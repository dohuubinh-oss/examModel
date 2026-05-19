import React from 'react';
import { cn } from '@/lib/utils';

export interface AnnotationItem {
  text?: string;
  icon?: string;
  status: 'success' | 'error';
  // Position properties to be mapped directly into absolute positioning styles
  top?: string | number;
  left?: string | number;
  bottom?: string | number;
  right?: string | number;
}

export interface HandwrittenPaperProps extends React.HTMLAttributes<HTMLDivElement> {
  annotations?: AnnotationItem[];
  paperColor?: string;
  textColor?: string;
}

export const HandwrittenPaper = React.forwardRef<HTMLDivElement, HandwrittenPaperProps>(
  ({ annotations = [], paperColor = "bg-white", textColor = "text-blue-800", className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-xl border border-slate-200 overflow-hidden p-6 min-h-[300px] select-none",
          paperColor,
          className
        )}
        style={{
          backgroundImage: 'repeating-linear-gradient(#f1f5f9 0px, #f1f5f9 1px, transparent 1px, transparent 24px)',
          backgroundSize: '100% 24px',
          lineHeight: '24px',
          ...props.style
        }}
        {...props}
      >
        {/* Handwritten text content */}
        <div 
          className={cn("math-handwriting text-lg space-y-4", textColor)}
          style={{ fontFamily: "'Brush Script MT', 'Comic Sans MS', cursive" }}
        >
          {children}
        </div>

        {/* Absolute floating annotations overlay */}
        {annotations.map((ann, idx) => {
          const statusStyles = {
            success: 'border-success text-success bg-white/95 shadow-sm',
            error: 'border-error text-error bg-white/95 shadow-sm opacity-90'
          };

          return (
            <div
              key={idx}
              className={cn(
                "absolute border-2 px-3 py-1.5 rounded-xl flex items-center justify-center gap-1 font-bold text-xs pointer-events-none select-none",
                statusStyles[ann.status] || statusStyles.success
              )}
              style={{
                top: ann.top,
                left: ann.left,
                bottom: ann.bottom,
                right: ann.right
              }}
            >
              {ann.icon && (
                <span className="material-symbols-outlined text-sm select-none">
                  {ann.icon}
                </span>
              )}
              {ann.text && <span>{ann.text}</span>}
            </div>
          );
        })}
      </div>
    );
  }
);

HandwrittenPaper.displayName = 'HandwrittenPaper';
