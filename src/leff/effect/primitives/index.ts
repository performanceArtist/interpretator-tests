import { AST } from '../../../ast';

export * from './eat';
export * from './symbol';
export * from './token';
export * from './node';
export * from './nullaryAST';
export * from './unaryAST';
export * from './binaryAST';

import { NullaryASTEffect } from './nullaryAST';
import { UnaryASTEffect } from './unaryAST';
import { BinaryASTEffect } from './binaryAST';
import { EatEffect } from './eat';
import { SymbolEffect } from './symbol';
import { TokenEffect } from './token';
import { NodeEffect } from './node';

export type Effect =
  | NullaryASTEffect
  | UnaryASTEffect
  | BinaryASTEffect
  | EatEffect
  | SymbolEffect
  | TokenEffect
  | NodeEffect;

export type EffectGenerator = () => Iterator<
  Effect,
  any,
  AST | { type: string; value?: any }
>;
