export type NodeEffect = {
  type: 'node';
};

export function node(): NodeEffect {
  return {
    type: 'node'
  };
}
