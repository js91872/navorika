"use client";

import { useMemo, useState } from "react";
import { TrendingUp, TrendingDown, Calendar, DollarSign, PieChart as PieChartIcon } from "lucide-react";

import CalculatorShell from "../CalculatorShell";
import CalculatorHeader from "../CalculatorHeader";
import NumberInput from "../NumberInput";
import PercentageInput from "../PercentageInput";
import Slider from "../Slider";
import ResultGrid from "../ResultGrid";
import ResultCard from "../ResultCard";
import Summary from "../Summary";
import PieChart from "../PieChart";

import { calculateROI } from "@/lib/calculations/roi";
import { formatCurrency, formatNumber } from "@/lib/format/currency";
import { roiConfig } from "@/config/calculators/roi";

export default function ROICalculator() {
  const [initialInvestment, setInitialInvestment] = useState(roiConfig.initialInvestment.default);
  const [finalValue, setFinalValue] = useState(roiConfig.finalValue.default);
  const [timePeriod, setTimePeriod] = useState(roiConfig.timePeriod.default);
  const [additionalContributions, setAdditionalContributions] = useState(roiConfig.additionalContributions.default);
  const [contributionFrequency, setContributionFrequency] = useState(roiConfig.contributionFrequency.default);
  const [calculationMethod, setCalculationMethod] = useState(roiConfig.calculationMethod.default);

  const result = useMemo(() => {
    return calculateROI({
      initialInvestment,
      finalValue,
      timePeriod,
      additionalContributions,
      contributionFrequency: contributionFrequency as 'yearly' | 'monthly' | 'quarterly',
      calculationMethod: calculationMethod as 'simple' | 'annualized' | 'contributions',
    });
  }, [initialInvestment, finalValue, timePeriod, additionalContributions, contributionFrequency, calculationMethod]);

  const isPositive = result.totalReturn >= 0;

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="ROI Calculator"
        description="Calculate return on investment, annualized returns, and measure investment performance."
        icon="📈"
        accuracy="Accurate as per standard financial formulas"
      />

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          {/* LEFT PANEL - Inputs */}
          <div className="space-y-4 sm:space-y-6">
            {/* Calculation Method */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Calculation Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                {roiConfig.calculationMethod.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setCalculationMethod(option.value)}
                    className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-medium transition ${
                      calculationMethod === option.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Initial Investment */}
            <div className="space-y-2">
              <NumberInput
                label="Initial Investment"
                value={initialInvestment}
                onChange={setInitialInvestment}
                prefix="₹"
                min={roiConfig.initialInvestment.min}
              />
              <Slider
                value={initialInvestment}
                min={roiConfig.initialInvestment.min}
                max={roiConfig.initialInvestment.max}
                step={roiConfig.initialInvestment.step}
                onChange={setInitialInvestment}
              />
            </div>

            {/* Final Value */}
            <div className="space-y-2">
              <NumberInput
                label="Final Value"
                value={finalValue}
                onChange={setFinalValue}
                prefix="₹"
                min={roiConfig.finalValue.min}
              />
              <Slider
                value={finalValue}
                min={roiConfig.finalValue.min}
                max={roiConfig.finalValue.max}
                step={roiConfig.finalValue.step}
                onChange={setFinalValue}
              />
            </div>

            {/* Time Period */}
            <div className="space-y-2">
              <NumberInput
                label="Time Period"
                value={timePeriod}
                onChange={setTimePeriod}
                suffix="Years"
                min={roiConfig.timePeriod.min}
                max={roiConfig.timePeriod.max}
              />
              <Slider
                value={timePeriod}
                min={roiConfig.timePeriod.min}
                max={roiConfig.timePeriod.max}
                step={roiConfig.timePeriod.step}
                onChange={setTimePeriod}
              />
            </div>

            {/* Additional Contributions (only for contributions method) */}
            {calculationMethod === 'contributions' && (
              <div className="space-y-4 border-t border-slate-200 pt-4">
                <div className="space-y-2">
                  <NumberInput
                    label="Additional Contributions"
                    value={additionalContributions}
                    onChange={setAdditionalContributions}
                    prefix="₹"
                    min={roiConfig.additionalContributions.min}
                  />
                  <Slider
                    value={additionalContributions}
                    min={roiConfig.additionalContributions.min}
                    max={roiConfig.additionalContributions.max}
                    step={roiConfig.additionalContributions.step}
                    onChange={setAdditionalContributions}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Contribution Frequency
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {roiConfig.contributionFrequency.options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setContributionFrequency(option.value)}
                        className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-medium transition ${
                          contributionFrequency === option.value
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT PANEL - Results */}
          <div className="space-y-4 sm:space-y-6">
            {/* ROI Summary Card */}
            <div className={`rounded-2xl p-4 sm:p-6 text-white ${
              isPositive ? 'bg-gradient-to-br from-green-600 to-green-700' : 'bg-gradient-to-br from-red-600 to-red-700'
            }`}>
              <p className="text-sm text-white/80">Total Return</p>
              <p className="text-3xl sm:text-4xl font-bold mt-1">
                {isPositive ? '+' : ''}{formatCurrency(result.totalReturn)}
              </p>
              <div className="flex items-center gap-2 mt-2 text-sm text-white/80">
                <span>{isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}</span>
                <span>{result.totalReturnPercentage.toFixed(2)}% total ROI</span>
                {result.annualizedReturn !== 0 && (
                  <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    {result.annualizedReturn.toFixed(2)}% annualized
                  </span>
                )}
              </div>
            </div>

            <ResultGrid>
              <ResultCard
                label="Net Profit"
                value={formatCurrency(result.netProfit)}
                subtitle={isPositive ? '✅ Positive return' : '⚠️ Negative return'}
              />
              <ResultCard
                label="Total Return %"
                value={`${result.totalReturnPercentage.toFixed(2)}%`}
              />
              {result.annualizedReturn !== 0 && (
                <ResultCard
                  label="Annualized Return"
                  value={`${result.annualizedReturn.toFixed(2)}%`}
                  subtitle={`Over ${timePeriod} years`}
                />
              )}
            </ResultGrid>

            {calculationMethod === 'contributions' && result.totalContributions > 0 && (
              <ResultGrid>
                <ResultCard
                  label="Total Contributions"
                  value={formatCurrency(result.totalContributions)}
                />
                <ResultCard
                  label="Total Invested"
                  value={formatCurrency(initialInvestment + result.totalContributions)}
                />
              </ResultGrid>
            )}

            {/* Pie Chart */}
            {calculationMethod === 'contributions' && result.totalContributions > 0 && (
              <PieChart
                principal={initialInvestment + result.totalContributions - result.totalReturn}
                interest={result.totalReturn}
              />
            )}

            <Summary
              principal={result.breakdown.initialInvestment}
              interest={result.breakdown.netProfit > 0 ? result.breakdown.netProfit : 0}
              total={result.breakdown.finalValue}
              principalLabel="Initial Investment"
              interestLabel="Profit"
              totalLabel="Final Value"
            />

            {/* Yearly Breakdown (for contributions method) */}
            {calculationMethod === 'contributions' && result.yearlyBreakdown && result.yearlyBreakdown.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">
                  Yearly Breakdown
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 font-medium text-slate-500">Year</th>
                        <th className="text-right py-2 font-medium text-slate-500">Start Value</th>
                        <th className="text-right py-2 font-medium text-slate-500">Contributions</th>
                        <th className="text-right py-2 font-medium text-slate-500">Growth</th>
                        <th className="text-right py-2 font-medium text-slate-500">End Value</th>
                        <th className="text-right py-2 font-medium text-slate-500">ROI %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.yearlyBreakdown.map((item) => (
                        <tr key={item.year} className="border-b border-slate-100">
                          <td className="py-2 font-medium">{item.year}</td>
                          <td className="text-right py-2">{formatCurrency(item.startValue)}</td>
                          <td className="text-right py-2">{formatCurrency(item.contributions)}</td>
                          <td className={`text-right py-2 ${item.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {item.growth >= 0 ? '+' : ''}{formatCurrency(item.growth)}
                          </td>
                          <td className="text-right py-2 font-medium">{formatCurrency(item.endValue)}</td>
                          <td className={`text-right py-2 ${item.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {item.roi.toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
