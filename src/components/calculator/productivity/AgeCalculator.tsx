"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";

import CalculatorShell from "../CalculatorShell";
import CalculatorHeader from "../CalculatorHeader";
import { Button } from "@/components/ui/Button";
import ResultGrid from "../ResultGrid";
import ResultCard from "../ResultCard";

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  nextBirthday: Date;
  daysUntilNextBirthday: number;
  zodiacSign: string;
  birthWeekday: string;
}

const zodiacSigns = [
  { sign: "Capricorn", start: [1, 1], end: [1, 19] },
  { sign: "Aquarius", start: [1, 20], end: [2, 18] },
  { sign: "Pisces", start: [2, 19], end: [3, 20] },
  { sign: "Aries", start: [3, 21], end: [4, 19] },
  { sign: "Taurus", start: [4, 20], end: [5, 20] },
  { sign: "Gemini", start: [5, 21], end: [6, 20] },
  { sign: "Cancer", start: [6, 21], end: [7, 22] },
  { sign: "Leo", start: [7, 23], end: [8, 22] },
  { sign: "Virgo", start: [8, 23], end: [9, 22] },
  { sign: "Libra", start: [9, 23], end: [10, 22] },
  { sign: "Scorpio", start: [10, 23], end: [11, 21] },
  { sign: "Sagittarius", start: [11, 22], end: [12, 21] },
  { sign: "Capricorn", start: [12, 22], end: [12, 31] },
];

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<AgeResult | null>(null);

  const calculateAge = () => {
    if (!birthDate) {
      alert("Please select your birth date.");
      return;
    }

    const birth = new Date(birthDate);
    const now = new Date();

    if (birth > now) {
      alert("Birth date cannot be in the future.");
      return;
    }

    const diffMs = now.getTime() - birth.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const nextBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= now) {
      nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    }
    const daysUntilNextBirthday = Math.ceil((nextBirthday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    const getZodiac = (month: number, day: number): string => {
      for (const z of zodiacSigns) {
        const [sMonth, sDay] = z.start;
        const [eMonth, eDay] = z.end;
        if ((month === sMonth && day >= sDay) || (month === eMonth && day <= eDay)) {
          return z.sign;
        }
      }
      return "Capricorn";
    };

    const birthWeekday = weekdays[birth.getDay()];

    setResult({
      years,
      months,
      days,
      totalDays: diffDays,
      totalWeeks: diffWeeks,
      totalMonths: diffMonths,
      nextBirthday,
      daysUntilNextBirthday,
      zodiacSign: getZodiac(birth.getMonth() + 1, birth.getDate()),
      birthWeekday,
    });
  };

  const handleToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    setBirthDate(`${year}-${month}-${day}`);
  };

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="Age Calculator"
        description="Calculate your exact age in years, months, days, and more."
        icon="🎂"
        accuracy="Accurate to the day"
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Date of Birth</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={calculateAge} className="flex-1">
            <Calendar className="mr-2 h-4 w-4" />
            Calculate Age
          </Button>
          <Button variant="outline" onClick={handleToday}>
            Today
          </Button>
        </div>

        {result && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white text-center">
              <p className="text-sm text-blue-200">Your Age</p>
              <p className="text-4xl font-bold mt-1">
                {result.years} years, {result.months} months, {result.days} days
              </p>
            </div>

            <ResultGrid>
              <ResultCard label="Total Days" value={result.totalDays.toLocaleString()} />
              <ResultCard label="Total Weeks" value={result.totalWeeks.toLocaleString()} />
              <ResultCard label="Total Months" value={result.totalMonths.toLocaleString()} />
              <ResultCard label="Next Birthday" value={`${result.daysUntilNextBirthday} days`} />
              <ResultCard label="Zodiac Sign" value={result.zodiacSign} />
              <ResultCard label="Born On" value={result.birthWeekday} />
            </ResultGrid>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
