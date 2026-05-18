import React from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checkboxSize?: 'sm' | 'md';
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checkboxSize = 'md', ...props }, ref) => {
    const sizes = {
      sm: "h-3.5 w-3.5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer transition-all",
      md: "h-4.5 w-4.5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer transition-all",
    };

    return (
      <input
        type="checkbox"
        ref={ref}
        className={cn(
          "focus:ring-offset-0 focus:outline-none focus:ring-2 focus:ring-primary/20",
          sizes[checkboxSize],
          className
        )}
        {...props}
      />
    );
  }
);
Checkbox.displayName = "Checkbox";
