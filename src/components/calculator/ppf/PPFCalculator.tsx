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

import { calculatePPF } from "@/lib/calculations/ppf";
import { formatCurrency } from "@/lib/format/currency";
import { ppfConfig } from "@/config/calculators/ppf";

export default function PPFCalculator() {
  const [yearlyInvestment, setYearlyInvestment] = useState(
    ppfConfig.yearlyInvestment.default
  );

  const [interestRate, setInterestRate] = useState(
    ppfConfig.rate.default
  );

  const [tenure, setTenure] = useState(
    ppfConfig.tenure.default
  );

  const result = useMemo(() => {
    return calculatePPF(
      yearlyInvestment,
      interestRate,
      tenure
    );
  }, [
    yearlyInvestment,
    interestRate,
    tenure,
  ]);

  return (
    <CalculatorShell>

      <CalculatorHeader
        title="PPF Calculator"
        description="Estimate the maturity amount, invested amount and interest earned on your Public Provident Fund."
      />

      <div className="grid gap-12 lg:grid-cols-[1fr_420px]">

        {/* LEFT PANEL */}

        <div className="space-y-10">

          <div className="space-y-3">

            <NumberInput
              label="Yearly Investment"
              value={yearlyInvestment}
              onChange={setYearlyInvestment}
              prefix="₹"
              min={ppfConfig.yearlyInvestment.min}
            />

            <Slider
              value={yearlyInvestment}
              min={ppfConfig.yearlyInvestment.min}
              max={ppfConfig.yearlyInvestment.max}
              step={ppfConfig.yearlyInvestment.step}
              onChange={setYearlyInvestment}
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
              min={ppfConfig.rate.min}
              max={ppfConfig.rate.max}
              step={ppfConfig.rate.step}
              onChange={setInterestRate}
            />

          </div>

          <div className="space-y-3">

            <TenureInput
              label="Investment Period"
              value={tenure}
              onChange={setTenure}
              min={15}
              max={50}
            />

            <Slider
              value={tenure}
              min={ppfConfig.tenure.min}
              max={ppfConfig.tenure.max}
              step={ppfConfig.tenure.step}
              onChange={setTenure}
            />

          </div>

        </div>

        {/* RIGHT PANEL */}

        <div className="space-y-6">

          <ResultGrid>

            <ResultCard
              label="Total Investment"
              value={formatCurrency(result.investedAmount)}
            />

            <ResultCard
              label="Interest Earned"
              value={formatCurrency(result.interestEarned)}
            />

            <ResultCard
              label="Maturity Amount"
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