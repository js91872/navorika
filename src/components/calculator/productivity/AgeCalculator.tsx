"use client";

import { useState, useMemo } from "react";
import { Calendar, Clock, Cake, Star, CalendarDays } from "lucide-react";

import CalculatorShell from "../CalculatorShell";
import CalculatorHeader from "../CalculatorHeader";
import ResultGrid from "../ResultGrid";
import ResultCard from "../ResultCard";

import { calculateAge } from "@/lib/calculations/age";

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState<string>("2000-01-01");

  const result = useMemo(() => {
    const date = new Date(birthDate);
    if (isNaN(date.getTime())) return null;
    return calculateAge(date);
  }, [birthDate]);

  const today = new Date().toISOString().split('T')[0];

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="Age Calculator"
        description="Calculate your exact age in years, months, and days."
        icon="🎂"
        accuracy="Accurate to the second"
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Date Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Date of Birth</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            max={today}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
          <p className="text-xs text-slate-400">Enter your date of birth to calculate your exact age</p>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Main Age Display */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white text-center">
              <p className="text-sm text-blue-200">Your Age</p>
              <p className="text-4xl sm:text-5xl font-bold mt-1">
                {result.years} Years {result.months} Months {result.days} Days
              </p>
              <div className="mt-3 flex justify-center gap-4 text-xs text-blue-200">
                <span>{result.totalDays.toLocaleString()} days</span>
                <span>•</span>
                <span>{result.totalMonths.toLocaleString()} months</span>
                <span>•</span>
                <span>{result.ageInSeconds.toLocaleString()} seconds</span>
              </div>
            </div>

            <ResultGrid>
              <ResultCard
                label="Next Birthday"
                value={result.nextBirthday.toLocaleDateString()}
                subtitle={`${result.daysUntilNextBirthday} days remaining`}
              />
              <ResultCard
                label="Day of Birth"
                value={result.dayOfWeek}
                subtitle={result.zodiacSign}
              />
              <ResultCard
                label="Leap Year Birth"
                value={result.isLeapYear ? "✅ Yes" : "❌ No"}
                subtitle={result.isLeapYear ? "Born in a leap year!" : "Not a leap year"}
              />
            </ResultGrid>

            {/* Zodiac Sign */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-center gap-4">
              <Star className="h-8 w-8 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-700">Zodiac Sign</p>
                <p className="text-lg font-semibold text-blue-600">{result.zodiacSign}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
