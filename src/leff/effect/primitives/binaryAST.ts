import { AST } from '../../../ast';

type Nodes = {
  left: AST,
  right: AST
};

export type BinaryASTEffect = {
  type: 'binaryAST',
  operator: string;
  nodes: Nodes
};

export function binaryAST(operator: string, nodes: Nodes): BinaryASTEffect {
  return {
    type: 'binaryAST',
    operator,
    nodes
  };
}
