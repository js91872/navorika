'use client';

import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'dark' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = 'default', padding = 'md', hoverable = false, className = '', ...props }, ref) => {
    const variants = {
      default: 'bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10',
      glass: 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-white/5',
      dark: 'bg-slate-900 text-white border border-slate-800',
      gradient: 'bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 border border-indigo-200/50 dark:border-indigo-800/30',
    };

    const paddings = {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6 sm:p-8',
      lg: 'p-8 sm:p-12',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-[2rem] shadow-sm transition-all duration-300',
          variants[variant],
          paddings[padding],
          hoverable && 'hover:shadow-xl hover:-translate-y-1 cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
