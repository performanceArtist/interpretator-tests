import {
  TokenPattern,
  Token,
  PlainTokenType,
  wordMap,
  IDToken
} from './lexerTypes';

function isNumber(input?: string) {
  if (input === undefined) {
    return false;
  }

  return !Number.isNaN(parseInt(input, 10));
}

class Lexer {
  constructor(private input: string, private caseSensitive = true) {
    this.parseToken = this.parseToken.bind(this);
  }

  public getTokens(): TokenPattern {
    return this.splitInput().map(this.parseToken);
  }

  private splitInput() {
    const withSpaces = this.input.replace(/(\S+)([;\.])/g, '$1 $2');
    const split = withSpaces.match(/\S+/g);
    if (!split) {
      throw new Error('Invalid string');
    }

    return [...split].reduce<string[]>((acc, char) => {
      const keywordMatch = Object.keys(wordMap).reduce(
        (token, key: PlainTokenType) => {
          return char === wordMap[key] ? wordMap[key] : token;
        },
        null
      );

      if (keywordMatch) {
        acc.push(keywordMatch);
      } else if (isNumber(char) && isNumber(acc[acc.length - 1])) {
        acc[acc.length - 1] += char;
      } else {
        acc.push(char);
      }

      return acc;
    }, []);
  }

  private parseToken(input: string): Token | IDToken {
    const number = parseInt(input, 10);

    if (!Number.isNaN(number)) {
      return {
        type: 'Number',
        value: number
      };
    }

    const identificator: IDToken = { type: 'ID', value: input };

    return Object.keys(wordMap).reduce((token, key: PlainTokenType) => {
      const comparison = this.caseSensitive
        ? wordMap[key] === input
        : wordMap[key].toLowerCase() === input.toLowerCase();

      return comparison ? { type: key } : token;
    }, identificator);
  }
}

export { Lexer };
