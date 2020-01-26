import { Value, BinaryOperator } from '../../ast';
import { eat, ast, symbol, node, token } from './effects';

export function* expr() {
  let currentToken = yield token();
  yield symbol('term');
  currentToken = yield token();

  while (
    currentToken && currentToken.type === 'Minus' || currentToken.type === 'Plus'
  ) {
    const { type } = currentToken;
    const left = yield node();

    if (type === 'Minus') {
      yield eat('Minus');
      yield symbol('term');
      const right = yield node();

      yield ast(
        BinaryOperator,
        (a: number, b: number) => a - b,
        left,
        right
      );
    }

    if (type === 'Plus') {
      yield eat('Plus');
      yield symbol('term');
      const right = yield node();

      yield ast(
        BinaryOperator,
        (a: number, b: number) => a + b,
        left,
        right
      );
    }

    currentToken = yield token();
  }
}

export function* term() {
  let currentToken = yield token();
  if (currentToken.type !== 'stop') {
    yield symbol('factor');
  }
  currentToken = yield token();

  while (
    currentToken && currentToken.type === 'Mul' || currentToken.type === 'Div'
  ) {
    const { type } = yield token();
    const left = yield node();

    if (type === 'Mul') {
      yield eat('Mul');
      yield symbol('factor');
      const right = yield node();

      yield ast(
        BinaryOperator,
        (a: number, b: number) => a * b,
        left,
        right
      );
    }

    if (type === 'Div') {
      yield eat('Div');
      yield symbol('factor');
      const right = yield node();

      yield ast(
        BinaryOperator,
        (a: number, b: number) => a / b,
        left,
        right
      );
    }

    currentToken = yield token();
  }
}

export function* factor() {
  const { value, type } = yield token();

  if (type === 'Number') {
    yield eat('Number');
    yield ast(Value, value);
  } else if (type === 'LeftParen') {
    yield eat('LeftParen');
    yield symbol('expr');
    yield eat('RightParen');
  }
}

export function getSymbol(symbol: string) {
  switch (symbol) {
    case 'expr':
      return expr;
    case 'term':
      return term;
    case 'factor':
      return factor;
    default:
      throw new Error(`Symbol not found: ${symbol}`);
  }
}
