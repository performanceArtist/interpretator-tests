import repl from 'repl';

import { ByRules } from './ByRules/ByRulesAST';

console.log('Type an expression(like 2+2*3 for example):\n');

repl.start({
  prompt: '> ',
  terminal: true,
  eval: (cmd, _, __, callback) => {
    const interpreter = new ByRules(cmd);
    callback(null, `Result: ${interpreter.evaluate()}`);
  }
});
