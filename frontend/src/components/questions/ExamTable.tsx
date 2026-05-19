'use client';

import React from 'react';
import { 
  Calculator, 
  Triangle, 
  TrendingUp, 
  BarChart3, 
  Share2, 
  Copy, 
  Edit3, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Play,
  LucideIcon 
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
export type ExamStatus = 'published' | 'draft' | 'ended';
export type ExamIconType = 'calculate' | 'square_foot' | 'timeline' | 'query_stats';

export interface ExamItem {
  id: string;
  name: string;
  updatedText: string;      // e.g. "Cập nhật 2 giờ trước"
  grade: string;            // e.g. "10", "11", "12"
  questionsCount: number;   // e.g. 50
  duration: string;         // e.g. "90 phút"
  status: ExamStatus;
  iconType: ExamIconType;
}

// Icon mapper helper
const getExamIcon = (type: ExamIconType): LucideIcon => {
  switch (type) {
    case 'calculate':
      return Calculator;
    case 'square_foot':
      return Triangle; // Representing geometry/ruler
    case 'timeline':
      return TrendingUp; // Representing analysis/growth
    case 'query_stats':
      return BarChart3; // Representing stats/bar chart
    default:
      return Calculator;
  }
};

// 1. StatusBadge Component
export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: ExamStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className, ...props }) => {
  const statusStyles = {
    published: {
      bg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      dot: 'bg-emerald-500',
      text: 'Đã xuất bản'
    },
    draft: {
      bg: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
      dot: 'bg-slate-400',
      text: 'Nháp'
    },
    ended: {
      bg: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      dot: 'bg-red-500',
      text: 'Đã kết thúc'
    }
  };

  const current = statusStyles[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        current.bg,
        className
      )}
      {...props}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5 shrink-0", current.dot)} />
      {current.text}
    </span>
  );
};

// 2. GradeBadge Component
export interface GradeBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  grade: string;
}

export const GradeBadge: React.FC<GradeBadgeProps> = ({ grade, className, ...props }) => {
  return (
    <span
      className={cn(
        "px-3 py-1 bg-amber-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-xs font-bold whitespace-nowrap",
        className
      )}
      {...props}
    >
      Lớp {grade}
    </span>
  );
};

// 3. ExamRow Component
export interface ExamRowProps extends Omit<React.HTMLAttributes<HTMLTableRowElement>, 'onCopy'> {
  exam: ExamItem;
  theme?: 'amber' | 'blue';
  onShare?: (exam: ExamItem) => void;
  onCopy?: (exam: ExamItem) => void;
  onEdit?: (exam: ExamItem) => void;
  onDelete?: (exam: ExamItem) => void;
  onTake?: (exam: ExamItem) => void;
}

