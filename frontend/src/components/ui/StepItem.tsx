import React from 'react';
import { cn } from '@/lib/utils';

export interface StepItemProps extends React.HTMLAttributes<HTMLDivElement> {
  stepNumber: number | string;
  title: string;
  isLast?: boolean;
}

export const StepItem = React.forwardRef<HTMLDivElement, StepItemProps>(
  ({ className, stepNumber, title, isLast = false, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex gap-4", className)} {...props}>
        <div className="flex-none flex flex-col items-center">
          <div className="size-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm select-none">
            {stepNumber}
          </div>
          {!isLast && (
            <div className="w-0.5 h-full min-h-[2rem] bg-slate-200 dark:bg-slate-800 my-1" />
          )}
        </div>
        <div className={cn("pb-6", isLast && "pb-0")}>
          <h4 className="font-bold text-slate-900 dark:text-white text-base">
            {title}
          </h4>
          {children && (
            <div className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
              {children}
            </div>
          )}
        </div>
      </div>
    );
  }
);

StepItem.displayName = "StepItem";
