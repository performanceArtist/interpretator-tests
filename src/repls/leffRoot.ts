/*
expr: term ((PLUS|MINUS) term)*
term: factor ((MUL|DIV) factor)*
factor: NUMBER | (PLUS|MINUS) factor | L_PAREN expr R_PAREN
*/

import { TokenType } from '../calc/lexer';
import {
  zeroOrMany,
  or,
  sequence,
  cond,
  nullary,
  binary
} from '../leff/effect/combinators';
import { SymbolFactory } from '../leff/SymbolFactory';

type NonTerminals = 'expr' | 'term' | 'factor';

const factory = new SymbolFactory<NonTerminals, TokenType>({
  expr: sequence('term', zeroOrMany(or('Plus', 'Minus'), binary('term'))),
  term: sequence('factor', zeroOrMany(or('Mul', 'Div'), binary('factor'))),
  factor: sequence(
    cond('Number', nullary()),
    cond('LeftParen', 'LeftParen', 'expr', 'RightParen')
  )
});

export const root = factory.getSymbols();
