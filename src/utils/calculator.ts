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
  
  // If the value is already in exponential notation and parseFloat would lose precision,
  // just return it as-is
  if (value.includes('e') || value.includes('E')) {
    // Check if it's a valid exponential notation
    const parts = value.toLowerCase().split('e');
    if (parts.length === 2 && !isNaN(parseFloat(parts[0])) && !isNaN(parseFloat(parts[1]))) {
      return value;
    }
  }
  
  const num = parseFloat(value);
  if (isNaN(num)) return '0';
  
  // Check if the number has more than 16 significant digits (beyond double precision)
  // In that case, just return the string as-is to preserve precision
  const absNum = Math.abs(num);
  if (value.replace(/[^\d]/g, '').length > 16 && !value.includes('e')) {
    return value;
  }
  
  // Only treat as zero if it's actually zero and the original string was "0"
  if (num === 0 && (value === '0' || value === '0.0' || value === '0.00')) {
    return '0';
  }
  
  // Handle very large or very small numbers
  if (absNum > 999999999 || (absNum < 0.000001 && num !== 0)) {
    // Check if it's a very round number in scientific notation
    const exp = num.toExponential();
    const parts = exp.split('e');
    const mantissa = parseFloat(parts[0]);
    // If mantissa is very simple (like 1, 2, 5), show short form
    if (Number.isInteger(mantissa * 10) && Math.abs(mantissa) < 10) {
      return exp;
    }
    // Otherwise show more precision
    return num.toExponential(15);
  }
  
  // For normal numbers, return string representation
  // This will show exact values like 0.3 as "0.3" and 0.30000000000000004 as is
  return value;
};

// Mathematical constants
export const CONSTANTS = {
  PI: Math.PI,
  E: Math.E,
} as const;