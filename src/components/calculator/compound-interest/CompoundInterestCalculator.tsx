"use client";

import { useMemo, useState } from "react";

import CalculatorShell from "../CalculatorShell";
import CalculatorHeader from "../CalculatorHeader";
import NumberInput from "../NumberInput";
import PercentageInput from "../PercentageInput";
import TenureInput from "../TenureInput";
import Slider from "../Slider";
import ResultGrid from "../ResultGrid";
import ResultCard from "../ResultCard";
import PieChart from "../PieChart";
import Summary from "../Summary";

import { calculateCompoundInterest } from "@/lib/calculations/compoundInterest";
import { formatCurrency } from "@/lib/format/currency";
import { compoundInterestConfig } from "@/config/calculators/compoundInterest";

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(
    compoundInterestConfig.principal.default
  );

  const [interestRate, setInterestRate] = useState(
    compoundInterestConfig.rate.default
  );

  const [tenure, setTenure] = useState(
    compoundInterestConfig.tenure.default
  );

  const [frequency, setFrequency] = useState(
    compoundInterestConfig.frequency.default
  );

  const result = useMemo(() => {
    return calculateCompoundInterest(
      principal,
      interestRate,
      tenure,
      frequency
    );
  }, [
    principal,
    interestRate,
    tenure,
    frequency,
  ]);

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="Compound Interest Calculator"
        description="Estimate your investment growth using compound interest."
      />

      <div className="grid gap-12 lg:grid-cols-[1fr_420px]">

        <div className="space-y-10">

          <div className="space-y-3">

            <NumberInput
              label="Principal Amount"
              value={principal}
              onChange={setPrincipal}
              prefix="₹"
              min={compoundInterestConfig.principal.min}
            />

            <Slider
              value={principal}
              min={compoundInterestConfig.principal.min}
              max={compoundInterestConfig.principal.max}
              step={compoundInterestConfig.principal.step}
              onChange={setPrincipal}
            />

          </div>

          <div className="space-y-3">

            <PercentageInput
              label="Interest Rate"
              value={interestRate}
              onChange={setInterestRate}
            />

            <Slider
              value={interestRate}
              min={compoundInterestConfig.rate.min}
              max={compoundInterestConfig.rate.max}
              step={compoundInterestConfig.rate.step}
              onChange={setInterestRate}
            />

          </div>

          <div className="space-y-3">

            <TenureInput
              label="Investment Period"
              value={tenure}
              onChange={setTenure}
              max={compoundInterestConfig.tenure.max}
            />

            <Slider
              value={tenure}
              min={compoundInterestConfig.tenure.min}
              max={compoundInterestConfig.tenure.max}
              step={compoundInterestConfig.tenure.step}
              onChange={setTenure}
            />

          </div>

          <div className="space-y-3">

            <label className="block text-sm font-medium">
              Compounding Frequency
            </label>

            <select
              value={frequency}
              onChange={(e) =>
                setFrequency(Number(e.target.value))
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
            >
              {compoundInterestConfig.frequency.options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>

          </div>

        </div>

        <div className="space-y-6">

          <ResultGrid>

            <ResultCard
              label="Principal Amount"
              value={formatCurrency(result.investedAmount)}
            />

            <ResultCard
              label="Interest Earned"
              value={formatCurrency(result.interestEarned)}
            />

            <ResultCard
              label="Maturity Amount"
              value={formatCurrency(result.maturityAmount)}
              highlight
            />

          </ResultGrid>

          <PieChart
            principal={result.investedAmount}
            interest={result.interestEarned}
          />

          <Summary
            principal={result.investedAmount}
            interest={result.interestEarned}
            total={result.maturityAmount}
          />

        </div>

      </div>

    </CalculatorShell>
  );
}