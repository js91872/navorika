"use client";

import { useState, useMemo } from "react";
import { Calendar, TrendingUp, Wallet, CalendarDays, IndianRupee } from "lucide-react";

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

const currencySymbol = '₹';

interface PPFResult {
  totalInvestment: number;
  totalInterest: number;
  maturityAmount: number;
  yearByYear: {
    year: number;
    openingBalance: number;
    deposit: number;
    interest: number;
    closingBalance: number;
  }[];
}

export default function PPFCalculator() {
  const [annualDeposit, setAnnualDeposit] = useState<number>(150000);
  const [tenure, setTenure] = useState<number>(15);
  const [interestRate, setInterestRate] = useState<number>(7.1);
  const [showYearlyBreakdown, setShowYearlyBreakdown] = useState(false);

  const calculatePPF = (): PPFResult | null => {
    if (annualDeposit <= 0 || tenure <= 0 || interestRate <= 0) {
      return null;
    }

    const maxAnnualDeposit = 150000;
    const actualDeposit = Math.min(annualDeposit, maxAnnualDeposit);
    const monthlyRate = interestRate / 100 / 12;
    let balance = 0;
    let totalInvestment = 0;
    let totalInterest = 0;
    const yearByYear = [];

    for (let year = 1; year <= tenure; year++) {
      let openingBalance = balance;
      let yearlyDeposit = 0;
      let yearlyInterest = 0;

      for (let month = 1; month <= 12; month++) {
        const monthlyDeposit = actualDeposit / 12;
        balance += monthlyDeposit;
        yearlyDeposit += monthlyDeposit;
        
        const interest = balance * monthlyRate;
        balance += interest;
        yearlyInterest += interest;
      }

      totalInvestment += yearlyDeposit;
      totalInterest += yearlyInterest;

      yearByYear.push({
        year,
        openingBalance: Math.round(openingBalance),
        deposit: Math.round(yearlyDeposit),
        interest: Math.round(yearlyInterest),
        closingBalance: Math.round(balance),
      });

      if (actualDeposit < 500) {
        break;
      }
    }

    return {
      totalInvestment: Math.round(totalInvestment),
      totalInterest: Math.round(totalInterest),
      maturityAmount: Math.round(balance),
      yearByYear,
    };
  };

  const result = useMemo(() => calculatePPF(), [annualDeposit, tenure, interestRate]);

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="PPF Calculator"
        description="Calculate your Public Provident Fund maturity amount and interest."
        icon="🏦"
        accuracy="Accurate PPF calculations with monthly compounding"
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <NumberInput
            label="Annual Deposit (₹)"
            value={annualDeposit}
            onChange={setAnnualDeposit}
            min={500}
            max={150000}
            step={1000}
            prefix="₹"
          />
          <NumberInput
            label="Tenure (Years)"
            value={tenure}
            onChange={setTenure}
            min={15}
            max={50}
            step={1}
          />
          <NumberInput
            label="Interest Rate (%)"
            value={interestRate}
            onChange={setInterestRate}
            min={1}
            max={15}
            step={0.1}
            suffix="%"
          />
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-sm text-slate-600 dark:text-slate-400">
          <p className="font-medium text-slate-700 dark:text-slate-300 mb-2">💡 PPF Rules:</p>
          <ul className="list-disc pl-5 space-y-1">
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
              <p className="text-sm text-emerald-200">PPF Maturity Amount</p>
              <p className="text-4xl sm:text-5xl font-bold mt-2">
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

            <Button
              variant="outline"
              onClick={() => setShowYearlyBreakdown(!showYearlyBreakdown)}
              className="w-full"
            >
              {showYearlyBreakdown ? "Hide" : "Show"} Yearly Breakdown
            </Button>

            {showYearlyBreakdown && (
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-400">Year</th>
                      <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-400">Opening Balance</th>
                      <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-400">Deposit</th>
                      <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-400">Interest</th>
                      <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-400">Closing Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.yearByYear.map((row) => (
                      <tr key={row.year} className="border-t border-slate-100 dark:border-slate-700">
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{row.year}</td>
                        <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">{formatINR(row.openingBalance)}</td>
                        <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">{formatINR(row.deposit)}</td>
                        <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400">{formatINR(row.interest)}</td>
                        <td className="px-4 py-3 text-right font-medium text-slate-700 dark:text-slate-300">{formatINR(row.closingBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
