type Plus = 'Plus';
type Minus = 'Minus';
type Number = 'Number';
type Mul = 'Mul';
type Div = 'Div';
type LeftParen = 'LeftParen';
type RightParen = 'RightParen';
type Unknown = 'Unknown';

type BinaryArithmetic = Plus | Minus | Mul | Div;
type Operator = BinaryArithmetic | LeftParen | RightParen;

export type TokenType = Number | Operator | Unknown;

export type Pattern = Readonly<TokenType[]>;
export type Token = {
  type: TokenType;
  value?: any;
};
export type TokenPattern = Readonly<Token[]>;

function isNumber(input?: string) {
  if (input === undefined) {
    return false;
  }

  return !Number.isNaN(parseInt(input, 10));
}

class Lexer {
  constructor(private input: string) {}

  public getTokens(): TokenPattern {
    return this.splitInput().map(this.parseToken);
  }

  private splitInput() {
    return [...this.input].reduce<string[]>((acc, char) => {
      if (char === ' ') {
        return acc;
      }

      if (isNumber(char) && isNumber(acc[acc.length - 1])) {
        acc[acc.length - 1] += char;
      } else {
        acc.push(char);
      }

      return acc;
    }, []);
  }

  private parseToken(input: string): Token {
    const number = parseInt(input, 10);

    if (!Number.isNaN(number)) {
      return {
        type: 'Number',
        value: number
      };
    }

    switch (input) {
      case '+':
        return { type: 'Plus' };
      case '-':
        return { type: 'Minus' };
      case '*':
        return { type: 'Mul' };
      case '/':
        return { type: 'Div' };
      case '(':
        return { type: 'LeftParen' };
      case ')':
        return { type: 'RightParen' };
      default:
        return { type: 'Unknown' };
    }
  }
}

export { Lexer };
