import { EffectGenerator } from './effect/primitives';
import { AST, Value, BinaryOperator } from '../ast';

type AnyToken = {
  type: string;
  value?: any;
}

type GeneratorMap = { [key: string]: EffectGenerator };

class Interpreter {
  private index = 0;
  private current!: AnyToken;
  private nodes: AST[] = [];
  private operations: {
    [key: string]: (a: number, b: number) => number;
  } = {};
  private symbols!: GeneratorMap;

  constructor(private tokens: readonly AnyToken[]) {
    this.current = this.tokens[this.index];
  }

  implement(type: string, operation: (a: number, b: number) => number) {
    this.operations[type] = operation;
  }

  evaluate(main: EffectGenerator, symbols: GeneratorMap) {
    this.symbols = symbols;
    this.eval(main);
    const last = this.nodes[this.nodes.length - 1];
    console.log('TREE:', last);

    return last.visit();
  }

  private eval(term: EffectGenerator) {
    const it = term();
    let result = it.next();

    while (!result.done) {
      const effect = result.value;
      console.log('EFFECT:', effect);

      switch (effect.type) {
        case 'eat': {
          this.eat(effect.token);
          result = it.next();
          break;
        }
        case 'unaryAST': {
          const node = new Value(this.tokens[this.index - 1].value);
          this.nodes.push(node);
          result = it.next();
          break;
        }
        case 'binaryAST': {
          const { left, right } = effect.nodes;
          const operation = this.operations[effect.operator];
          const node = new BinaryOperator(operation, left, right);

          this.nodes.push(node);
          result = it.next();
          break;
        }
        case 'token': {
          result = it.next({ ...this.current });
          break;
        }
        case 'symbol': {
          const symbol = this.symbols[effect.symbol];
          this.eval(symbol);
          result = it.next();
          break;
        }
        case 'node': {
          const node = this.nodes[this.nodes.length - 1];
          result = it.next(node);
          break;
        }
        default:
          throw new Error('Unknown type');
      }
    }
  }

  private eat(type: string) {
    if (this.current.type === type) {
      this.index += 1;
      this.current = this.tokens[this.index] || { type: 'STOP' };
    }
  }
}

export { Interpreter };
