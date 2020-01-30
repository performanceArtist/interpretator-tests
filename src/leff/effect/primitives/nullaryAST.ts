export type NullaryASTEffect = {
  type: 'nullaryAST';
  token: { type: string; value?: any };
};

export function nullaryAST(token: {
  type: string;
  value?: any;
}): NullaryASTEffect {
  return {
    type: 'nullaryAST',
    token
  };
}
