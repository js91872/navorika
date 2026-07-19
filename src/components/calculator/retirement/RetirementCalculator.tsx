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

import { retirementConfig } from "@/config/calculators/retirement";
import { calculateRetirement } from "@/lib/calculations/retirement";
import { formatCurrency } from "@/lib/format/currency";

export default function RetirementCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(
    retirementConfig.monthlyInvestment.default
  );

  const [annualReturn, setAnnualReturn] = useState(
    retirementConfig.annualReturn.default
  );

  const [tenure, setTenure] = useState(
    retirementConfig.tenure.default
  );

  const result = useMemo(() => {
    return calculateRetirement(
      monthlyInvestment,
      annualReturn,
      tenure
    );
  }, [
    monthlyInvestment,
    annualReturn,
    tenure,
  ]);

  return (
    <CalculatorShell>

      <CalculatorHeader
        title="Retirement Calculator"
        description="Estimate your retirement corpus based on your monthly investments and expected annual returns."
      />

      <div className="grid gap-12 lg:grid-cols-[1fr_420px]">

        {/* LEFT PANEL */}

        <div className="space-y-10">

          <div className="space-y-3">

            <NumberInput
              label="Monthly Investment"
              value={monthlyInvestment}
              onChange={setMonthlyInvestment}
              prefix="₹"
              min={retirementConfig.monthlyInvestment.min}
            />

            <Slider
              value={monthlyInvestment}
              min={retirementConfig.monthlyInvestment.min}
              max={retirementConfig.monthlyInvestment.max}
              step={retirementConfig.monthlyInvestment.step}
              onChange={setMonthlyInvestment}
            />

          </div>

          <div className="space-y-3">

            <PercentageInput
              label="Expected Annual Return"
              value={annualReturn}
              onChange={setAnnualReturn}
            />

            <Slider
              value={annualReturn}
              min={retirementConfig.annualReturn.min}
              max={retirementConfig.annualReturn.max}
              step={retirementConfig.annualReturn.step}
              onChange={setAnnualReturn}
            />

          </div>

          <div className="space-y-3">

            <TenureInput
              label="Investment Period"
              value={tenure}
              onChange={setTenure}
              max={50}
            />

            <Slider
              value={tenure}
              min={retirementConfig.tenure.min}
              max={retirementConfig.tenure.max}
              step={retirementConfig.tenure.step}
              onChange={setTenure}
            />

          </div>

        </div>

        {/* RIGHT PANEL */}

        <div className="space-y-6">

          <ResultGrid>

            <ResultCard
              label="Total Investment"
              value={formatCurrency(result.totalInvestment)}
            />

            <ResultCard
              label="Estimated Returns"
              value={formatCurrency(result.totalReturns)}
            />

            <ResultCard
              label="Retirement Corpus"
              value={formatCurrency(result.futureCorpus)}
              highlight
            />

          </ResultGrid>

          <PieChart
            principal={result.totalInvestment}
            interest={result.totalReturns}
          />

          <Summary
            principal={result.totalInvestment}
            interest={result.totalReturns}
            total={result.futureCorpus}
          />

        </div>

      </div>

    </CalculatorShell>
  );
}