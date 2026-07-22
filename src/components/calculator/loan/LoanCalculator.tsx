"use client";

import { useState, useMemo } from "react";
import { Calculator, TrendingUp, Wallet, Calendar, IndianRupee } from "lucide-react";

import CalculatorShell from "../CalculatorShell";
import { Button } from "@/components/ui/Button";
import ResultGrid from "../ResultGrid";
import ResultCard from "../ResultCard";
import NumberInput from "../NumberInput";

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState<number>(1000000);
  const [rate, setRate] = useState<number>(8.5);
  const [tenure, setTenure] = useState<number>(20);

  const result = useMemo(() => {
    if (principal <= 0 || rate <= 0 || tenure <= 0) return null;

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
    };
  }, [principal, rate, tenure]);

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
            label="Loan Amount"
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
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
