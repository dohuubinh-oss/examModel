import React from 'react';
import { cn } from '@/lib/utils';

export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked, onChange, disabled, ...props }, ref) => {
    const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      onChange(!checked);
      if (props.onClick) props.onClick(e);
    };

    return (
      <button
        type="button"
        ref={ref}
        disabled={disabled}
        onClick={handleToggle}
        className={cn(
          "w-14 h-7 rounded-full relative p-1 flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50",
          checked 
            ? "bg-primary/20" 
            : "bg-slate-200 dark:bg-slate-700",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "w-5 h-5 bg-primary rounded-full transition-transform duration-200 ease-in-out shadow-sm",
            checked 
              ? "translate-x-7 bg-primary" 
              : "translate-x-0 bg-slate-400 dark:bg-slate-500"
          )}
        />
      </button>
    );
  }
);

Switch.displayName = "Switch";
