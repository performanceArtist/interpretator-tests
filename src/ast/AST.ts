export type AST<Value = any, Type = string, Visit = any> = {
  type: Type;
  value?: Value;
  left?: AST;
  right?: AST;
  visit: () => Visit;
}
