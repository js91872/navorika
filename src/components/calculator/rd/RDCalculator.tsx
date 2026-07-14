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

import { calculateRD } from "@/lib/calculations/rd";
import { formatCurrency } from "@/lib/format/currency";
import { rdConfig } from "@/config/calculators/rd";

export default function RDCalculator() {

  const [monthlyDeposit, setMonthlyDeposit] = useState(
    rdConfig.monthlyDeposit.default
  );

  const [interestRate, setInterestRate] = useState(
    rdConfig.rate.default
  );

  const [tenure, setTenure] = useState(
    rdConfig.tenure.default
  );

  const result = useMemo(() => {

    return calculateRD(
      monthlyDeposit,
      interestRate,
      tenure
    );

  }, [
    monthlyDeposit,
    interestRate,
    tenure,
  ]);

  return (

    <CalculatorShell>

      <CalculatorHeader
        title="RD Calculator"
        description="Estimate the maturity amount and interest earned on your Recurring Deposit."
      />

      <div className="grid gap-12 lg:grid-cols-[1fr_420px]">

        <div className="space-y-10">

          <div className="space-y-3">

            <NumberInput
              label="Monthly Deposit"
              value={monthlyDeposit}
              onChange={setMonthlyDeposit}
              prefix="₹"
              min={rdConfig.monthlyDeposit.min}
            />

            <Slider
              value={monthlyDeposit}
              min={rdConfig.monthlyDeposit.min}
              max={rdConfig.monthlyDeposit.max}
              step={rdConfig.monthlyDeposit.step}
              onChange={setMonthlyDeposit}
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
              min={rdConfig.rate.min}
              max={rdConfig.rate.max}
              step={rdConfig.rate.step}
              onChange={setInterestRate}
            />

          </div>

          <div className="space-y-3">

            <TenureInput
              label="Deposit Tenure"
              value={tenure}
              onChange={setTenure}
              max={10}
            />

            <Slider
              value={tenure}
              min={rdConfig.tenure.min}
              max={rdConfig.tenure.max}
              step={rdConfig.tenure.step}
              onChange={setTenure}
            />

          </div>

        </div>

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