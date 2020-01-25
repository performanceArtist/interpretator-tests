/*
expr: term ((PLUS|MINUS) term)*
term: factor ((MUL|DIV) factor)*
factor: NUMBER | L_PAREN expr R_PAREN
*/

import { Lexer, Token, TokenType } from '../calc/lexer';
import { Num, Operator, AST } from '../ast';

class ByRules {
  private index = 0;
  private current!: Token;
  private tokens: readonly Token[] = [];

  constructor(private input: string) {
    const lexer = new Lexer(this.input);
    this.tokens = lexer.getTokens();
    console.log('\nTokens:', this.tokens, '\n');
    this.current = this.tokens[this.index];
  }

  evaluate() {
    const tree = this.expr();
    console.log('AST:', tree, '\n');
    return tree.visit();
  }

  expr(): AST {
    let node = this.term();

    while (
      this.current && this.current.type === 'Minus' || this.current.type === 'Plus'
    ) {
      const { type } = this.current;

      if (type === 'Minus') {
        this.eat('Minus');
        node = new Operator((a, b) => a - b, node, this.term())
      }

      if (type === 'Plus') {
        this.eat('Plus');
        node = new Operator((a, b) => a + b, node, this.term())
      }
    }

    return node;
  }

  term(): AST {
    let node = this.factor();

    while (
      this.current && this.current.type === 'Mul' || this.current.type === 'Div'
    ) {
      const { type } = this.current;

      if (type === 'Mul') {
        this.eat('Mul');
        node = new Operator((a, b) => a * b, node, this.factor())
      }

      if (type === 'Div') {
        this.eat('Div');
        node = new Operator((a, b) => a / b, node, this.factor())
      }
    }

    return node;
  }

  factor(): AST {
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
      throw new Error('Failed to parse an expression');
    }
  }

  eat(type: TokenType) {
    if (this.current.type === type) {
      this.index += 1;
      this.current = this.tokens[this.index] || { type: 'STOP' };
    } else {
      throw new Error('Parser error');
    }
  }
}

export { ByRules };
