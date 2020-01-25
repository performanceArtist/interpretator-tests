import { AST } from './AST';

export type BinaryOperation<T> = (a: T, b: T) => T;
type Tag = 'binary';

class BinaryOperator<T> implements AST<BinaryOperation<T>, Tag, T> {
  public type: Tag = 'binary';

  constructor(public value: BinaryOperation<T>, public left: AST, public right: AST) {}

  visit() {
    const a = this.left.visit();
    const b = this.right.visit();

    return this.value!(a, b);
  }
}

export { BinaryOperator };
