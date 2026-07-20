"use client";

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
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
  placeholder,
  prefix,
  suffix,
  min,
  max,
  step = 1,
}: NumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    // Remove leading zeros and parse as number
    const cleanedValue = rawValue.replace(/^0+/, '');
    if (cleanedValue === '') {
      onChange(0);
      return;
    }
    const numValue = Number(cleanedValue);
    if (!isNaN(numValue)) {
      onChange(numValue);
    }
  };

  // Format the display value without leading zeros
  const displayValue = value === 0 ? '' : value.toString();

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-foreground">
        {label}
      </label>

      <div className="flex items-center rounded-xl border border-border bg-background px-4 py-3 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
        {prefix && (
          <span className="mr-3 font-semibold text-muted-foreground">
            {prefix}
          </span>
        )}

        <input
          type="text"
          inputMode="numeric"
          value={displayValue}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          onChange={handleChange}
          onFocus={(e) => {
            // Select all text on focus for easy replacement
            e.target.select();
          }}
          className="w-full bg-transparent text-lg font-medium outline-none"
        />

        {suffix && (
          <span className="ml-3 font-semibold text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
