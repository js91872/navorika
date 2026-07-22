"use client";

import { useState, useMemo } from "react";
import { TrendingUp, Calendar, Wallet, IndianRupee } from "lucide-react";

import CalculatorShell from "../CalculatorShell";
import { Button } from "@/components/ui/Button";
import ResultGrid from "../ResultGrid";
import ResultCard from "../ResultCard";
import NumberInput from "../NumberInput";

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState<number>(100000);
  const [rate, setRate] = useState<number>(8);
  const [tenure, setTenure] = useState<number>(10);
  const [frequency, setFrequency] = useState<"yearly" | "quarterly" | "monthly">("yearly");

  const result = useMemo(() => {
    if (principal <= 0 || rate <= 0 || tenure <= 0) return null;

    const frequencies = { yearly: 1, quarterly: 4, monthly: 12 };
    const n = frequencies[frequency];
    const r = rate / 100;
    const t = tenure;
    const amount = principal * Math.pow(1 + r / n, n * t);
    const interest = amount - principal;

    return {
      amount: Math.round(amount),
      interest: Math.round(interest),
      principal: Math.round(principal),
    };
  }, [principal, rate, tenure, frequency]);

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
            label="Principal Amount"
            value={principal}
            onChange={setPrincipal}
            min={1000}
            step={1000}
            prefix="₹"
          />
          <NumberInput
            label="Interest Rate"
            value={rate}
            onChange={setRate}
            min={0.1}
            max={30}
            step={0.1}
            suffix="%"
          />
          <NumberInput
            label="Tenure"
            value={tenure}
            onChange={setTenure}
            min={1}
            max={50}
            step={1}
            suffix="Years"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Compounding Frequency</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "yearly", label: "Yearly" },
              { value: "quarterly", label: "Quarterly" },
              { value: "monthly", label: "Monthly" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFrequency(option.value as any)}
                className={`py-2.5 px-4 rounded-xl text-sm font-medium transition ${
                  frequency === option.value
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {result && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-accent-600 p-6 text-white text-center">
              <p className="text-sm text-white/70">Future Value</p>
              <p className="text-3xl sm:text-4xl font-bold mt-1">
                {formatCurrency(result.amount)}
              </p>
            </div>

            <ResultGrid>
              <ResultCard
                label="Principal"
                value={formatCurrency(result.principal)}
                icon="💰"
              />
              <ResultCard
                label="Total Interest"
                value={formatCurrency(result.interest)}
                icon="📈"
              />
              <ResultCard
                label="Tenure"
                value={`${tenure} Years`}
                icon="📅"
              />
            </ResultGrid>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
