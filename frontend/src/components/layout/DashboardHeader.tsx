'use client';

import React from 'react';
import { Sparkles, Bell, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export interface HeaderAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'secondary' | 'outline' | 'outline-slate';
  className?: string;
}

export interface DashboardHeaderProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  subtitle?: string;
  breadcrumbs?: string[];
  actions?: HeaderAction[];
  showNotification?: boolean;
  notificationCount?: number;
  onNotificationClick?: () => void;
  showSettings?: boolean;
  onSettingsClick?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs = [],
  actions = [],
  showNotification = true,
  notificationCount = 1,
  onNotificationClick,
  showSettings = false,
  onSettingsClick,
  className,
  ...props
}) => {
  const router = useRouter();

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-amber-100 dark:border-slate-800 px-6 py-3.5",
        className
      )}
      {...props}
    >
      <div className="w-full flex items-center justify-between gap-4 max-w-[1440px] mx-auto">
        {/* Left Side: Breadcrumb & Title */}
        <div className="flex flex-col min-w-0">
          {breadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="flex items-center text-[11px] text-slate-400 dark:text-slate-500 font-medium mb-1 truncate select-none">
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb}>
                  {idx > 0 && <span className="mx-1 text-slate-300 dark:text-slate-700">/</span>}
                  <span className={idx === breadcrumbs.length - 1 ? "text-primary font-semibold" : ""}>
                    {crumb}
                  </span>
                </React.Fragment>
              ))}
            </nav>
          )}
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white leading-tight truncate">
              {title}
            </h1>
            {subtitle && (
              <span className="hidden md:inline-block px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 rounded">
                {subtitle}
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Actions, Notifications & Avatar */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Action Buttons */}
          {actions.map((act, idx) => {
            const ButtonComponent = act.variant === 'default' ? 'button' : 'button';
            const btnVariantClass = 
              act.variant === 'default' 
                ? 'bg-primary hover:bg-primary/95 text-white shadow-sm hover:shadow shadow-primary/10'
                : act.variant === 'secondary'
                ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-slate-800 dark:text-slate-200'
                : 'border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400';

            return (
              <button
                key={`${act.label}-${idx}`}
                onClick={act.onClick}
                className={cn(
                  "flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all active:scale-[0.98]",
                  btnVariantClass,
                  act.className
                )}
              >
                {act.icon}
                <span className="hidden sm:inline">{act.label}</span>
              </button>
            );
          })}

          {/* Notification Bell */}
          {showNotification && (
            <button
              onClick={onNotificationClick}
              className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-full relative transition-all active:scale-95"
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900" />
              )}
            </button>
          )}

          {/* Settings Icon */}
          {showSettings && (
            <button
              onClick={onSettingsClick}
              className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-full transition-all active:scale-95"
            >
              <Settings className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
