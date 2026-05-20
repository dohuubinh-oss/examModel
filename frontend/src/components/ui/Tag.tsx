import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TagProps {
  label: string;
  onRemove?: () => void;
  className?: string;
}

export const Tag: React.FC<TagProps> = ({ label, onRemove, className }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-widest select-none",
        className
      )}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="hover:text-blue-800 transition-colors cursor-pointer focus:outline-none"
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
};
Tag.displayName = "Tag";
