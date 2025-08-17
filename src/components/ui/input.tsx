import type * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends Omit<React.ComponentProps<'input'>, 'onChange' | 'onBlur'> {
  // Number validation props
  numberValidation?: 'int' | 'float';

  // Enhanced handlers
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onValueChange?: (value: number | string) => void;
}

function Input({ className, type, numberValidation, onChange, onBlur, onValueChange, min, max, ...props }: InputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (numberValidation && type === 'number') {
      const value = e.target.value;
      if (value === '') {
        onValueChange?.('');
      } else {
        const parseValue = numberValidation === 'float' ? parseFloat : parseInt;
        onValueChange?.(parseValue(value) ?? '');
      }
    }
    onChange?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (numberValidation && type === 'number' && min !== undefined && max !== undefined) {
      const parseValue = numberValidation === 'float' ? parseFloat : parseInt;
      const value = parseValue(e.target.value);
      const minNum = typeof min === 'string' ? parseFloat(min) : min;
      const maxNum = typeof max === 'string' ? parseFloat(max) : max;
      if (Number.isNaN(value) || value < minNum || value > maxNum) {
        const correctedValue = Math.max(minNum, Math.min(maxNum, value || minNum));
        onValueChange?.(correctedValue);
        // Update the input value directly
        e.target.value = correctedValue.toString();
      }
    }
    onBlur?.(e);
  };

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className,
      )}
      onChange={handleChange}
      onBlur={handleBlur}
      min={min}
      max={max}
      {...props}
    />
  );
}

export { Input };
