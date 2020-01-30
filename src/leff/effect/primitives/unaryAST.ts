export type UnaryASTEffect = {
  type: 'unaryAST';
  token: { type: string; value?: any };
};

export function unaryAST(token: { type: string; value?: any }): UnaryASTEffect {
  return {
    type: 'unaryAST',
    token
  };
}
