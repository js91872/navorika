"use client";

import { useState, useMemo } from "react";
import { TrendingUp, Calculator, Wallet, Calendar, IndianRupee } from "lucide-react";

import CalculatorShell from "../CalculatorShell";
import { Button } from "@/components/ui/Button";
import ResultCard from "../ResultCard";
import ResultGrid from "../ResultGrid";
import NumberInput from "../NumberInput";

export default function ROICalculator() {
  const [initialInvestment, setInitialInvestment] = useState<number>(100000);
  const [finalValue, setFinalValue] = useState<number>(150000);
  const [timePeriod, setTimePeriod] = useState<number>(5);
  const [method, setMethod] = useState<"simple" | "annualized" | "withContributions">("simple");

  const result = useMemo(() => {
    if (initialInvestment <= 0 || finalValue <= 0 || timePeriod <= 0) return null;

    const profit = finalValue - initialInvestment;
    const roi = (profit / initialInvestment) * 100;
    const annualizedRoi = (Math.pow(finalValue / initialInvestment, 1 / timePeriod) - 1) * 100;

    return {
      profit: Math.round(profit),
      roi: Math.round(roi * 100) / 100,
      annualizedRoi: Math.round(annualizedRoi * 100) / 100,
      initialInvestment: Math.round(initialInvestment),
      finalValue: Math.round(finalValue),
      isPositive: profit > 0,
    };
  }, [initialInvestment, finalValue, timePeriod]);

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
        {/* Method Selection */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "simple", label: "Simple ROI" },
            { value: "annualized", label: "Annualized ROI" },
            { value: "withContributions", label: "With Contributions" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setMethod(option.value as any)}
              className={`py-2.5 px-4 rounded-xl text-sm font-medium transition ${
                method === option.value
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Input Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <NumberInput
            label="Initial Investment"
            value={initialInvestment}
            onChange={setInitialInvestment}
            min={1000}
            step={1000}
            prefix="₹"
          />
          <NumberInput
            label="Final Value"
            value={finalValue}
            onChange={setFinalValue}
            min={1000}
            step={1000}
            prefix="₹"
          />
          <NumberInput
            label="Time Period"
            value={timePeriod}
            onChange={setTimePeriod}
            min={1}
            max={50}
            step={1}
            suffix="Years"
          />
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Main Result */}
            <div className={`rounded-2xl p-6 text-white text-center ${
              result.isPositive 
                ? 'bg-gradient-to-br from-emerald-600 to-teal-700' 
                : 'bg-gradient-to-br from-red-600 to-rose-700'
            }`}>
              <p className="text-sm text-white/70">Total Return</p>
              <p className="text-3xl sm:text-4xl font-bold mt-1">
                {result.isPositive ? '+' : ''}{formatCurrency(result.profit)}
              </p>
              <div className="flex justify-center gap-6 mt-2 text-sm text-white/80">
                <span>{result.roi.toFixed(2)}% total ROI</span>
                <span>•</span>
                <span>{result.annualizedRoi.toFixed(2)}% annualized</span>
              </div>
            </div>

            <ResultGrid>
              <ResultCard
                label="Net Profit"
                value={formatCurrency(result.profit)}
                icon={result.isPositive ? "✅" : "❌"}
                subtitle={result.isPositive ? "Positive return" : "Negative return"}
              />
              <ResultCard
                label="Total Return %"
                value={`${result.roi.toFixed(2)}%`}
                icon="📊"
              />
              <ResultCard
                label="Annualized Return"
                value={`${result.annualizedRoi.toFixed(2)}%`}
                icon="📈"
                subtitle={`Over ${timePeriod} years`}
              />
            </ResultGrid>

            {/* Summary */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">📋 Summary</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Initial Investment</p>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {formatCurrency(result.initialInvestment)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Profit</p>
                  <p className={`text-sm font-medium ${result.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {result.isPositive ? '+' : ''}{formatCurrency(result.profit)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Final Value</p>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {formatCurrency(result.finalValue)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
