import { calculate, calculateScientific, formatDisplay, CONSTANTS } from './calculator';

// Test cases for calculate function
const testCalculate = () => {
  console.log('Testing calculate function...\n');

  // Basic operations
  console.assert(calculate(5, 3, '+') === 8, 'Addition failed');
  console.assert(calculate(10, 4, '-') === 6, 'Subtraction failed');
  console.assert(calculate(6, 7, '*') === 42, 'Multiplication failed');
  console.assert(calculate(15, 3, '/') === 5, 'Division failed');

  // Edge cases
  console.assert(calculate(0, 5, '+') === 5, 'Addition with zero failed');
  console.assert(calculate(5, 0, '*') === 0, 'Multiplication by zero failed');
  console.assert(calculate(0, 0, '+') === 0, 'Zero addition failed');
  
  // Division by zero
  try {
    calculate(5, 0, '/');
    console.error('Division by zero should throw error');
  } catch (e) {
    console.log('✓ Division by zero correctly throws error');
  }

  // Very large numbers
  console.assert(calculate(1e307, 1e307, '+') === 2e307, 'Large number addition failed');
  console.assert(calculate(1e307, 2, '*') === 2e307, 'Large number multiplication failed');

  // Very small numbers
  console.assert(calculate(1e-10, 1e-10, '+') === 2e-10, 'Small number addition failed');
  console.assert(calculate(1e-10, 2, '/') === 5e-11, 'Small number division failed');

  // Negative numbers
  console.assert(calculate(-5, 3, '+') === -2, 'Negative addition failed');
  console.assert(calculate(-5, -3, '*') === 15, 'Negative multiplication failed');
  console.assert(calculate(-10, -2, '/') === 5, 'Negative division failed');

  console.log('All calculate tests passed!\n');
};

// Test cases for formatDisplay function
const testFormatDisplay = () => {
  console.log('Testing formatDisplay function...\n');

  // Normal numbers
  console.assert(formatDisplay('123') === '123', 'Normal number formatting failed');
  console.assert(formatDisplay('123.456') === '123.456', 'Decimal formatting failed');
  
  // Remove trailing zeros
  console.assert(formatDisplay('123.000') === '123', 'Trailing zero removal failed');
  console.assert(formatDisplay('123.4500') === '123.45', 'Partial trailing zero removal failed');

  // Very large numbers (should use exponential notation)
  console.assert(formatDisplay('1234567890') === '1.234568e+9', 'Large number exponential formatting failed');
  console.assert(formatDisplay('9999999999') === '1.000000e+10', 'Large number boundary formatting failed');

  // Very small numbers (should use exponential notation)
  console.assert(formatDisplay('0.0000001') === '1.000000e-7', 'Small number exponential formatting failed');
  console.assert(formatDisplay('0.00000012345') === '1.234500e-7', 'Small number precision formatting failed');

  // Error handling
  console.assert(formatDisplay('Error') === 'Error', 'Error message preservation failed');
  console.assert(formatDisplay('NaN') === '0', 'NaN handling failed');
  console.assert(formatDisplay('') === '0', 'Empty string handling failed');

  // Zero handling
  console.assert(formatDisplay('0') === '0', 'Zero formatting failed');
  console.assert(formatDisplay('0.0') === '0', 'Decimal zero formatting failed');

  console.log('All formatDisplay tests passed!\n');
};

// Test cases for scientific functions
const testScientificCalculations = () => {
  console.log('Testing scientific calculations...\n');

  // Test trigonometric functions in radians
  console.assert(Math.abs(calculateScientific(0, 'sin', 'rad') - 0) < 0.0001, 'sin(0) failed');
  console.assert(Math.abs(calculateScientific(Math.PI / 2, 'sin', 'rad') - 1) < 0.0001, 'sin(π/2) failed');
  console.assert(Math.abs(calculateScientific(0, 'cos', 'rad') - 1) < 0.0001, 'cos(0) failed');
  console.assert(Math.abs(calculateScientific(Math.PI, 'cos', 'rad') + 1) < 0.0001, 'cos(π) failed');
  
  // Test trigonometric functions in degrees
  console.assert(Math.abs(calculateScientific(90, 'sin', 'deg') - 1) < 0.0001, 'sin(90°) failed');
  console.assert(Math.abs(calculateScientific(180, 'cos', 'deg') + 1) < 0.0001, 'cos(180°) failed');
  console.assert(Math.abs(calculateScientific(45, 'tan', 'deg') - 1) < 0.0001, 'tan(45°) failed');

  // Test logarithmic functions
  console.assert(Math.abs(calculateScientific(10, 'log') - 1) < 0.0001, 'log(10) failed');
  console.assert(Math.abs(calculateScientific(100, 'log') - 2) < 0.0001, 'log(100) failed');
  console.assert(Math.abs(calculateScientific(Math.E, 'ln') - 1) < 0.0001, 'ln(e) failed');

  // Test power functions
  console.assert(calculateScientific(5, 'x^2') === 25, 'x^2 failed');
  console.assert(calculateScientific(2, 'x^y', 'rad', 3) === 8, 'x^y failed');
  console.assert(calculateScientific(4, '1/x') === 0.25, '1/x failed');
  console.assert(Math.abs(calculateScientific(2, 'e^x') - Math.exp(2)) < 0.0001, 'e^x failed');
  console.assert(calculateScientific(2, '10^x') === 100, '10^x failed');

  // Test square root
  console.assert(calculateScientific(16, 'sqrt') === 4, 'sqrt(16) failed');
  console.assert(calculateScientific(2, 'sqrt') === Math.sqrt(2), 'sqrt(2) failed');

  // Test error cases
  try {
    calculateScientific(-1, 'sqrt');
    console.error('sqrt(-1) should throw error');
  } catch (e) {
    console.log('✓ sqrt(-1) correctly throws error');
  }

  try {
    calculateScientific(0, 'log');
    console.error('log(0) should throw error');
  } catch (e) {
    console.log('✓ log(0) correctly throws error');
  }

  try {
    calculateScientific(0, '1/x');
    console.error('1/0 should throw error');
  } catch (e) {
    console.log('✓ 1/0 correctly throws error');
  }

  console.log('All scientific calculation tests passed!\n');
};

// Test constants
const testConstants = () => {
  console.log('Testing mathematical constants...\n');
  
  console.assert(Math.abs(CONSTANTS.PI - Math.PI) < 0.0001, 'PI constant failed');
  console.assert(Math.abs(CONSTANTS.E - Math.E) < 0.0001, 'E constant failed');
  
  console.log('All constant tests passed!\n');
};

// Run all tests
console.log('Running Calculator Tests\n');
console.log('=======================\n');

testCalculate();
testFormatDisplay();
testScientificCalculations();
testConstants();

console.log('All tests completed successfully!');

export {};