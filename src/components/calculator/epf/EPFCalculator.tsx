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

import { epfConfig } from "@/config/calculators/epf";
import { calculateEPF } from "@/lib/calculations/epf";
import { formatCurrency } from "@/lib/format/currency";

export default function EPFCalculator() {
  const [monthlySalary, setMonthlySalary] = useState(
    epfConfig.monthlySalary.default
  );

  const [employeeContribution, setEmployeeContribution] = useState(
    epfConfig.employeeContribution.default
  );

  const [annualInterest, setAnnualInterest] = useState(
    epfConfig.annualInterest.default
  );

  const [tenure, setTenure] = useState(
    epfConfig.tenure.default
  );

  const result = useMemo(() => {
    return calculateEPF(
      monthlySalary,
      employeeContribution,
      annualInterest,
      tenure
    );
  }, [
    monthlySalary,
    employeeContribution,
    annualInterest,
    tenure,
  ]);

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="EPF Calculator"
        description="Estimate your Employees' Provident Fund (EPF) maturity amount based on salary, contribution, interest and service period."
      />

      <div className="grid gap-12 lg:grid-cols-[1fr_420px]">

        <div className="space-y-10">

          <div className="space-y-3">
            <NumberInput
              label="Monthly Basic Salary"
              value={monthlySalary}
              onChange={setMonthlySalary}
              prefix="₹"
              min={epfConfig.monthlySalary.min}
            />

            <Slider
              value={monthlySalary}
              min={epfConfig.monthlySalary.min}
              max={epfConfig.monthlySalary.max}
              step={epfConfig.monthlySalary.step}
              onChange={setMonthlySalary}
            />
          </div>

          <div className="space-y-3">
            <PercentageInput
              label="Employee Contribution (%)"
              value={employeeContribution}
              onChange={setEmployeeContribution}
            />

            <Slider
              value={employeeContribution}
              min={epfConfig.employeeContribution.min}
              max={epfConfig.employeeContribution.max}
              step={epfConfig.employeeContribution.step}
              onChange={setEmployeeContribution}
            />
          </div>

          <div className="space-y-3">
            <PercentageInput
              label="EPF Interest Rate"
              value={annualInterest}
              onChange={setAnnualInterest}
            />

            <Slider
              value={annualInterest}
              min={epfConfig.annualInterest.min}
              max={epfConfig.annualInterest.max}
              step={epfConfig.annualInterest.step}
              onChange={setAnnualInterest}
            />
          </div>

          <div className="space-y-3">
            <TenureInput
              label="Years of Service"
              value={tenure}
              onChange={setTenure}
              max={40}
            />

            <Slider
              value={tenure}
              min={epfConfig.tenure.min}
              max={epfConfig.tenure.max}
              step={epfConfig.tenure.step}
              onChange={setTenure}
            />
          </div>

        </div>

        <div className="space-y-6">

          <ResultGrid>

            <ResultCard
              label="Employee Contribution"
              value={formatCurrency(result.employeeContribution)}
            />

            <ResultCard
              label="Employer Contribution"
              value={formatCurrency(result.employerContribution)}
            />

            <ResultCard
              label="Total Contribution"
              value={formatCurrency(result.totalContribution)}
            />

            <ResultCard
              label="Interest Earned"
              value={formatCurrency(result.totalInterest)}
            />

            <ResultCard
              label="Estimated EPF Corpus"
              value={formatCurrency(result.maturityAmount)}
              highlight
            />

          </ResultGrid>

          <PieChart
            key={`${result.totalContribution}-${result.totalInterest}`}
            principal={result.totalContribution}
            interest={result.totalInterest}
          />

          <Summary
            principal={result.totalContribution}
            interest={result.totalInterest}
            total={result.maturityAmount}
          />

        </div>

      </div>

    </CalculatorShell>
  );
}
