import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'ghost-danger';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center gap-2 font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      default: "bg-primary hover:bg-primary/90 text-white shadow-sm",
      secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700",
      outline: "bg-white border border-primary text-primary hover:bg-primary hover:text-white",
      ghost: "text-primary hover:bg-primary/5 border border-transparent hover:border-primary/20",
      "ghost-danger": "text-slate-500 hover:text-red-500",
    };

    const sizes = {
      default: "h-10 px-5 py-2 text-sm rounded-lg",
      sm: "h-8 px-3 py-1.5 text-xs rounded-lg",
      lg: "h-12 px-8 py-3 text-base rounded-xl",
      icon: "p-2 rounded-lg aspect-square",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
