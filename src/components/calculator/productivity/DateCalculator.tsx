"use client";

import { useState } from "react";
import { Calendar, ArrowRight, Clock, Plus, Minus } from "lucide-react";

import CalculatorShell from "../CalculatorShell";
import CalculatorHeader from "../CalculatorHeader";
import { Button } from "@/components/ui/Button";
import ResultGrid from "../ResultGrid";
import ResultCard from "../ResultCard";

export default function DateCalculator() {
  const [mode, setMode] = useState<"difference" | "add">("difference");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [daysToAdd, setDaysToAdd] = useState(30);
  const [result, setResult] = useState<{
    days: number;
    weeks: number;
    months: number;
    years: number;
    businessDays: number;
    endDateStr: string;
  } | null>(null);

  const calculateDifference = () => {
    if (!startDate || !endDate) {
      alert("Please select both dates.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      alert("End date must be after start date.");
      return;
    }

    const diffMs = end.getTime() - start.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const diffYears = end.getFullYear() - start.getFullYear();

    // Calculate business days (weekdays only)
    let businessDays = 0;
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (d.getDay() !== 0 && d.getDay() !== 6) businessDays++;
    }

    setResult({
      days: diffDays,
      weeks: diffWeeks,
      months: diffMonths,
      years: diffYears,
      businessDays,
      endDateStr: end.toLocaleDateString(),
    });
  };

  const calculateAdd = () => {
    if (!startDate) {
      alert("Please select a start date.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + daysToAdd);

    setResult({
      days: daysToAdd,
      weeks: Math.floor(daysToAdd / 7),
      months: Math.floor(daysToAdd / 30.44),
      years: Math.floor(daysToAdd / 365.25),
      businessDays: 0,
      endDateStr: end.toLocaleDateString(),
    });
  };

  const handlePreset = (days: number) => {
    setDaysToAdd(days);
  };

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="Date Calculator"
        description="Calculate the difference between dates or add days to a date."
        icon="📅"
        accuracy="Accurate date calculations"
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Mode Selection */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Mode</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "difference", label: "Date Difference", icon: "📊" },
              { value: "add", label: "Add Days", icon: "➕" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setMode(option.value as any)}
                className={`py-2 px-4 rounded-xl text-sm font-medium transition ${
                  mode === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span className="mr-1">{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {mode === "difference" ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Days to Add</label>
              <div className="flex flex-wrap gap-2">
                {[7, 14, 30, 90, 180, 365].map((num) => (
                  <button
                    key={num}
                    onClick={() => handlePreset(num)}
                    className={`px-3 py-1 rounded-lg text-sm transition ${
                      daysToAdd === num
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {num}d
                  </button>
                ))}
                <input
                  type="number"
                  value={daysToAdd}
                  onChange={(e) => setDaysToAdd(Number(e.target.value))}
                  className="w-24 rounded-lg border border-slate-300 px-2 py-1 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>
        )}

        <Button onClick={mode === "difference" ? calculateDifference : calculateAdd} className="w-full">
          <Calendar className="mr-2 h-4 w-4" />
          {mode === "difference" ? "Calculate Difference" : "Calculate Date"}
        </Button>

        {result && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white text-center">
              <p className="text-sm text-blue-200">
                {mode === "difference" ? "Date Difference" : "Result Date"}
              </p>
              {mode === "add" && (
                <p className="text-xl font-bold mt-1">{result.endDateStr}</p>
              )}
              {mode === "difference" && (
                <p className="text-2xl font-bold mt-1">
                  {result.days} days
                </p>
              )}
            </div>

            <ResultGrid>
              {mode === "difference" && (
                <>
                  <ResultCard label="Weeks" value={result.weeks.toString()} />
                  <ResultCard label="Months" value={result.months.toString()} />
                  <ResultCard label="Years" value={result.years.toString()} />
                  <ResultCard label="Business Days" value={result.businessDays.toString()} />
                </>
              )}
              {mode === "add" && (
                <>
                  <ResultCard label="Days Added" value={result.days.toString()} />
                  <ResultCard label="Weeks" value={result.weeks.toString()} />
                  <ResultCard label="Months" value={result.months.toString()} />
                  <ResultCard label="Years" value={result.years.toString()} />
                </>
              )}
            </ResultGrid>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
