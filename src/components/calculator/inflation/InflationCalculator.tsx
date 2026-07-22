"use client";

import { useState, useMemo } from "react";
import { TrendingDown, Calculator, Wallet, Calendar, IndianRupee } from "lucide-react";

import CalculatorShell from "../CalculatorShell";
import { Button } from "@/components/ui/Button";
import ResultCard from "../ResultCard";
import ResultGrid from "../ResultGrid";
import NumberInput from "../NumberInput";

export default function InflationCalculator() {
  const [currentAmount, setCurrentAmount] = useState<number>(100000);
  const [inflationRate, setInflationRate] = useState<number>(6);
  const [years, setYears] = useState<number>(10);

  const result = useMemo(() => {
    if (currentAmount <= 0 || inflationRate <= 0 || years <= 0) return null;

    const futureValue = currentAmount * Math.pow(1 + inflationRate / 100, years);
    const lostValue = futureValue - currentAmount;
    const purchasingPower = (currentAmount / futureValue) * 100;

    return {
      futureValue: Math.round(futureValue),
      lostValue: Math.round(lostValue),
      purchasingPower: Math.round(purchasingPower * 100) / 100,
      currentAmount: Math.round(currentAmount),
    };
  }, [currentAmount, inflationRate, years]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <CalculatorShell>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <NumberInput
            label="Current Amount"
            value={currentAmount}
            onChange={setCurrentAmount}
            min={1000}
            step={1000}
            prefix="₹"
          />
          <NumberInput
            label="Inflation Rate"
            value={inflationRate}
            onChange={setInflationRate}
            min={0.1}
            max={20}
            step={0.1}
            suffix="%"
          />
          <NumberInput
            label="Time Period"
            value={years}
            onChange={setYears}
            min={1}
            max={50}
            step={1}
            suffix="Years"
          />
        </div>

        {result && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-gradient-to-br from-orange-600 to-amber-700 p-6 text-white text-center">
              <p className="text-sm text-white/70">Future Value Needed</p>
              <p className="text-3xl sm:text-4xl font-bold mt-1">
                {formatCurrency(result.futureValue)}
              </p>
              <p className="text-sm text-white/60 mt-1">
                To maintain same purchasing power
              </p>
            </div>

            <ResultGrid>
              <ResultCard
                label="Future Value"
                value={formatCurrency(result.futureValue)}
                icon="📈"
              />
              <ResultCard
                label="Lost Value"
                value={formatCurrency(result.lostValue)}
                icon="📉"
              />
              <ResultCard
                label="Purchasing Power"
                value={`${result.purchasingPower}%`}
                icon="💪"
              />
            </ResultGrid>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                💡 <span className="font-medium">What this means:</span> 
                Today's {formatCurrency(result.currentAmount)} will need to grow to 
                {formatCurrency(result.futureValue)} in {years} years to maintain the 
                same purchasing power at {inflationRate}% inflation.
              </p>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
