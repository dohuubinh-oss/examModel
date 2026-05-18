'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CollapsibleProps extends React.DetailsHTMLAttributes<HTMLDetailsElement> {
  title: string;
  icon?: React.ReactNode;
  childrenClassName?: string;
}

export const Collapsible = React.forwardRef<HTMLDetailsElement, CollapsibleProps>(
  ({ className, title, icon, children, childrenClassName, ...props }, ref) => {
    return (
      <details
        ref={ref}
        className={cn("group px-3 overflow-hidden transition-all duration-300", className)}
        {...props}
      >
        <summary className="flex items-center justify-between cursor-pointer text-sm font-semibold py-1 hover:text-primary transition-colors list-none outline-none select-none">
          <div className="flex items-center gap-2 text-slate-700 group-open:text-primary group-hover:text-primary transition-colors">
            {icon}
            <span>{title}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-400 group-open:rotate-180 group-open:text-primary transition-transform duration-200" />
        </summary>
        <div className={cn("mt-3 grid gap-2 pl-6 pb-2 transition-all", childrenClassName)}>
          {children}
        </div>
      </details>
    );
  }
);
Collapsible.displayName = "Collapsible";
