"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

export default function NumberInput({
  label,
  value,
  onChange,
  prefix = "",
  suffix = "",
  min,
  max,
  step = 1,
  placeholder = "",
}: NumberInputProps) {
  const [displayValue, setDisplayValue] = useState<string>(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  // Update display when value prop changes from parent
  useEffect(() => {
    setDisplayValue(String(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDisplayValue(raw);
    
    // Allow empty, decimal point, and minus sign
    if (raw === "" || raw === "-" || raw === ".") {
      return;
    }
    
    const numValue = parseFloat(raw);
    if (!isNaN(numValue)) {
      let finalValue = numValue;
      if (min !== undefined && finalValue < min) finalValue = min;
      if (max !== undefined && finalValue > max) finalValue = max;
      onChange(finalValue);
    }
  };

  const handleBlur = () => {
    let numValue = parseFloat(displayValue);
    
    if (isNaN(numValue) || displayValue === "") {
      numValue = min !== undefined ? min : 0;
    }
    
    if (min !== undefined && numValue < min) numValue = min;
    if (max !== undefined && numValue > max) numValue = max;
    
    // Round to step
    if (step > 0) {
      numValue = Math.round(numValue / step) * step;
    }
    
    onChange(numValue);
    setDisplayValue(String(numValue));
  };

  const increment = () => {
    let newValue = value + step;
    if (max !== undefined && newValue > max) newValue = max;
    onChange(newValue);
  };

  const decrement = () => {
    let newValue = value - step;
    if (min !== undefined && newValue < min) newValue = min;
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-sm text-slate-500 dark:text-slate-400 pointer-events-none z-10">
            {prefix}
          </span>
        )}
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-xl border border-slate-300 dark:border-slate-600",
            "bg-white dark:bg-slate-800 px-4 py-3",
            "text-sm text-slate-900 dark:text-slate-100",
            "outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
            "transition duration-200",
            prefix ? "pl-8" : "pl-4",
            suffix ? "pr-12" : "pr-4"
          )}
        />
        {suffix && (
          <span className="absolute right-8 text-sm text-slate-500 dark:text-slate-400 pointer-events-none">
            {suffix}
          </span>
        )}
        <div className="absolute right-1 flex flex-col gap-0.5">
          <button
            type="button"
            onClick={increment}
            className="h-4 w-6 rounded-t hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-xs text-slate-500 transition"
          >
            ▲
          </button>
          <button
            type="button"
            onClick={decrement}
            className="h-4 w-6 rounded-b hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-xs text-slate-500 transition"
          >
            ▼
          </button>
        </div>
      </div>
    </div>
  );
}
