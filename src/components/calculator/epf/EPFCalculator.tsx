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

export default function EPFCalculator() {
  const [monthlySalary, setMonthlySalary] = useState<number>(50000);
  const [employeeRate, setEmployeeRate] = useState<number>(12);
  const [employerRate, setEmployerRate] = useState<number>(3.67);
  const [interestRate, setInterestRate] = useState<number>(8.25);
  const [tenure, setTenure] = useState<number>(20);

  const result = useMemo(() => {
    if (monthlySalary <= 0 || tenure <= 0) return null;

    const monthlyEmployee = (monthlySalary * employeeRate) / 100;
    const monthlyEmployer = (monthlySalary * employerRate) / 100;
    const monthlyTotal = monthlyEmployee + monthlyEmployer;
    const monthlyRate = interestRate / 100 / 12;

    let balance = 0;
    let totalEmployee = 0;
    let totalEmployer = 0;
    let totalInterest = 0;

    for (let year = 1; year <= tenure; year++) {
      for (let month = 1; month <= 12; month++) {
        const interest = balance * monthlyRate;
        balance += interest;
        totalInterest += interest;

        balance += monthlyEmployee;
        totalEmployee += monthlyEmployee;
        balance += monthlyEmployer;
        totalEmployer += monthlyEmployer;
      }
    }

    return {
      employeeShare: Math.round(totalEmployee),
      employerShare: Math.round(totalEmployer),
      totalContribution: Math.round(totalEmployee + totalEmployer),
      interestEarned: Math.round(totalInterest),
      maturityAmount: Math.round(balance),
    };
  }, [monthlySalary, employeeRate, employerRate, interestRate, tenure]);

  return (
    <CalculatorShell>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <NumberInput
            label="Monthly Salary"
            value={monthlySalary}
            onChange={setMonthlySalary}
            min={1000}
            step={1000}
            prefix="₹"
          />
          <NumberInput
            label="Employee Rate"
            value={employeeRate}
            onChange={setEmployeeRate}
            min={0}
            max={15}
            step={0.1}
            suffix="%"
          />
          <NumberInput
            label="Employer Rate"
            value={employerRate}
            onChange={setEmployerRate}
            min={0}
            max={15}
            step={0.01}
            suffix="%"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput
            label="Interest Rate"
            value={interestRate}
            onChange={setInterestRate}
            min={1}
            max={12}
            step={0.1}
            suffix="%"
          />
          <NumberInput
            label="Tenure"
            value={tenure}
            onChange={setTenure}
            min={1}
            max={40}
            step={1}
            suffix="Years"
          />
        </div>

        {result && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white text-center">
              <p className="text-sm text-white/70">EPF Maturity Amount</p>
              <p className="text-3xl sm:text-4xl font-bold mt-1">
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
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
