import { eat, symbol, token, unaryAST, binaryAST, node } from './primitives';

export const makeUnaryAST = () => {
  return function* () {
    yield unaryAST();
  }
}

export const makeBinaryAST = (nonTerm: string) => {
  return function*() {
    const { type } = yield token();
    const left = yield node();
    yield eat(type);
    yield symbol(nonTerm);
    const right = yield node();
    yield binaryAST(type, { left, right });
  }
}

export const makeEat = (terminal: string) => {
  return function*() {
    yield eat(terminal);
  }
}

export const makeWhile = (predicate: (a: any) => boolean, steps: any) => {
  return function*() {
    let currentToken = yield token();

    while(predicate(currentToken)) {
      yield * steps();
      currentToken = yield token();
    }
  }
}

export const makeSymbol = (symbolName: string) => {
  return function*() {
    yield symbol(symbolName);
  }
}

export const makeIf = (predicate: (a: any) => boolean, steps: any) => {
  return function*() {
    const tok = yield token();

    if (predicate(tok)) {
      yield eat(tok.type);
      yield * steps();
    }
  }
}
