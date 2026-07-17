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

import { calculateLumpsum } from "@/lib/calculations/lumpsum";
import { formatCurrency } from "@/lib/format/currency";
import { lumpsumConfig } from "@/config/calculators/lumpsum";

export default function LumpsumCalculator() {
  const [investment, setInvestment] = useState(
    lumpsumConfig.investment.default
  );

  const [rate, setRate] = useState(
    lumpsumConfig.rate.default
  );

  const [tenure, setTenure] = useState(
    lumpsumConfig.tenure.default
  );

  const result = useMemo(() => {
    return calculateLumpsum(
      investment,
      rate,
      tenure
    );
  }, [
    investment,
    rate,
    tenure,
  ]);

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="Lumpsum Calculator"
        description="Estimate the future value of your one-time investment using compound annual growth."
      />

      <div className="grid gap-12 lg:grid-cols-[1fr_420px]">

        {/* Left Panel */}

        <div className="space-y-10">

          <div className="space-y-3">

            <NumberInput
              label="Investment Amount"
              value={investment}
              onChange={setInvestment}
              prefix="₹"
              min={lumpsumConfig.investment.min}
            />

            <Slider
              value={investment}
              min={lumpsumConfig.investment.min}
              max={lumpsumConfig.investment.max}
              step={lumpsumConfig.investment.step}
              onChange={setInvestment}
            />

          </div>

          <div className="space-y-3">

            <PercentageInput
              label="Expected Annual Return"
              value={rate}
              onChange={setRate}
            />

            <Slider
              value={rate}
              min={lumpsumConfig.rate.min}
              max={lumpsumConfig.rate.max}
              step={lumpsumConfig.rate.step}
              onChange={setRate}
            />

          </div>

          <div className="space-y-3">

            <TenureInput
              label="Investment Period"
              value={tenure}
              onChange={setTenure}
              max={lumpsumConfig.tenure.max}
            />

            <Slider
              value={tenure}
              min={lumpsumConfig.tenure.min}
              max={lumpsumConfig.tenure.max}
              step={lumpsumConfig.tenure.step}
              onChange={setTenure}
            />

          </div>

        </div>

        {/* Right Panel */}

        <div className="space-y-6">

          <ResultGrid>

            <ResultCard
              label="Investment"
              value={formatCurrency(result.investedAmount)}
            />

            <ResultCard
              label="Estimated Returns"
              value={formatCurrency(result.interestEarned)}
            />

            <ResultCard
              label="Future Value"
              value={formatCurrency(result.maturityAmount)}
              highlight
            />

          </ResultGrid>

          <PieChart
            principal={result.investedAmount}
            interest={result.interestEarned}
          />

          <Summary
            principal={result.investedAmount}
            interest={result.interestEarned}
            total={result.maturityAmount}
          />

        </div>

      </div>

    </CalculatorShell>
  );
}