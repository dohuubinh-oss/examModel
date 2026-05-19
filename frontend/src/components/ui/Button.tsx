import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'outline-slate' | 'ghost' | 'ghost-danger' | 'difficulty-active' | 'difficulty-inactive' | 'circle' | 'math' | 'pill-primary' | 'pill-outline' | 'large-primary' | 'large-outline' | 'pricing-primary' | 'pricing-outline' | 'fab' | 'action-primary' | 'action-secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'circle' | 'math' | 'pill' | 'large' | 'pricing' | 'fab' | 'action';
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
      "pill-primary": "bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 rounded-full",
      "pill-outline": "border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-primary/30 hover:bg-primary/5 rounded-full",
      "large-primary": "bg-primary text-white rounded-xl shadow-xl shadow-primary/30 hover:-translate-y-1",
      "large-outline": "bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200",
      "pricing-primary": "bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 rounded-xl",
      "pricing-outline": "border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-primary hover:text-white hover:border-primary rounded-xl",
      fab: "bg-primary text-white rounded-full shadow-2xl shadow-primary/40 hover:scale-110 active:scale-95",
      "action-primary": "w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/25",
      "action-secondary": "w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
    };

    const sizes = {
      default: "h-10 px-5 py-2 text-sm rounded-lg",
      sm: "h-8 px-3 py-1.5 text-xs rounded-lg",
      lg: "h-12 px-8 py-3 text-base rounded-xl",
      icon: "p-1.5 rounded flex items-center justify-center aspect-square",
      circle: "w-14 h-14",
      math: "w-8 h-8 rounded p-0 text-base",
      pill: "h-11 px-6 text-sm",
      large: "h-14 px-8 text-lg",
      pricing: "w-full py-4 text-base",
      fab: "w-16 h-16",
      action: "py-3 px-5 text-sm"
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
