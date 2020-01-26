export * from './ast';
export * from './eat';
export * from './symbol';
export * from './token';

import { ASTEffect } from './ast';
import { EatEffect } from './eat';
import { SymbolEffect } from './symbol';
import { TokenEffect } from './token';

export type Effect = ASTEffect<any> | EatEffect | SymbolEffect | TokenEffect;
