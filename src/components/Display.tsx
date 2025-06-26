import React from 'react';
import './Display.css';

interface DisplayProps {
  value: string;
}

export const Display: React.FC<DisplayProps> = ({ value }) => {
  return (
    <div className="display" role="textbox" aria-label="Calculator display" aria-readonly="true">
      <div className="display-value">{value || '0'}</div>
    </div>
  );
};