import React from 'react';
import { Display } from './Display';
import { Button } from './Button';
import { useCalculator } from '../hooks/useCalculator';
import './Calculator.css';

export const Calculator: React.FC = () => {
  const {
    display,
    hasMemory,
    isScientific,
    angleMode,
    isExpressionMode,
    openParentheses,
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
    evaluateExpression,
    handleMemoryClear,
    handleMemoryRecall,
    handleMemoryAdd,
    handleMemorySubtract,
  } = useCalculator();

  return (
    <div className="calculator" role="application" aria-label="Calculator">
      <Display value={display} />
      
      <div className="mode-controls">
        <Button 
          label={isScientific ? "Basic" : "Scientific"} 
          onClick={toggleScientific} 
          className="mode-toggle"
          ariaLabel={`Switch to ${isScientific ? 'basic' : 'scientific'} calculator`}
        />
        <Button 
          label={isExpressionMode ? "Standard" : "Expression"} 
          onClick={toggleExpressionMode} 
          className="mode-toggle"
          ariaLabel={`Switch to ${isExpressionMode ? 'standard' : 'expression'} mode`}
        />
        {isScientific && (
          <Button 
            label={angleMode.toUpperCase()} 
            onClick={toggleAngleMode} 
            className="angle-mode"
            ariaLabel={`Angle mode: ${angleMode === 'deg' ? 'degrees' : 'radians'}`}
          />
        )}
      </div>
      
      <div className="memory-buttons">
        <Button label="MC" onClick={handleMemoryClear} className="memory" ariaLabel="Memory Clear" />
        <Button label="MR" onClick={handleMemoryRecall} className="memory" ariaLabel="Memory Recall" />
        <Button label="M+" onClick={handleMemoryAdd} className="memory" ariaLabel="Memory Add" />
        <Button label="M-" onClick={handleMemorySubtract} className="memory" ariaLabel="Memory Subtract" />
        <div className={`memory-indicator ${hasMemory ? 'active' : ''}`} aria-label={hasMemory ? 'Memory stored' : 'Memory empty'}>
          M
        </div>
      </div>

      {isScientific && (
        <div className="scientific-buttons">
          <Button 
            label="sin" 
            onClick={() => isExpressionMode ? handleExpressionFunction('sin') : handleScientificOperation('sin')} 
            className="scientific" 
            ariaLabel="Sine" 
          />
          <Button 
            label="cos" 
            onClick={() => isExpressionMode ? handleExpressionFunction('cos') : handleScientificOperation('cos')} 
            className="scientific" 
            ariaLabel="Cosine" 
          />
          <Button 
            label="tan" 
            onClick={() => isExpressionMode ? handleExpressionFunction('tan') : handleScientificOperation('tan')} 
            className="scientific" 
            ariaLabel="Tangent" 
          />
          <Button 
            label="log" 
            onClick={() => isExpressionMode ? handleExpressionFunction('log') : handleScientificOperation('log')} 
            className="scientific" 
            ariaLabel="Logarithm base 10" 
          />
          <Button 
            label="ln" 
            onClick={() => isExpressionMode ? handleExpressionFunction('ln') : handleScientificOperation('ln')} 
            className="scientific" 
            ariaLabel="Natural logarithm" 
          />
          
          <Button label="x²" onClick={() => handleScientificOperation('x^2')} className="scientific" ariaLabel="Square" />
          <Button label="^" onClick={() => isExpressionMode ? handleExpressionInput('^') : handleScientificOperation('x^y')} className="scientific" ariaLabel="Power" />
          <Button 
            label="√" 
            onClick={() => isExpressionMode ? handleExpressionFunction('sqrt') : handleScientificOperation('sqrt')} 
            className="scientific" 
            ariaLabel="Square root" 
          />
          <Button label="1/x" onClick={() => handleScientificOperation('1/x')} className="scientific" ariaLabel="Reciprocal" />
          <Button label="eˣ" onClick={() => handleScientificOperation('e^x')} className="scientific" ariaLabel="e to the power of x" />
          
          <Button 
            label="π" 
            onClick={() => isExpressionMode ? handleExpressionInput('π') : handleConstant('PI')} 
            className="constant" 
            ariaLabel="Pi" 
          />
          <Button 
            label="e" 
            onClick={() => isExpressionMode ? handleExpressionInput('e') : handleConstant('E')} 
            className="constant" 
            ariaLabel="Euler's number" 
          />
          <Button label="10ˣ" onClick={() => handleScientificOperation('10^x')} className="scientific" ariaLabel="10 to the power of x" />
        </div>
      )}

      {isExpressionMode && (
        <div className="expression-buttons">
          <Button label="(" onClick={() => handleExpressionInput('(')} className="parenthesis" ariaLabel="Left parenthesis" />
          <Button label=")" onClick={() => handleExpressionInput(')')} className="parenthesis" ariaLabel="Right parenthesis" />
          <div className="parenthesis-counter" aria-label={`${openParentheses} open parentheses`}>
            {openParentheses > 0 && `(${openParentheses})`}
          </div>
        </div>
      )}

      <div className="calculator-buttons">
        <Button label="AC" onClick={handleClear} className="clear" ariaLabel="All Clear" />
        <Button label="CE" onClick={handleClearEntry} className="clear" ariaLabel="Clear Entry" />
        <Button label="%" onClick={handlePercent} className="operation" ariaLabel="Percent" />
        <Button 
          label="÷" 
          onClick={() => isExpressionMode ? handleExpressionInput('/') : handleOperation('/')} 
          className="operation" 
          ariaLabel="Divide" 
        />

        <Button 
          label="7" 
          onClick={() => isExpressionMode ? handleExpressionInput('7') : handleNumber('7')} 
          className="number" 
        />
        <Button 
          label="8" 
          onClick={() => isExpressionMode ? handleExpressionInput('8') : handleNumber('8')} 
          className="number" 
        />
        <Button 
          label="9" 
          onClick={() => isExpressionMode ? handleExpressionInput('9') : handleNumber('9')} 
          className="number" 
        />
        <Button 
          label="×" 
          onClick={() => isExpressionMode ? handleExpressionInput('*') : handleOperation('*')} 
          className="operation" 
          ariaLabel="Multiply" 
        />

        <Button 
          label="4" 
          onClick={() => isExpressionMode ? handleExpressionInput('4') : handleNumber('4')} 
          className="number" 
        />
        <Button 
          label="5" 
          onClick={() => isExpressionMode ? handleExpressionInput('5') : handleNumber('5')} 
          className="number" 
        />
        <Button 
          label="6" 
          onClick={() => isExpressionMode ? handleExpressionInput('6') : handleNumber('6')} 
          className="number" 
        />
        <Button 
          label="−" 
          onClick={() => isExpressionMode ? handleExpressionInput('-') : handleOperation('-')} 
          className="operation" 
          ariaLabel="Subtract" 
        />

        <Button 
          label="1" 
          onClick={() => isExpressionMode ? handleExpressionInput('1') : handleNumber('1')} 
          className="number" 
        />
        <Button 
          label="2" 
          onClick={() => isExpressionMode ? handleExpressionInput('2') : handleNumber('2')} 
          className="number" 
        />
        <Button 
          label="3" 
          onClick={() => isExpressionMode ? handleExpressionInput('3') : handleNumber('3')} 
          className="number" 
        />
        <Button 
          label="+" 
          onClick={() => isExpressionMode ? handleExpressionInput('+') : handleOperation('+')} 
          className="operation" 
          ariaLabel="Add" 
        />

        <Button label="±" onClick={handleToggleSign} ariaLabel="Toggle sign" />
        <Button 
          label="0" 
          onClick={() => isExpressionMode ? handleExpressionInput('0') : handleNumber('0')} 
          className="number zero" 
        />
        <Button 
          label="." 
          onClick={() => isExpressionMode ? handleExpressionInput('.') : handleDecimal()} 
          ariaLabel="Decimal point" 
        />
        <Button 
          label="=" 
          onClick={() => isExpressionMode ? evaluateExpression() : handleEquals()} 
          className="equals" 
          ariaLabel="Equals" 
        />
      </div>

      <div className="keyboard-hint" aria-hidden="true">
        Tip: Use your keyboard for faster calculations!
      </div>
    </div>
  );
};