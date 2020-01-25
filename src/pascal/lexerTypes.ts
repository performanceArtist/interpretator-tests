type Plus = 'Plus';
type Minus = 'Minus';
type Number = 'Number';
type Mul = 'Mul';
type Div = 'Div';
type BinaryArithmetic = Plus | Minus | Mul | Div;
type LeftParen = 'LeftParen';
type RightParen = 'RightParen';

type Begin = 'Begin';
type End = 'End';
type Semi = 'Semi';
type Dot = 'Dot';
type Assign = 'Assign';
type Keyword = Begin | End | Semi | Dot | Assign;

type Operator = BinaryArithmetic | LeftParen | RightParen;

export type Unknown = 'Unknown';
export type UnknownToken = { type: Unknown };
export type ID = 'ID';
export type IDToken = { type: ID, value: string };
export type PlainTokenType = Operator | Keyword;
export type TokenType = Number | Operator | Keyword | ID;
export type WordMap = Record<PlainTokenType, string>;

export type Pattern = Readonly<TokenType[]>;
export type Token = {
  type: TokenType | Unknown | ID,
  value?: any
};
export type TokenPattern = Readonly<Token[]>;

export const wordMap: WordMap = {
  'Plus': '+',
  'Minus': '-',
  'Mul': '*',
  'Div': '/',
  'LeftParen': '(',
  'RightParen': ')',
  'Begin': 'BEGIN',
  'End': 'END',
  'Semi': ';',
  'Dot': '.',
  'Assign': ':='
};
