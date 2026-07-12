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
import Insights from "../Insights";
import ScheduleTable from "../ScheduleTable";

import { calculateEMI } from "@/lib/calculations/emi";
import { generateAmortizationSchedule } from "@/lib/calculations/amortization";
import { formatCurrency } from "@/lib/format/currency";

export default function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const result = useMemo(() => {
    return calculateEMI(
      loanAmount,
      interestRate,
      tenure
    );
  }, [loanAmount, interestRate, tenure]);

  const schedule = useMemo(() => {
    return generateAmortizationSchedule(
      loanAmount,
      interestRate,
      tenure
    );
  }, [loanAmount, interestRate, tenure]);

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="EMI Calculator"
        description="Calculate your monthly EMI, total interest and repayment instantly."
      />

      <div className="grid gap-12 lg:grid-cols-[1fr_420px]">

        {/* LEFT PANEL */}

        <div className="space-y-10">

          <div className="space-y-3">

            <NumberInput
              label="Loan Amount"
              value={loanAmount}
              onChange={setLoanAmount}
              prefix="₹"
              min={100000}
            />

            <Slider
              value={loanAmount}
              min={100000}
              max={50000000}
              step={50000}
              onChange={setLoanAmount}
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
              min={1}
              max={20}
              step={0.05}
              onChange={setInterestRate}
            />

          </div>

          <div className="space-y-3">

            <TenureInput
              value={tenure}
              onChange={setTenure}
            />

            <Slider
              value={tenure}
              min={1}
              max={40}
              step={1}
              onChange={setTenure}
            />

          </div>

        </div>

        {/* RIGHT PANEL */}

        <div className="space-y-6">

          <ResultGrid>

            <ResultCard
              label="Monthly EMI"
              value={formatCurrency(result.emi)}
              highlight
            />

            <ResultCard
              label="Total Interest"
              value={formatCurrency(result.totalInterest)}
            />

            <ResultCard
              label="Total Payment"
              value={formatCurrency(result.totalPayment)}
            />

          </ResultGrid>

          <PieChart
            principal={loanAmount}
            interest={result.totalInterest}
          />

          <Summary
            principal={loanAmount}
            interest={result.totalInterest}
            total={result.totalPayment}
          />

          <Insights
            principal={loanAmount}
            interest={result.totalInterest}
            total={result.totalPayment}
          />

        </div>

      </div>

      <div className="mt-16">

        <ScheduleTable
          schedule={schedule}
        />

      </div>

    </CalculatorShell>
  );
}