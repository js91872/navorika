"use client";

import NumberInput from "./NumberInput";

interface TenureInputProps {
  value: number;
  onChange: (value: number) => void;
}

export default function TenureInput({
  value,
  onChange,
}: TenureInputProps) {
  return (
    <NumberInput
      label="Loan Tenure"
      value={value}
      onChange={onChange}
      suffix="Years"
      min={1}
      max={40}
    />
  );
}