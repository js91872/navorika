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
  format?: boolean;
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
  format = true,
}: NumberInputProps) {
  const [displayValue, setDisplayValue] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update display value when props change
  useEffect(() => {
    if (!isFocused) {
      if (format) {
        setDisplayValue(value.toLocaleString());
      } else {
        setDisplayValue(String(value));
      }
    }
  }, [value, isFocused, format]);

  const parseNumber = (str: string): number => {
    const cleaned = str.replace(/[^0-9.]/g, "");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  const handleFocus = () => {
    setIsFocused(true);
    setDisplayValue(String(value));
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.select();
      }
    }, 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "" || raw === "-" || raw === ".") {
      setDisplayValue(raw);
      return;
    }
    const cleaned = raw.replace(/[^0-9.]/g, "");
    const numValue = parseFloat(cleaned);
    if (!isNaN(numValue)) {
      setDisplayValue(cleaned);
    } else {
      setDisplayValue(cleaned);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleBlur();
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    let numValue: number;
    if (displayValue === "" || displayValue === "-" || displayValue === ".") {
      numValue = min !== undefined ? min : 0;
    } else {
      numValue = parseNumber(displayValue);
      if (isNaN(numValue)) {
        numValue = min !== undefined ? min : 0;
      }
    }
    if (min !== undefined && numValue < min) numValue = min;
    if (max !== undefined && numValue > max) numValue = max;
    if (step > 0) {
      numValue = Math.round(numValue / step) * step;
    }
    onChange(numValue);
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
          <span className="absolute left-3 text-sm text-slate-500 dark:text-slate-400 pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
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
          <span className="absolute right-3 text-sm text-slate-500 dark:text-slate-400 pointer-events-none">
            {suffix}
          </span>
        )}
        <div className="absolute right-1 flex flex-col gap-0.5">
          <button
            type="button"
            onClick={increment}
            className="h-4 w-6 rounded-t hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-xs text-slate-500"
          >
            ▲
          </button>
          <button
            type="button"
            onClick={decrement}
            className="h-4 w-6 rounded-b hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-xs text-slate-500"
          >
            ▼
          </button>
        </div>
      </div>
    </div>
  );
}
