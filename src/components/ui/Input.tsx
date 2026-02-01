import React from 'react';
import { cn } from '../../lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-xl border border-border bg-surface px-4 py-2 text-sm',
          'transition-all duration-200 ease-smooth',
          'placeholder:text-foreground-tertiary',
          'focus-visible:outline-none focus-visible:border-primary/30 focus-visible:ring-4 focus-visible:ring-primary/10',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'hover:border-border-hover',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
