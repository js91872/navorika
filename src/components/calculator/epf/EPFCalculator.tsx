"use client";

import { useState, useMemo } from "react";
import { Calendar, TrendingUp, Wallet, IndianRupee } from "lucide-react";

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

interface EPFResult {
  employeeShare: number;
  employerShare: number;
  totalContribution: number;
  interestEarned: number;
  maturityAmount: number;
  yearByYear: {
    year: number;
    openingBalance: number;
    employeeContribution: number;
    employerContribution: number;
    interest: number;
    closingBalance: number;
  }[];
}

export default function EPFCalculator() {
  const [monthlySalary, setMonthlySalary] = useState<number>(50000);
  const [employeeContributionRate, setEmployeeContributionRate] = useState<number>(12);
  const [employerContributionRate, setEmployerContributionRate] = useState<number>(3.67);
  const [interestRate, setInterestRate] = useState<number>(8.25);
  const [tenure, setTenure] = useState<number>(20);
  const [showYearlyBreakdown, setShowYearlyBreakdown] = useState(false);

  const calculateEPF = (): EPFResult | null => {
    if (monthlySalary <= 0 || tenure <= 0) return null;

    const monthlyEmployee = (monthlySalary * employeeContributionRate) / 100;
    const monthlyEmployer = (monthlySalary * employerContributionRate) / 100;
    const monthlyTotal = monthlyEmployee + monthlyEmployer;
    const monthlyRate = interestRate / 100 / 12;

    let balance = 0;
    let totalEmployee = 0;
    let totalEmployer = 0;
    let totalInterest = 0;
    const yearByYear = [];

    for (let year = 1; year <= tenure; year++) {
      let openingBalance = balance;
      let yearlyEmployee = 0;
      let yearlyEmployer = 0;
      let yearlyInterest = 0;

      for (let month = 1; month <= 12; month++) {
        // Interest is calculated on the opening balance + contributions
        const interest = balance * monthlyRate;
        balance += interest;
        yearlyInterest += interest;

        // Contributions at the end of month
        balance += monthlyEmployee;
        yearlyEmployee += monthlyEmployee;
        balance += monthlyEmployer;
        yearlyEmployer += monthlyEmployer;
      }

      totalEmployee += yearlyEmployee;
      totalEmployer += yearlyEmployer;
      totalInterest += yearlyInterest;

      yearByYear.push({
        year,
        openingBalance: Math.round(openingBalance),
        employeeContribution: Math.round(yearlyEmployee),
        employerContribution: Math.round(yearlyEmployer),
        interest: Math.round(yearlyInterest),
        closingBalance: Math.round(balance),
      });
    }

    return {
      employeeShare: Math.round(totalEmployee),
      employerShare: Math.round(totalEmployer),
      totalContribution: Math.round(totalEmployee + totalEmployer),
      interestEarned: Math.round(totalInterest),
      maturityAmount: Math.round(balance),
      yearByYear,
    };
  };

  const result = useMemo(() => calculateEPF(), [
    monthlySalary,
    employeeContributionRate,
    employerContributionRate,
    interestRate,
    tenure,
  ]);

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="EPF Calculator"
        description="Calculate your Employees' Provident Fund maturity amount and interest."
        icon="💰"
        accuracy="Accurate EPF calculations with monthly compounding"
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <NumberInput
            label="Monthly Salary (₹)"
            value={monthlySalary}
            onChange={setMonthlySalary}
            min={1000}
            step={1000}
            prefix="₹"
          />
          <NumberInput
            label="Employee Rate (%)"
            value={employeeContributionRate}
            onChange={setEmployeeContributionRate}
            min={0}
            max={15}
            step={0.1}
            suffix="%"
          />
          <NumberInput
            label="Employer Rate (%)"
            value={employerContributionRate}
            onChange={setEmployerContributionRate}
            min={0}
            max={15}
            step={0.01}
            suffix="%"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <NumberInput
            label="Interest Rate (%)"
            value={interestRate}
            onChange={setInterestRate}
            min={1}
            max={12}
            step={0.1}
            suffix="%"
          />
          <NumberInput
            label="Tenure (Years)"
            value={tenure}
            onChange={setTenure}
            min={1}
            max={40}
            step={1}
          />
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-sm text-slate-600 dark:text-slate-400">
          <p className="font-medium text-slate-700 dark:text-slate-300 mb-2">💡 EPF Rules:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Employee contribution: 12% of basic salary</li>
            <li>Employer contribution: 3.67% of basic salary (8.33% goes to pension)</li>
            <li>Interest is compounded monthly</li>
            <li>Tax-free returns on maturity</li>
          </ul>
        </div>

        {result && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white text-center">
              <p className="text-sm text-emerald-200">EPF Maturity Amount</p>
              <p className="text-4xl sm:text-5xl font-bold mt-2">
                {formatINR(result.maturityAmount)}
              </p>
            </div>

            <ResultGrid>
              <ResultCard
                label="Employee Share"
                value={formatINR(result.employeeShare)}
                icon="👤"
              />
              <ResultCard
                label="Employer Share"
                value={formatINR(result.employerShare)}
                icon="🏢"
              />
              <ResultCard
                label="Total Interest"
                value={formatINR(result.interestEarned)}
                icon="📈"
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
                      <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-400">Employee</th>
                      <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-400">Employer</th>
                      <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-400">Interest</th>
                      <th className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-400">Closing Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.yearByYear.map((row) => (
                      <tr key={row.year} className="border-t border-slate-100 dark:border-slate-700">
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{row.year}</td>
                        <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">{formatINR(row.openingBalance)}</td>
                        <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">{formatINR(row.employeeContribution)}</td>
                        <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">{formatINR(row.employerContribution)}</td>
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
