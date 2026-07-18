"use client";

import { useMemo, useState } from "react";

import CalculatorShell from "../CalculatorShell";
import CalculatorHeader from "../CalculatorHeader";
import NumberInput from "../NumberInput";
import TenureInput from "../TenureInput";
import Slider from "../Slider";
import ResultGrid from "../ResultGrid";
import ResultCard from "../ResultCard";

import { calculateCAGR } from "@/lib/calculations/cagr";
import { formatCurrency } from "@/lib/format/currency";
import { cagrConfig } from "@/config/calculators/cagr";

export default function CAGRCalculator() {
  const [beginningValue, setBeginningValue] = useState(
    cagrConfig.beginningValue.default
  );

  const [endingValue, setEndingValue] = useState(
    cagrConfig.endingValue.default
  );

  const [tenure, setTenure] = useState(
    cagrConfig.tenure.default
  );

  const result = useMemo(() => {
    return calculateCAGR(
      beginningValue,
      endingValue,
      tenure
    );
  }, [
    beginningValue,
    endingValue,
    tenure,
  ]);

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="CAGR Calculator"
        description="Calculate the Compound Annual Growth Rate of your investment."
      />

      <div className="grid gap-12 lg:grid-cols-[1fr_420px]">

        <div className="space-y-10">

          <div className="space-y-3">

            <NumberInput
              label="Beginning Value"
              value={beginningValue}
              onChange={setBeginningValue}
              prefix="₹"
              min={cagrConfig.beginningValue.min}
            />

            <Slider
              value={beginningValue}
              min={cagrConfig.beginningValue.min}
              max={cagrConfig.beginningValue.max}
              step={cagrConfig.beginningValue.step}
              onChange={setBeginningValue}
            />

          </div>

          <div className="space-y-3">

            <NumberInput
              label="Ending Value"
              value={endingValue}
              onChange={setEndingValue}
              prefix="₹"
              min={cagrConfig.endingValue.min}
            />

            <Slider
              value={endingValue}
              min={cagrConfig.endingValue.min}
              max={cagrConfig.endingValue.max}
              step={cagrConfig.endingValue.step}
              onChange={setEndingValue}
            />

          </div>

          <div className="space-y-3">

            <TenureInput
              label="Investment Period"
              value={tenure}
              onChange={setTenure}
              max={50}
            />

            <Slider
              value={tenure}
              min={cagrConfig.tenure.min}
              max={cagrConfig.tenure.max}
              step={cagrConfig.tenure.step}
              onChange={setTenure}
            />

          </div>

        </div>

        <div className="space-y-6">

          <ResultGrid>

            <ResultCard
              label="Beginning Value"
              value={formatCurrency(result.beginningValue)}
            />

            <ResultCard
              label="Ending Value"
              value={formatCurrency(result.endingValue)}
            />

            <ResultCard
              label="CAGR"
              value={`${result.cagr.toFixed(2)}%`}
              highlight
            />

          </ResultGrid>

        </div>

      </div>

    </CalculatorShell>
  );
}