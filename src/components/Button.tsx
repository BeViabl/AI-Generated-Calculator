import React from 'react';
import './Button.css';

interface ButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
  ariaLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({ label, onClick, className = '', ariaLabel }) => {
  return (
    <button
      className={`calculator-button ${className}`}
      onClick={onClick}
      aria-label={ariaLabel || label}
    >
      {label}
    </button>
  );
};