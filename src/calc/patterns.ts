import { Pattern } from './lexer';

export const addition = ['Number', 'Plus', 'Number'] as const;
export const subtraction = ['Number', 'Minus', 'Number'] as const;
export const multiplication = ['Number', 'Mul', 'Number'] as const;
export const division = ['Number', 'Div', 'Number'] as const;

export type BinaryArithmetic<T extends Readonly<Pattern>> = {
  [key in keyof T]: {
    type: T[key];
    value: T[key] extends 'Number' ? number : undefined;
  };
};