export const ExamRow: React.FC<ExamRowProps> = ({
  exam,
  theme = 'amber',
  className,
  onShare,
  onCopy,
  onEdit,
  onDelete,
  onTake,
  ...props
}) => {
  const Icon = getExamIcon(exam.iconType);

  const themeClasses = {
    amber: {
      iconBg: 'bg-amber-100/50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
      rowHover: 'hover:bg-amber-50/10 dark:hover:bg-amber-950/5',
      actionHover: 'hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/20'
    },
    blue: {
      iconBg: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      rowHover: 'hover:bg-blue-50/10 dark:hover:bg-blue-950/5',
      actionHover: 'hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20'
    }
  };

  const style = themeClasses[theme];

  return (
    <tr
      className={cn(
        "transition-colors group border-b border-amber-50/50 dark:border-slate-800/50",
        style.rowHover,
        className
      )}
      {...props}
    >
      {/* Exam Name */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded flex items-center justify-center shrink-0", style.iconBg)}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-800 dark:text-slate-100 truncate">{exam.name}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{exam.updatedText}</p>
          </div>
        </div>
      </td>

      {/* Grade */}
      <td className="px-6 py-4 text-center">
        <GradeBadge grade={exam.grade} />
      </td>

      {/* Questions Count */}
      <td className="px-6 py-4 text-center text-sm font-medium text-slate-700 dark:text-slate-300">
        {exam.questionsCount}
      </td>

      {/* Duration */}
      <td className="px-6 py-4 text-center text-sm font-medium text-slate-700 dark:text-slate-300">
        {exam.duration}
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <StatusBadge status={exam.status} />
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <button 
            onClick={() => onTake?.(exam)}
            className="p-2 text-primary hover:text-white hover:bg-primary rounded-lg transition-all" 
            title="Làm bài thi"
          >
            <Play className="h-4.5 w-4.5 fill-current" />
          </button>
          <button 
            onClick={() => onShare?.(exam)}
            className={cn("p-2 text-slate-400 dark:text-slate-500 rounded-lg transition-all", style.actionHover)} 
            title="Chia sẻ"
          >
            <Share2 className="h-4.5 w-4.5" />
          </button>
          <button 
            onClick={() => onCopy?.(exam)}
            className={cn("p-2 text-slate-400 dark:text-slate-500 rounded-lg transition-all", style.actionHover)} 
            title="Nhân bản"
          >
            <Copy className="h-4.5 w-4.5" />
          </button>
          <button 
            onClick={() => onEdit?.(exam)}
            className={cn("p-2 text-slate-400 dark:text-slate-500 rounded-lg transition-all", style.actionHover)} 
            title="Chỉnh sửa"
          >
            <Edit3 className="h-4.5 w-4.5" />
          </button>
          <button 
            onClick={() => onDelete?.(exam)}
            className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all" 
            title="Xóa"
          >
            <Trash2 className="h-4.5 w-4.5" />
          </button>
        </div>
      </td>
    </tr>
  );
};

// 4. Pagination Component
export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  theme?: 'amber' | 'blue';
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  theme = 'amber',
  onPageChange,
  className,
  ...props
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const themeClasses = {
    amber: {
      activePage: 'bg-amber-700 text-white dark:bg-amber-800',
      inactiveHover: 'hover:bg-amber-50 dark:hover:bg-slate-800 text-slate-500 hover:text-amber-700 dark:hover:text-amber-400',
      border: 'border-amber-50 dark:border-slate-800'
    },
    blue: {
      activePage: 'bg-blue-600 text-white dark:bg-blue-700',
      inactiveHover: 'hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400',
      border: 'border-slate-100 dark:border-slate-800'
    }
  };

  const style = themeClasses[theme];

  // Helper to generate dynamic page array (e.g. [1, 2, 3, '...', 39])
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div
      className={cn(
        "px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t",
        style.border,
        className
      )}
      {...props}
    >
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Hiển thị <span className="font-bold text-slate-700 dark:text-slate-200">{startItem}-{endItem}</span> của{' '}
        <span className="font-bold text-slate-700 dark:text-slate-200">{totalItems}</span> bài thi
      </p>
      
      <div className="flex items-center gap-1">
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            "p-2 text-slate-400 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent",
            style.inactiveHover
          )}
        >
          <ChevronLeft className="h-4.5 w-4.5" />
        </button>

        {getPageNumbers().map((page, idx) => {
          if (page === '...') {
            return (
              <span key={`dots-${idx}`} className="px-2 text-slate-300 dark:text-slate-600 select-none">
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={`page-${pageNum}`}
              onClick={() => onPageChange(pageNum)}
              className={cn(
                "w-8 h-8 flex items-center justify-center text-xs font-bold rounded-lg transition-all",
                isActive ? style.activePage : style.inactiveHover
              )}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            "p-2 text-slate-400 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent",
            style.inactiveHover
          )}
        >
          <ChevronRight className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  );
};

// 5. Main ExamTable Component
export interface ExamTableProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onCopy'> {
  exams: ExamItem[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  theme?: 'amber' | 'blue';
  onPageChange: (page: number) => void;
  onShare?: (exam: ExamItem) => void;
  onCopy?: (exam: ExamItem) => void;
  onEdit?: (exam: ExamItem) => void;
  onDelete?: (exam: ExamItem) => void;
  onTake?: (exam: ExamItem) => void;
}

export const ExamTable: React.FC<ExamTableProps> = ({
  exams,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  theme = 'amber',
  onPageChange,
  onShare,
  onCopy,
  onEdit,
  onDelete,
  onTake,
  className,
  ...props
}) => {
  const borderClasses = {
    amber: 'border-amber-100 dark:border-slate-800 bg-amber-50/20 dark:bg-slate-800/50 header-border-amber',
    blue: 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 header-border-blue'
  };

  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-900 rounded-xl shadow-sm border overflow-hidden",
        theme === 'amber' ? 'border-amber-100 dark:border-slate-800' : 'border-slate-200 dark:border-slate-800',
        className
      )}
      {...props}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={cn("border-b", borderClasses[theme])}>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tên đề thi</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Khối lớp</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Số câu hỏi</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Thời gian</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-50/30 dark:divide-slate-800/50">
            {exams.map((exam) => (
              <ExamRow
                key={exam.id}
                exam={exam}
                theme={theme}
                onShare={onShare}
                onCopy={onCopy}
                onEdit={onEdit}
                onDelete={onDelete}
                onTake={onTake}
              />
            ))}
            {exams.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">
                  Không tìm thấy đề thi nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        theme={theme}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default ExamTable;
