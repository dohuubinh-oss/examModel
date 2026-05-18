'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

export interface FloatingAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'secondary' | 'ghost-danger';
}

export interface FloatingActionBarProps {
  selectedCount: number;
  onClear: () => void;
  actions: FloatingAction[];
  isOpen: boolean;
  className?: string;
}

export const FloatingActionBar: React.FC<FloatingActionBarProps> = ({
  selectedCount,
  onClear,
  actions,
  isOpen,
  className
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed bottom-8 left-1/2 -translate-x-1/2 bg-white border border-slate-200 shadow-2xl rounded-2xl px-6 py-3 flex items-center gap-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span className="w-6 h-6 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">
          {selectedCount}
        </span>
        <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">
          Đã chọn {selectedCount} câu hỏi
        </span>
      </div>
      <div className="h-6 w-px bg-slate-200" />
      <div className="flex items-center gap-4">
        {actions.map((act, idx) => (
          <Button
            key={idx}
            variant={act.variant || 'outline-slate'}
            size="sm"
            onClick={act.onClick}
            className="text-xs font-bold whitespace-nowrap flex items-center gap-1.5"
          >
            {act.icon}
            {act.label}
          </Button>
        ))}
      </div>
      <button
        onClick={onClear}
        className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none p-1 hover:bg-slate-50 rounded"
        title="Đóng thanh tác vụ"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
FloatingActionBar.displayName = "FloatingActionBar";
