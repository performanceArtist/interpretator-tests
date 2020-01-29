export type UnaryASTEffect = {
  type: 'unaryAST',
};

export function unaryAST(): UnaryASTEffect {
  return {
    type: 'unaryAST',
  };
}
