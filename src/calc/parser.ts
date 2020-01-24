import { Lexer, Pattern, TokenPattern, Token } from './lexer';
import { addition, subtraction, BinaryArithmetic } from './patterns';

class Parser {
  constructor(private input: string) {}

  evaluate() {
    const lexer = new Lexer(this.input);
    const tokens = lexer.getTokens();

    return this.tryMatch(tokens);
  }

  private tryMatch(tokens: TokenPattern): string {
    if (tokens.length === 1) {
      return tokens[0].value;
    }

    if (this.match(addition, tokens)) {
      const [a, , b, ...rest] = tokens;
      const merged: Token = {
        type: 'Number',
        value: a.value + b.value
      };

      return this.tryMatch([merged, ...rest]);
    }

    if (this.match(subtraction, tokens)) {
      const [a, , b, ...rest] = tokens;
      const merged: Token = {
        type: 'Number',
        value: a.value - b.value
      };

      return this.tryMatch([merged, ...rest]);
    }

    return 'Unknown expression';
  }

  private match<T extends Pattern>(pattern: T, tokens: TokenPattern): tokens is BinaryArithmetic<T> {
    return pattern.every((type, index) => tokens[index] && type === tokens[index].type);
  }
}

export { Parser };
