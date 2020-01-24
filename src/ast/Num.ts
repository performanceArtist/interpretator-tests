import { AST } from './AST';
import { Visitor } from './Visitor';

type Tag = 'number';

class Num extends AST<number, Tag> implements Visitor<number> {
  constructor(value: number) {
    super({ type: 'number', value });
  }

  visit() {
    return this.value!;
  }
}

export { Num };
