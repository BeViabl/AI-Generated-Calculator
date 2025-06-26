import Decimal from 'decimal.js';
import { ScientificOperation } from '../types/calculator';

// Configure Decimal for high precision
Decimal.set({ precision: 50 });

type Token = {
  type: 'number' | 'operator' | 'function' | 'leftParen' | 'rightParen' | 'constant';
  value: string;
};

export class ExpressionEvaluator {
  private angleMode: 'deg' | 'rad';
  
  constructor(angleMode: 'deg' | 'rad' = 'deg') {
    this.angleMode = angleMode;
  }

  evaluate(expression: string): number {
    if (!expression || expression.trim() === '') {
      throw new Error('Empty expression');
    }

    const tokens = this.tokenize(expression);
    const postfix = this.toPostfix(tokens);
    const result = this.evaluatePostfix(postfix);
    return result.toNumber();
  }

  private tokenize(expression: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;

    while (i < expression.length) {
      const char = expression[i];

      // Skip whitespace
      if (/\s/.test(char)) {
        i++;
        continue;
      }

      // Numbers (including decimals and scientific notation)
      if (/\d/.test(char) || (char === '.' && i + 1 < expression.length && /\d/.test(expression[i + 1]))) {
        let num = '';
        while (i < expression.length && (/\d/.test(expression[i]) || expression[i] === '.' || expression[i] === 'e' || expression[i] === 'E' || ((expression[i] === '-' || expression[i] === '+') && i > 0 && /[eE]/.test(expression[i - 1])))) {
          num += expression[i];
          i++;
        }
        tokens.push({ type: 'number', value: num });
        continue;
      }

      // Constants
      if (expression.substr(i, 2) === 'PI' || expression.substr(i, 2) === 'pi') {
        tokens.push({ type: 'constant', value: 'PI' });
        i += 2;
        continue;
      }
      if (expression[i] === 'π') {
        tokens.push({ type: 'constant', value: 'PI' });
        i++;
        continue;
      }
      if (expression[i] === 'e' && (i + 1 >= expression.length || !/\d/.test(expression[i + 1]))) {
        tokens.push({ type: 'constant', value: 'E' });
        i++;
        continue;
      }

      // Functions
      const functionMatch = expression.substr(i).match(/^(sin|cos|tan|log|ln|sqrt)/);
      if (functionMatch) {
        tokens.push({ type: 'function', value: functionMatch[1] });
        i += functionMatch[1].length;
        continue;
      }

      // Handle minus sign (could be subtraction or negative number)
      if (char === '-') {
        // Check if this is a negative number (minus at start, after operator, or after left paren)
        const lastToken = tokens[tokens.length - 1];
        const isNegative = tokens.length === 0 || 
                          (lastToken && (lastToken.type === 'operator' || lastToken.type === 'leftParen' || lastToken.type === 'function'));
        
        if (isNegative) {
          // This is a negative number, read the number
          i++; // Skip the minus sign
          if (i < expression.length && (/\d/.test(expression[i]) || expression[i] === '.')) {
            let num = '-';
            while (i < expression.length && (/\d/.test(expression[i]) || expression[i] === '.' || expression[i] === 'e' || expression[i] === 'E' || ((expression[i] === '-' || expression[i] === '+') && i > 0 && /[eE]/.test(expression[i - 1])))) {
              num += expression[i];
              i++;
            }
            tokens.push({ type: 'number', value: num });
            continue;
          } else {
            // Just a minus operator
            tokens.push({ type: 'operator', value: '-' });
            continue;
          }
        } else {
          // This is subtraction
          tokens.push({ type: 'operator', value: '-' });
          i++;
        }
      } else if ('+*/^'.includes(char)) {
        tokens.push({ type: 'operator', value: char });
        i++;
      } else if (char === '(') {
        tokens.push({ type: 'leftParen', value: '(' });
        i++;
      } else if (char === ')') {
        tokens.push({ type: 'rightParen', value: ')' });
        i++;
      } else {
        throw new Error(`Invalid character: ${char}`);
      }
    }

    return tokens;
  }

  private toPostfix(tokens: Token[]): Token[] {
    const output: Token[] = [];
    const stack: Token[] = [];
    
    const precedence: { [key: string]: number } = {
      '+': 1,
      '-': 1,
      '*': 2,
      '/': 2,
      '^': 3,
    };

    for (const token of tokens) {
      if (token.type === 'number' || token.type === 'constant') {
        output.push(token);
      } else if (token.type === 'function') {
        stack.push(token);
      } else if (token.type === 'operator') {
        while (
          stack.length > 0 &&
          stack[stack.length - 1].type === 'operator' &&
          precedence[stack[stack.length - 1].value] >= precedence[token.value] &&
          !(token.value === '^' && stack[stack.length - 1].value === '^') // Right associative
        ) {
          output.push(stack.pop()!);
        }
        stack.push(token);
      } else if (token.type === 'leftParen') {
        stack.push(token);
      } else if (token.type === 'rightParen') {
        while (stack.length > 0 && stack[stack.length - 1].type !== 'leftParen') {
          output.push(stack.pop()!);
        }
        if (stack.length === 0) {
          throw new Error('Mismatched parentheses');
        }
        stack.pop(); // Remove left paren
        
        // If there's a function before the left paren, pop it to output
        if (stack.length > 0 && stack[stack.length - 1].type === 'function') {
          output.push(stack.pop()!);
        }
      }
    }

    while (stack.length > 0) {
      const token = stack.pop()!;
      if (token.type === 'leftParen') {
        throw new Error('Mismatched parentheses');
      }
      output.push(token);
    }

    return output;
  }

