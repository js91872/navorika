"use client";

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}

export default function Slider({
  value,
  min,
  max,
  step = 1,
  onChange,
}: SliderProps) {
  return (
    <div className="pt-2">

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) =>
          onChange(Number(e.target.value))
        }
        className="
          h-2
          w-full
          cursor-pointer
          appearance-none
          rounded-full
          bg-slate-200
          accent-blue-600
        "
      />

      <div className="mt-2 flex justify-between text-xs text-muted-foreground">

        <span>{min.toLocaleString()}</span>

        <span>{max.toLocaleString()}</span>

      </div>

    </div>
  );
}