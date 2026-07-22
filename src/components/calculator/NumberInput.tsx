interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
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
  className = "",
}: NumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    if (rawValue === "") {
      if (min !== undefined && min > 0) {
        return;
      }
      onChange(0);
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

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    if (rawValue === "" || rawValue === "-") {
      onChange(min !== undefined ? min : 0);
    }
  };

  const getDisplayValue = (): string => {
    if (value === 0 && min !== undefined && min === 0) {
      return "";
    }
    return value.toString();
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-sm text-slate-500 dark:text-slate-400">
            {prefix}
          </span>
        )}
        <input
          type="text"
          inputMode="decimal"
          value={getDisplayValue()}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={min !== undefined ? min.toString() : "0"}
          className={`
            w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none
            focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20
            dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder:text-slate-400
            ${prefix ? 'pl-7' : 'pl-3'}
            ${suffix ? 'pr-12' : 'pr-3'}
          `}
        />
        {suffix && (
          <span className="absolute right-3 text-sm text-slate-500 dark:text-slate-400">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
