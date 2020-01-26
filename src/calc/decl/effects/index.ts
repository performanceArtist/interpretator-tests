export * from './ast';
export * from './eat';
export * from './symbol';
export * from './token';
export * from './node';

import { ASTEffect } from './ast';
import { EatEffect } from './eat';
import { SymbolEffect } from './symbol';
import { TokenEffect } from './token';
import { NodeEffect } from './node';

export type Effect = ASTEffect<any> | EatEffect | SymbolEffect | TokenEffect | NodeEffect;
