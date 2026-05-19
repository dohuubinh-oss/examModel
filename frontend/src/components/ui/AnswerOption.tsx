import React from 'react';
import { cn } from '@/lib/utils';

export interface AnswerOptionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  label: string;
  content: string | React.ReactNode;
  status?: 'default' | 'correct' | 'wrong';
}

export const AnswerOption = React.forwardRef<HTMLDivElement, AnswerOptionProps>(
  ({ label, content, status = 'default', className, ...props }, ref) => {
    const statusStyles = {
      default: 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50/50',
      correct: 'border-2 border-success bg-success/5 text-success font-bold',
      wrong: 'border-2 border-error bg-error/5 text-error font-bold'
    };

    const statusIcons = {
      default: <span className="material-symbols-outlined text-slate-300 select-none">circle</span>,
      correct: <span className="material-symbols-outlined text-success select-none">check_circle</span>,
      wrong: <span className="material-symbols-outlined text-error select-none">cancel</span>
    };

    return (
      <div
        ref={ref}
        className={cn(
          "p-4 rounded-lg border text-sm flex items-center justify-between transition-all duration-200 select-none cursor-pointer",
          statusStyles[status] || statusStyles.default,
          className
        )}
        {...props}
      >
        <span className="flex items-center gap-2">
          <span className="font-bold opacity-80">{label}.</span>
          <span className="font-medium">{content}</span>
        </span>
        {statusIcons[status]}
      </div>
    );
  }
);

AnswerOption.displayName = 'AnswerOption';
