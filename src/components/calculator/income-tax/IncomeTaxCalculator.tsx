"use client";

import { useState, useMemo } from "react";
import { Calculator, TrendingUp, Receipt, IndianRupee } from "lucide-react";

import CalculatorShell from "../CalculatorShell";
import { Button } from "@/components/ui/Button";
import ResultGrid from "../ResultGrid";
import ResultCard from "../ResultCard";
import NumberInput from "../NumberInput";

const formatINR = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function IncomeTaxCalculator() {
  const [annualIncome, setAnnualIncome] = useState<number>(800000);
  const [deductions80C, setDeductions80C] = useState<number>(150000);
  const [deductions80D, setDeductions80D] = useState<number>(25000);
  const [standardDeduction, setStandardDeduction] = useState<number>(75000);
  const [regime, setRegime] = useState<"old" | "new">("new");

  const result = useMemo(() => {
    if (annualIncome <= 0) return null;

    // Calculate taxable income
    let taxableIncome = annualIncome - standardDeduction;
    if (regime === "old") {
      taxableIncome -= Math.min(deductions80C, 150000);
      taxableIncome -= Math.min(deductions80D, 25000);
    }
    if (taxableIncome < 0) taxableIncome = 0;

    // Calculate tax based on regime
    let tax = 0;
    let remaining = taxableIncome;

    if (regime === "new") {
      // New regime slabs
      if (remaining > 1500000) {
        tax += (remaining - 1500000) * 0.30;
        remaining = 1500000;
      }
      if (remaining > 1200000) {
        tax += (remaining - 1200000) * 0.20;
        remaining = 1200000;
      }
      if (remaining > 1000000) {
        tax += (remaining - 1000000) * 0.15;
        remaining = 1000000;
      }
      if (remaining > 700000) {
        tax += (remaining - 700000) * 0.10;
        remaining = 700000;
      }
      if (remaining > 300000) {
        tax += (remaining - 300000) * 0.05;
      }
    } else {
      // Old regime slabs
      if (remaining > 1000000) {
        tax += (remaining - 1000000) * 0.30;
        remaining = 1000000;
      }
      if (remaining > 500000) {
        tax += (remaining - 500000) * 0.20;
        remaining = 500000;
      }
      if (remaining > 250000) {
        tax += (remaining - 250000) * 0.05;
      }
    }

    tax = Math.round(tax * 1.04); // Add 4% cess
    const effectiveRate = Math.round((tax / annualIncome) * 100);

    return {
      taxableIncome: Math.round(taxableIncome),
      tax,
      effectiveRate,
    };
  }, [annualIncome, deductions80C, deductions80D, standardDeduction, regime]);

  return (
    <CalculatorShell>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Regime Selection */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: "new", label: "New Regime" },
            { value: "old", label: "Old Regime" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setRegime(option.value as any)}
              className={`py-2.5 px-4 rounded-xl text-sm font-medium transition ${
                regime === option.value
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput
            label="Annual Income"
            value={annualIncome}
            onChange={setAnnualIncome}
            min={100000}
            step={10000}
            prefix="₹"
          />
          <NumberInput
            label="Standard Deduction"
            value={standardDeduction}
            onChange={setStandardDeduction}
            min={0}
            max={75000}
            step={1000}
            prefix="₹"
          />
        </div>

        {regime === "old" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NumberInput
              label="Section 80C"
              value={deductions80C}
              onChange={setDeductions80C}
              min={0}
              max={150000}
              step={1000}
              prefix="₹"
            />
            <NumberInput
              label="Section 80D"
              value={deductions80D}
              onChange={setDeductions80D}
              min={0}
              max={25000}
              step={1000}
              prefix="₹"
            />
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-accent-600 p-6 text-white text-center">
              <p className="text-sm text-white/70">Tax Liability</p>
              <p className="text-3xl sm:text-4xl font-bold mt-1">
                {formatINR(result.tax)}
              </p>
              <p className="text-sm text-white/60 mt-1">
                Effective Rate: {result.effectiveRate}%
              </p>
            </div>

            <ResultGrid>
              <ResultCard
                label="Taxable Income"
                value={formatINR(result.taxableIncome)}
                icon="📊"
              />
              <ResultCard
                label="Tax Payable"
                value={formatINR(result.tax)}
                icon="🧾"
              />
              <ResultCard
                label="Effective Rate"
                value={`${result.effectiveRate}%`}
                icon="📈"
              />
            </ResultGrid>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
