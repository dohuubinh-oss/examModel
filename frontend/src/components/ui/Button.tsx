import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'outline-slate' | 'ghost' | 'ghost-danger' | 'difficulty-active' | 'difficulty-inactive' | 'circle' | 'math';
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'circle' | 'math';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center gap-2 font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      default: "bg-primary hover:bg-primary/90 text-white shadow-sm",
      secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700",
      outline: "bg-white border border-primary text-primary hover:bg-primary hover:text-white",
      "outline-slate": "bg-slate-50/50 border border-slate-200 text-slate-700 hover:bg-slate-100",
      ghost: "text-primary hover:bg-primary/5 border border-transparent hover:border-primary/20",
      "ghost-danger": "text-slate-400 hover:text-red-500 hover:bg-red-500/10",
      "difficulty-active": "border-2 border-primary text-white bg-primary shadow-lg shadow-primary/20 hover:bg-primary/95 text-center uppercase tracking-widest text-[9px] font-black rounded-xl h-auto py-3.5 px-4",
      "difficulty-inactive": "border border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100 transition-all text-center uppercase tracking-widest text-[9px] font-black rounded-xl h-auto py-3.5 px-4",
      circle: "bg-white rounded-full shadow-lg border border-slate-200 flex items-center justify-center text-primary hover:scale-110 active:scale-95 transition-all group",
      math: "text-primary font-serif hover:bg-primary/10 transition-colors",
    };

    const sizes = {
      default: "h-10 px-5 py-2 text-sm rounded-lg",
      sm: "h-8 px-3 py-1.5 text-xs rounded-lg",
      lg: "h-12 px-8 py-3 text-base rounded-xl",
      icon: "p-1.5 rounded flex items-center justify-center aspect-square",
      circle: "w-14 h-14",
      math: "w-8 h-8 rounded p-0 text-base",
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
