import { useState, useCallback, useEffect } from 'react';
import { CalculatorState, Operation, ScientificOperation } from '../types/calculator';
import { calculate, calculateScientific, formatDisplay, CONSTANTS } from '../utils/calculator';
import { ExpressionEvaluator } from '../utils/expressionEvaluator';

const initialState: CalculatorState = {
  display: '',
  previousValue: null,
  currentValue: '0',
  operation: null,
  waitingForNewValue: false,
  memory: 0,
  isScientific: false,
  angleMode: 'deg',
  expression: '',
  isExpressionMode: true,
  openParentheses: 0,
};

export const useCalculator = () => {
  const [state, setState] = useState<CalculatorState>(initialState);

  const handleNumber = useCallback((num: string) => {
    setState((prevState) => {
      if (prevState.waitingForNewValue) {
        return {
          ...prevState,
          currentValue: num,
          display: num,
          waitingForNewValue: false,
        };
      }

      const newValue = prevState.currentValue === '0' ? num : prevState.currentValue + num;
      return {
        ...prevState,
        currentValue: newValue,
        display: newValue,
      };
    });
  }, []);

  const handleDecimal = useCallback(() => {
    setState((prevState) => {
      if (prevState.waitingForNewValue) {
        return {
          ...prevState,
          currentValue: '0.',
          display: '0.',
          waitingForNewValue: false,
        };
      }

      if (prevState.currentValue.includes('.')) {
        return prevState;
      }

      const newValue = prevState.currentValue + '.';
      return {
        ...prevState,
        currentValue: newValue,
        display: newValue,
      };
    });
  }, []);

  const handleOperation = useCallback((nextOperation: Operation) => {
    setState((prevState) => {
      const inputValue = parseFloat(prevState.currentValue);

      if (prevState.previousValue === null) {
        return {
          ...prevState,
          previousValue: inputValue,
          operation: nextOperation,
          waitingForNewValue: true,
        };
      }

      if (prevState.operation && !prevState.waitingForNewValue) {
        try {
          const newValue = calculate(prevState.previousValue, inputValue, prevState.operation);
          const displayValue = formatDisplay(newValue.toString());

          return {
            ...prevState,
            display: displayValue,
            previousValue: newValue,
            currentValue: displayValue,
            operation: nextOperation,
            waitingForNewValue: true,
          };
        } catch (error) {
          return {
            ...prevState,
            display: 'Error',
            previousValue: null,
            currentValue: '0',
            operation: null,
            waitingForNewValue: true,
          };
        }
      }

      return {
        ...prevState,
        operation: nextOperation,
        waitingForNewValue: true,
      };
    });
  }, []);

  const handleScientificOperation = useCallback((operation: ScientificOperation) => {
    setState((prevState) => {
      const inputValue = parseFloat(prevState.currentValue);

      // Operations that need a second value
      if (operation === 'x^y') {
        return {
          ...prevState,
          previousValue: inputValue,
          operation: 'pow', // We'll handle this specially
          waitingForNewValue: true,
        };
      }

      try {
        const result = calculateScientific(inputValue, operation, prevState.angleMode);
        const displayValue = formatDisplay(result.toString());

        return {
          ...prevState,
          display: displayValue,
          currentValue: displayValue,
          waitingForNewValue: true,
        };
      } catch (error) {
        return {
          ...prevState,
          display: 'Error',
          currentValue: '0',
          waitingForNewValue: true,
        };
      }
    });
  }, []);

  const handleEquals = useCallback(() => {
    setState((prevState) => {
      const inputValue = parseFloat(prevState.currentValue);

      if (prevState.previousValue !== null && prevState.operation) {
        try {
          let newValue: number;
          
          // Handle power operation specially
          if (prevState.operation === 'pow') {
            newValue = calculateScientific(prevState.previousValue, 'x^y', prevState.angleMode, inputValue);
          } else {
            newValue = calculate(prevState.previousValue, inputValue, prevState.operation);
          }
          
          const displayValue = formatDisplay(newValue.toString());

          return {
            ...prevState,
            display: displayValue,
            previousValue: null,
            currentValue: displayValue,
            operation: null,
            waitingForNewValue: true,
          };
        } catch (error) {
          return {
            ...prevState,
            display: 'Error',
            previousValue: null,
            currentValue: '0',
            operation: null,
            waitingForNewValue: true,
          };
        }
      }

      return prevState;
    });
  }, []);

  const handleClear = useCallback(() => {
    setState({
      ...initialState,
      isScientific: state.isScientific,
      angleMode: state.angleMode,
      isExpressionMode: state.isExpressionMode,
    });
  }, [state.isScientific, state.angleMode, state.isExpressionMode]);

  const handleClearEntry = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      currentValue: '0',
      display: '0',
      waitingForNewValue: true,
    }));
  }, []);

  const handleToggleSign = useCallback(() => {
    setState((prevState) => {
      const newValue = (parseFloat(prevState.currentValue) * -1).toString();
      return {
        ...prevState,
        currentValue: newValue,
        display: formatDisplay(newValue),
      };
    });
  }, []);

  const handlePercent = useCallback(() => {
    setState((prevState) => {
      const newValue = (parseFloat(prevState.currentValue) / 100).toString();
      return {
        ...prevState,
        currentValue: newValue,
        display: formatDisplay(newValue),
      };
    });
  }, []);

  const handleConstant = useCallback((constant: keyof typeof CONSTANTS) => {
    const value = CONSTANTS[constant].toString();
    setState((prevState) => ({
      ...prevState,
      currentValue: value,
      display: formatDisplay(value),
      waitingForNewValue: true,
    }));
  }, []);

  const toggleScientific = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      isScientific: !prevState.isScientific,
    }));
  }, []);

  const toggleAngleMode = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      angleMode: prevState.angleMode === 'deg' ? 'rad' : 'deg',
    }));
  }, []);

  const toggleExpressionMode = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      isExpressionMode: !prevState.isExpressionMode,
      expression: prevState.isExpressionMode ? '' : prevState.display,
      display: prevState.isExpressionMode ? prevState.display : prevState.display,
      openParentheses: 0,
    }));
  }, []);

  const handleExpressionInput = useCallback((input: string) => {
    setState((prevState) => {
      if (!prevState.isExpressionMode) return prevState;

      let newExpression = prevState.expression;
      let newOpenParentheses = prevState.openParentheses;

      // Handle numbers, operators, and constants
      if (/[\d+\-*/^.]/.test(input) || input === 'π' || input === 'e') {
        newExpression += input;
      } else if (input === '(') {
        newExpression += '(';
        newOpenParentheses++;
      } else if (input === ')' && newOpenParentheses > 0) {
        newExpression += ')';
        newOpenParentheses--;
      } else if (input === 'backspace') {
        if (newExpression.length > 0) {
          const lastChar = newExpression[newExpression.length - 1];
          if (lastChar === '(') newOpenParentheses--;
          else if (lastChar === ')') newOpenParentheses++;
          newExpression = newExpression.slice(0, -1);
        }
      }

      return {
        ...prevState,
        expression: newExpression,
        display: newExpression,
        openParentheses: newOpenParentheses,
      };
    });
  }, []);

  const handleExpressionFunction = useCallback((func: string) => {
    setState((prevState) => {
      if (!prevState.isExpressionMode) return prevState;

      const newExpression = prevState.expression + func + '(';
      return {
        ...prevState,
        expression: newExpression,
        display: newExpression,
        openParentheses: prevState.openParentheses + 1,
      };
    });
  }, []);

  const toggleLastNumberSign = useCallback(() => {
    setState((prevState) => {
      if (!prevState.isExpressionMode || !prevState.expression) return prevState;

      let expression = prevState.expression;
      
      // Find the last number in the expression
      const regex = /(-?\d+\.?\d*)$/;
      const match = expression.match(regex);
      
      if (match) {
        const lastNumber = match[0];
        const position = match.index!;
        
        // Toggle the sign
        if (lastNumber.startsWith('-')) {
          // Remove the negative sign
          expression = expression.substring(0, position) + lastNumber.substring(1);
        } else {
          // Add negative sign, but check what comes before
          const beforeNumber = expression.substring(0, position);
          const lastChar = beforeNumber[beforeNumber.length - 1];
          
          // If the last character is an operator or opening parenthesis, just add the negative
          if (!lastChar || '+-*/^('.includes(lastChar)) {
            expression = beforeNumber + '-' + lastNumber;
          } else {
            // Otherwise, we need to wrap in parentheses
            expression = beforeNumber + '(-' + lastNumber + ')';
          }
        }
      }

      return {
        ...prevState,
        expression: expression,
        display: expression,
      };
    });
  }, []);

  const evaluateExpression = useCallback(() => {
    setState((prevState) => {
      if (!prevState.isExpressionMode || !prevState.expression) return prevState;

      try {
        // Auto-close open parentheses
        let expression = prevState.expression;
        for (let i = 0; i < prevState.openParentheses; i++) {
          expression += ')';
        }

        const evaluator = new ExpressionEvaluator(prevState.angleMode);
        const result = evaluator.evaluate(expression);
        const formattedResult = formatDisplay(result.toString());

        return {
          ...prevState,
          display: formattedResult,
          expression: formattedResult,
          currentValue: formattedResult,
          openParentheses: 0,
          waitingForNewValue: true,
        };
      } catch (error) {
        return {
          ...prevState,
          display: 'Error',
          expression: '',
          currentValue: '0',
          openParentheses: 0,
          waitingForNewValue: true,
        };
      }
    });
  }, []);

  // Memory functions
  const handleMemoryClear = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      memory: 0,
    }));
  }, []);

  const handleMemoryRecall = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      currentValue: prevState.memory.toString(),
      display: formatDisplay(prevState.memory.toString()),
      waitingForNewValue: true,
    }));
  }, []);

  const handleMemoryAdd = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      memory: prevState.memory + parseFloat(prevState.currentValue),
    }));
  }, []);

  const handleMemorySubtract = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      memory: prevState.memory - parseFloat(prevState.currentValue),
    }));
  }, []);

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key >= '0' && event.key <= '9' || '+-*/^.'.includes(event.key)) {
        handleExpressionInput(event.key);
      } else if (event.key === '(') {
        handleExpressionInput('(');
      } else if (event.key === ')') {
        handleExpressionInput(')');
      } else if (event.key === 'Enter' || event.key === '=') {
        evaluateExpression();
      } else if (event.key === 'Escape') {
        handleClear();
      } else if (event.key === 'Backspace') {
        handleExpressionInput('backspace');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleExpressionInput, evaluateExpression, handleClear]);

  return {
    display: state.display,
    hasMemory: state.memory !== 0,
    isScientific: state.isScientific,
    angleMode: state.angleMode,
    isExpressionMode: state.isExpressionMode,
    openParentheses: state.openParentheses,
    handleNumber,
    handleDecimal,
    handleOperation,
    handleScientificOperation,
    handleEquals,
    handleClear,
    handleClearEntry,
    handleToggleSign,
    handlePercent,
    handleConstant,
    toggleScientific,
    toggleAngleMode,
    toggleExpressionMode,
    handleExpressionInput,
    handleExpressionFunction,
    toggleLastNumberSign,
    evaluateExpression,
    handleMemoryClear,
    handleMemoryRecall,
    handleMemoryAdd,
    handleMemorySubtract,
  };
};