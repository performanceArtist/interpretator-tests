export type Combinators<T> =
  | OR<T>
  | ZeroOrMany<T>
  | Sequence<T>
  | Cond<T>
  | UnaryAST
  | BinaryAST;
export type Payload<T> = Combinators<T> | T;

type OR<T> = {
  type: 'or';
  payload: Payload<T>[];
};
type ZeroOrMany<T> = {
  type: 'zero-or-many';
  payload: Payload<T>[];
};
type Sequence<T> = {
  type: 'sequence';
  payload: Payload<T>[];
};
type Cond<T> = {
  type: 'cond';
  payload: Payload<T>[];
};
type UnaryAST = {
  type: 'unaryAST';
};
type BinaryAST = {
  type: 'binaryAST';
  payload: {
    nonTerm: string;
  };
};

export type Rules<S extends string, T extends string> = {
  [key in S]: Combinators<S | T>;
};

export const or: <T>(...payload: Payload<T>[]) => OR<T> = (...payload) => ({
  type: 'or',
  payload
});

export const zeroOrMany: <T>(...payload: Payload<T>[]) => ZeroOrMany<T> = (
  ...payload
) => ({ type: 'zero-or-many', payload });

export const sequence: <T>(...payload: Payload<T>[]) => Sequence<T> = (
  ...payload
) => ({ type: 'sequence', payload });

export const cond: <T>(...payload: Payload<T>[]) => Cond<T> = (...payload) => ({
  type: 'cond',
  payload
});

export const unary = (): UnaryAST => ({
  type: 'unaryAST'
});

export const binary = (nonTerm: string): BinaryAST => ({
  type: 'binaryAST',
  payload: {
    nonTerm
  }
});
