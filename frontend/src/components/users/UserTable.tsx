'use client';

import React from 'react';
import { 
  KeyRound, 
  Edit3, 
  Trash2, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
export type UserRole = 'student' | 'teacher' | 'admin';
export type UserStatus = 'active' | 'locked';

export interface UserItem {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  grade: string;       // e.g. "Lớp 10A1", "Toán học", "—"
  joinDate: string;    // e.g. "12/05/2023"
  status: UserStatus;
  hasPulse?: boolean;  // Enables green dot pulsing for active status
}

// 1. RoleBadge Component
export interface RoleBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  role: UserRole;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, className, ...props }) => {
  const roleStyles = {
    student: {
      bg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
      text: 'Học sinh'
    },
    teacher: {
      bg: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800',
      text: 'Giáo viên'
    },
    admin: {
      bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700',
      text: 'Quản trị viên'
    }
  };

  const current = roleStyles[role];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
        current.bg,
        className
      )}
      {...props}
    >
      {current.text}
    </span>
  );
};

// 2. StatusIndicator Component
export interface StatusIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: UserStatus;
  hasPulse?: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  status, 
  hasPulse = false, 
  className, 
  ...props 
}) => {
  const statusStyles = {
    active: {
      text: 'text-emerald-600 dark:text-emerald-400',
      dot: 'bg-emerald-500',
      labelText: 'Hoạt động'
    },
    locked: {
      text: 'text-rose-600 dark:text-rose-400',
      dot: 'bg-rose-500',
      labelText: 'Bị khóa'
    },
    blocked: {
      text: 'text-rose-600 dark:text-rose-400',
      dot: 'bg-rose-500',
      labelText: 'Bị khóa'
    },
    inactive: {
      text: 'text-slate-600 dark:text-slate-400',
      dot: 'bg-slate-500',
      labelText: 'Vô hiệu hóa'
    }
  };

  // Fallback to active if unknown
  const current = statusStyles[status as keyof typeof statusStyles] || statusStyles.active;

  return (
    <span
      className={cn(
        "flex items-center gap-1.5 text-xs font-semibold select-none",
        current.text,
        className
      )}
      {...props}
    >
      <span className={cn(
        "w-1.5 h-1.5 rounded-full shrink-0", 
        current.dot,
        hasPulse && status === 'active' && "animate-pulse"
      )} />
      {current.labelText}
    </span>
  );
};

// 3. UserRow Component
export interface UserRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  user: UserItem;
  onResetPassword?: (user: UserItem) => void;
  onEdit?: (user: UserItem) => void;
  onDelete?: (user: UserItem) => void;
}

export const UserRow: React.FC<UserRowProps> = ({
  user,
  onResetPassword,
  onEdit,
  onDelete,
  className,
  ...props
}) => {
  return (
    <tr
      className={cn(
        "hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800/50",
        className
      )}
      {...props}
    >
      {/* Name and Avatar */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <img 
            alt={`Avatar ${user.name}`} 
            className="w-9 h-9 rounded-full bg-slate-100 object-cover shrink-0 border border-slate-200/50 dark:border-slate-700/50" 
            src={user.avatarUrl} 
          />
          <div className="min-w-0">
            <p className="font-medium text-slate-900 dark:text-slate-200 truncate">{user.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
          </div>
        </div>
      </td>

      {/* Role */}
      <td className="px-6 py-4">
        <RoleBadge role={user.role} />
      </td>

      {/* Grade */}
      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
        {user.grade}
      </td>

      {/* Join Date */}
      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
        {user.joinDate}
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <StatusIndicator status={user.status} hasPulse={user.hasPulse} />
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <button 
            onClick={() => onResetPassword?.(user)}
            className="p-2 text-slate-400 dark:text-slate-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-all" 
            title="Đổi mật khẩu"
          >
            <KeyRound className="h-4.5 w-4.5" />
          </button>
          <button 
            onClick={() => onEdit?.(user)}
            className="p-2 text-slate-400 dark:text-slate-500 hover:text-amber-600 hover:bg-amber-100 rounded-lg transition-all" 
            title="Chỉnh sửa"
          >
            <Edit3 className="h-4.5 w-4.5" />
          </button>
          <button 
            onClick={() => onDelete?.(user)}
            className="p-2 text-slate-400 dark:text-slate-500 hover:text-rose-600 hover:bg-rose-100 rounded-lg transition-all" 
            title="Xóa"
          >
            <Trash2 className="h-4.5 w-4.5" />
          </button>
        </div>
      </td>
    </tr>
  );
};

// 4. UserPagination Component
export interface UserPaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const UserPagination: React.FC<UserPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className,
  ...props
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generates page link logic (e.g. [1, 2, 3, '...', 125])
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
        "mt-6 flex flex-col md:flex-row items-center justify-between gap-4 select-none",
        className
      )}
      {...props}
    >
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Hiển thị <span className="font-semibold text-slate-700 dark:text-slate-200">{startItem} - {endItem}</span> trên tổng số <span className="font-semibold text-slate-700 dark:text-slate-200">{totalItems.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</span> người dùng
      </p>
      
      <div className="flex items-center gap-1">
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-primary hover:border-primary disabled:opacity-50 transition-all cursor-pointer"
        >
          <ChevronLeft className="h-4.5 w-4.5" />
        </button>

        {getPageNumbers().map((page, idx) => {
          if (page === '...') {
            return (
              <span key={`dots-${idx}`} className="px-2 text-slate-400 select-none">
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
                "w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-all cursor-pointer",
                isActive 
                  ? "bg-primary text-white" 
                  : "border border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
              )}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-primary hover:border-primary disabled:opacity-50 transition-all cursor-pointer"
        >
          <ChevronRight className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  );
};

// 5. Main UserTable Component
export interface UserTableProps extends React.HTMLAttributes<HTMLDivElement> {
  users: UserItem[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onResetPassword?: (user: UserItem) => void;
  onEdit?: (user: UserItem) => void;
  onDelete?: (user: UserItem) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onResetPassword,
  onEdit,
  onDelete,
  className,
  ...props
}) => {
  return (
    <div className={cn("w-full", className)} {...props}>
      {/* Table Container Wrapper */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Họ tên</th>
                <th className="px-6 py-4 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Vai trò</th>
                <th className="px-6 py-4 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Khối lớp</th>
                <th className="px-6 py-4 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ngày tham gia</th>
                <th className="px-6 py-4 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onResetPassword={onResetPassword}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400 dark:text-slate-500">
                    Không tìm thấy người dùng nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <UserPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default UserTable;
