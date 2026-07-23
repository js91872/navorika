"use client";

import { useState, useMemo } from "react";
import { Scale, Dumbbell, Target, Utensils, Beef, Egg, Fish, Bean } from "lucide-react";

import CalculatorShell from "../CalculatorShell";
import { Button } from "@/components/ui/Button";
import ResultCard from "../ResultCard";
import ResultGrid from "../ResultGrid";
import NumberInput from "../NumberInput";

export default function ProteinCalculator() {
  const [weight, setWeight] = useState<number>(70);
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [activityLevel, setActivityLevel] = useState<"sedentary" | "light" | "moderate" | "active" | "veryActive">("moderate");
  const [goal, setGoal] = useState<"maintain" | "build" | "lose">("maintain");

  const activityFactors = {
    sedentary: 0.8,
    light: 1.0,
    moderate: 1.2,
    active: 1.5,
    veryActive: 1.8,
  };

  const goalFactors = {
    maintain: 1,
    build: 1.3,
    lose: 1.1,
  };

  const result = useMemo(() => {
    const weightInKg = unit === "metric" ? weight : weight * 0.453592;
    const baseProtein = weightInKg * activityFactors[activityLevel];
    const totalProtein = baseProtein * goalFactors[goal];
    const perMeal = totalProtein / 3;

    return {
      total: Math.round(totalProtein),
      perMeal: Math.round(perMeal),
      base: Math.round(baseProtein),
      weightInKg: Math.round(weightInKg * 10) / 10,
      goal: goal,
    };
  }, [weight, unit, activityLevel, goal]);

  const proteinSources = [
    { name: "Chicken", protein: "31g/100g", icon: <Beef className="h-4 w-4" /> },
    { name: "Eggs", protein: "13g/100g", icon: <Egg className="h-4 w-4" /> },
    { name: "Fish", protein: "22g/100g", icon: <Fish className="h-4 w-4" /> },
    { name: "Beans", protein: "21g/100g", icon: <Bean className="h-4 w-4" /> },
  ];

  return (
    <CalculatorShell>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Unit Selection */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: "metric", label: "Metric (kg)" },
            { value: "imperial", label: "Imperial (lbs)" },
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
            step={1}
            suffix={unit === "metric" ? "kg" : "lbs"}
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Activity Level</label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value as any)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
            >
              <option value="sedentary">Sedentary</option>
              <option value="light">Light (1-2 days/week)</option>
              <option value="moderate">Moderately Active (3-5 days/week)</option>
              <option value="active">Active (6-7 days/week)</option>
              <option value="veryActive">Very Active (athlete)</option>
            </select>
          </div>
        </div>

        {/* Goal Selection */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "maintain", label: "Maintain" },
            { value: "build", label: "Build Muscle" },
            { value: "lose", label: "Weight Loss" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setGoal(option.value as any)}
              className={`py-2.5 px-4 rounded-xl text-sm font-medium transition ${
                goal === option.value
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-accent-600 p-6 text-white text-center">
              <p className="text-sm text-white/70">Daily Protein Goal</p>
              <p className="text-4xl sm:text-5xl font-bold mt-1">
                {result.total} <span className="text-xl font-normal">grams</span>
              </p>
              <p className="text-sm text-white/60 mt-2">
                Per Day • {result.goal === "build" ? "Building muscle" : result.goal === "lose" ? "Weight loss" : "Maintenance"}
              </p>
            </div>

            <ResultGrid>
              <ResultCard
                label="Per Meal"
                value={`${result.perMeal}g`}
                icon="🍽️"
                subtitle="3 meals per day"
              />
              <ResultCard
                label="Base Amount"
                value={`${result.base}g`}
                icon="📊"
                subtitle={`${activityFactors[activityLevel]} g/kg`}
              />
              <ResultCard
                label="Weight"
                value={`${result.weightInKg} kg`}
                icon="⚖️"
                subtitle={unit === "metric" ? "Metric" : "Imperial"}
              />
            </ResultGrid>

            {/* Recommendations */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">💡 Recommendations</h4>
              <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-brand-500">•</span>
                  <span>{result.total}g protein per day is recommended for your goals</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-500">•</span>
                  <span>Spread protein intake across 3-4 meals ({result.perMeal}g per meal)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-500">•</span>
                  <span>Include protein in every meal for optimal muscle synthesis</span>
                </li>
              </ul>
            </div>

            {/* Protein Sources */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-800">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">🥩 Protein Sources</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {proteinSources.map((source) => (
                  <div key={source.name} className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                    <div className="flex justify-center mb-1">{source.icon}</div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{source.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{source.protein}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
