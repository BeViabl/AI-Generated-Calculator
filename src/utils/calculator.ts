import { Operation, ScientificOperation } from '../types/calculator';

export const calculate = (firstValue: number, secondValue: number, operation: Operation): number => {
  switch (operation) {
    case '+':
      return firstValue + secondValue;
    case '-':
      return firstValue - secondValue;
    case '*':
      return firstValue * secondValue;
    case '/':
      if (secondValue === 0) {
        throw new Error('Division by zero');
      }
      return firstValue / secondValue;
    default:
      return secondValue;
  }
};

export const calculateScientific = (value: number, operation: ScientificOperation, angleMode: 'deg' | 'rad' = 'rad', secondValue?: number): number => {
  // Convert degrees to radians for trig functions if needed
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);
  
  // Helper to clean up floating point errors for trig functions
  const cleanTrigResult = (result: number): number => {
    // If the result is very close to 0, 1, or -1, round to that value
    if (Math.abs(result) < 1e-10) return 0;
    if (Math.abs(result - 1) < 1e-10) return 1;
    if (Math.abs(result + 1) < 1e-10) return -1;
    return result;
  };
  
  switch (operation) {
    case 'sin':
      return cleanTrigResult(Math.sin(angleMode === 'deg' ? toRadians(value) : value));
    case 'cos':
      return cleanTrigResult(Math.cos(angleMode === 'deg' ? toRadians(value) : value));
    case 'tan':
      // Special handling for tan at 90, 270 degrees etc.
      if (angleMode === 'deg' && Math.abs((value % 180) - 90) < 1e-10) {
        throw new Error('Undefined');
      }
      if (angleMode === 'rad' && Math.abs((value % Math.PI) - Math.PI/2) < 1e-10) {
        throw new Error('Undefined');
      }
      return cleanTrigResult(Math.tan(angleMode === 'deg' ? toRadians(value) : value));
    case 'log':
      if (value <= 0) throw new Error('Invalid input for logarithm');
      return Math.log10(value);
    case 'ln':
      if (value <= 0) throw new Error('Invalid input for natural logarithm');
      return Math.log(value);
    case 'sqrt':
      if (value < 0) throw new Error('Invalid input for square root');
      return Math.sqrt(value);
    case 'x^2':
      return value * value;
    case 'x^y':
      if (secondValue === undefined) throw new Error('Second value required for power operation');
      return Math.pow(value, secondValue);
    case 'pow':
      if (secondValue === undefined) throw new Error('Second value required for power operation');
      return Math.pow(value, secondValue);
    case '1/x':
      if (value === 0) throw new Error('Division by zero');
      return 1 / value;
    case 'e^x':
      return Math.exp(value);
    case '10^x':
      return Math.pow(10, value);
    default:
      throw new Error('Unknown operation');
  }
};

export const formatDisplay = (value: string): string => {
  if (value === 'Error') return value;
  
  const num = parseFloat(value);
  if (isNaN(num)) return '0';
  
  // Handle numbers that are essentially zero (within floating point precision)
  if (Math.abs(num) < 1e-10) {
    return '0';
  }
  
  // Handle very large or very small numbers
  if (Math.abs(num) > 999999999 || (Math.abs(num) < 0.000001 && num !== 0)) {
    return num.toExponential(6);
  }
  
  // Remove trailing zeros after decimal point
  if (value.includes('.') && !value.includes('e')) {
    return parseFloat(value).toString();
  }
  
  return value;
};

// Mathematical constants
export const CONSTANTS = {
  PI: Math.PI,
  E: Math.E,
} as const;