  private evaluatePostfix(tokens: Token[]): Decimal {
    const stack: Decimal[] = [];

    for (const token of tokens) {
      if (token.type === 'number') {
        stack.push(new Decimal(token.value));
      } else if (token.type === 'constant') {
        if (token.value === 'PI') {
          // Use Decimal's pi with high precision
          // We need to use the string representation to maintain full precision
          stack.push(new Decimal('3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679'));
        } else if (token.value === 'E') {
          // Use Decimal's e with high precision
          stack.push(new Decimal('2.7182818284590452353602874713526624977572470936999595749669676277240766303535475945713821785251664274'));
        }
      } else if (token.type === 'operator') {
        if (stack.length < 2) {
          throw new Error('Invalid expression');
        }
        const b = stack.pop()!;
        const a = stack.pop()!;
        
        switch (token.value) {
          case '+':
            stack.push(a.plus(b));
            break;
          case '-':
            stack.push(a.minus(b));
            break;
          case '*':
            stack.push(a.times(b));
            break;
          case '/':
            if (b.isZero()) throw new Error('Division by zero');
            stack.push(a.dividedBy(b));
            break;
          case '^':
            stack.push(a.pow(b));
            break;
        }
      } else if (token.type === 'function') {
        if (stack.length < 1) {
          throw new Error('Invalid expression');
        }
        const a = stack.pop()!;
        
        try {
          const result = this.calculateScientificDecimal(a, token.value as ScientificOperation);
          stack.push(result);
        } catch (error) {
          throw new Error(`Function error: ${error}`);
        }
      }
    }

    if (stack.length !== 1) {
      throw new Error('Invalid expression');
    }

    return stack[0];
  }

  private calculateScientificDecimal(value: Decimal, operation: ScientificOperation): Decimal {
    // Get exact pi value - same as used for PI constant
    const pi = new Decimal('3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679');
    
    // Convert degrees to radians for trig functions if needed
    const toRadians = (degrees: Decimal) => degrees.times(pi).dividedBy(180);
    
    // For trig functions, check if the input is a multiple of pi for exact results
    const checkExactTrigValue = (radianValue: Decimal): Decimal | null => {
      // Check if value is n*π
      const nPi = radianValue.dividedBy(pi);
      if (nPi.mod(1).abs().lt(new Decimal('1e-40'))) {
        const n = nPi.round();
        // sin(n*π) = 0 for all integer n
        if (operation === 'sin') return new Decimal(0);
        // cos(n*π) = (-1)^n
        if (operation === 'cos') return n.mod(2).eq(0) ? new Decimal(1) : new Decimal(-1);
        // tan(n*π) = 0 for all integer n
        if (operation === 'tan') return new Decimal(0);
      }
      
      // Check if value is (n + 0.5)*π
      const nPlusHalf = radianValue.dividedBy(pi).minus(0.5);
      if (nPlusHalf.mod(1).abs().lt(new Decimal('1e-40'))) {
        const n = nPlusHalf.round();
        // sin((n + 0.5)*π) = (-1)^n
        if (operation === 'sin') return n.mod(2).eq(0) ? new Decimal(1) : new Decimal(-1);
        // cos((n + 0.5)*π) = 0
        if (operation === 'cos') return new Decimal(0);
        // tan((n + 0.5)*π) = undefined (would throw error)
        if (operation === 'tan') throw new Error('Undefined: tan of odd multiple of π/2');
      }
      
      return null;
    };
    
    switch (operation) {
      case 'sin': {
        const radianValue = this.angleMode === 'deg' ? toRadians(value) : value;
        const exact = checkExactTrigValue(radianValue);
        return exact !== null ? exact : Decimal.sin(radianValue);
      }
      case 'cos': {
        const radianValue = this.angleMode === 'deg' ? toRadians(value) : value;
        const exact = checkExactTrigValue(radianValue);
        return exact !== null ? exact : Decimal.cos(radianValue);
      }
      case 'tan': {
        const radianValue = this.angleMode === 'deg' ? toRadians(value) : value;
        const exact = checkExactTrigValue(radianValue);
        return exact !== null ? exact : Decimal.tan(radianValue);
      }
      case 'log':
        if (value.lte(0)) throw new Error('Invalid input for logarithm');
        return Decimal.log10(value);
      case 'ln':
        if (value.lte(0)) throw new Error('Invalid input for natural logarithm');
        return Decimal.ln(value);
      case 'sqrt':
        if (value.lt(0)) throw new Error('Invalid input for square root');
        return value.sqrt();
      default:
        throw new Error('Unknown operation');
    }
  }
}