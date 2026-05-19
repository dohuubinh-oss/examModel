import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'outline' | 'red-outline' | 'blue-filled' | 'blue-pill';
  size?: 'sm' | 'md';
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'sm', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-colors";
    
    const variants = {
      default: "bg-slate-100 text-slate-500",
      primary: "bg-primary/10 text-primary border-transparent",
      success: "bg-green-500/10 text-green-600 border-transparent",
      warning: "bg-amber-500/10 text-amber-600 border-transparent",
      danger: "bg-red-500/10 text-red-600 border-transparent",
      outline: "border border-slate-300 text-slate-700 bg-white",
      'red-outline': "bg-red-100 text-red-600 border border-red-200 font-black tracking-widest text-[10px]",
      'blue-filled': "bg-blue-100 text-primary border-transparent text-[9px] font-bold",
      'blue-pill': "px-3 py-1.5 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-widest",
    };

    const sizes = {
      sm: "text-[10px] font-bold uppercase px-2 py-0.5 rounded",
      md: "text-xs font-semibold px-2.5 py-1 rounded-lg h-7",
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";
