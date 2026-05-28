import React from 'react';
import { cn } from '@/lib/utils';

export type QNodeStatus = 'done' | 'current' | 'flagged' | 'unfinished';

export interface QNodeProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  number: number;
  status: QNodeStatus;
  isCurrent?: boolean;
}

export const QNode = React.forwardRef<HTMLButtonElement, QNodeProps>(
  ({ className, number, status, isCurrent, ...props }, ref) => {
    const baseStyles = "relative w-full aspect-square flex items-center justify-center rounded-lg font-bold text-sm cursor-pointer transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary/50";
    
    const variants = {
      done: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800/50",
      current: "bg-primary text-white shadow-md shadow-primary/30 ring-4 ring-primary/20",
      flagged: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50",
      unfinished: "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[status], isCurrent && status !== 'current' ? 'ring-4 ring-primary/20 shadow-md' : '', className)}
        {...props}
      >
        {number}
        {status === 'flagged' && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
        )}
      </button>
    );
  }
);
QNode.displayName = "QNode";
