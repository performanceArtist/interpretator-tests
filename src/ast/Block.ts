import { AST } from './AST';

type Tag = 'block';

class Block implements AST<AST[], Tag, any> {
  public type: Tag = 'block';

  constructor(public value: AST[]) {}

  visit() {
    this.value.forEach(statement => statement.visit());
  }
}

export { Block };
