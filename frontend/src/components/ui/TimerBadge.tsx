import React from 'react';
import { cn } from '@/lib/utils';

export interface TimerBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  timeString: string;
  isPulsing?: boolean;
}

export const TimerBadge = React.forwardRef<HTMLDivElement, TimerBadgeProps>(
  ({ className, timeString, isPulsing = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-3 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-xl border border-red-100 dark:border-red-900/30",
          className
        )}
        {...props}
      >
        <span className={cn("material-icons text-red-500 text-xl", isPulsing && "animate-pulse")}>
          timer
        </span>
        <span className="text-red-600 dark:text-red-400 font-bold tabular-nums text-lg">
          {timeString}
        </span>
      </div>
    );
  }
);
TimerBadge.displayName = "TimerBadge";
