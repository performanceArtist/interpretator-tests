import { EffectGenerator } from './effect/primitives';
import { AST } from '../ast';

type AnyToken = {
  type: string;
  value?: any;
};

type GeneratorMap = { [key: string]: EffectGenerator };

type Arity = 'binary' | 'unary' | 'nullary';

type NodeMaker<T extends Arity> = T extends 'nullary'
  ? (value?: any) => AST
  : T extends 'unary'
  ? (node: AST) => AST
  : (left: AST, right: AST) => AST;

type NodeInfo<T extends Arity> = {
  arity: T;
  type: string;
  nodeMaker: NodeMaker<T>;
};

class Interpreter {
  private index = 0;
  private current!: AnyToken;
  private nodes: AST[] = [];
  private operations: NodeInfo<Arity>[] = [];
  private symbols!: GeneratorMap;

  constructor(private tokens: readonly AnyToken[]) {
    this.current = this.tokens[this.index];
  }

  implement<T extends Arity>(arity: T, type: string, nodeMaker: NodeMaker<T>) {
    this.operations.push({ arity, type, nodeMaker });
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
        case 'nullaryAST': {
          const operation = this.operations.find(
            ({ arity, type }) =>
              arity === 'nullary' && type === effect.token.type
          );
          const node = (operation as any).nodeMaker(effect.token);
          this.nodes.push(node);
          result = it.next();
          break;
        }
        case 'unaryAST': {
          const operation = this.operations.find(
            ({ arity, type }) => arity === 'unary' && type === effect.token.type
          );
          const node = (operation as any).nodeMaker(this.nodes[this.nodes.length - 1]);
          this.nodes.push(node);
          result = it.next();
          break;
        }
        case 'binaryAST': {
          const { left, right } = effect.nodes;
          const operation = this.operations.find(
            ({ arity, type }) => arity === 'binary' && type === effect.operator
          );
          const node = operation!.nodeMaker(left, right);

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
