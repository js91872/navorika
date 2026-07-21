"use client";

import { useState, useMemo } from "react";
import { IndianRupee, Calculator, TrendingUp, FileText } from "lucide-react";

import CalculatorShell from "../CalculatorShell";
import CalculatorHeader from "../CalculatorHeader";
import { Button } from "@/components/ui/Button";
import ResultGrid from "../ResultGrid";
import ResultCard from "../ResultCard";
import NumberInput from "../NumberInput";

// Force INR currency for India-specific tools
const formatINR = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

interface TaxResult {
  taxableIncome: number;
  taxUnderOldRegime: number;
  taxUnderNewRegime: number;
  savingsOldRegime: number;
  recommendedRegime: string;
  breakdown: {
    old: { slab: string; amount: number }[];
    new: { slab: string; amount: number }[];
  };
}

export default function IncomeTaxCalculator() {
  const [annualIncome, setAnnualIncome] = useState<number>(800000);
  const [deductions80C, setDeductions80C] = useState<number>(150000);
  const [deductions80D, setDeductions80D] = useState<number>(25000);
  const [hra, setHra] = useState<number>(0);
  const [nps, setNps] = useState<number>(0);
  const [standardDeduction, setStandardDeduction] = useState<number>(75000);

  const calculateTax = (income: number, regime: 'old' | 'new'): number => {
    let taxableIncome = income;
    let tax = 0;

    if (regime === 'old') {
      // Old regime deductions
      taxableIncome -= Math.min(deductions80C, 150000);
      taxableIncome -= Math.min(deductions80D, 25000);
      taxableIncome -= hra;
      taxableIncome -= Math.min(nps, 50000);
      taxableIncome -= standardDeduction;

      if (taxableIncome < 0) taxableIncome = 0;

      // Old regime slabs
      if (taxableIncome > 1000000) {
        tax += (taxableIncome - 1000000) * 0.30;
        taxableIncome = 1000000;
      }
      if (taxableIncome > 500000) {
        tax += (taxableIncome - 500000) * 0.20;
        taxableIncome = 500000;
      }
      if (taxableIncome > 250000) {
        tax += (taxableIncome - 250000) * 0.05;
      }
    } else {
      // New regime deductions (only standard deduction)
      taxableIncome -= standardDeduction;
      if (taxableIncome < 0) taxableIncome = 0;

      // New regime slabs (FY 2026-27)
      if (taxableIncome > 1500000) {
        tax += (taxableIncome - 1500000) * 0.30;
        taxableIncome = 1500000;
      }
      if (taxableIncome > 1200000) {
        tax += (taxableIncome - 1200000) * 0.20;
        taxableIncome = 1200000;
      }
      if (taxableIncome > 1000000) {
        tax += (taxableIncome - 1000000) * 0.15;
        taxableIncome = 1000000;
      }
      if (taxableIncome > 700000) {
        tax += (taxableIncome - 700000) * 0.10;
        taxableIncome = 700000;
      }
      if (taxableIncome > 300000) {
        tax += (taxableIncome - 300000) * 0.05;
      }
    }

    // Add 4% cess
    tax = tax * 1.04;
    return Math.round(tax);
  };

  const calculateResults = (): TaxResult | null => {
    if (annualIncome <= 0) return null;

    const taxOld = calculateTax(annualIncome, 'old');
    const taxNew = calculateTax(annualIncome, 'new');

    // Calculate taxable income for display
    let taxableIncomeOld = annualIncome;
    taxableIncomeOld -= Math.min(deductions80C, 150000);
    taxableIncomeOld -= Math.min(deductions80D, 25000);
    taxableIncomeOld -= hra;
    taxableIncomeOld -= Math.min(nps, 50000);
    taxableIncomeOld -= standardDeduction;
    if (taxableIncomeOld < 0) taxableIncomeOld = 0;

    let taxableIncomeNew = annualIncome - standardDeduction;
    if (taxableIncomeNew < 0) taxableIncomeNew = 0;

    const savings = taxOld - taxNew;
    const recommendedRegime = savings > 0 ? 'New Regime' : 'Old Regime';

    return {
      taxableIncome: Math.round(Math.min(taxableIncomeOld, taxableIncomeNew)),
      taxUnderOldRegime: taxOld,
      taxUnderNewRegime: taxNew,
      savingsOldRegime: Math.abs(savings),
      recommendedRegime: savings > 0 ? 'New Regime' : 'Old Regime',
      breakdown: {
        old: [],
        new: [],
      },
    };
  };

  const result = useMemo(() => calculateResults(), [
    annualIncome,
    deductions80C,
    deductions80D,
    hra,
    nps,
    standardDeduction,
  ]);

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="Income Tax Calculator"
        description="Calculate your income tax for FY 2026-27 under New or Old Tax Regime."
        icon="🧾"
        accuracy="Accurate tax calculations for FY 2026-27"
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <NumberInput
            label="Annual Income (₹)"
            value={annualIncome}
            onChange={setAnnualIncome}
            min={100000}
            step={10000}
            prefix="₹"
          />
          <NumberInput
            label="Standard Deduction (₹)"
            value={standardDeduction}
            onChange={setStandardDeduction}
            min={0}
            max={75000}
            step={1000}
            prefix="₹"
          />
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Deductions (Old Regime)</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <NumberInput label="Section 80C (₹)" value={deductions80C} onChange={setDeductions80C} min={0} max={150000} step={1000} prefix="₹" />
            <NumberInput label="Section 80D (₹)" value={deductions80D} onChange={setDeductions80D} min={0} max={25000} step={1000} prefix="₹" />
            <NumberInput label="HRA (₹)" value={hra} onChange={setHra} min={0} step={1000} prefix="₹" />
          </div>
          <div className="mt-4">
            <NumberInput label="NPS (₹)" value={nps} onChange={setNps} min={0} max={50000} step={1000} prefix="₹" />
          </div>
        </div>

        {result && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white text-center">
                <p className="text-sm text-blue-200">Old Regime Tax</p>
                <p className="text-3xl font-bold mt-2">{formatINR(result.taxUnderOldRegime)}</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white text-center">
                <p className="text-sm text-emerald-200">New Regime Tax</p>
                <p className="text-3xl font-bold mt-2">{formatINR(result.taxUnderNewRegime)}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-amber-600 to-orange-700 p-6 text-white text-center">
              <p className="text-sm text-amber-200">Recommended Regime</p>
              <p className="text-2xl font-bold mt-2">{result.recommendedRegime}</p>
              <p className="text-sm text-amber-200 mt-1">
                You can save {formatINR(result.savingsOldRegime)} with {result.recommendedRegime}
              </p>
            </div>

            <ResultGrid>
              <ResultCard
                label="Taxable Income"
                value={formatINR(result.taxableIncome)}
                icon="📊"
              />
              <ResultCard
                label="Tax Savings"
                value={formatINR(result.savingsOldRegime)}
                icon="💰"
              />
              <ResultCard
                label="Effective Tax Rate"
                value={`${Math.round((result.taxUnderNewRegime / annualIncome) * 100)}%`}
                icon="📈"
              />
            </ResultGrid>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
