"use client";

import { useMemo, useState } from "react";
import { calculateSIP } from "@/lib/calculations/sip";
import { formatCurrency } from "@/lib/format/currency";
import CalculatorShell from "./CalculatorShell";
import CalculatorHeader from "./CalculatorHeader";
import NumberInput from "./NumberInput";
import PercentageInput from "./PercentageInput";
import TenureInput from "./TenureInput";
import Slider from "./Slider";
import ResultGrid from "./ResultGrid";
import ResultCard from "./ResultCard";
import PieChart from "./PieChart";

export default function SIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] =
    useState(10000);

  const [expectedReturn, setExpectedReturn] =
    useState(12);

  const [years, setYears] =
    useState(20);

  const result = useMemo(() => {
    return calculateSIP(
      monthlyInvestment,
      expectedReturn,
      years
    );
  }, [
    monthlyInvestment,
    expectedReturn,
    years,
  ]);

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="SIP Calculator"
        description="Estimate the future value of your monthly investments."
      />

      <div className="grid gap-12 p-8 lg:grid-cols-[1fr_420px]">

        <div className="space-y-10">

          <div className="space-y-3">

            <NumberInput
              label="Monthly Investment"
              value={monthlyInvestment}
              onChange={setMonthlyInvestment}
              prefix="₹"
              min={500}
            />

            <Slider
              value={monthlyInvestment}
              min={500}
              max={500000}
              step={500}
              onChange={setMonthlyInvestment}
            />

          </div>

          <div className="space-y-3">

            <PercentageInput
              label="Expected Annual Return"
              value={expectedReturn}
              onChange={setExpectedReturn}
            />

            <Slider
              value={expectedReturn}
              min={1}
              max={30}
              step={0.1}
              onChange={setExpectedReturn}
            />

          </div>

          <div className="space-y-3">

           <TenureInput
  label="Investment Period"
  value={years}
  onChange={setYears}
/>

            <Slider
              value={years}
              min={1}
              max={40}
              step={1}
              onChange={setYears}
            />

          </div>

        </div>

        <div className="space-y-6">

          <ResultGrid>

            <ResultCard
              label="Invested Amount"
              value={formatCurrency(
                result.investedAmount
              )}
            />

            <ResultCard
              label="Estimated Returns"
              value={formatCurrency(
                result.estimatedReturns
              )}
            />

            <ResultCard
              label="Total Value"
              value={formatCurrency(
                result.maturityAmount
              )}
            />

          </ResultGrid>

          <PieChart
            principal={result.investedAmount}
            interest={result.estimatedReturns}
          />

        </div>

      </div>

    </CalculatorShell>
  );
}