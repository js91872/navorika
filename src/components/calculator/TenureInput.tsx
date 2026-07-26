"use client";

import { useState, useEffect } from "react";

interface TenureInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  unit?: "years" | "months";
}

export default function TenureInput({
  label,
  value,
  onChange,
  min = 1,
  max = 30,
  unit = "years",
}: TenureInputProps) {
  const [inputValue, setInputValue] = useState<string>(String(value));

  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    if (newValue === "") return;
    
    const numValue = Number(newValue);
    if (!isNaN(numValue)) {
      let finalValue = Math.round(numValue);
      if (min !== undefined && finalValue < min) finalValue = min;
      if (max !== undefined && finalValue > max) finalValue = max;
      onChange(finalValue);
    }
  };

  const handleBlur = () => {
    if (inputValue === "" || isNaN(Number(inputValue))) {
      setInputValue(String(min));
      onChange(min);
      return;
    }
    
    let numValue = Math.round(Number(inputValue));
    if (min !== undefined && numValue < min) numValue = min;
    if (max !== undefined && numValue > max) numValue = max;
    setInputValue(String(numValue));
    onChange(numValue);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <input
          type="text"
          inputMode="numeric"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          min={min}
          max={max}
          className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
        />
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400 min-w-[50px]">
          {unit}
        </span>
      </div>
    </div>
  );
}
