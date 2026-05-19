import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface LectureRowCardProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  imageSrc: string;
  title: string;
  category: string;
  href: string;
}

export const LectureRowCard = React.forwardRef<HTMLAnchorElement, LectureRowCardProps>(
  ({ className, imageSrc, title, category, href, ...props }, ref) => {
    return (
      <Link
        ref={ref}
        href={href}
        className={cn("group block hover:no-underline", className)}
        {...props}
      >
        <div className="flex gap-3">
          <div className="w-20 h-20 shrink-0 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200/50 dark:border-slate-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              src={imageSrc}
            />
          </div>
          <div className="flex flex-col justify-center">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
              {title}
            </h4>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 uppercase font-bold tracking-wider">
              {category}
            </p>
          </div>
        </div>
      </Link>
    );
  }
);

LectureRowCard.displayName = "LectureRowCard";
