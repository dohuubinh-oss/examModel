import React from 'react';
import { cn } from '@/lib/utils';
import { Latex } from './Latex';

export interface OptionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  letter: string;
  content: string;
  selected?: boolean;
}

export const OptionButton = React.forwardRef<HTMLButtonElement, OptionButtonProps>(
  ({ className, letter, content, selected = false, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group relative flex items-center gap-6 p-6 bg-white dark:bg-slate-900 rounded-xl border-2 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20",
          selected
            ? "border-primary shadow-md shadow-primary/5"
            : "border-transparent hover:border-slate-200 dark:hover:border-slate-700",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "w-12 h-12 flex items-center justify-center font-bold rounded-lg text-xl transition-colors",
            selected
              ? "bg-primary text-white shadow-sm"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-primary group-hover:text-white"
          )}
        >
          {letter}
        </div>
        <div className="text-left">
          <span className="text-xl font-serif font-medium text-slate-900 dark:text-white">
            <Latex text={content} />
          </span>
        </div>
        {selected && (
          <div className="absolute top-4 right-4 text-primary">
            <span className="material-icons">check_circle</span>
          </div>
        )}
      </button>
    );
  }
);
OptionButton.displayName = "OptionButton";
