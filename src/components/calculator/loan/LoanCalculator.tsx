"use client";

import { useMemo, useState } from "react";

import CalculatorShell from "../CalculatorShell";
import CalculatorHeader from "../CalculatorHeader";
import NumberInput from "../NumberInput";
import PercentageInput from "../PercentageInput";
import TenureInput from "../TenureInput";
import Slider from "../Slider";
import ResultGrid from "../ResultGrid";
import ResultCard from "../ResultCard";
import PieChart from "../PieChart";
import Summary from "../Summary";

import { calculateLoan } from "@/lib/calculations/loan";
import { formatCurrency } from "@/lib/format/currency";
import { loanConfig } from "@/config/calculators/loan";

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(loanConfig.amount.default);
  const [interestRate, setInterestRate] = useState(loanConfig.rate.default);
  const [tenure, setTenure] = useState(loanConfig.tenure.default);
  const [loanType, setLoanType] = useState(loanConfig.loanType.default);

  const result = useMemo(() => {
    return calculateLoan({
      amount: loanAmount,
      annualRate: interestRate,
      years: tenure,
      loanType,
    });
  }, [loanAmount, interestRate, tenure, loanType]);

  const getLoanTypeInfo = (type: string) => {
    const map: Record<string, { emoji: string; color: string }> = {
      personal: { emoji: "💳", color: "text-purple-600" },
      home: { emoji: "🏠", color: "text-blue-600" },
      car: { emoji: "🚗", color: "text-green-600" },
      education: { emoji: "🎓", color: "text-orange-600" },
      business: { emoji: "💼", color: "text-red-600" },
    };
    return map[type] || { emoji: "💰", color: "text-slate-600" };
  };

  const loanTypeInfo = getLoanTypeInfo(loanType);

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="Loan Calculator"
        description="Calculate your monthly EMI, total interest, and repayment schedule for any type of loan."
      />

      <div className="grid gap-12 lg:grid-cols-[1fr_420px]">
        <div className="space-y-10">
          <div className="space-y-3">
            <label className="block text-sm font-medium">
              Loan Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {loanConfig.loanType.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setLoanType(option.value)}
                  className={`py-2 px-3 rounded-xl text-sm font-medium transition ${
                    loanType === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <NumberInput
              label="Loan Amount"
              value={loanAmount}
              onChange={setLoanAmount}
              prefix="₹"
              min={loanConfig.amount.min}
            />
            <Slider
              value={loanAmount}
              min={loanConfig.amount.min}
              max={loanConfig.amount.max}
              step={loanConfig.amount.step}
              onChange={setLoanAmount}
            />
          </div>

          <div className="space-y-3">
            <PercentageInput
              label="Interest Rate"
              value={interestRate}
              onChange={setInterestRate}
            />
            <Slider
              value={interestRate}
              min={loanConfig.rate.min}
              max={loanConfig.rate.max}
              step={loanConfig.rate.step}
              onChange={setInterestRate}
            />
          </div>

          <div className="space-y-3">
            <TenureInput
              label="Loan Tenure"
              value={tenure}
              onChange={setTenure}
              max={loanConfig.tenure.max}
            />
            <Slider
              value={tenure}
              min={loanConfig.tenure.min}
              max={loanConfig.tenure.max}
              step={loanConfig.tenure.step}
              onChange={setTenure}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 rounded-3xl border border-blue-200 p-6 shadow-sm">
            <div className="flex flex-col items-center">
              <p className="text-sm text-blue-600 font-medium flex items-center gap-2">
                <span>{loanTypeInfo.emoji}</span>
                Monthly EMI
                <span className={`text-xs ${loanTypeInfo.color}`}>
                  ({loanType.charAt(0).toUpperCase() + loanType.slice(1)} Loan)
                </span>
              </p>
              <p className="text-4xl font-bold text-blue-700 mt-2">
                {formatCurrency(result.monthlyEMI)}
              </p>
              <p className="text-xs text-blue-500 mt-1">
                {tenure} years • {interestRate}% p.a.
              </p>
            </div>
          </div>

          <ResultGrid>
            <ResultCard
              label="Total Payment"
              value={formatCurrency(result.totalPayment)}
            />
            <ResultCard
              label="Total Interest"
              value={formatCurrency(result.totalInterest)}
            />
            <ResultCard
              label="Principal Amount"
              value={formatCurrency(result.principal)}
            />
          </ResultGrid>

          <PieChart
            principal={result.principal}
            interest={result.totalInterest}
          />

          <Summary
            principal={result.principal}
            interest={result.totalInterest}
            total={result.totalPayment}
            principalLabel="Principal Amount"
            interestLabel="Total Interest"
            totalLabel="Total Payment"
          />
        </div>
      </div>
    </CalculatorShell>
  );
}
