/*
expr: term ((PLUS|MINUS) term)*
term: factor ((MUL|DIV) factor)*
factor: NUMBER | L_PAREN expr R_PAREN
*/

import { EffectGenerator } from './effect/primitives';
import {
  Rules,
  Combinators,
  Payload,
  sequence,
  or
} from './effect/combinators';
import {
  makeIf,
  makeSymbol,
  makeEat,
  makeWhile,
  makeNullaryAST,
  makeUnaryAST,
  makeBinaryAST
} from './effect/generators';

class SymbolFactory<S extends string, T extends string> {
  constructor(private rules: Rules<S, T>) {
    this.parseCombinator = this.parseCombinator.bind(this);
  }

  getSymbols() {
    return Object.keys(this.rules).reduce((acc, key: S) => {
      const rule = this.rules[key];
      acc[key] = this.generateSymbol(rule);
      return acc;
    }, {} as { [key in S]: EffectGenerator });
  }

  private isNonTerminal(symbol: any): symbol is S {
    return Object.keys(this.rules).includes(symbol);
  }

  private isCombinator(symbol: any): symbol is Combinators<S | T> {
    return typeof symbol === 'object' && symbol.type;
  }

  private generateSymbol(rule: Rules<S, T>[S]) {
    return this.parseCombinator(rule);
  }

  private parseCombinator(rule: Payload<S | T>): any {
    if (this.isNonTerminal(rule)) {
      console.log('NON TERMINAL', rule);
      return makeSymbol(rule);
    } else if (!this.isCombinator(rule)) {
      console.log('TERMINAL', rule);
      return makeEat(rule);
    }

    switch (rule.type) {
      case 'sequence': {
        const steps = rule.payload.map(this.parseCombinator);

        return function*() {
          for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            yield* step();
          }
        };
      }
      case 'nullaryAST': {
        return makeNullaryAST();
      }
      case 'unaryAST': {
        return makeUnaryAST(rule.payload.nonTerm);
      }
      case 'binaryAST': {
        return makeBinaryAST(rule.payload.nonTerm);
      }
      case 'or': {
        return (token: any) => rule.payload.includes(token.type);
      }
      case 'zero-or-many': {
        const [first, ...rest] = rule.payload;
        const predicate = this.parseCombinator(first);

        return makeWhile(predicate, this.parseCombinator(sequence(...rest)));
      }
      case 'cond': {
        const [condition, ...rest] = rule.payload;
        const predicate =
          (condition as any).type === 'or'
            ? this.parseCombinator(condition)
            : this.parseCombinator(or(condition));
        return makeIf(predicate, this.parseCombinator(sequence(...rest)));
      }
      default: {
        throw new Error('Unknown input');
      }
    }
  }
}

export { SymbolFactory };
