import React from 'react';
import { Display } from './Display';
import { Button } from './Button';
import { useCalculator } from '../hooks/useCalculator';
import './Calculator.css';

export const Calculator: React.FC = () => {
  const {
    display,
    previousResult,
    hasMemory,
    isScientific,
    angleMode,
    handleClear,
    toggleScientific,
    toggleAngleMode,
    handleExpressionInput,
    handleExpressionFunction,
    toggleLastNumberSign,
    evaluateExpression,
    handleMemoryClear,
    handleMemoryRecall,
    handleMemoryAdd,
    handleMemorySubtract,
  } = useCalculator();

  return (
    <div className="calculator" role="application" aria-label="Calculator">
      <Display value={display} previousResult={previousResult} />
      
      <div className="mode-controls">
        <Button 
          label={isScientific ? "Basic" : "Scientific"} 
          onClick={toggleScientific} 
          className="mode-toggle"
          ariaLabel={`Switch to ${isScientific ? 'basic' : 'scientific'} calculator`}
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
            onClick={() => handleExpressionFunction('sin')} 
            className="scientific" 
            ariaLabel="Sine" 
          />
          <Button 
            label="cos" 
            onClick={() => handleExpressionFunction('cos')} 
            className="scientific" 
            ariaLabel="Cosine" 
          />
          <Button 
            label="tan" 
            onClick={() => handleExpressionFunction('tan')} 
            className="scientific" 
            ariaLabel="Tangent" 
          />
          <Button 
            label="log" 
            onClick={() => handleExpressionFunction('log')} 
            className="scientific" 
            ariaLabel="Logarithm base 10" 
          />
          <Button 
            label="ln" 
            onClick={() => handleExpressionFunction('ln')} 
            className="scientific" 
            ariaLabel="Natural logarithm" 
          />
          
          <Button label="x²" onClick={() => handleExpressionInput('^2')} className="scientific" ariaLabel="Square" />
          <Button label="xʸ" onClick={() => handleExpressionInput('^')} className="scientific" ariaLabel="Power" />
          <Button 
            label="√" 
            onClick={() => handleExpressionFunction('sqrt')} 
            className="scientific" 
            ariaLabel="Square root" 
          />
          <Button 
            label="π" 
            onClick={() => handleExpressionInput('π')} 
            className="constant" 
            ariaLabel="Pi" 
          />
          <Button 
            label="e" 
            onClick={() => handleExpressionInput('e')} 
            className="constant" 
            ariaLabel="Euler's number" 
          />
        </div>
      )}


      <div className="calculator-buttons">
        <Button label="AC" onClick={handleClear} className="clear" ariaLabel="All Clear" />
        <Button label="⌫" onClick={() => handleExpressionInput('backspace')} className="clear" ariaLabel="Backspace" />
        <Button label="(" onClick={() => handleExpressionInput('(')} className="parenthesis" ariaLabel="Left parenthesis" />
        <Button label=")" onClick={() => handleExpressionInput(')')} className="parenthesis" ariaLabel="Right parenthesis" />

        <Button label="7" onClick={() => handleExpressionInput('7')} className="number" />
        <Button label="8" onClick={() => handleExpressionInput('8')} className="number" />
        <Button label="9" onClick={() => handleExpressionInput('9')} className="number" />
        <Button label="÷" onClick={() => handleExpressionInput('/')} className="operation" ariaLabel="Divide" />

        <Button label="4" onClick={() => handleExpressionInput('4')} className="number" />
        <Button label="5" onClick={() => handleExpressionInput('5')} className="number" />
        <Button label="6" onClick={() => handleExpressionInput('6')} className="number" />
        <Button label="×" onClick={() => handleExpressionInput('*')} className="operation" ariaLabel="Multiply" />

        <Button label="1" onClick={() => handleExpressionInput('1')} className="number" />
        <Button label="2" onClick={() => handleExpressionInput('2')} className="number" />
        <Button label="3" onClick={() => handleExpressionInput('3')} className="number" />
        <Button label="−" onClick={() => handleExpressionInput('-')} className="operation" ariaLabel="Subtract" />

        <Button label="±" onClick={toggleLastNumberSign} className="negation" ariaLabel="Toggle sign" />
        <Button label="0" onClick={() => handleExpressionInput('0')} className="number" />
        <Button label="." onClick={() => handleExpressionInput('.')} ariaLabel="Decimal point" />
        <Button label="+" onClick={() => handleExpressionInput('+')} className="operation" ariaLabel="Add" />

        <Button label="=" onClick={() => evaluateExpression()} className="equals equals-wide" ariaLabel="Equals" />
      </div>

      <div className="keyboard-hint" aria-hidden="true">
        Tip: Use your keyboard for faster calculations!
      </div>
    </div>
  );
};