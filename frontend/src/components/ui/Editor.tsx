import React from 'react';
import { cn } from '@/lib/utils';

export interface EditorProps extends React.HTMLAttributes<HTMLDivElement> {
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export const Editor = React.forwardRef<HTMLDivElement, EditorProps>(
  ({ className, placeholder = "Nhập văn bản...", value, onValueChange, ...props }, ref) => {
    const localRef = React.useRef<HTMLDivElement>(null);
    const resolvedRef = (ref || localRef) as React.RefObject<HTMLDivElement>;

    // Keep inner HTML synchronized with value prop if updated externally
    React.useEffect(() => {
      if (resolvedRef.current && value !== undefined && resolvedRef.current.innerHTML !== value) {
        resolvedRef.current.innerHTML = value;
      }
    }, [value, resolvedRef]);

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
      const content = e.currentTarget.innerHTML;
      if (onValueChange) {
        onValueChange(content);
      }
    };

    return (
      <div className="relative w-full flex flex-col">
        <div
          ref={resolvedRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          className={cn(
            "flex-grow min-h-[150px] focus:outline-none text-sm leading-relaxed bg-slate-50/30 p-5 rounded-xl border border-slate-200 focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/5 custom-scrollbar overflow-y-auto outline-none transition-all duration-200",
            // Add placeholder styling when content is empty
            "empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none empty:before:font-medium",
            className
          )}
          data-placeholder={placeholder}
          {...props}
        />
      </div>
    );
  }
);
Editor.displayName = "Editor";
