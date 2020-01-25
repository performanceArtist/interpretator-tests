import { AST } from './AST';

type Tag = 'value';

class Value<T> implements AST<T, Tag, T> {
  public type: Tag = 'value';

  constructor(public value: T) {}

  visit() {
    return this.value;
  }
}

export { Value };
