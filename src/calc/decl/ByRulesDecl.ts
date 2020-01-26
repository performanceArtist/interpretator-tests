/*
expr: term ((PLUS|MINUS) term)*
term: factor ((MUL|DIV) factor)*
factor: NUMBER | L_PAREN expr R_PAREN
*/

import { Token, TokenType } from '../lexer';
import { Effect } from './effects';
import { getSymbol, expr } from './symbols';

class ByRules {
  private index = 0;
  private current!: Token;
  private effects: Effect[] = [];
  private STOP = false;

  constructor(private tokens: readonly Token[]) {
    this.current = this.tokens[this.index];
  }

  evaluate() {
    const tree = this.eval(expr);
    console.log('TREE:', tree);
  }

  private eval(term: () => IterableIterator<Effect>) {
    const it = term();
    let result = it.next();
    let lastAst;

    while (!result.done && !this.STOP) {
      const effect = result.value;
      this.effects.push(effect);

      console.log('Effect:', effect);

      switch (effect.type) {
        case 'eat':
          this.eat(effect.token);
          result = it.next();
          break;
        case 'ast':
          const astNode = new effect.constructor(...effect.args);
          lastAst = astNode;
          result = it.next(astNode);
          break;
        case 'token':
          result = it.next(this.current);
          break;
        case 'symbol':
          const symbol = getSymbol(effect.symbol);
          const val = this.eval(symbol);
          console.log('NODE', val, val.value);
          result = it.next(val);
          break;
        default:
          throw new Error('Unknown type');
      }
    }

    return lastAst || result;
  }

  private eat(type: TokenType) {
    if (this.current.type === type) {
      this.index += 1;
      this.current = this.tokens[this.index] || { type: 'STOP' };
    } else {
      console.log('STOP');
      this.STOP = true;
      return;
    }
  }
}

export { ByRules };
