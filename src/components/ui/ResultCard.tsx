'use client';

import { cn } from '@/lib/utils';

interface ResultCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  color?: 'default' | 'green' | 'blue' | 'purple' | 'amber' | 'rose' | 'indigo' | 'red';
  icon?: React.ReactNode;
  className?: string;
  animate?: boolean;
}

const colorMap = {
  default: 'bg-white dark:bg-[#18181b] border-[#e4e4e8] dark:border-[#27272a]',
  green: 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300',
  blue: 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50 text-blue-800 dark:text-blue-300',
  purple: 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/50 text-purple-800 dark:text-purple-300',
  indigo: 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200',
  amber: 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300',
  rose: 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-300',
  red: 'bg-[#fff1f1] dark:bg-[#e5322d]/10 border-[#e5322d]/30 text-[#e5322d]',
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
      'p-5 rounded-xl border transition-all',
      colorMap[color],
      className
    )}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#5b5b63] dark:text-[#a1a1aa]">
            {label}
          </span>
          <div className="flex items-center gap-2 mt-1">
            {icon && <span className="text-xl">{icon}</span>}
            <span className="text-2xl sm:text-3xl font-black text-[#18181b] dark:text-white tracking-tight">{value}</span>
          </div>
          {subValue && (
            <p className="text-xs text-[#5b5b63] dark:text-[#a1a1aa] mt-1">{subValue}</p>
          )}
        </div>
      </div>
    </div>
  );
}
