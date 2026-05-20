import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Trash2 } from 'lucide-react';
import { Badge } from './Badge';

export interface NavigatorControlsProps extends React.HTMLAttributes<HTMLDivElement> {
  currentQuestion: number;
  totalQuestions: number;
  tagText?: string;
  onFirst?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  onLast?: () => void;
  onDelete?: () => void;
  disablePrev?: boolean;
  disableNext?: boolean;
}

export const NavigatorControls = React.forwardRef<HTMLDivElement, NavigatorControlsProps>(
  ({ 
    className, 
    currentQuestion, 
    totalQuestions, 
    tagText = "Câu hỏi chùm",
    onFirst,
    onPrev,
    onNext,
    onLast,
    onDelete,
    disablePrev = false,
    disableNext = false,
    ...props 
  }, ref) => {
    
    return (
      <div 
        ref={ref}
        className={cn("flex justify-center w-full select-none", className)}
        {...props}
      >
        <div className="bg-white rounded-full border border-slate-200 px-3 py-1.5 flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow duration-300">
          {/* First Page Button */}
          <button
            onClick={onFirst}
            disabled={disablePrev || currentQuestion <= 1}
            className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent"
            title="Đến câu đầu tiên"
          >
            <ChevronsLeft size={18} />
          </button>

          {/* Previous Page Button */}
          <button
            onClick={onPrev}
            disabled={disablePrev || currentQuestion <= 1}
            className="p-1.5 hover:bg-slate-100 rounded-full transition-colors border border-slate-100 shadow-sm text-slate-600 hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-transparent disabled:border-transparent"
            title="Đến câu trước"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Counter and Tag */}
          <div className="px-4 py-1 flex items-center gap-2 border-x border-slate-100">
            <span className="text-xs font-black text-primary uppercase tracking-widest">
              Câu {currentQuestion}
            </span>
            {tagText && (
              <Badge variant="danger" size="sm" className="ml-1 bg-red-100 text-red-600 border border-red-200 tracking-widest text-[9px] font-black uppercase py-0.5 px-2">
                {tagText}
              </Badge>
            )}
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              / {totalQuestions}
            </span>
          </div>

          {/* Next Page Button */}
          <button
            onClick={onNext}
            disabled={disableNext || currentQuestion >= totalQuestions}
            className="p-1.5 hover:bg-slate-100 rounded-full transition-colors border border-slate-100 shadow-sm text-slate-600 hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-transparent disabled:border-transparent"
            title="Đến câu tiếp theo"
          >
            <ChevronRight size={18} />
          </button>

          {/* Last Page Button */}
          <button
            onClick={onLast}
            disabled={disableNext || currentQuestion >= totalQuestions}
            className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent"
            title="Đến câu cuối cùng"
          >
            <ChevronsRight size={18} />
          </button>

          {/* Delete Button Divider & Icon */}
          {onDelete && (
            <>
              <div className="w-px h-4 bg-slate-200 mx-1"></div>
              <button
                onClick={onDelete}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Xóa câu này"
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    );
  }
);

NavigatorControls.displayName = "NavigatorControls";
