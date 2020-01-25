/*
expr: term ((PLUS|MINUS) term)*
term: factor ((MUL|DIV) factor)*
factor: NUMBER | L_PAREN expr R_PAREN
*/

import { Token, TokenType } from '../lexer';
import { Value, BinaryOperator, AST } from '../../ast';

class ByRules {
  private index = 0;
  private current!: Token;

  constructor(private tokens: readonly Token[]) {
    this.current = this.tokens[this.index];
  }

  evaluate() {
    const tree = this.expr();
    console.log('AST:', tree, '\n');
    return tree.visit();
  }

  private expr(): AST {
    let node = this.term();

    while (
      this.current && this.current.type === 'Minus' || this.current.type === 'Plus'
    ) {
      const { type } = this.current;

      if (type === 'Minus') {
        this.eat('Minus');
        node = new BinaryOperator((a, b) => a - b, node, this.term())
      }

      if (type === 'Plus') {
        this.eat('Plus');
        node = new BinaryOperator((a, b) => a + b, node, this.term())
      }
    }

    return node;
  }

  private term(): AST {
    let node = this.factor();

    while (
      this.current && this.current.type === 'Mul' || this.current.type === 'Div'
    ) {
      const { type } = this.current;

      if (type === 'Mul') {
        this.eat('Mul');
        node = new BinaryOperator((a, b) => a * b, node, this.factor())
      }

      if (type === 'Div') {
        this.eat('Div');
        node = new BinaryOperator((a, b) => a / b, node, this.factor())
      }
    }

    return node;
  }

  private factor(): AST {
    const { value, type } = this.current;
    if (type === 'Number') {
      this.eat('Number');
      return new Value(value);
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
