export type EatEffect = {
  type: 'eat',
  token: string
};

export function eat(type: string): EatEffect {
  return {
    type: 'eat',
    token: type
  };
}
