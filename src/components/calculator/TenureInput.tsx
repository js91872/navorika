"use client";

import NumberInput from "./NumberInput";

interface TenureInputProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export default function TenureInput({
  label = "Loan Tenure",
  value,
  onChange,
  min = 1,
  max = 40,
}: TenureInputProps) {
  return (
    <NumberInput
      label={label}
      value={value}
      onChange={onChange}
      suffix="Years"
      min={min}
      max={max}
    />
  );
}