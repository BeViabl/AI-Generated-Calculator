import React, { useRef, useEffect, useState } from 'react';
import './Display.css';

interface DisplayProps {
  value: string;
  previousResult?: string | null;
}

export const Display: React.FC<DisplayProps> = ({ value, previousResult }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  
  const formatNumberWithCommas = (str: string): string => {
    // Check if it's a pure number (not an expression with operators)
    if (/^-?\d+(\.\d+)?$/.test(str)) {
      const parts = str.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return parts.join('.');
    }
    return str;
  };
  
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const isOverflow = container.scrollWidth > container.clientWidth;
      setIsOverflowing(isOverflow);
      
      // Scroll to the right to show the most recent input
      if (isOverflow) {
        container.scrollLeft = container.scrollWidth;
      }
    }
  }, [value]);
  
  return (
    <div className={`display ${isOverflowing ? 'has-overflow' : ''}`} role="textbox" aria-label="Calculator display" aria-readonly="true">
      <div className="previous-result">{previousResult ? formatNumberWithCommas(previousResult) : '\u00A0'}</div>
      <div 
        ref={scrollContainerRef}
        className="display-scroll-container"
      >
        <div className="display-value">{formatNumberWithCommas(value) || '0'}</div>
      </div>
    </div>
  );
};