"use client";

import { useState } from "react";
import { Percent, Calculator, ArrowRight } from "lucide-react";

import CalculatorShell from "../CalculatorShell";
import CalculatorHeader from "../CalculatorHeader";
import NumberInput from "../NumberInput";
import { Button } from "@/components/ui/Button";
import ResultCard from "../ResultCard";
import ResultGrid from "../ResultGrid";

export default function PercentageCalculator() {
  const [mode, setMode] = useState<"percentage" | "change" | "of">("percentage");
  const [value, setValue] = useState<number>(100);
  const [percentage, setPercentage] = useState<number>(10);
  const [base, setBase] = useState<number>(200);
  const [result, setResult] = useState<{
    label: string;
    value: string;
    formula: string;
  } | null>(null);

  const calculate = () => {
    let resultValue = 0;
    let label = "";
    let formula = "";

    switch (mode) {
      case "percentage": {
        // What is X% of Y?
        resultValue = (percentage / 100) * base;
        label = `${percentage}% of ${base} is`;
        formula = `${percentage}% × ${base} = ${resultValue}`;
        break;
      }
      case "change": {
        // What is the percentage change from X to Y?
        const change = value - base;
        resultValue = (change / Math.abs(base)) * 100;
        label = `Percentage change from ${base} to ${value}`;
        formula = `${value} - ${base} / ${Math.abs(base)} × 100 = ${resultValue.toFixed(2)}%`;
        break;
      }
      case "of": {
        // X is what percentage of Y?
        resultValue = (value / base) * 100;
        label = `${value} is what percentage of ${base}`;
        formula = `${value} / ${base} × 100 = ${resultValue.toFixed(2)}%`;
        break;
      }
    }

    setResult({
      label,
      value: resultValue.toFixed(2),
      formula,
    });
  };

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="Percentage Calculator"
        description="Calculate percentages, percentage changes, and more."
        icon="%"
        accuracy="Accurate percentage calculations"
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Mode Selection */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Mode</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "percentage", label: "X% of Y", icon: "🔢" },
              { value: "change", label: "Change %", icon: "📈" },
              { value: "of", label: "X is % of Y", icon: "📊" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setMode(option.value as any)}
                className={`py-2 px-4 rounded-xl text-sm font-medium transition ${
                  mode === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span className="mr-1">{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {mode === "percentage" && (
            <>
              <NumberInput
                label="Percentage"
                value={percentage}
                onChange={setPercentage}
                suffix="%"
              />
              <NumberInput
                label="of"
                value={base}
                onChange={setBase}
                prefix=""
              />
            </>
          )}

          {mode === "change" && (
            <>
              <NumberInput
                label="Original Value"
                value={base}
                onChange={setBase}
                prefix=""
              />
              <NumberInput
                label="New Value"
                value={value}
                onChange={setValue}
                prefix=""
              />
            </>
          )}

          {mode === "of" && (
            <>
              <NumberInput
                label="Value X"
                value={value}
                onChange={setValue}
                prefix=""
              />
              <NumberInput
                label="Value Y"
                value={base}
                onChange={setBase}
                prefix=""
              />
            </>
          )}

          <Button onClick={calculate} className="w-full">
            <Calculator className="mr-2 h-4 w-4" />
            Calculate
          </Button>

          {result && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white text-center">
                <p className="text-sm text-blue-200">{result.label}</p>
                <p className="text-4xl font-bold mt-1">{result.value}</p>
                <p className="text-xs text-blue-200 mt-2">{result.formula}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
