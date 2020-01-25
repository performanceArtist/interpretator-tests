class SymbolTable {
  private symbols: { [key: string]: any } = {};

  constructor() {}

  get(symbol: string) {
    return this.symbols[symbol];
  }

  set(symbol: string, value: any) {
    this.symbols[symbol] = value;
  }
}

export const SYMBOL_TABLE = new SymbolTable();

export { SymbolTable };
