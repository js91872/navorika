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
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      <div className="flex items-center">
        {prefix && <span className="text-sm text-slate-500 dark:text-slate-400 mr-2">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder:text-slate-400"
        />
        {suffix && <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">{suffix}</span>}
      </div>
    </div>
  );
}
