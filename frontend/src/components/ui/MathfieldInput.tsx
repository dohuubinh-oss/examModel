'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface MathfieldInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<any>) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
}

export const MathfieldInput: React.FC<MathfieldInputProps> = ({
  value = '',
  onChange,
  onKeyDown,
  placeholder = 'Nhập công thức toán...',
  className,
  readOnly = false,
  ...props
}) => {
  const mfRef = React.useRef<any>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Load mathlive dynamically only on the client
  React.useEffect(() => {
    import('mathlive')
      .then(() => {
        setIsLoaded(true);
      })
      .catch((err) => {
        console.error('Failed to load MathLive:', err);
      });
  }, []);

  // Synchronize external value with local math-field value
  React.useEffect(() => {
    if (isLoaded && mfRef.current) {
      if (mfRef.current.value !== value) {
        mfRef.current.value = value;
      }
    }
  }, [value, isLoaded]);

  // Handle local change events
  const handleInput = (e: React.FormEvent<any>) => {
    const newValue = e.currentTarget.value;
    if (onChange) {
      onChange(newValue);
    }
  };

  // Configure MathfieldElement properties once loaded
  React.useEffect(() => {
    if (isLoaded && mfRef.current) {
      // Set read-only if requested
      mfRef.current.readOnly = readOnly;

      // Customize keyboard and layout behaviors if needed
      mfRef.current.menuItems = []; // clean layout

      mfRef.current.setOptions({
        smartMode: true,
        defaultMode: 'math',
        fontsDirectory: '/fonts/mathlive'
      });

      // Apply customizable attributes
      if (placeholder) {
        mfRef.current.setAttribute('placeholder', placeholder);
      }
    }
  }, [isLoaded, readOnly, placeholder]);

  return (
    <div
      className={cn(
        "relative w-full rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 transition-all duration-200 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5 overflow-hidden",
        className
      )}
      {...props}
    >
      {!isLoaded ? (
        <div className="flex items-center justify-center p-6 text-sm text-slate-400 font-medium animate-pulse">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Đang khởi tạo khung gõ Toán học...
        </div>
      ) : (
        <math-field
          ref={mfRef}
          onInput={handleInput}
          onKeyDown={onKeyDown}
          math-style="upright"
          class="w-full text-base leading-relaxed p-5 outline-none h-full custom-scrollbar overflow-y-auto bg-transparent text-slate-800 dark:text-slate-100"
          style={{
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
            fontFamily: 'inherit',
          }}
        />
      )}
    </div>
  );
};

MathfieldInput.displayName = 'MathfieldInput';
