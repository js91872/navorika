"use client";

import { useState, useMemo } from "react";
import { Scale, Activity, Heart, Ruler, Weight } from "lucide-react";

import CalculatorShell from "../CalculatorShell";
import { Button } from "@/components/ui/Button";
import ResultCard from "../ResultCard";
import ResultGrid from "../ResultGrid";
import NumberInput from "../NumberInput";

export default function BMICalculator() {
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(175);
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");

  const result = useMemo(() => {
    const heightInM = unit === "metric" ? height / 100 : height * 0.0254;
    const weightInKg = unit === "metric" ? weight : weight * 0.453592;
    const bmi = weightInKg / (heightInM * heightInM);
    
    let category = "";
    let color = "";
    let advice = "";
    
    if (bmi < 18.5) {
      category = "Underweight";
      color = "text-blue-500";
      advice = "Consider gaining weight through a balanced diet and strength training.";
    } else if (bmi < 25) {
      category = "Normal";
      color = "text-emerald-500";
      advice = "Great job! Maintain your current lifestyle and eating habits.";
    } else if (bmi < 30) {
      category = "Overweight";
      color = "text-orange-500";
      advice = "Consider incorporating more exercise and a balanced diet.";
    } else {
      category = "Obese";
      color = "text-red-500";
      advice = "Consult a healthcare professional for personalized advice.";
    }

    return {
      bmi: Math.round(bmi * 10) / 10,
      category,
      color,
      advice,
      weightInKg: Math.round(weightInKg),
      heightInM: Math.round(heightInM * 100) / 100,
    };
  }, [weight, height, unit]);

  return (
    <CalculatorShell>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Unit Selection */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: "metric", label: "Metric" },
            { value: "imperial", label: "Imperial" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setUnit(option.value as any)}
              className={`py-2.5 px-4 rounded-xl text-sm font-medium transition ${
                unit === option.value
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput
            label="Weight"
            value={weight}
            onChange={setWeight}
            min={20}
            max={300}
            step={0.5}
            suffix={unit === "metric" ? "kg" : "lbs"}
          />
          <NumberInput
            label="Height"
            value={height}
            onChange={setHeight}
            min={100}
            max={250}
            step={0.5}
            suffix={unit === "metric" ? "cm" : "inches"}
          />
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            <div className={`rounded-2xl p-6 text-white text-center bg-gradient-to-br from-brand-600 to-accent-600`}>
              <p className="text-sm text-white/70">Your BMI</p>
              <p className="text-5xl sm:text-6xl font-bold mt-1">
                {result.bmi}
              </p>
              <p className={`text-lg font-semibold mt-2 ${result.color} bg-white/20 inline-block px-4 py-1 rounded-full`}>
                {result.category}
              </p>
            </div>

            <ResultGrid>
              <ResultCard
                label="Category"
                value={result.category}
                icon="📊"
                subtitle="Based on WHO standards"
              />
              <ResultCard
                label="Weight"
                value={`${result.weightInKg} kg`}
                icon="⚖️"
              />
              <ResultCard
                label="Height"
                value={`${result.heightInM} m`}
                icon="📏"
              />
            </ResultGrid>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">💡 Health Advice</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {result.advice}
              </p>
            </div>

            {/* BMI Scale */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-800">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">BMI Scale</h4>
              <div className="relative h-4 w-full rounded-full overflow-hidden">
                <div className="absolute inset-0 flex">
                  <div className="h-full w-[18.5%] bg-blue-400" />
                  <div className="h-full w-[31.5%] bg-emerald-400" />
                  <div className="h-full w-[30%] bg-orange-400" />
                  <div className="h-full w-[20%] bg-red-400" />
                </div>
                <div 
                  className="absolute top-1/2 -translate-y-1/2 h-6 w-1 bg-slate-800 dark:bg-slate-200 rounded-full"
                  style={{ left: `${Math.min((result.bmi / 40) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span>Underweight</span>
                <span>Normal</span>
                <span>Overweight</span>
                <span>Obese</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
