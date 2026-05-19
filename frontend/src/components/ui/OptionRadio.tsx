import React from 'react';
import { cn } from '@/lib/utils';

export interface OptionRadioProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  letter: string;
  value: string;
  checked?: boolean;
  placeholder?: string;
  name?: string;
  onChange?: (checked: boolean) => void;
  onTextChange?: (text: string) => void;
}

export const OptionRadio = React.forwardRef<HTMLDivElement, OptionRadioProps>(
  ({ className, letter, value, checked = false, placeholder = "Nhập đáp án...", name = "correct-ans", onChange, onTextChange, ...props }, ref) => {
    
    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) onChange(e.target.checked);
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onTextChange) onTextChange(e.target.value);
    };

    const handleContainerClick = () => {
      if (!checked && onChange) {
        onChange(true);
      }
    };

    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-4 group cursor-pointer w-full select-none", className)}
        onClick={handleContainerClick}
        {...props}
      >
        {/* Radio Button */}
        <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <input
            type="radio"
            name={name}
            checked={checked}
            onChange={handleRadioChange}
            className="w-6 h-6 text-primary border-slate-300 focus:ring-primary rounded-full cursor-pointer transition-all"
          />
        </div>

        {/* Input Wrapper Container */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "flex-grow flex items-center rounded-xl px-5 py-4 transition-all duration-200 border-2",
            checked 
              ? "bg-blue-50/30 border-primary/40 ring-4 ring-primary/5 shadow-sm" 
              : "bg-slate-50 border-slate-200 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5"
          )}
        >
          {/* Prefix Letter */}
          <span className={cn(
            "font-bold mr-4 transition-colors duration-200 select-none",
            checked ? "text-primary" : "text-slate-400"
          )}>
            {letter}.
          </span>

          {/* Text Input */}
          <input
            type="text"
            value={value}
            onChange={handleTextChange}
            placeholder={placeholder}
            className={cn(
              "bg-transparent border-none p-0 w-full focus:ring-0 text-sm outline-none transition-all",
              checked ? "font-bold text-slate-900" : "font-medium text-slate-700 placeholder:text-slate-400"
            )}
          />
        </div>
      </div>
    );
  }
);

OptionRadio.displayName = "OptionRadio";
