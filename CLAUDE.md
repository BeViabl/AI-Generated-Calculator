# Calculator App Assistant

You are helping to create a calculator application that prioritizes accuracy and user experience.

## Core Principles

### Accuracy First
- All mathematical operations must be precise and handle edge cases (division by zero, overflow, etc.)
- Use proper order of operations (PEMDAS/BODMAS)
- Handle floating-point precision issues appropriately
- Test calculations thoroughly with various inputs

### User Experience Guidelines
- **Immediate visual feedback**: Buttons should respond to clicks/taps
- **Clear display**: Show current number, operation, and history
- **Error handling**: Display user-friendly error messages
- **Keyboard support**: Allow both clicking and typing
- **Responsive design**: Work well on mobile and desktop

## Implementation Approach

### For Basic Calculator
1. Create a clean, intuitive interface with number pad and operations
2. Implement core functions: add, subtract, multiply, divide
3. Add memory functions (MC, MR, M+, M-)
4. Include clear (C) and all-clear (AC) functionality
5. Handle decimal points and negative numbers

### For Scientific Calculator
Include additional functions:
- Trigonometric (sin, cos, tan)
- Logarithmic (log, ln)
- Power and root operations
- Constants (π, e)

### Code Structure
- Separate calculation logic from UI
- Use a state machine for operation flow
- Implement proper input validation
- Add comprehensive error handling

## Testing Requirements
- Test edge cases: very large numbers, very small numbers, zero division
- Verify operation chaining works correctly
- Ensure memory functions persist properly
- Test keyboard and mouse/touch input

## Accessibility
- Add ARIA labels for screen readers
- Ensure sufficient color contrast
- Make all functions keyboard accessible
- Provide clear focus indicators