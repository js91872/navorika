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

import { calculateSWP } from "@/lib/calculations/swp";
import { swpConfig } from "@/config/calculators/swp";
import { formatCurrency } from "@/lib/format/currency";

export default function SWPCalculator() {
  const [corpus, setCorpus] = useState(
    swpConfig.corpus.default
  );

  const [withdrawal, setWithdrawal] = useState(
    swpConfig.withdrawal.default
  );

  const [interestRate, setInterestRate] = useState(
    swpConfig.rate.default
  );

  const [tenure, setTenure] = useState(
    swpConfig.tenure.default
  );

  const result = useMemo(() => {
    return calculateSWP(
      corpus,
      interestRate,
      withdrawal,
      tenure
    );
  }, [
    corpus,
    withdrawal,
    interestRate,
    tenure,
  ]);

  return (
    <CalculatorShell>

      <CalculatorHeader
        title="SWP Calculator"
        description="Estimate total withdrawals and remaining corpus using a Systematic Withdrawal Plan."
      />

      <div className="grid gap-12 lg:grid-cols-[1fr_420px]">

        <div className="space-y-10">

          <div className="space-y-3">

            <NumberInput
              label="Initial Investment"
              value={corpus}
              onChange={setCorpus}
              prefix="₹"
              min={swpConfig.corpus.min}
            />

            <Slider
              value={corpus}
              min={swpConfig.corpus.min}
              max={swpConfig.corpus.max}
              step={swpConfig.corpus.step}
              onChange={setCorpus}
            />

          </div>

          <div className="space-y-3">

            <NumberInput
              label="Yearly Withdrawal"
              value={withdrawal}
              onChange={setWithdrawal}
              prefix="₹"
              min={swpConfig.withdrawal.min}
            />

            <Slider
              value={withdrawal}
              min={swpConfig.withdrawal.min}
              max={swpConfig.withdrawal.max}
              step={swpConfig.withdrawal.step}
              onChange={setWithdrawal}
            />

          </div>

          <div className="space-y-3">

            <PercentageInput
              label="Expected Annual Return"
              value={interestRate}
              onChange={setInterestRate}
            />

            <Slider
              value={interestRate}
              min={swpConfig.rate.min}
              max={swpConfig.rate.max}
              step={swpConfig.rate.step}
              onChange={setInterestRate}
            />

          </div>

          <div className="space-y-3">

            <TenureInput
              label="Withdrawal Period"
              value={tenure}
              onChange={setTenure}
              max={swpConfig.tenure.max}
            />

            <Slider
              value={tenure}
              min={swpConfig.tenure.min}
              max={swpConfig.tenure.max}
              step={swpConfig.tenure.step}
              onChange={setTenure}
            />

          </div>

        </div>

        <div className="space-y-6">

          <ResultGrid>

            <ResultCard
              label="Initial Investment"
              value={formatCurrency(result.investedAmount)}
            />

            <ResultCard
              label="Total Withdrawn"
              value={formatCurrency(result.totalWithdrawal)}
            />

            <ResultCard
              label="Remaining Corpus"
              value={formatCurrency(result.finalCorpus)}
              highlight
            />

          </ResultGrid>

          <PieChart
            principal={result.investedAmount}
            interest={Math.max(
              0,
              result.finalCorpus +
                result.totalWithdrawal -
                result.investedAmount
            )}
          />

          <Summary
  title="SWP Summary"

  principalLabel="Initial Investment"

  interestLabel="Total Withdrawn"

  totalLabel="Remaining Corpus"

  principal={result.investedAmount}

  interest={result.totalWithdrawal}

  total={result.finalCorpus}
/>
        </div>

      </div>

    </CalculatorShell>
  );
}