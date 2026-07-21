"use client";

import { useMemo, useState } from "react";
import { Utensils, Flame, Target, Apple, Bread, Fish } from "lucide-react";

import CalculatorShell from "../CalculatorShell";
import CalculatorHeader from "../CalculatorHeader";
import NumberInput from "../NumberInput";
import Slider from "../Slider";
import ResultGrid from "../ResultGrid";
import ResultCard from "../ResultCard";

import { calculateCalories } from "@/lib/calculations/calorie";
import { formatNumber } from "@/lib/format/currency";
import { calorieConfig } from "@/config/calculators/calorie";

export default function CalorieCalculator() {
  const [weight, setWeight] = useState(calorieConfig.weight.default);
  const [height, setHeight] = useState(calorieConfig.height.default);
  const [age, setAge] = useState(calorieConfig.age.default);
  const [gender, setGender] = useState(calorieConfig.gender.default);
  const [unit, setUnit] = useState(calorieConfig.unit.default);
  const [activityLevel, setActivityLevel] = useState(calorieConfig.activityLevel.default);
  const [goal, setGoal] = useState(calorieConfig.goal.default);

  const result = useMemo(() => {
    return calculateCalories({
      weight,
      height,
      age,
      gender: gender as 'male' | 'female',
      unit: unit as 'metric' | 'imperial',
      activityLevel: activityLevel as any,
      goal: goal as any,
    });
  }, [weight, height, age, gender, unit, activityLevel, goal]);

  const weightUnit = unit === 'metric' ? 'kg' : 'lbs';
  const heightUnit = unit === 'metric' ? 'cm' : 'in';

  const goalLabels = {
    maintain: 'Maintain Weight',
    lose: 'Lose Weight',
    gain: 'Gain Weight',
  };

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="Calorie Calculator"
        description="Calculate your daily calorie needs and macro recommendations."
        icon="🥗"
        accuracy="Based on scientific formulas"
      />

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          {/* LEFT PANEL - Inputs */}
          <div className="space-y-6">
            {/* Unit Selection */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Unit System</label>
              <div className="grid grid-cols-2 gap-3">
                {calorieConfig.unit.options.map((option) => (
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
                min={calorieConfig.weight.min}
                max={calorieConfig.weight.max}
                step={calorieConfig.weight.step}
              />
              <Slider
                value={weight}
                min={calorieConfig.weight.min}
                max={calorieConfig.weight.max}
                step={calorieConfig.weight.step}
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
                min={calorieConfig.height.min}
                max={calorieConfig.height.max}
                step={calorieConfig.height.step}
              />
              <Slider
                value={height}
                min={calorieConfig.height.min}
                max={calorieConfig.height.max}
                step={calorieConfig.height.step}
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
                min={calorieConfig.age.min}
                max={calorieConfig.age.max}
                step={calorieConfig.age.step}
              />
              <Slider
                value={age}
                min={calorieConfig.age.min}
                max={calorieConfig.age.max}
                step={calorieConfig.age.step}
                onChange={setAge}
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Gender</label>
              <div className="grid grid-cols-2 gap-3">
                {calorieConfig.gender.options.map((option) => (
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
                {calorieConfig.activityLevel.options.map((option) => (
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
                {calorieConfig.goal.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setGoal(option.value)}
                    className={`py-2 px-4 rounded-xl text-sm font-medium transition ${
                      goal === option.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {option.label.split(' ')[0]}
                    <span className="block text-xs opacity-75">{option.label.split(' ').slice(1).join(' ')}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL - Results */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white text-center">
              <p className="text-sm text-blue-200">Daily Calorie Goal</p>
              <p className="text-5xl font-bold mt-1">{formatNumber(result.goalCalories)}</p>
              <p className="text-sm text-blue-200 mt-1">calories/day</p>
              <div className="mt-3 flex justify-center gap-4 text-xs text-blue-200">
                <span>{goalLabels[goal as keyof typeof goalLabels]}</span>
                <span>•</span>
                <span>BMR: {formatNumber(result.bmr)} cal</span>
              </div>
            </div>

            <ResultGrid>
              <ResultCard
                label="Maintenance"
                value={`${formatNumber(result.maintenanceCalories)} cal`}
              />
              <ResultCard
                label="Protein"
                value={`${result.protein}g`}
                subtitle={`${result.macros.protein.calories} cal`}
              />
              <ResultCard
                label="Carbs"
                value={`${result.carbs}g`}
                subtitle={`${result.macros.carbs.calories} cal`}
              />
              <ResultCard
                label="Fat"
                value={`${result.fat}g`}
                subtitle={`${result.macros.fat.calories} cal`}
              />
            </ResultGrid>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Macro Breakdown</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-2 flex-1 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full rounded-full bg-blue-600" style={{ width: '40%' }} />
                  </div>
                  <span className="text-xs text-slate-600 w-16 text-right">40% Carbs</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 flex-1 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full rounded-full bg-green-500" style={{ width: '30%' }} />
                  </div>
                  <span className="text-xs text-slate-600 w-16 text-right">30% Protein</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 flex-1 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full rounded-full bg-yellow-500" style={{ width: '30%' }} />
                  </div>
                  <span className="text-xs text-slate-600 w-16 text-right">30% Fat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
