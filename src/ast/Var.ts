import { AST } from './AST';
import { SymbolTable } from '../pascal/SYMBOL_TABLE';

type Tag = 'var';

class Var implements AST<string, Tag, any> {
  public type: Tag = 'var';

  constructor(public value: string, private symbolTable: SymbolTable) {}

  visit() {
    const value = this.symbolTable.get(this.value);
    if (value) {
      return value;
    } else {
      throw new Error('Varibale not found');
    }
  }
}

export { Var };
