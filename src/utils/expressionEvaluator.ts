import { calculateScientific, CONSTANTS } from './calculator';
import { ScientificOperation } from '../types/calculator';

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
    return this.evaluatePostfix(postfix);
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
        while (i < expression.length && (/\d/.test(expression[i]) || expression[i] === '.' || expression[i] === 'e' || expression[i] === 'E' || (expression[i] === '-' && i > 0 && /[eE]/.test(expression[i - 1])))) {
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
            while (i < expression.length && (/\d/.test(expression[i]) || expression[i] === '.' || expression[i] === 'e' || expression[i] === 'E')) {
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

  private evaluatePostfix(tokens: Token[]): number {
    const stack: number[] = [];

    for (const token of tokens) {
      if (token.type === 'number') {
        stack.push(parseFloat(token.value));
      } else if (token.type === 'constant') {
        stack.push(CONSTANTS[token.value as keyof typeof CONSTANTS]);
      } else if (token.type === 'operator') {
        if (stack.length < 2) {
          throw new Error('Invalid expression');
        }
        const b = stack.pop()!;
        const a = stack.pop()!;
        
        switch (token.value) {
          case '+':
            stack.push(a + b);
            break;
          case '-':
            stack.push(a - b);
            break;
          case '*':
            stack.push(a * b);
            break;
          case '/':
            if (b === 0) throw new Error('Division by zero');
            stack.push(a / b);
            break;
          case '^':
            stack.push(Math.pow(a, b));
            break;
        }
      } else if (token.type === 'function') {
        if (stack.length < 1) {
          throw new Error('Invalid expression');
        }
        const a = stack.pop()!;
        
        try {
          const result = calculateScientific(a, token.value as ScientificOperation, this.angleMode);
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
}