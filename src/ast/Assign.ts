import { AST } from './AST';
import { SymbolTable } from '../pascal/SYMBOL_TABLE';

type Tag = 'assign';

class Assign<T> implements AST<T, Tag, undefined> {
  public type: Tag = 'assign';

  constructor(
    public left: AST,
    public right: AST,
    private symbolTable: SymbolTable
  ) {}

  visit() {
    this.symbolTable.set(this.left.value, this.right.visit());
    return undefined;
  }
}

export { Assign };
