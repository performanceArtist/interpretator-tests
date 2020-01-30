export type SymbolEffect = {
  type: 'symbol';
  symbol: string;
};

export function symbol(symbol: string): SymbolEffect {
  return {
    type: 'symbol',
    symbol
  };
}
