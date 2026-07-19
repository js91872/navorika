"use client";

import CalculatorShell from "../CalculatorShell";
import CalculatorHeader from "../CalculatorHeader";

export default function IncomeTaxCalculator() {
  return (
    <CalculatorShell>
      <CalculatorHeader
        title="Income Tax Calculator"
        description="Calculate your income tax under both the Old and New Tax Regime."
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-8">
        <h3 className="text-xl font-semibold">
          Income Tax Calculator
        </h3>

        <p className="mt-3 text-slate-600">
          The complete calculator inputs and tax calculation engine
          will be added in the next step.
        </p>
      </div>
    </CalculatorShell>
  );
}