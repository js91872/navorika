'use client';

import { cn } from '@/lib/utils';
import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  unit?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, icon, iconPosition = 'left', unit, className = '', type = 'text', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
          )}
          <input
            ref={ref}
            type={inputType}
            className={cn(
              'w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5',
              'border border-slate-200 dark:border-white/10',
              'text-slate-900 dark:text-white font-bold text-lg',
              'placeholder:text-slate-400 placeholder:font-medium',
              'outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
              error && 'border-red-500 focus:ring-red-500/20',
              icon && iconPosition === 'left' && 'pl-12',
              (icon && iconPosition === 'right' || unit) && 'pr-12',
              isPassword && 'pr-12',
              className
            )}
            {...props}
          />
          {unit && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
              {unit}
            </span>
          )}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          )}
          {icon && iconPosition === 'right' && !isPassword && !unit && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
          )}
        </div>
        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
        {helper && !error && <p className="text-xs text-slate-400">{helper}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
