/*
expr: term ((PLUS|MINUS) term)*
term: factor ((MUL|DIV) factor)*
factor: NUMBER | L_PAREN expr R_PAREN
*/

import { Token, TokenType } from '../lexer';
import { Effect } from './effects';
import { AST } from '../../ast';
import { getSymbol, expr } from './symbols';

class ByRules {
  private index = 0;
  private current!: Token;
  private lastNode!: AST<any>;

  constructor(private tokens: readonly Token[]) {
    this.current = this.tokens[this.index];
  }

  evaluate() {
    this.eval(expr, true);
    console.log('TREE:', this.lastNode, this.lastNode.visit());
  }

  private eval(term: () => IterableIterator<Effect>, firstPass = false) {
    const it = term();
    let result = it.next();

    while (!result.done) {
      const effect = result.value;
      console.log('EFFECT:', effect);

      switch (effect.type) {
        case 'eat':
          this.eat(effect.token);
          result = it.next();
          break;
        case 'ast':
          const astNode = new effect.constructor(...effect.args);
          result = it.next(astNode);
          this.lastNode = astNode;
          break;
        case 'token':
          result = it.next({ ...this.current });
          break;
        case 'symbol':
          const symbol = getSymbol(effect.symbol);
          const node = this.eval(symbol);
          result = it.next(node);
          break;
        case 'node':
          result = it.next(this.lastNode);
          break;
        default:
          throw new Error('Unknown type');
      }
    }
  }

  private eat(type: TokenType) {
    if (this.current.type === type) {
      this.index += 1;
      this.current = this.tokens[this.index] || { type: 'STOP' };
    }
  }
}

export { ByRules };
