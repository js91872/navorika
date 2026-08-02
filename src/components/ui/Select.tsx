'use client';

import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helper?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helper, options, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5',
            'border border-slate-200 dark:border-white/10',
            'text-slate-900 dark:text-white font-bold text-sm',
            'outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
            error && 'border-red-500 focus:ring-red-500/20',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
        {helper && !error && <p className="text-xs text-slate-400">{helper}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
