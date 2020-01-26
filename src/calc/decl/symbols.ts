import { Value, BinaryOperator } from '../../ast';
import { eat, ast, symbol, token } from './effects';

export function* expr() {
  let node = yield symbol('term');
  const current = yield token();

  while (
    current && current.type === 'Minus' || current.type === 'Plus'
  ) {
    const { type } = current;

    if (type === 'Minus') {
      yield eat('Minus');
      const nterm = yield symbol('term');
      node = yield ast(
        BinaryOperator,
        (a: number, b: number) => a - b,
        node.value,
        nterm.value
      );
    }

    if (type === 'Plus') {
      yield eat('Plus');
      const nterm = yield symbol('term');

      node = yield ast(
        BinaryOperator,
        (a: number, b: number) => a + b,
        node.value,
        nterm.value
      );
    }
  }

  return node;
}

export function* term() {
  let node = yield symbol('factor');
  const current = yield token();

  while (
    current && current.type === 'Mul' || current.type === 'Div'
  ) {
    const { type } = current;

    if (type === 'Mul') {
      yield eat('Mul');
      const nterm = yield symbol('factor');
      node = yield ast(
        BinaryOperator,
        (a: number, b: number) => a * b,
        node,
        nterm
      );
    }

    if (type === 'Div') {
      yield eat('Div');
      const nterm = yield symbol('factor');
      node = yield ast(
        BinaryOperator,
        (a: number, b: number) => a / b,
        node,
        nterm
      );
    }
  }

  return node;
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
  } else {
    throw new Error('Invalid expression');
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
