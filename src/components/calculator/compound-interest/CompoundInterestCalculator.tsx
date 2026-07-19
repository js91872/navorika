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

import { calculateCompoundInterest } from "@/lib/calculations/compound-interest";
import { formatCurrency } from "@/lib/format/currency";
import { compoundInterestConfig } from "@/config/calculators/compound-interest";

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(compoundInterestConfig.principal.default);
  const [interestRate, setInterestRate] = useState(compoundInterestConfig.rate.default);
  const [tenure, setTenure] = useState(compoundInterestConfig.tenure.default);
  const [frequency, setFrequency] = useState(compoundInterestConfig.frequency.default);
  const [monthlyContribution, setMonthlyContribution] = useState(compoundInterestConfig.contribution.default);
  const [contributionFrequency, setContributionFrequency] = useState(compoundInterestConfig.contributionFrequency.default);

  const result = useMemo(() => {
    return calculateCompoundInterest(
      principal,
      interestRate,
      tenure,
      frequency,
      monthlyContribution,
      contributionFrequency
    );
  }, [principal, interestRate, tenure, frequency, monthlyContribution, contributionFrequency]);

  const totalPrincipal = result.initialPrincipal + result.totalContributions;
  const totalInterest = result.interestEarned;

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="Compound Interest Calculator"
        description="Calculate the future value of your investment with compound interest and regular contributions."
      />

      <div className="grid gap-12 lg:grid-cols-[1fr_420px]">
        {/* LEFT PANEL - Inputs */}
        <div className="space-y-10">
          <div className="space-y-3">
            <NumberInput
              label="Initial Investment"
              value={principal}
              onChange={setPrincipal}
              prefix="₹"
              min={compoundInterestConfig.principal.min}
            />
            <Slider
              value={principal}
              min={compoundInterestConfig.principal.min}
              max={compoundInterestConfig.principal.max}
              step={compoundInterestConfig.principal.step}
              onChange={setPrincipal}
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
              min={compoundInterestConfig.rate.min}
              max={compoundInterestConfig.rate.max}
              step={compoundInterestConfig.rate.step}
              onChange={setInterestRate}
            />
          </div>

          <div className="space-y-3">
            <TenureInput
              label="Investment Tenure"
              value={tenure}
              onChange={setTenure}
              max={compoundInterestConfig.tenure.max}
            />
            <Slider
              value={tenure}
              min={compoundInterestConfig.tenure.min}
              max={compoundInterestConfig.tenure.max}
              step={compoundInterestConfig.tenure.step}
              onChange={setTenure}
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium">
              Compounding Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
            >
              {compoundInterestConfig.frequency.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <NumberInput
              label="Monthly Contribution"
              value={monthlyContribution}
              onChange={setMonthlyContribution}
              prefix="₹"
              min={compoundInterestConfig.contribution.min}
            />
            <Slider
              value={monthlyContribution}
              min={compoundInterestConfig.contribution.min}
              max={compoundInterestConfig.contribution.max}
              step={compoundInterestConfig.contribution.step}
              onChange={setMonthlyContribution}
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium">
              Contribution Frequency
            </label>
            <select
              value={contributionFrequency}
              onChange={(e) => setContributionFrequency(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
            >
              {compoundInterestConfig.contributionFrequency.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* RIGHT PANEL - Results */}
        <div className="space-y-6">
          <ResultGrid>
            <ResultCard
              label="Maturity Amount"
              value={formatCurrency(result.maturityAmount)}
              highlight
            />
            <ResultCard
              label="Initial Investment"
              value={formatCurrency(result.initialPrincipal)}
            />
            <ResultCard
              label="Total Interest"
              value={formatCurrency(result.interestEarned)}
            />
          </ResultGrid>

          {monthlyContribution > 0 && (
            <ResultGrid>
              <ResultCard
                label="Total Contributions"
                value={formatCurrency(result.totalContributions)}
              />
            </ResultGrid>
          )}

          <PieChart
            key={`${totalPrincipal}-${totalInterest}`}
            principal={totalPrincipal}
            interest={totalInterest}
          />

          <Summary
            principal={totalPrincipal}
            interest={totalInterest}
            total={result.maturityAmount}
            principalLabel="Invested Amount"
          />
        </div>
      </div>
    </CalculatorShell>
  );
}
