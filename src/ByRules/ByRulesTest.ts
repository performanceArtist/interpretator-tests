/*
expr: term ((PLUS|MINUS) term)*
term: factor ((MUL|DIV) factor)*
factor: NUMBER | L_PAREN expr R_PAREN
*/

import { Token, TokenType } from '../calc/lexer';
import { Num, BinaryOperator, AST, BinaryOperation } from '../ast';

type RuleMap = Partial<Record<TokenType, BinaryOperation<any>>>;

class ByRules {
  private index = 0;
  private current!: Token;
  private expr: () => AST;

  constructor(private tokens: readonly Token[], termMap: RuleMap, exprMap: RuleMap) {
    this.current = this.tokens[this.index];
    this.factor = this.factor.bind(this);

    const term = this.getTerm(termMap, this.factor);

    this.expr = this.getTerm(exprMap, term);
  }

  evaluate() {
    const tree = this.expr();
    console.log('AST:', tree, '\n');
    return tree.visit();
  }

  private getTerm(m: RuleMap, next: () => AST) {
    const predicate = (token: Token) =>
      Object.keys(m).includes(token.type)
        ? token.type
        : null;

    const getNode = (type: TokenType, left: AST, right: AST) =>
      new BinaryOperator(m[type]!, left, right);

    return this.getRule(
      predicate,
      next,
      getNode
    );
  }

  private getRule(
    predicate: (token: Token) => null | TokenType,
    next: () => AST,
    getNode: (type: TokenType, left: AST, right: AST) => AST
  ) {
    return () => {
      let node = next();

      const rec: () => AST = () => {
        const check = predicate(this.current);

        if (check) {
          this.eat(check);
          node = getNode(check, node, next());
          return rec();
        } else {
          return node;
        }
      }

      return rec();
    }
  }

  private factor(): AST {
    const { value, type } = this.current;

    if (type === 'Number') {
      this.eat('Number');
      return new Num(value);
    } else if (type === 'LeftParen') {
      this.eat('LeftParen');
      const node = this.expr();
      this.eat('RightParen');
      return node;
    } else {
      throw new Error('Invalid expression');
    }
  }

  private eat(type: TokenType) {
    if (this.current.type === type) {
      this.index += 1;
      this.current = this.tokens[this.index] || { type: 'STOP' };
    } else {
      throw new Error('Parser error');
    }
  }
}

export { ByRules };
