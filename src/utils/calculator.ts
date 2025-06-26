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
  
  switch (operation) {
    case 'sin':
      return Math.sin(angleMode === 'deg' ? toRadians(value) : value);
    case 'cos':
      return Math.cos(angleMode === 'deg' ? toRadians(value) : value);
    case 'tan':
      return Math.tan(angleMode === 'deg' ? toRadians(value) : value);
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
  
  // Only treat as zero if it's actually zero
  if (num === 0) {
    return '0';
  }
  
  // Handle very large or very small numbers
  if (Math.abs(num) > 999999999 || (Math.abs(num) < 0.000001 && num !== 0)) {
    return num.toExponential(15);  // Increased precision to show more exact values
  }
  
  // For normal numbers, just convert to string which shows the exact floating-point value
  return num.toString();
};

// Mathematical constants
export const CONSTANTS = {
  PI: Math.PI,
  E: Math.E,
} as const;