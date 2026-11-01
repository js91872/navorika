'use client';

import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      icon,
      iconPosition = 'left',
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary: 'bg-[#e5322d] hover:bg-[#c71f1e] text-white shadow-xs',
      secondary: 'bg-[#f0f0f2] dark:bg-[#27272a] hover:bg-[#e4e4e8] dark:hover:bg-[#323236] text-[#18181b] dark:text-white',
      outline: 'border border-[#e4e4e8] dark:border-[#27272a] hover:border-[#e5322d] text-[#18181b] dark:text-[#f4f4f5] hover:text-[#e5322d] bg-white dark:bg-[#18181b]',
      ghost: 'hover:bg-[#f0f0f2] dark:hover:bg-[#27272a] text-[#5b5b63] dark:text-[#a1a1aa] hover:text-[#18181b] dark:hover:text-white',
      danger: 'bg-red-600 hover:bg-red-700 text-white shadow-xs',
      success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs',
    };

    const sizes = {
      sm: 'min-h-10 px-3 py-1.5 text-xs font-semibold rounded-lg',
      md: 'min-h-11 px-4 py-2 text-sm font-semibold rounded-lg',
      lg: 'min-h-12 px-6 py-3 text-base font-semibold rounded-lg',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'relative inline-flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-[#e5322d]/30 focus:ring-offset-1',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          !isLoading && 'active:scale-[0.99]',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
            {children}
            {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
