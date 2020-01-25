import { AST } from './AST';

type Tag = 'unary';
export type UnaryOperation<T, R> = (a: T) => R;

class UnaryOperator<T, R> implements AST<UnaryOperation<T, R>, Tag, R> {
  public type: Tag = 'unary';

  constructor(public value: UnaryOperation<T, R>, public left: AST) {}

  visit() {
    return this.value(this.left.visit());
  }
}

export { UnaryOperator };
