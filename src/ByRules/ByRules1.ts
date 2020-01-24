/*
expr: factor((Plus|Minus)factor)*
factor: INTEGER
*/

import { Lexer, Token, TokenType } from '../calc/lexer';

class ByRules {
  private index = 0;
  private current!: Token;
  private tokens: readonly Token[] = [];

  constructor(private input: string) {
    const lexer = new Lexer(this.input);
    this.tokens = lexer.getTokens();
    this.current = this.tokens[this.index];
  }

  evaluate() {
    return this.expr();
  }

  expr() {
    let result = this.factor();

    while (this.current) {
      const { type } = this.current;

      if (type === 'Minus') {
        this.eat('Minus');
        result -= this.factor();
      }

      if (type === 'Plus') {
        this.eat('Plus');
        result += this.factor();
      }
    }

    return result;
  }

  factor() {
    const { value } = this.current;
    this.eat('Number');
    return value;
  }

  eat(type: TokenType) {
    if (this.current.type === type) {
      this.index += 1;
      this.current = this.tokens[this.index];
    } else {
      throw new Error('Parser error');
    }
  }
}

export { ByRules };
