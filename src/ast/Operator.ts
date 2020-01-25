import { AST } from './AST';

type BinaryOperation<T> = (a: T, b: T) => T;
type Arithmetic = BinaryOperation<number>;
type Tag = 'arithmetic';

class Operator implements AST<Arithmetic, Tag, number> {
  public type: Tag = 'arithmetic';

  constructor(public value: Arithmetic, public left: AST, public right: AST) {}

  visit() {
    const a = this.left.visit();
    const b = this.right.visit();

    return this.value!(a, b);
  }
}

export { Operator };
