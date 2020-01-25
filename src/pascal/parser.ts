import {
  Value,
  BinaryOperator,
  UnaryOperator,
  Block,
  AST,
  Assign,
  Var,
  NoOp
} from '../ast';
import { Token, TokenType } from './lexerTypes';
import { SYMBOL_TABLE } from './SYMBOL_TABLE';

class Parser {
  private index = 0;
  private current!: Token;

  constructor(private tokens: readonly Token[]) {
    this.current = this.tokens[this.index];
  }

  evaluate() {
    const tree = this.program();
    console.log('AST:', tree, '\n');
    const result = tree.visit();
    console.log('Symbol Table:', SYMBOL_TABLE);
    return result;
  }

  private program(): AST {
    let node = this.block();
    this.eat('Dot');
    return node;
  }

  private block(): AST {
    this.eat('Begin');
    let nodes = this.statementList();
    this.eat('End');

    return new Block(nodes);
  }

  private statementList(): AST[] {
    let node = this.statement();
    let nodes = [node];

    while (this.current.type === 'Semi') {
      this.eat('Semi');
      nodes.push(this.statement());
    }

    return nodes;
  }

  private statement(): AST {
    if (this.current.type === 'Begin') {
      return this.block();
    } else if (this.current.type === 'ID') {
      return this.assignment();
    } else {
      return new NoOp();
    }
  }

  private assignment(): AST {
    const variable = this.variable();
    this.eat('Assign');
    const expression = this.expr();

    return new Assign(variable, expression, SYMBOL_TABLE);
  }

  private variable(): AST {
    let node = new Var(this.current.value, SYMBOL_TABLE);
    this.eat('ID');
    return node;
  }

  private expr(): AST {
    let node = this.term();

    while (
      this.current && this.current.type === 'Minus' || this.current.type === 'Plus'
    ) {
      const { type } = this.current;

      if (type === 'Minus') {
        this.eat('Minus');
        node = new BinaryOperator((a, b) => a - b, node, this.term());
      }

      if (type === 'Plus') {
        this.eat('Plus');
        node = new BinaryOperator((a, b) => a + b, node, this.term());
      }
    }

    return node;
  }

  private term(): AST {
    let node = this.factor();

    while (
      this.current && this.current.type === 'Mul' || this.current.type === 'Div'
    ) {
      const { type } = this.current;

      if (type === 'Mul') {
        this.eat('Mul');
        node = new BinaryOperator((a, b) => a * b, node, this.factor())
      }

      if (type === 'Div') {
        this.eat('Div');
        node = new BinaryOperator((a, b) => a / b, node, this.factor())
      }
    }

    return node;
  }

  private factor(): AST {
    const { value, type } = this.current;

    if (type === 'Number') {
      this.eat('Number');
      return new Value(value);
    } else if (type === 'Plus') {
      this.eat('Plus');
      return new UnaryOperator((a: number) => a, this.factor());
    } else if (type === 'Minus') {
      this.eat('Minus');
      return new UnaryOperator((a: number) => a * (-1), this.factor());
    } else if (type === 'LeftParen') {
      this.eat('LeftParen');
      const node = this.expr();
      this.eat('RightParen');
      return node;
    } else if (type === 'ID') {
      return this.variable();
    } else {
      throw new Error('Invalid expression');
    }
  }

  private eat(type: TokenType) {
    if (this.current.type === type) {
      this.index += 1;
      this.current = this.tokens[this.index] || { type: 'STOP' };
    } else {
      console.log(this.current);
      throw new Error(`Parser error at ${this.index}`);
    }
  }
}

export { Parser };
