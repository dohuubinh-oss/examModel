'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface RightSidebarLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;      // Main work area content (left side)
  sidebar: React.ReactNode;       // Filter/Sidebar content (right side)
  sidebarWidthClass?: string;     // e.g. "lg:col-span-3", defaults to "lg:col-span-3"
  mainWidthClass?: string;        // e.g. "lg:col-span-9", defaults to "lg:col-span-9"
  maxWidthClass?: string;         // e.g. "max-w-[1440px]", defaults to "max-w-[1440px]"
}

export const RightSidebarLayout: React.FC<RightSidebarLayoutProps> = ({
  children,
  sidebar,
  sidebarWidthClass = 'lg:col-span-3',
  mainWidthClass = 'lg:col-span-9',
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
      {/* Left Column: Main Content Area */}
      <div className={cn("space-y-6 order-1", mainWidthClass)}>
        {children}
      </div>

      {/* Right Column: Filter / Config Sidebar */}
      <div className={cn("space-y-6 order-2 lg:order-1", sidebarWidthClass)}>
        {sidebar}
      </div>
    </div>
  );
};

export default RightSidebarLayout;
