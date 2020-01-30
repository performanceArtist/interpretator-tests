import repl from 'repl';

import { Lexer as PascalLexer, Parser as PascalParser } from '../pascal';

export function startPascalRepl() {
  console.log('Enter a valid Pascal expression');

  repl.start({
    prompt: '> ',
    terminal: true,
    eval: (cmd, _, __, callback) => {
      const lexer = new PascalLexer(cmd.trim(), false);
      const tokens = lexer.getTokens();
      const interpreter = new PascalParser(tokens);

      console.log('\nTokens:', tokens, '\n');

      const result = interpreter.evaluate();

      callback(null, `Result: ${result}`);
    }
  });
}
