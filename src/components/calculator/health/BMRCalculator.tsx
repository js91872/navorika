"use client";

import { useMemo, useState } from "react";
import { Flame, Ruler, Weight, Calendar } from "lucide-react";

import CalculatorShell from "../CalculatorShell";
import CalculatorHeader from "../CalculatorHeader";
import NumberInput from "../NumberInput";
import Slider from "../Slider";
import ResultGrid from "../ResultGrid";
import ResultCard from "../ResultCard";

import { calculateBMR } from "@/lib/calculations/bmr";
import { formatNumber } from "@/lib/format/currency";
import { bmrConfig } from "@/config/calculators/bmr";

export default function BMRCalculator() {
  const [weight, setWeight] = useState(bmrConfig.weight.default);
  const [height, setHeight] = useState(bmrConfig.height.default);
  const [age, setAge] = useState(bmrConfig.age.default);
  const [gender, setGender] = useState(bmrConfig.gender.default);
  const [unit, setUnit] = useState(bmrConfig.unit.default);
  const [activityLevel, setActivityLevel] = useState(bmrConfig.activityLevel.default);

  const result = useMemo(() => {
    return calculateBMR({
      weight,
      height,
      age,
      gender: gender as 'male' | 'female',
      unit: unit as 'metric' | 'imperial',
      activityLevel: activityLevel as any,
    });
  }, [weight, height, age, gender, unit, activityLevel]);

  const weightUnit = unit === 'metric' ? 'kg' : 'lbs';
  const heightUnit = unit === 'metric' ? 'cm' : 'in';

  const activityLabels = {
    sedentary: 'Sedentary',
    light: 'Lightly Active',
    moderate: 'Moderately Active',
    very: 'Very Active',
    extra: 'Extra Active',
  };

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="BMR Calculator"
        description="Calculate your Basal Metabolic Rate and daily calorie needs."
        icon="🔥"
        accuracy="Based on Mifflin-St Jeor equation"
      />

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          {/* LEFT PANEL - Inputs */}
          <div className="space-y-6">
            {/* Unit Selection */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Unit System</label>
              <div className="grid grid-cols-2 gap-3">
                {bmrConfig.unit.options.map((option) => (
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
                min={bmrConfig.weight.min}
                max={bmrConfig.weight.max}
                step={bmrConfig.weight.step}
              />
              <Slider
                value={weight}
                min={bmrConfig.weight.min}
                max={bmrConfig.weight.max}
                step={bmrConfig.weight.step}
                onChange={setWeight}
              />
            </div>

            {/* Height */}
            <div className="space-y-2">
              <NumberInput
                label={`Height (${heightUnit})`}
                value={height}
                onChange={setHeight}
                suffix={heightUnit}
                min={bmrConfig.height.min}
                max={bmrConfig.height.max}
                step={bmrConfig.height.step}
              />
              <Slider
                value={height}
                min={bmrConfig.height.min}
                max={bmrConfig.height.max}
                step={bmrConfig.height.step}
                onChange={setHeight}
              />
            </div>

            {/* Age */}
            <div className="space-y-2">
              <NumberInput
                label="Age"
                value={age}
                onChange={setAge}
                suffix="years"
                min={bmrConfig.age.min}
                max={bmrConfig.age.max}
                step={bmrConfig.age.step}
              />
              <Slider
                value={age}
                min={bmrConfig.age.min}
                max={bmrConfig.age.max}
                step={bmrConfig.age.step}
                onChange={setAge}
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Gender</label>
              <div className="grid grid-cols-2 gap-3">
                {bmrConfig.gender.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setGender(option.value)}
                    className={`py-2 px-4 rounded-xl text-sm font-medium transition ${
                      gender === option.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Activity Level */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Activity Level</label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                {bmrConfig.activityLevel.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* RIGHT PANEL - Results */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white text-center">
              <p className="text-sm text-blue-200">Your BMR</p>
              <p className="text-5xl font-bold mt-1">{formatNumber(result.bmr)}</p>
              <p className="text-sm text-blue-200 mt-1">calories/day</p>
              <div className="mt-3 flex justify-center gap-4 text-xs text-blue-200">
                <span>Maintenance: {formatNumber(result.maintenanceCalories)} cal/day</span>
              </div>
            </div>

            <ResultGrid>
              <ResultCard
                label="Activity Level"
                value={activityLabels[activityLevel as keyof typeof activityLabels]}
                subtitle={`${formatNumber(result.maintenanceCalories)} cal/day`}
              />
            </ResultGrid>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">All Activity Levels</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Sedentary</span>
                  <span className="font-medium text-slate-800">{formatNumber(result.activityLevels.sedentary)} cal</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Lightly Active</span>
                  <span className="font-medium text-slate-800">{formatNumber(result.activityLevels.light)} cal</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Moderately Active</span>
                  <span className="font-medium text-slate-800">{formatNumber(result.activityLevels.moderate)} cal</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Very Active</span>
                  <span className="font-medium text-slate-800">{formatNumber(result.activityLevels.very)} cal</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-600">Extra Active</span>
                  <span className="font-medium text-slate-800">{formatNumber(result.activityLevels.extra)} cal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
