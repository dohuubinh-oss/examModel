import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'primary' | 'outline';
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center text-xs font-medium transition-colors";
    
    const variants = {
      default: "bg-slate-100 text-slate-500 px-2 py-0.5 rounded",
      success: "bg-green-100 text-green-700 px-3 py-1 rounded-full",
      primary: "bg-primary text-white px-2.5 py-1 rounded-lg font-bold text-sm h-8",
      outline: "border border-slate-300 text-slate-700 px-2 py-0.5 rounded-full",
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";
