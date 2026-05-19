import React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  heightClass?: string;
  barClassName?: string;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, heightClass = 'h-2.5', barClassName, ...props }, ref) => {
    // Ensure value is between 0 and 100
    const clampedValue = Math.min(Math.max(value, 0), 100);

    return (
      <div
        ref={ref}
        className={cn("w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden", heightClass, className)}
        {...props}
      >
        <div
          className={cn("bg-primary h-full rounded-full shadow-[0_0_10px_rgba(37,99,235,0.3)] transition-all duration-500 ease-out", barClassName)}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";
