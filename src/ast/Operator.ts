import { AST, VisitorASTNode } from './AST';
import { Visitor } from './Visitor';

type BinaryOperation<T> = (a: T, b: T) => T;
type Arithmetic = BinaryOperation<number>;
type Tag = 'arithmetic';

class Operator extends AST<Arithmetic, Tag> implements Visitor<number> {
  constructor(operation: Arithmetic, left: VisitorASTNode, right: VisitorASTNode) {
    super({
      type: 'arithmetic',
      left,
      right,
      value: operation
    });
  }

  visit() {
    const a = (this.left as VisitorASTNode).visit();
    const b = (this.right as VisitorASTNode).visit();

    return this.value!(a, b);
  }
}

export { Operator };
