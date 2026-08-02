'use client';

import { cn } from '@/lib/utils';

interface ResultCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  color?: 'default' | 'green' | 'blue' | 'purple' | 'amber' | 'rose' | 'indigo';
  icon?: React.ReactNode;
  className?: string;
  animate?: boolean;
}

const colorMap = {
  default: 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
  green: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300',
  blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300',
  purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300',
  indigo: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300',
  amber: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300',
  rose: 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300',
};

export function ResultCard({ 
  label, 
  value, 
  subValue, 
  color = 'default', 
  icon, 
  className,
}: ResultCardProps) {
  return (
    <div className={cn(
      'p-6 rounded-2xl border shadow-sm transition-all hover:shadow-md',
      colorMap[color],
      className
    )}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
            {label}
          </span>
          <div className="flex items-center gap-2 mt-1">
            {icon && <span className="text-xl">{icon}</span>}
            <span className="text-3xl font-black">{value}</span>
          </div>
          {subValue && (
            <p className="text-xs font-medium opacity-70 mt-1">{subValue}</p>
          )}
        </div>
      </div>
    </div>
  );
}
