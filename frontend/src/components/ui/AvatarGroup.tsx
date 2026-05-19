import React from 'react';
import { cn } from '@/lib/utils';

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  avatars: string[];
  totalLabel?: string;
  text?: string;
}

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, avatars, totalLabel, text, ...props }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn("flex items-center gap-4", className)}
        {...props}
      >
        <div className="flex -space-x-3">
          {avatars.map((url, index) => (
            <img 
              key={index}
              src={url}
              alt={`Avatar ${index + 1}`}
              className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 object-cover"
            />
          ))}
          {totalLabel && (
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-900 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-400">
              {totalLabel}
            </div>
          )}
        </div>
        {text && (
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {text}
          </p>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = "AvatarGroup";
