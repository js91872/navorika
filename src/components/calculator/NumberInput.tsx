import { useState, useEffect, useRef } from "react";

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
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
}: NumberInputProps) {
  const [inputValue, setInputValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Update internal state when external value changes
  useEffect(() => {
    if (value === 0 && min === undefined) {
      setInputValue("");
    } else if (value === 0 && min !== undefined && min === 0) {
      setInputValue("");
    } else {
      setInputValue(value.toString());
    }
  }, [value, min]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setInputValue(rawValue);
    
    // If empty, don't update the value yet
    if (rawValue === "" || rawValue === "-") {
      // Don't call onChange for empty values
      return;
    }
    
    const numValue = parseFloat(rawValue);
    if (!isNaN(numValue)) {
      let clampedValue = numValue;
      if (min !== undefined && numValue < min) {
        clampedValue = min;
      }
      if (max !== undefined && numValue > max) {
        clampedValue = max;
      }
      onChange(clampedValue);
    }
  };

  const handleBlur = () => {
    // If empty, set to min or 0
    if (inputValue === "" || inputValue === "-") {
      const defaultValue = min !== undefined ? min : 0;
      setInputValue(defaultValue === 0 ? "" : defaultValue.toString());
      onChange(defaultValue);
    }
  };

  const handleFocus = () => {
    // Select all text when focusing
    if (inputRef.current) {
      inputRef.current.select();
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      <div className="flex items-center">
        {prefix && <span className="text-sm text-slate-500 dark:text-slate-400 mr-2">{prefix}</span>}
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={min !== undefined && min > 0 ? min.toString() : "0"}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder:text-slate-400"
        />
        {suffix && <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">{suffix}</span>}
      </div>
    </div>
  );
}
