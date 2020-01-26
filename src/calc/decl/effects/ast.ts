import { AST } from '../../../ast';

export type ASTEffect<T extends unknown[]> = {
  type: 'ast',
  constructor: new (...args: T) => AST,
  args: T
};

export function ast<T extends unknown[]>(constructor: new (...args: T) => AST, ...args: T): ASTEffect<T> {
  return {
    type: 'ast',
    constructor,
    args
  };
}
