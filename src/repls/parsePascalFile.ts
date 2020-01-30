import { promisify } from 'util';
import fs from 'fs';

import { Lexer as PascalLexer, Parser as PascalParser } from '../pascal';

const readFile = promisify(fs.readFile);

export function parsePascalFile(path: string) {
  readFile(path)
    .then(content => {
      const program = content.toString().trim();
      const lexer = new PascalLexer(program, false);
      const tokens = lexer.getTokens();
      const interpreter = new PascalParser(tokens);

      console.log('\nTokens:', tokens, '\n');

      const result = interpreter.evaluate();
      console.log(`Result: ${result}`);
    })
    .catch(error => console.log(error));
}
