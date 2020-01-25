import { AST } from './AST';

type Tag = 'noop';

class NoOp implements AST<undefined, Tag, undefined> {
  public type: Tag = 'noop';

  visit() {
    return undefined;
  }
}

export { NoOp };
