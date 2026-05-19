import React from 'react';
import { cn } from '@/lib/utils';

export interface QuestionMapButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  questionNumber: string | number;
  status?: 'success' | 'error' | 'warning' | 'default';
  subText?: string;
}

export const QuestionMapButton = React.forwardRef<HTMLButtonElement, QuestionMapButtonProps>(
  ({ questionNumber, status = 'default', subText, className, ...props }, ref) => {
    const statusStyles = {
      success: 'bg-success/10 text-success border-success/20 hover:bg-success/20',
      error: 'bg-error/10 text-error border-error/20 hover:bg-error/20',
      warning: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20',
      default: 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
    };

    return (
      <button
        ref={ref}
        className={cn(
          "h-10 rounded-lg border flex items-center justify-center font-bold transition-all hover:scale-105 duration-200 outline-none select-none",
          subText ? "px-3 text-xs gap-1" : "w-10 text-sm",
          statusStyles[status] || statusStyles.default,
          className
        )}
        {...props}
      >
        <span>{questionNumber}</span>
        {subText && <span className="text-[10px] font-normal opacity-70">{subText}</span>}
      </button>
    );
  }
);

QuestionMapButton.displayName = 'QuestionMapButton';
