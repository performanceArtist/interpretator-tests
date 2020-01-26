import repl from 'repl';

import { Lexer } from '../calc/lexer';
import { ByRules } from '../calc/decl/ByRulesDecl';

export function startCalcRepl() {
  console.log('Type an expression(like 2+2*3 for example):\n');

  repl.start({
    prompt: '> ',
    terminal: true,
    eval: (cmd, _, __, callback) => {
      const lexer = new Lexer(cmd.trim());
      const tokens = lexer.getTokens();
      const interpreter = new ByRules(tokens);

      console.log('\nTokens:', tokens, '\n');

      const result = interpreter.evaluate();

      callback(null, `Result: ${result}`);
    }
  });
}
