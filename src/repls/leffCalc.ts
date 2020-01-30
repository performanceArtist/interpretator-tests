import repl from 'repl';

import { Lexer } from '../calc/lexer';
import { Interpreter } from '../leff/Interpreter';
import { root } from './leffRoot';
import { BinaryOperator, Value, UnaryOperator } from '../ast';

export function startCalcRepl() {
  console.log('Type an expression(like 2+2*3 for example):\n');

  repl.start({
    prompt: '> ',
    terminal: true,
    eval: (cmd, _, __, callback) => {
      const lexer = new Lexer(cmd.trim());
      const tokens = lexer.getTokens();
      const interpreter = new Interpreter(tokens);

      interpreter.implement(
        'nullary',
        'Number',
        ({ value }) => new Value(value)
      );
      interpreter.implement(
        'unary',
        'Minus',
        node => new UnaryOperator((a: number) => -a, node)
      );
      interpreter.implement(
        'unary',
        'Plus',
        node => new UnaryOperator((a: number) => a, node)
      );
      interpreter.implement(
        'binary',
        'Plus',
        (left, right) => new BinaryOperator((a, b) => a + b, left, right)
      );
      interpreter.implement(
        'binary',
        'Minus',
        (left, right) => new BinaryOperator((a, b) => a - b, left, right)
      );
      interpreter.implement(
        'binary',
        'Div',
        (left, right) => new BinaryOperator((a, b) => a / b, left, right)
      );
      interpreter.implement(
        'binary',
        'Mul',
        (left, right) => new BinaryOperator((a, b) => a * b, left, right)
      );

      console.log('\nTokens:', tokens, '\n');

      const result = interpreter.evaluate(root.expr, root);

      callback(null, `Result: ${result}`);
    }
  });
}
