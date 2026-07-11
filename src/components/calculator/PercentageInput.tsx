"use client";

interface PercentageInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export default function PercentageInput({
  label,
  value,
  onChange,
}: PercentageInputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="flex items-center rounded-xl border border-slate-300 bg-white px-4 py-3 shadow-sm focus-within:border-blue-500">

        <input
          type="number"
          value={value}
          step="0.01"
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full bg-transparent text-lg font-medium outline-none"
        />

        <span className="ml-2 text-lg font-semibold text-slate-500">
          %
        </span>

      </div>
    </div>
  );
}