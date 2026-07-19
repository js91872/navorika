"use client";

import { useMemo, useState } from "react";

import CalculatorShell from "../CalculatorShell";
import CalculatorHeader from "../CalculatorHeader";
import NumberInput from "../NumberInput";
import Slider from "../Slider";
import ResultGrid from "../ResultGrid";
import ResultCard from "../ResultCard";
import Summary from "../Summary";

import { waterIntakeConfig } from "@/config/calculators/water-intake";
import { calculateWaterIntake } from "@/lib/calculations/water-intake";
import { formatNumber } from "@/lib/format/currency";

export default function WaterIntakeCalculator() {
  const [weight, setWeight] = useState(waterIntakeConfig.weight.default);
  const [activityLevel, setActivityLevel] = useState(waterIntakeConfig.activityLevel.default);
  const [climate, setClimate] = useState(waterIntakeConfig.climate.default);
  const [unit, setUnit] = useState(waterIntakeConfig.unit.default);

  const result = useMemo(() => {
    return calculateWaterIntake({
      weight,
      activityLevel,
      climate: climate as 'cold' | 'moderate' | 'hot',
      unit: unit as 'metric' | 'imperial',
    });
  }, [weight, activityLevel, climate, unit]);

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="Water Intake Calculator"
        description="Calculate your daily water intake based on weight, activity level, and climate."
        accuracy="Based on medical guidelines for hydration"
      />

      <div className="grid gap-12 lg:grid-cols-[1fr_420px]">
        {/* LEFT PANEL - Inputs */}
        <div className="space-y-10">
          <div className="space-y-3">
            <NumberInput
              label={`Weight (${unit === 'metric' ? 'kg' : 'lbs'})`}
              value={weight}
              onChange={setWeight}
              suffix={unit === 'metric' ? 'kg' : 'lbs'}
              min={waterIntakeConfig.weight.min}
              max={waterIntakeConfig.weight.max}
            />
            <Slider
              value={weight}
              min={waterIntakeConfig.weight.min}
              max={waterIntakeConfig.weight.max}
              step={waterIntakeConfig.weight.step}
              onChange={setWeight}
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium">
              Unit System
            </label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
            >
              {waterIntakeConfig.unit.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium">
              Activity Level
            </label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
            >
              {waterIntakeConfig.activityLevel.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium">
              Climate
            </label>
            <select
              value={climate}
              onChange={(e) => setClimate(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
            >
              {waterIntakeConfig.climate.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* RIGHT PANEL - Results */}
        <div className="space-y-6">
          <ResultGrid>
            <ResultCard
              label="Daily Water Intake"
              value={`${formatNumber(result.inGlasses)} glasses`}
              highlight
            />
            <ResultCard
              label="In Liters"
              value={`${formatNumber(result.inLiters)} L`}
            />
            <ResultCard
              label="In Milliliters"
              value={`${formatNumber(Math.round(result.climateAdjusted))} ml`}
            />
          </ResultGrid>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-slate-700">Recommendations</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              {result.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  {rec}
                </li>
              ))}
            </ul>
            <div className="mt-4 text-xs text-slate-400 border-t pt-3">
              ⚕️ General guideline: 30-35ml per kg of body weight, adjusted for activity and climate.
            </div>
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
