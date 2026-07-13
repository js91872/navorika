"use client";

import { useMemo, useState } from "react";

import CalculatorShell from "../CalculatorShell";
import CalculatorHeader from "../CalculatorHeader";
import NumberInput from "../NumberInput";
import Slider from "../Slider";
import ResultGrid from "../ResultGrid";
import ResultCard from "../ResultCard";
import PieChart from "../PieChart";

import { calculateGST } from "@/lib/calculations/gst";
import { formatCurrency } from "@/lib/format/currency";

export default function GSTCalculator() {
  const [amount, setAmount] = useState(1000);
  const [gstRate, setGstRate] = useState(18);

  const result = useMemo(() => {
    return calculateGST(amount, gstRate);
  }, [amount, gstRate]);

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="GST Calculator"
        description="Calculate GST amount and total price instantly."
      />

      <div className="grid gap-12 lg:grid-cols-[1fr_420px]">

        {/* LEFT PANEL */}

        <div className="space-y-10">

          <div className="space-y-3">

            <NumberInput
              label="Amount"
              value={amount}
              onChange={setAmount}
              prefix="₹"
              min={1}
            />

            <Slider
              value={amount}
              min={1}
              max={1000000}
              step={100}
              onChange={setAmount}
            />

          </div>

          <div className="space-y-3">

            <label className="text-sm font-medium">
              GST Rate (%)
            </label>

            <select
              value={gstRate}
              onChange={(e) =>
                setGstRate(Number(e.target.value))
              }
              className="w-full rounded-2xl border border-slate-300 p-3"
            >
              <option value={3}>3%</option>
              <option value={5}>5%</option>
              <option value={12}>12%</option>
              <option value={18}>18%</option>
              <option value={28}>28%</option>
            </select>

          </div>

        </div>

        {/* RIGHT PANEL */}

        <div className="space-y-6">

          <ResultGrid>

            <ResultCard
              label="Original Amount"
              value={formatCurrency(result.originalAmount)}
            />

            <ResultCard
              label="GST Amount"
              value={formatCurrency(result.gstAmount)}
            />

            <ResultCard
              label="Final Amount"
              value={formatCurrency(result.totalAmount)}
              highlight
            />

          </ResultGrid>

          <PieChart
            principal={result.originalAmount}
            interest={result.gstAmount}
          />

        </div>

      </div>

    </CalculatorShell>
  );
}