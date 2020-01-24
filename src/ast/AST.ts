import { Visitor } from './Visitor';
type Leaf<T, R> = { type: R, value: T };
type Branch<T, R> = {
  type: R,
  value?: T,
  left?: ASTNode<any, string>,
  right?: ASTNode<any, string>
};
export type ASTNode<T = any, R = string> = Leaf<T, R> | Branch<T, R>;
export type VisitorASTNode<T = any, R = string> = Visitor<T> & Leaf<T, R> | Visitor<T> & Branch<T, R>;

function isBranch<T, R>(node: ASTNode<T, R>): node is Branch<T, R> {
  return (node as any).left && (node as any).right;
}

class AST<T = any, R = string> {
  public type: R;
  public value?: T;
  public left?: ASTNode;
  public right?: ASTNode;

  constructor(node: ASTNode<T, R>) {
    this.type = node.type;
    this.value = node.value;

    if (isBranch(node)) {
      this.left = node.left;
      this.right = node.right;
    }
  }
}

export { AST };
