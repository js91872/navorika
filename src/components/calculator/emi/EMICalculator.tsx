"use client";

import { useState } from "react";
import { Calculator, TrendingUp, Wallet, Calendar, IndianRupee } from "lucide-react";

import CalculatorShell from "../CalculatorShell";
import { Button } from "@/components/ui/Button";
import ResultCard from "../ResultCard";
import ResultGrid from "../ResultGrid";
import NumberInput from "../NumberInput";

interface EMIResult {
  emi: number;
  totalInterest: number;
  totalAmount: number;
  principal: number;
  interestPercentage: number;
  principalPercentage: number;
}

export default function EMICalculator() {
  const [principal, setPrincipal] = useState<number>(1000000);
  const [rate, setRate] = useState<number>(8.5);
  const [tenure, setTenure] = useState<number>(20);

  const calculateEMI = (): EMIResult | null => {
    if (principal <= 0 || rate <= 0 || tenure <= 0) {
      return null;
    }

    const monthlyRate = rate / 100 / 12;
    const months = tenure * 12;
    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalAmount = emi * months;
    const totalInterest = totalAmount - principal;

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalAmount: Math.round(totalAmount),
      principal: Math.round(principal),
      interestPercentage: Math.round((totalInterest / totalAmount) * 100),
      principalPercentage: Math.round((principal / totalAmount) * 100),
    };
  };

  const result = calculateEMI();

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
        {/* Input Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <NumberInput
            label="Principal Amount"
            value={principal}
            onChange={setPrincipal}
            min={1000}
            step={10000}
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
            max={30}
            step={1}
            suffix="Years"
          />
        </div>

        {/* Calculate Button */}
        <Button onClick={() => {}} className="w-full sm:w-auto">
          <Calculator className="mr-2 h-4 w-4" />
          Calculate EMI
        </Button>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-accent-600 p-6 text-white text-center">
              <p className="text-sm text-white/70">Monthly EMI</p>
              <p className="text-3xl sm:text-4xl font-bold mt-1">
                {formatCurrency(result.emi)}
              </p>
            </div>

            <ResultGrid>
              <ResultCard
                label="Total Repayment"
                value={formatCurrency(result.totalAmount)}
                icon="💰"
              />
              <ResultCard
                label="Total Interest"
                value={formatCurrency(result.totalInterest)}
                icon="📈"
              />
              <ResultCard
                label="Tenure"
                value={`${tenure} Years`}
                icon="📅"
              />
            </ResultGrid>

            {/* Breakdown */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">📊 Payment Breakdown</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Principal</span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {result.principalPercentage}%
                    </span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${result.principalPercentage}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Interest</span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {result.interestPercentage}%
                    </span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-brand-500"
                      style={{ width: `${result.interestPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
