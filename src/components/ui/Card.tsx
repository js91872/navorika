'use client';

import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'dark';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = 'default', padding = 'md', hoverable = false, className = '', ...props }, ref) => {
    const variants = {
      default: 'bg-white dark:bg-[#18181b] border border-[#e4e4e8] dark:border-[#27272a]',
      subtle: 'bg-[#f7f7f8] dark:bg-[#202023] border border-[#e4e4e8] dark:border-[#27272a]',
      dark: 'bg-[#18181b] text-white border border-[#27272a]',
    };

    const paddings = {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8 sm:p-10',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl transition-all duration-150',
          variants[variant],
          paddings[padding],
          hoverable && 'hover:border-[#e5322d] hover:shadow-md cursor-pointer',
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
