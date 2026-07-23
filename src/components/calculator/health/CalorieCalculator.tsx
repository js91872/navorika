"use client";

import { useState, useMemo } from "react";
import { Apple, Flame, Activity, Target, Utensils, Salad } from "lucide-react";

import CalculatorShell from "../CalculatorShell";
import { Button } from "@/components/ui/Button";
import ResultCard from "../ResultCard";
import ResultGrid from "../ResultGrid";
import NumberInput from "../NumberInput";

export default function CalorieCalculator() {
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(175);
  const [activityLevel, setActivityLevel] = useState<"sedentary" | "light" | "moderate" | "active" | "veryActive">("moderate");
  const [goal, setGoal] = useState<"maintain" | "lose" | "gain">("maintain");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");

  const result = useMemo(() => {
    const heightInCm = unit === "metric" ? height : height * 2.54;
    const weightInKg = unit === "metric" ? weight : weight * 0.453592;

    // BMR using Mifflin-St Jeor Equation
    let bmr = 0;
    if (gender === "male") {
      bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * age + 5;
    } else {
      bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * age - 161;
    }

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };

    const tdee = bmr * activityMultipliers[activityLevel];
    
    const goalAdjustments = {
      maintain: 0,
      lose: -500,
      gain: 500,
    };

    const dailyCalories = tdee + goalAdjustments[goal];

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      dailyCalories: Math.round(dailyCalories),
      weightInKg: Math.round(weightInKg),
      heightInCm: Math.round(heightInCm),
    };
  }, [age, gender, weight, height, activityLevel, goal, unit]);

  return (
    <CalculatorShell>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Gender Selection */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setGender(option.value as any)}
              className={`py-2.5 px-4 rounded-xl text-sm font-medium transition ${
                gender === option.value
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NumberInput
            label="Age"
            value={age}
            onChange={setAge}
            min={10}
            max={100}
            step={1}
            suffix="Years"
          />
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

        {/* Activity Level */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Activity Level</label>
          <select
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value as any)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
          >
            <option value="sedentary">Sedentary (little or no exercise)</option>
            <option value="light">Light (1-3 days/week)</option>
            <option value="moderate">Moderate (3-5 days/week)</option>
            <option value="active">Active (6-7 days/week)</option>
            <option value="veryActive">Very Active (athlete)</option>
          </select>
        </div>

        {/* Goal Selection */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "maintain", label: "Maintain", icon: "⚖️" },
            { value: "lose", label: "Lose Weight", icon: "📉" },
            { value: "gain", label: "Gain Weight", icon: "📈" },
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
              <span className="mr-1">{option.icon}</span>
              {option.label}
            </button>
          ))}
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            <div className={`rounded-2xl p-6 text-white text-center ${
              goal === "maintain" 
                ? 'bg-gradient-to-br from-brand-600 to-accent-600'
                : goal === "lose"
                ? 'bg-gradient-to-br from-orange-500 to-amber-600'
                : 'bg-gradient-to-br from-emerald-500 to-teal-600'
            }`}>
              <p className="text-sm text-white/70">Daily Calorie Goal</p>
              <p className="text-4xl sm:text-5xl font-bold mt-1">
                {result.dailyCalories} <span className="text-xl font-normal">cal</span>
              </p>
              <p className="text-sm text-white/60 mt-2">
                {goal === "maintain" ? "Maintain current weight" : goal === "lose" ? "Lose weight" : "Gain weight"}
              </p>
            </div>

            <ResultGrid>
              <ResultCard
                label="BMR"
                value={`${result.bmr} cal`}
                icon="🔥"
                subtitle="Basal Metabolic Rate"
              />
              <ResultCard
                label="TDEE"
                value={`${result.tdee} cal`}
                icon="🏃"
                subtitle="Total Daily Energy Expenditure"
              />
              <ResultCard
                label="Weight"
                value={`${result.weightInKg} kg`}
                icon="⚖️"
              />
            </ResultGrid>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-800">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">💡 Macro Breakdown</h4>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-700/30">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Protein</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {Math.round(result.dailyCalories * 0.3 / 4)}g
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-700/30">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Carbs</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {Math.round(result.dailyCalories * 0.4 / 4)}g
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-700/30">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Fats</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {Math.round(result.dailyCalories * 0.3 / 9)}g
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-2">
                Based on standard macro split: 30% Protein, 40% Carbs, 30% Fats
              </p>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
