"use client";

import { useMemo, useState } from "react";
import { Dumbbell, Weight, Activity, Target } from "lucide-react";

import CalculatorShell from "../CalculatorShell";
import CalculatorHeader from "../CalculatorHeader";
import NumberInput from "../NumberInput";
import Slider from "../Slider";
import ResultGrid from "../ResultGrid";
import ResultCard from "../ResultCard";

import { calculateProtein } from "@/lib/calculations/protein";
import { formatNumber } from "@/lib/format/currency";
import { proteinConfig } from "@/config/calculators/protein";

export default function ProteinCalculator() {
  const [weight, setWeight] = useState(proteinConfig.weight.default);
  const [unit, setUnit] = useState(proteinConfig.unit.default);
  const [activityLevel, setActivityLevel] = useState(proteinConfig.activityLevel.default);
  const [goal, setGoal] = useState(proteinConfig.goal.default);

  const result = useMemo(() => {
    return calculateProtein({
      weight,
      unit: unit as 'metric' | 'imperial',
      activityLevel: activityLevel as any,
      goal: goal as any,
    });
  }, [weight, unit, activityLevel, goal]);

  const weightUnit = unit === 'metric' ? 'kg' : 'lbs';

  const goalLabels = {
    maintain: 'Maintain',
    muscle: 'Build Muscle',
    lose: 'Weight Loss',
  };

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="Protein Intake Calculator"
        description="Calculate your daily protein requirements based on your goals."
        icon="💪"
        accuracy="Based on scientific recommendations"
      />

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          {/* LEFT PANEL - Inputs */}
          <div className="space-y-6">
            {/* Unit Selection */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Unit System</label>
              <div className="grid grid-cols-2 gap-3">
                {proteinConfig.unit.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setUnit(option.value)}
                    className={`py-2 px-4 rounded-xl text-sm font-medium transition ${
                      unit === option.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <NumberInput
                label={`Weight (${weightUnit})`}
                value={weight}
                onChange={setWeight}
                suffix={weightUnit}
                min={proteinConfig.weight.min}
                max={proteinConfig.weight.max}
                step={proteinConfig.weight.step}
              />
              <Slider
                value={weight}
                min={proteinConfig.weight.min}
                max={proteinConfig.weight.max}
                step={proteinConfig.weight.step}
                onChange={setWeight}
              />
            </div>

            {/* Activity Level */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Activity Level</label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                {proteinConfig.activityLevel.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Goal */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Goal</label>
              <div className="grid grid-cols-3 gap-2">
                {proteinConfig.goal.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setGoal(option.value)}
                    className={`py-2 px-4 rounded-xl text-sm font-medium transition ${
                      goal === option.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL - Results */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white text-center">
              <p className="text-sm text-blue-200">Daily Protein Goal</p>
              <p className="text-5xl font-bold mt-1">{formatNumber(result.dailyProtein)}</p>
              <p className="text-sm text-blue-200 mt-1">grams per day</p>
              <div className="mt-3 flex justify-center gap-4 text-xs text-blue-200">
                <span>{goalLabels[goal as keyof typeof goalLabels]}</span>
                <span>•</span>
                <span>{result.proteinPerKg.toFixed(1)} g/kg</span>
              </div>
            </div>

            <ResultGrid>
              <ResultCard
                label="Per Meal"
                value={`${formatNumber(result.perMeal)} g`}
                subtitle={`${result.perMealCount} meals per day`}
              />
            </ResultGrid>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Recommendations</h3>
              <ul className="space-y-2 text-sm">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-slate-600">
                    <span className="text-blue-500 mt-0.5">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Protein Sources</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 rounded-lg p-2 text-center">
                  <span className="block font-medium text-slate-700">Chicken</span>
                  <span className="text-slate-500">31g/100g</span>
                </div>
                <div className="bg-slate-50 rounded-lg p-2 text-center">
                  <span className="block font-medium text-slate-700">Eggs</span>
                  <span className="text-slate-500">13g/100g</span>
                </div>
                <div className="bg-slate-50 rounded-lg p-2 text-center">
                  <span className="block font-medium text-slate-700">Fish</span>
                  <span className="text-slate-500">22g/100g</span>
                </div>
                <div className="bg-slate-50 rounded-lg p-2 text-center">
                  <span className="block font-medium text-slate-700">Beans</span>
                  <span className="text-slate-500">21g/100g</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
