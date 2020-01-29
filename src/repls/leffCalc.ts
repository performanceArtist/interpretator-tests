import repl from 'repl';

import { Lexer } from '../calc/lexer';
import { Interpreter } from '../leff/Interpreter';
import { root } from './leffRoot';

export function startCalcRepl() {
  console.log('Type an expression(like 2+2*3 for example):\n');

  repl.start({
    prompt: '> ',
    terminal: true,
    eval: (cmd, _, __, callback) => {
      const lexer = new Lexer(cmd.trim());
      const tokens = lexer.getTokens();
      const interpreter = new Interpreter(tokens);

      interpreter.implement('Plus', (a, b) => a + b);
      interpreter.implement('Minus', (a, b) => a - b);
      interpreter.implement('Div', (a, b) => a / b);
      interpreter.implement('Mul', (a, b) => a * b);

      console.log('\nTokens:', tokens, '\n');

      const result = interpreter.evaluate(root.expr, root);

      callback(null, `Result: ${result}`);
    }
  });
}
