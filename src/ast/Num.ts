import { AST } from './AST';

type Tag = 'number';

class Num implements AST<number, Tag, number> {
  public type: Tag = 'number';

  constructor(public value: number) {}

  visit() {
    return this.value!;
  }
}

export { Num };
