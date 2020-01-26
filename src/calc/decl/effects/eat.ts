import { TokenType } from 'calc/lexer';

export type EatEffect = {
  type: 'eat',
  token: TokenType
};

export function eat(type: TokenType): EatEffect {
  return {
    type: 'eat',
    token: type
  };
}
