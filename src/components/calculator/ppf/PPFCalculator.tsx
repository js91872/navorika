"use client";

import { useState, useMemo } from "react";
import { Calendar, TrendingUp, Wallet, IndianRupee } from "lucide-react";

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

export default function PPFCalculator() {
  const [annualDeposit, setAnnualDeposit] = useState<number>(150000);
  const [tenure, setTenure] = useState<number>(15);
  const [interestRate, setInterestRate] = useState<number>(7.1);

  const result = useMemo(() => {
    if (annualDeposit <= 0 || tenure <= 0 || interestRate <= 0) return null;

    const maxAnnualDeposit = 150000;
    const actualDeposit = Math.min(annualDeposit, maxAnnualDeposit);
    const monthlyRate = interestRate / 100 / 12;
    let balance = 0;
    let totalInvestment = 0;
    let totalInterest = 0;

    for (let year = 1; year <= tenure; year++) {
      for (let month = 1; month <= 12; month++) {
        const monthlyDeposit = actualDeposit / 12;
        balance += monthlyDeposit;
        totalInvestment += monthlyDeposit;
        
        const interest = balance * monthlyRate;
        balance += interest;
        totalInterest += interest;
      }
    }

    return {
      totalInvestment: Math.round(totalInvestment),
      totalInterest: Math.round(totalInterest),
      maturityAmount: Math.round(balance),
    };
  }, [annualDeposit, tenure, interestRate]);

  return (
    <CalculatorShell>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <NumberInput
            label="Annual Deposit"
            value={annualDeposit}
            onChange={setAnnualDeposit}
            min={500}
            max={150000}
            step={1000}
            prefix="₹"
          />
          <NumberInput
            label="Tenure"
            value={tenure}
            onChange={setTenure}
            min={15}
            max={50}
            step={1}
            suffix="Years"
          />
          <NumberInput
            label="Interest Rate"
            value={interestRate}
            onChange={setInterestRate}
            min={1}
            max={15}
            step={0.1}
            suffix="%"
          />
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-sm text-slate-600 dark:text-slate-400">
          <p className="font-medium text-slate-700 dark:text-slate-300">💡 PPF Rules:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Minimum annual deposit: ₹500</li>
            <li>Maximum annual deposit: ₹1,50,000</li>
            <li>Minimum tenure: 15 years</li>
            <li>Interest is compounded monthly</li>
            <li>Tax-free returns under Section 80C</li>
          </ul>
        </div>

        {result && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white text-center">
              <p className="text-sm text-white/70">PPF Maturity Amount</p>
              <p className="text-3xl sm:text-4xl font-bold mt-1">
                {formatINR(result.maturityAmount)}
              </p>
            </div>

            <ResultGrid>
              <ResultCard
                label="Total Investment"
                value={formatINR(result.totalInvestment)}
                icon="💰"
              />
              <ResultCard
                label="Total Interest Earned"
                value={formatINR(result.totalInterest)}
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
