"use client";

import { useState } from "react";
import { Calculator, TrendingUp, Receipt, IndianRupee } from "lucide-react";

import CalculatorShell from "../CalculatorShell";
import { Button } from "@/components/ui/Button";
import ResultCard from "../ResultCard";
import ResultGrid from "../ResultGrid";
import NumberInput from "../NumberInput";

export default function GSTCalculator() {
  const [amount, setAmount] = useState<number>(10000);
  const [rate, setRate] = useState<number>(18);
  const [type, setType] = useState<"exclusive" | "inclusive">("exclusive");

  const calculateGST = () => {
    const gstAmount = (amount * rate) / 100;
    const total = type === "exclusive" ? amount + gstAmount : amount;
    const baseAmount = type === "inclusive" ? amount / (1 + rate / 100) : amount;
    const calculatedGST = type === "inclusive" ? amount - baseAmount : gstAmount;

    return {
      baseAmount: Math.round(baseAmount),
      gstAmount: Math.round(calculatedGST),
      totalAmount: Math.round(total),
      rate,
    };
  };

  const result = calculateGST();

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
        {/* Type Selection */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: "exclusive", label: "Exclusive" },
            { value: "inclusive", label: "Inclusive" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setType(option.value as any)}
              className={`py-2.5 px-4 rounded-xl text-sm font-medium transition ${
                type === option.value
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Input Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput
            label={type === "exclusive" ? "Net Amount" : "Total Amount"}
            value={amount}
            onChange={setAmount}
            min={1}
            step={100}
            prefix="₹"
          />
          <NumberInput
            label="GST Rate"
            value={rate}
            onChange={setRate}
            min={0}
            max={40}
            step={0.5}
            suffix="%"
          />
        </div>

        {/* Calculate Button */}
        <Button onClick={() => {}} className="w-full sm:w-auto">
          <Calculator className="mr-2 h-4 w-4" />
          Calculate GST
        </Button>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-accent-600 p-6 text-white text-center">
              <p className="text-sm text-white/70">GST Amount</p>
              <p className="text-3xl sm:text-4xl font-bold mt-1">
                {formatCurrency(result.gstAmount)}
              </p>
            </div>

            <ResultGrid>
              <ResultCard
                label="Base Amount"
                value={formatCurrency(result.baseAmount)}
                icon="💰"
              />
              <ResultCard
                label="GST Amount"
                value={formatCurrency(result.gstAmount)}
                icon="📈"
              />
              <ResultCard
                label="Total Amount"
                value={formatCurrency(result.totalAmount)}
                icon="🧾"
              />
            </ResultGrid>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
