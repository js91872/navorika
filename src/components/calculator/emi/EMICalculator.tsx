"use client";

import { useState, useMemo } from "react";
import { Wallet, TrendingUp, Calendar, IndianRupee } from "lucide-react";

import CalculatorShell from "../CalculatorShell";
import CalculatorHeader from "../CalculatorHeader";
import NumberInput from "../NumberInput";
import Slider from "../Slider";
import { Button } from "@/components/ui/Button";
import ResultGrid from "../ResultGrid";
import ResultCard from "../ResultCard";
import ScheduleTable from "../ScheduleTable";

export default function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [showSchedule, setShowSchedule] = useState(false);

  const calculateEMI = useMemo(() => {
    const monthlyRate = interestRate / 100 / 12;
    const months = tenure * 12;
    
    if (loanAmount <= 0 || interestRate <= 0 || tenure <= 0) {
      return {
        emi: 0,
        totalInterest: 0,
        totalPayment: 0,
        schedule: [],
      };
    }
    
    const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - loanAmount;
    
    let balance = loanAmount;
    const schedule = [];
    for (let i = 1; i <= Math.min(months, 360); i++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = emi - interestPayment;
      balance -= principalPayment;
      schedule.push({
        month: i,
        emi: emi,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance),
      });
    }
    
    return {
      emi,
      totalInterest,
      totalPayment,
      schedule,
    };
  }, [loanAmount, interestRate, tenure]);

  const resetFields = () => {
    setLoanAmount(500000);
    setInterestRate(8.5);
    setTenure(20);
    setShowSchedule(false);
  };

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="EMI Calculator"
        description="Calculate your monthly loan EMI instantly."
        icon="💰"
        accuracy="Accurate to the rupee"
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <NumberInput
            label="Loan Amount"
            value={loanAmount}
            onChange={setLoanAmount}
            prefix="₹"
            min={1000}
            max={100000000}
            step={1000}
          />
          <NumberInput
            label="Interest Rate"
            value={interestRate}
            onChange={setInterestRate}
            suffix="%"
            min={0.1}
            max={30}
            step={0.1}
          />
          <div className="md:col-span-2">
            <Slider
              label="Tenure"
              value={tenure}
              onChange={setTenure}
              min={1}
              max={30}
              step={1}
              suffix=" years"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setShowSchedule(true)} className="flex-1">
            <Wallet className="mr-2 h-4 w-4" />
            Calculate EMI
          </Button>
          <Button variant="outline" onClick={resetFields}>
            Reset
          </Button>
        </div>

        {loanAmount > 0 && interestRate > 0 && tenure > 0 && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white text-center">
              <p className="text-sm text-blue-200">Monthly EMI</p>
              <p className="text-4xl font-bold mt-1">
                ₹{calculateEMI.emi.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>

            <ResultGrid>
              <ResultCard 
                label="Total Payment" 
                value={`₹${calculateEMI.totalPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} 
              />
              <ResultCard 
                label="Total Interest" 
                value={`₹${calculateEMI.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} 
              />
              <ResultCard 
                label="Tenure" 
                value={`${tenure} years`} 
              />
            </ResultGrid>

            {showSchedule && calculateEMI.schedule.length > 0 && (
              <ScheduleTable 
                data={calculateEMI.schedule} 
                columns={[
                  { key: "month", label: "Month" },
                  { key: "emi", label: "EMI" },
                  { key: "principal", label: "Principal" },
                  { key: "interest", label: "Interest" },
                  { key: "balance", label: "Balance" },
                ]}
              />
            )}
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
