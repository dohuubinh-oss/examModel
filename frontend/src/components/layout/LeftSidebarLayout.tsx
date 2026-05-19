'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface LeftSidebarLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;      // Main editor area content (right side)
  sidebar: React.ReactNode;       // Outline/Sidebar content (left side)
  sidebarWidthClass?: string;     // e.g. "lg:col-span-4", defaults to "lg:col-span-4"
  mainWidthClass?: string;        // e.g. "lg:col-span-8", defaults to "lg:col-span-8"
  maxWidthClass?: string;         // e.g. "max-w-[1440px]", defaults to "max-w-[1440px]"
}

export const LeftSidebarLayout: React.FC<LeftSidebarLayoutProps> = ({
  children,
  sidebar,
  sidebarWidthClass = 'lg:col-span-4',
  mainWidthClass = 'lg:col-span-8',
  maxWidthClass = 'max-w-[1440px]',
  className,
  ...props
}) => {
  return (
    <div 
      className={cn(
        "w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6",
        maxWidthClass,
        className
      )}
      {...props}
    >
      {/* Left Column: Sidebar / Outline Tree */}
      <div className={cn("space-y-6 lg:order-1", sidebarWidthClass)}>
        {sidebar}
      </div>

      {/* Right Column: Main Editor Work Area */}
      <div className={cn("space-y-6 lg:order-2", mainWidthClass)}>
        {children}
      </div>
    </div>
  );
};

export default LeftSidebarLayout;
