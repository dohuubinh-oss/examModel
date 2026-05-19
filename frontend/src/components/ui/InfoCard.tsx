import React from 'react';
import { cn } from '@/lib/utils';

export interface InfoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'danger' | 'warning' | 'primary';
  icon: string;
  title: string;
}

export const InfoCard = React.forwardRef<HTMLDivElement, InfoCardProps>(
  ({ className, variant = 'primary', icon, title, children, ...props }, ref) => {
    const iconColors = {
      danger: "text-red-500",
      warning: "text-amber-500",
      primary: "text-primary"
    };

    return (
      <div
        ref={ref}
        className={cn(
          "bg-white dark:bg-slate-900 p-5 rounded-xl border border-primary/10 shadow-sm transition-all hover:shadow-md duration-300",
          className
        )}
        {...props}
      >
        <div className={cn("flex items-center gap-2 mb-3", iconColors[variant])}>
          <span className="material-symbols-outlined select-none">{icon}</span>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            {title}
          </h3>
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {children}
        </div>
      </div>
    );
  }
);

InfoCard.displayName = "InfoCard";
