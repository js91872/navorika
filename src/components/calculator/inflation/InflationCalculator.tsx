"use client";

import { useMemo, useState } from "react";

import CalculatorShell from "../CalculatorShell";
import CalculatorHeader from "../CalculatorHeader";
import NumberInput from "../NumberInput";
import PercentageInput from "../PercentageInput";
import Slider from "../Slider";
import ResultGrid from "../ResultGrid";
import ResultCard from "../ResultCard";
import Summary from "../Summary";

import { calculateInflation } from "@/lib/calculations/inflation";
import { formatCurrency, formatNumber } from "@/lib/format/currency";
import { inflationConfig } from "@/config/calculators/inflation";

export default function InflationCalculator() {
  const [amount, setAmount] = useState(inflationConfig.amount.default);
  const [inflationRate, setInflationRate] = useState(inflationConfig.inflationRate.default);
  const [years, setYears] = useState(inflationConfig.years.default);
  const [frequency, setFrequency] = useState(inflationConfig.frequency.default);

  const result = useMemo(() => {
    return calculateInflation({
      amount,
      inflationRate,
      years,
      frequency: frequency as 'yearly' | 'monthly',
    });
  }, [amount, inflationRate, years, frequency]);

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="Inflation Calculator"
        description="Calculate how inflation erodes the purchasing power of your money over time."
      />

      <div className="grid gap-12 lg:grid-cols-[1fr_420px]">
        {/* LEFT PANEL - Inputs */}
        <div className="space-y-10">
          {/* Current Amount */}
          <div className="space-y-3">
            <NumberInput
              label="Current Amount"
              value={amount}
              onChange={setAmount}
              prefix="₹"
              min={inflationConfig.amount.min}
            />
            <Slider
              value={amount}
              min={inflationConfig.amount.min}
              max={inflationConfig.amount.max}
              step={inflationConfig.amount.step}
              onChange={setAmount}
            />
          </div>

          {/* Inflation Rate */}
          <div className="space-y-3">
            <PercentageInput
              label="Inflation Rate"
              value={inflationRate}
              onChange={setInflationRate}
            />
            <Slider
              value={inflationRate}
              min={inflationConfig.inflationRate.min}
              max={inflationConfig.inflationRate.max}
              step={inflationConfig.inflationRate.step}
              onChange={setInflationRate}
            />
          </div>

          {/* Time Period */}
          <div className="space-y-3">
            <NumberInput
              label="Time Period"
              value={years}
              onChange={setYears}
              suffix="Years"
              min={inflationConfig.years.min}
              max={inflationConfig.years.max}
            />
            <Slider
              value={years}
              min={inflationConfig.years.min}
              max={inflationConfig.years.max}
              step={inflationConfig.years.step}
              onChange={setYears}
            />
          </div>

          {/* Frequency */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">
              Compounding Frequency
            </label>
            <div className="grid grid-cols-2 gap-3">
              {inflationConfig.frequency.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFrequency(option.value)}
                  className={`py-2 px-4 rounded-xl text-sm font-medium transition ${
                    frequency === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-700">
            <span className="font-medium">⚠️ Important:</span>
            <p className="mt-1">
              Inflation reduces the purchasing power of your money. 
              {frequency === 'monthly' 
                ? " Monthly compounding shows a more realistic effect."
                : " Yearly compounding is the standard calculation."}
            </p>
          </div>
        </div>

        {/* RIGHT PANEL - Results */}
        <div className="space-y-6">
          {/* Future Value - Highlighted */}
          <div className="bg-blue-50 rounded-3xl border border-blue-200 p-6 shadow-sm">
            <div className="flex flex-col items-center">
              <p className="text-sm text-blue-600 font-medium">
                Amount Needed in {years} Years
              </p>
              <p className="text-4xl font-bold text-blue-700 mt-2">
                {formatCurrency(result.futureValue)}
              </p>
              <p className="text-xs text-blue-500 mt-1">
                To maintain today's purchasing power
              </p>
            </div>
          </div>

          <ResultGrid>
            <ResultCard
              label="Today's Value"
              value={formatCurrency(result.purchasingPower)}
              subtitle={`₹${formatNumber(amount)} in ${years} years`}
            />
            <ResultCard
              label="Total Loss in Value"
              value={formatCurrency(result.totalLoss)}
              subtitle={`${result.lossPercentage.toFixed(1)}% decrease`}
            />
            <ResultCard
              label="Future Value"
              value={formatCurrency(result.futureValue)}
            />
          </ResultGrid>

          {/* Purchasing Power Loss */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-700">
              Purchasing Power Over Time
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Today</span>
                <span className="font-medium text-slate-800">
                  {formatCurrency(amount)}
                </span>
              </div>
              <div className="flex justify-between text-sm border-b border-slate-100 pb-2">
                <span className="text-slate-600">After {years} years</span>
                <span className="font-medium text-red-600">
                  {formatCurrency(result.purchasingPower)}
                </span>
              </div>
              <div className="flex justify-between text-sm pt-2">
                <span className="text-slate-600">Loss in value</span>
                <span className="font-medium text-red-600">
                  -{formatCurrency(result.totalLoss)} ({result.lossPercentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>

          <Summary
            principal={amount}
            interest={result.totalLoss}
            total={result.futureValue}
            principalLabel="Today's Value"
            interestLabel="Loss in Value"
            totalLabel="Future Value Needed"
          />
        </div>
      </div>
    </CalculatorShell>
  );
}
