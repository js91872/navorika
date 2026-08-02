'use client';

import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  showValue?: boolean;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ label, value, onChange, min = 0, max = 100, step = 1, unit = '', showValue = true, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {label}
            </label>
            {showValue && (
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                {value}{unit}
              </span>
            )}
          </div>
        )}
        <div className="relative">
          <input
            ref={ref}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className={cn(
              'w-full h-2 rounded-lg appearance-none cursor-pointer transition-all',
              'bg-slate-200 dark:bg-slate-700',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
              className
            )}
            style={{
              background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${((value - min) / (max - min)) * 100}%, #e2e8f0 ${((value - min) / (max - min)) * 100}%, #e2e8f0 100%)`,
            }}
            {...props}
          />
          <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1">
            <span>{min}</span>
            <span>{max}</span>
          </div>
        </div>
      </div>
    );
  }
);

Slider.displayName = 'Slider';
