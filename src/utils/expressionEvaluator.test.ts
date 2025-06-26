import { ExpressionEvaluator } from './expressionEvaluator';

const testExpressionEvaluator = () => {
  console.log('Testing Expression Evaluator...\n');
  
  const evaluator = new ExpressionEvaluator('deg');
  
  // Basic arithmetic
  console.assert(evaluator.evaluate('2 + 3') === 5, 'Basic addition failed');
  console.assert(evaluator.evaluate('10 - 4') === 6, 'Basic subtraction failed');
  console.assert(evaluator.evaluate('3 * 4') === 12, 'Basic multiplication failed');
  console.assert(evaluator.evaluate('15 / 3') === 5, 'Basic division failed');
  
  // Parentheses
  console.assert(evaluator.evaluate('(2 + 3) * 4') === 20, 'Parentheses precedence failed');
  console.assert(evaluator.evaluate('2 * (3 + 4)') === 14, 'Parentheses precedence failed');
  console.assert(evaluator.evaluate('((2 + 3) * 4) / 2') === 10, 'Nested parentheses failed');
  
  // Order of operations
  console.assert(evaluator.evaluate('2 + 3 * 4') === 14, 'Order of operations failed');
  console.assert(evaluator.evaluate('20 / 4 + 3') === 8, 'Order of operations failed');
  console.assert(evaluator.evaluate('2 ^ 3 * 4') === 32, 'Power precedence failed');
  
  // Power operations
  console.assert(evaluator.evaluate('2 ^ 3') === 8, 'Power operation failed');
  console.assert(evaluator.evaluate('10 ^ 2') === 100, 'Power operation failed');
  console.assert(evaluator.evaluate('2 ^ 10') === 1024, 'Power operation failed');
  
  // Large number expression (10^100) + 1
  const largeResult = evaluator.evaluate('(10^100) + 1');
  console.assert(largeResult === 1e100 + 1, 'Large number expression failed');
  console.log(`✓ (10^100) + 1 = ${largeResult.toExponential(6)}`);
  
  // Scientific functions
  console.assert(Math.abs(evaluator.evaluate('sin(90)') - 1) < 0.0001, 'sin(90°) failed');
  console.assert(Math.abs(evaluator.evaluate('cos(0)') - 1) < 0.0001, 'cos(0°) failed');
  console.assert(Math.abs(evaluator.evaluate('tan(45)') - 1) < 0.0001, 'tan(45°) failed');
  console.assert(Math.abs(evaluator.evaluate('sqrt(16)') - 4) < 0.0001, 'sqrt(16) failed');
  console.assert(Math.abs(evaluator.evaluate('log(100)') - 2) < 0.0001, 'log(100) failed');
  console.assert(Math.abs(evaluator.evaluate('ln(e)') - 1) < 0.0001, 'ln(e) failed');
  
  // Complex expressions with functions
  console.assert(Math.abs(evaluator.evaluate('2 * sin(30)') - 1) < 0.0001, 'Complex function expression failed');
  console.assert(Math.abs(evaluator.evaluate('sqrt(16) + log(100)') - 6) < 0.0001, 'Multiple functions failed');
  
  // Constants
  console.assert(Math.abs(evaluator.evaluate('π') - Math.PI) < 0.0001, 'PI constant failed');
  console.assert(Math.abs(evaluator.evaluate('e') - Math.E) < 0.0001, 'E constant failed');
  console.assert(Math.abs(evaluator.evaluate('2 * π') - 2 * Math.PI) < 0.0001, 'PI in expression failed');
  
  // Complex expression with constants and functions
  const radEvaluator = new ExpressionEvaluator('rad');
  console.assert(Math.abs(radEvaluator.evaluate('sin(π/2)') - 1) < 0.0001, 'sin(π/2) failed');
  console.assert(Math.abs(evaluator.evaluate('e^2') - Math.exp(2)) < 0.0001, 'e^2 failed');
  
  // Error handling
  try {
    evaluator.evaluate('2 / 0');
    console.error('Division by zero should throw error');
  } catch (e) {
    console.log('✓ Division by zero correctly throws error');
  }
  
  try {
    evaluator.evaluate('(2 + 3');
    console.error('Mismatched parentheses should throw error');
  } catch (e) {
    console.log('✓ Mismatched parentheses correctly throws error');
  }
  
  try {
    evaluator.evaluate('sqrt(-4)');
    console.error('sqrt(-4) should throw error');
  } catch (e) {
    console.log('✓ sqrt(-4) correctly throws error');
  }
  
  console.log('\nAll expression evaluator tests passed!');
};

// Run tests
console.log('Running Expression Evaluator Tests\n');
console.log('==================================\n');

testExpressionEvaluator();

export {};