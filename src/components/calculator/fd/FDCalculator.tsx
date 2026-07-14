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

import { calculateFD } from "@/lib/calculations/fd";
import { formatCurrency } from "@/lib/format/currency";
import { fdConfig } from "@/config/calculators/fd";

export default function FDCalculator() {
  const [depositAmount, setDepositAmount] = useState(
    fdConfig.amount.default
  );

  const [interestRate, setInterestRate] = useState(
    fdConfig.rate.default
  );

  const [tenure, setTenure] = useState(
    fdConfig.tenure.default
  );

  const [frequency, setFrequency] = useState(
    fdConfig.frequency.default
  );

  const result = useMemo(() => {
    return calculateFD(
      depositAmount,
      interestRate,
      tenure,
      frequency
    );
  }, [
    depositAmount,
    interestRate,
    tenure,
    frequency,
  ]);

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="FD Calculator"
        description="Estimate the maturity amount and interest earned on your Fixed Deposit."
      />

      <div className="grid gap-12 lg:grid-cols-[1fr_420px]">

        {/* LEFT PANEL */}

        <div className="space-y-10">

          <div className="space-y-3">

            <NumberInput
              label="Deposit Amount"
              value={depositAmount}
              onChange={setDepositAmount}
              prefix="₹"
              min={fdConfig.amount.min}
            />

            <Slider
              value={depositAmount}
              min={fdConfig.amount.min}
              max={fdConfig.amount.max}
              step={fdConfig.amount.step}
              onChange={setDepositAmount}
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
              min={fdConfig.rate.min}
              max={fdConfig.rate.max}
              step={fdConfig.rate.step}
              onChange={setInterestRate}
            />

          </div>

          <div className="space-y-3">

          <TenureInput
  label="Deposit Tenure"
  value={tenure}
  onChange={setTenure}
  max={20}
/>

            <Slider
              value={tenure}
              min={fdConfig.tenure.min}
              max={fdConfig.tenure.max}
              step={fdConfig.tenure.step}
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
              {fdConfig.frequency.options.map((option) => (
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

        {/* RIGHT PANEL */}

        <div className="space-y-6">

          <ResultGrid>

            <ResultCard
              label="Deposit Amount"
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