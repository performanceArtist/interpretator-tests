/*
expr: term ((PLUS|MINUS) term)*
term: factor ((MUL|DIV) factor)*
factor: NUMBER | L_PAREN expr R_PAREN
*/

import { Lexer, Token, TokenType } from '../calc/lexer';

class ByRules {
  private index = 0;
  private current!: Token;
  private tokens: readonly Token[] = [];

  constructor(private input: string) {
    const lexer = new Lexer(this.input);
    this.tokens = lexer.getTokens();
    console.log(this.tokens);
    this.current = this.tokens[this.index];
  }

  evaluate() {
    return this.expr();
  }

  expr(): number {
    let result = this.term();

    while (
      this.current && this.current.type === 'Minus' || this.current.type === 'Plus'
    ) {
      const { type } = this.current;

      if (type === 'Minus') {
        this.eat('Minus');
        result -= this.term();
      }

      if (type === 'Plus') {
        this.eat('Plus');
        result += this.term();
      }
    }

    return result;
  }

  term() {
    let result = this.factor();

    while (
      this.current && this.current.type === 'Mul' || this.current.type === 'Div'
    ) {
      const { type } = this.current;

      if (type === 'Mul') {
        this.eat('Mul');
        result *= this.factor();
      }

      if (type === 'Div') {
        this.eat('Div');
        result /= this.factor();
      }
    }

    return result;
  }

  factor() {
    const { value, type } = this.current;
    if (type === 'Number') {
      this.eat('Number');
      return value;
    } else if (type === 'LeftParen') {
      this.eat('LeftParen');
      const result = this.expr();
      this.eat('RightParen');
      return result;
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
