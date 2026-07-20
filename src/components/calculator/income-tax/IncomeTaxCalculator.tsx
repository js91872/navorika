"use client";

import { useMemo, useState } from "react";

import CalculatorShell from "../CalculatorShell";
import CalculatorHeader from "../CalculatorHeader";
import NumberInput from "../NumberInput";
import Slider from "../Slider";
import ResultGrid from "../ResultGrid";
import ResultCard from "../ResultCard";
import Summary from "../Summary";

import { calculateIncomeTax } from "@/lib/calculations/income-tax";
import { formatCurrency } from "@/lib/format/currency";
import { incomeTaxConfig } from "@/config/calculators/income-tax";

export default function IncomeTaxCalculator() {
  const [income, setIncome] = useState(incomeTaxConfig.income.default);
  const [regime, setRegime] = useState(incomeTaxConfig.regime.default);
  const [hra, setHra] = useState(incomeTaxConfig.hra.default);
  const [section80c, setSection80c] = useState(incomeTaxConfig.section80c.default);
  const [section80d, setSection80d] = useState(incomeTaxConfig.section80d.default);
  const [nps, setNps] = useState(incomeTaxConfig.nps.default);
  const [standardDeduction, setStandardDeduction] = useState(
    incomeTaxConfig.standardDeduction.default
  );

  const result = useMemo(() => {
    return calculateIncomeTax(
      income,
      regime,
      hra,
      section80c,
      section80d,
      nps,
      standardDeduction
    );
  }, [income, regime, hra, section80c, section80d, nps, standardDeduction]);

  const isNewRegime = regime === 'new';

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="Income Tax Calculator (India)"
        description="Calculate your income tax for FY 2026-27 under New or Old Tax Regime."
        accuracy="Accurate as per Income-tax Rules, 2026"
        updatedOn="July 2026"
      />

      <div className="grid gap-12 lg:grid-cols-[1fr_420px]">
        {/* LEFT PANEL - Inputs */}
        <div className="space-y-10">
          {/* FY 2026-27 Notice */}
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 text-sm text-blue-700">
            <span className="font-medium">📅 FY 2026-27 (AY 2027-28)</span>
            <p className="mt-1">
              This calculator uses the latest tax slabs and rules from the Income-tax Rules, 2026.
              {isNewRegime ? (
                <span className="block mt-1 text-xs">
                  ✅ New Tax Regime: 0% up to ₹3L | 5% up to ₹7L | 10% up to ₹10L | 15% up to ₹12L | 20% up to ₹15L | 30% above ₹15L
                </span>
              ) : (
                <span className="block mt-1 text-xs">
                  ✅ Old Tax Regime: 0% up to ₹2.5L | 5% up to ₹5L | 20% up to ₹10L | 30% above ₹10L
                </span>
              )}
            </p>
          </div>

          {/* Tax Regime Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">
              Tax Regime
            </label>
            <div className="grid grid-cols-2 gap-3">
              {incomeTaxConfig.regime.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setRegime(option.value)}
                  className={`py-2 px-4 rounded-xl text-sm font-medium transition ${
                    regime === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {option.label}
                  {option.value === 'new' && (
                    <span className="block text-xs opacity-75">(Default)</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Annual Income */}
          <div className="space-y-3">
            <NumberInput
              label="Annual Income"
              value={income}
              onChange={setIncome}
              prefix="₹"
              min={incomeTaxConfig.income.min}
            />
            <Slider
              value={income}
              min={incomeTaxConfig.income.min}
              max={incomeTaxConfig.income.max}
              step={incomeTaxConfig.income.step}
              onChange={setIncome}
            />
          </div>

          {/* Standard Deduction */}
          <div className="space-y-3 border-t border-slate-200 pt-6">
            <h3 className="text-sm font-semibold text-slate-700">
              Standard Deduction
              <span className="block text-xs font-normal text-slate-500">
                {isNewRegime 
                  ? "₹75,000 allowed in New Tax Regime as per Rules, 2026"
                  : "₹50,000 allowed in Old Tax Regime"
                }
              </span>
            </h3>
            <NumberInput
              label="Standard Deduction"
              value={standardDeduction}
              onChange={setStandardDeduction}
              prefix="₹"
              min={incomeTaxConfig.standardDeduction.min}
              max={isNewRegime ? 75000 : 50000}
            />
            <Slider
              value={standardDeduction}
              min={incomeTaxConfig.standardDeduction.min}
              max={isNewRegime ? 75000 : 50000}
              step={incomeTaxConfig.standardDeduction.step}
              onChange={setStandardDeduction}
            />
          </div>

          {/* Deductions (Only for Old Regime) */}
          {!isNewRegime && (
            <div className="space-y-4 border-t border-slate-200 pt-6">
              <h3 className="text-sm font-semibold text-slate-700">
                Deductions (Section 80C, 80D, NPS, HRA)
              </h3>

              <div className="space-y-3">
                <NumberInput
                  label="HRA Exemption"
                  value={hra}
                  onChange={setHra}
                  prefix="₹"
                  min={incomeTaxConfig.hra.min}
                />
                <Slider
                  value={hra}
                  min={incomeTaxConfig.hra.min}
                  max={incomeTaxConfig.hra.max}
                  step={incomeTaxConfig.hra.step}
                  onChange={setHra}
                />
              </div>

              <div className="space-y-3">
                <NumberInput
                  label="Section 80C (PPF, ELSS, etc.)"
                  value={section80c}
                  onChange={setSection80c}
                  prefix="₹"
                  min={incomeTaxConfig.section80c.min}
                />
                <Slider
                  value={section80c}
                  min={incomeTaxConfig.section80c.min}
                  max={incomeTaxConfig.section80c.max}
                  step={incomeTaxConfig.section80c.step}
                  onChange={setSection80c}
                />
              </div>

              <div className="space-y-3">
                <NumberInput
                  label="Section 80D (Health Insurance)"
                  value={section80d}
                  onChange={setSection80d}
                  prefix="₹"
                  min={incomeTaxConfig.section80d.min}
                />
                <Slider
                  value={section80d}
                  min={incomeTaxConfig.section80d.min}
                  max={incomeTaxConfig.section80d.max}
                  step={incomeTaxConfig.section80d.step}
                  onChange={setSection80d}
                />
              </div>

              <div className="space-y-3">
                <NumberInput
                  label="NPS Contribution"
                  value={nps}
                  onChange={setNps}
                  prefix="₹"
                  min={incomeTaxConfig.nps.min}
                />
                <Slider
                  value={nps}
                  min={incomeTaxConfig.nps.min}
                  max={incomeTaxConfig.nps.max}
                  step={incomeTaxConfig.nps.step}
                  onChange={setNps}
                />
              </div>
            </div>
          )}

          {isNewRegime && (
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-600">
              <span className="font-medium">ℹ️ Note:</span> In the New Tax Regime, only Standard Deduction is allowed. Other deductions (80C, 80D, HRA, NPS) are not available.
            </div>
          )}
        </div>

        {/* RIGHT PANEL - Results */}
        <div className="space-y-6">
          {/* Tax Amount - Highlighted as primary result */}
          <div className="bg-blue-50 rounded-3xl border border-blue-200 p-6 shadow-sm">
            <div className="flex flex-col items-center">
              <p className="text-sm text-blue-600 font-medium">Your Tax Liability</p>
              <p className="text-4xl font-bold text-blue-700 mt-2">
                {formatCurrency(result.totalTax)}
              </p>
              <div className="flex gap-4 mt-3 text-sm text-blue-600">
                <span>Tax Rate: {result.effectiveTaxRate.toFixed(1)}%</span>
                {result.rebateApplied > 0 && (
                  <span className="text-green-600">🎉 Rebate: {formatCurrency(result.rebateApplied)}</span>
                )}
              </div>
            </div>
          </div>

          <ResultGrid>
            <ResultCard
              label="Total Income"
              value={formatCurrency(result.totalIncome)}
            />
            <ResultCard
              label="Total Deductions"
              value={formatCurrency(result.totalDeductions)}
            />
            <ResultCard
              label="Taxable Income"
              value={formatCurrency(result.taxableIncome)}
            />
          </ResultGrid>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-slate-700">
              Tax Breakdown
            </h3>
            <div className="space-y-2 text-sm">
              {result.taxBreakdown.map((item, index) => (
                <div key={index} className="flex justify-between border-b border-slate-100 py-1">
                  <span className="text-slate-600">{item.slab}</span>
                  <span className="font-medium text-slate-800">
                    {formatCurrency(item.tax)}
                  </span>
                </div>
              ))}
              {result.rebateApplied > 0 && (
                <div className="flex justify-between border-b border-slate-100 py-1 text-green-600">
                  <span>Rebate u/s 87A</span>
                  <span>-{formatCurrency(result.rebateApplied)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 font-medium">
                <span>Health & Education Cess (4%)</span>
                <span>{formatCurrency(result.healthAndEducationCess)}</span>
              </div>
            </div>
          </div>

          <Summary
            principal={result.totalIncome}
            interest={result.totalDeductions}
            total={result.taxableIncome}
            principalLabel="Total Income"
            interestLabel="Total Deductions"
            totalLabel="Taxable Income"
          />
        </div>
      </div>
    </CalculatorShell>
  );
}
