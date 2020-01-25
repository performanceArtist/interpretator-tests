import { Token } from './calc/lexer';
import { ByRules } from './ByRules/ByRulesTest';

export function arithmetic(tokens: readonly Token[]) {
  const termMap = {
    'Mul': (a: number, b: number) => a * b,
    'Div': (a: number, b: number) => a / b,
  };
  const exprMap = {
    'Plus': (a: number, b: number) => a + b,
    'Minus': (a: number, b: number) => a - b,
  }

  return new ByRules(tokens, termMap, exprMap);
}

export function rpn(tokens: readonly Token[]) {
  const termMap = {
    'Mul': (a: number, b: number) => `${a} ${b} *`,
    'Div': (a: number, b: number) => `${a} ${b} /`,
  };
  const exprMap = {
    'Plus': (a: number, b: number) => `${a} ${b} +`,
    'Minus': (a: number, b: number) => `${a} ${b} -`,
  }

  return new ByRules(tokens, termMap, exprMap);
}

export function lisp(tokens: readonly Token[]) {
  const termMap = {
    'Mul': (a: number, b: number) => `(* ${a} ${b})`,
    'Div': (a: number, b: number) => `(/ ${a} ${b})`,
  };
  const exprMap = {
    'Plus': (a: number, b: number) => `(+ ${a} ${b})`,
    'Minus': (a: number, b: number) => `(- ${a} ${b})`,
  }

  return new ByRules(tokens, termMap, exprMap);
}
