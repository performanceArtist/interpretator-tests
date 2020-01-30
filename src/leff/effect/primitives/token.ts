export type TokenEffect = {
  type: 'token';
};

export function token(): TokenEffect {
  return {
    type: 'token'
  };
}
