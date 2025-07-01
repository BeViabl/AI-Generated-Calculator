export type Operation = '+' | '-' | '*' | '/' | '=' | 'pow' | null;
export type ScientificOperation = 'sin' | 'cos' | 'tan' | 'log' | 'ln' | 'sqrt' | 'pow' | 'x^2' | 'x^y' | '1/x' | 'e^x' | '10^x';

export interface CalculatorState {
  display: string;
  previousValue: number | null;
  currentValue: string;
  operation: Operation;
  waitingForNewValue: boolean;
  memory: number;
  isScientific: boolean;
  angleMode: 'deg' | 'rad';
  expression: string;
  isExpressionMode: boolean;
  openParentheses: number;
  previousResult: string | null;
}