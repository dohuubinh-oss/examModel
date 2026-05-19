import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionScore {
  name: string;
  score: number;
  maxScore: number;
  status: 'success' | 'warning' | 'error';
}

export interface ResultScoreGaugeProps extends React.HTMLAttributes<HTMLDivElement> {
  score: number;
  maxScore?: number;
  title: string;
  description: string;
  sections?: SectionScore[];
}

export const ResultScoreGauge = React.forwardRef<HTMLDivElement, ResultScoreGaugeProps>(
  ({ score, maxScore = 10, title, description, sections = [], className, ...props }, ref) => {
    const radius = 70;
    const strokeWidth = 8;
    const circumference = 2 * Math.PI * radius;
    const safeScore = Math.max(0, Math.min(score, maxScore));
    const strokeDashoffset = circumference - (safeScore / maxScore) * circumference;

    return (
      <div
        ref={ref}
        className={cn(
          "bg-white rounded-xl p-8 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col items-center",
          className
        )}
        {...props}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 pointer-events-none" />
        
        <div className="text-center relative flex flex-col items-center">
          {/* Circular Progress Gauge */}
          <div className="inline-flex items-center justify-center relative mb-4">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                className="text-slate-100"
                cx="80"
                cy="80"
                fill="transparent"
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
              />
              <circle
                className="text-primary transition-all duration-500 ease-out"
                cx="80"
                cy="80"
                fill="transparent"
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-slate-900">{score.toFixed(1)}</span>
              <span className="text-slate-400 font-bold text-sm">/ {maxScore}</span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mb-1">{title}</h3>
          <p className="text-slate-500 text-sm font-medium">{description}</p>
        </div>

        {/* Section Score Breakdown Grid */}
        {sections.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mt-8 w-full">
            {sections.map((section, index) => {
              const statusColors = {
                success: 'text-success bg-success/5 border-success/20',
                warning: 'text-warning bg-warning/5 border-warning/20',
                error: 'text-error bg-error/5 border-error/20'
              };

              return (
                <div
                  key={index}
                  className={cn(
                    "p-4 rounded-xl bg-slate-50 text-center border border-slate-100",
                    statusColors[section.status] || "text-slate-700 bg-slate-50 border-slate-200"
                  )}
                >
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                    {section.name}
                  </p>
                  <p className="text-xl font-bold">
                    {section.score.toFixed(1)}
                    <span className="text-xs text-slate-400 font-semibold">/{section.maxScore.toFixed(1)}</span>
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
);

ResultScoreGauge.displayName = 'ResultScoreGauge';
