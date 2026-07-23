"use client";

import { useState, useMemo } from "react";
import { Flame, Users, Calendar, Heart, Ruler, Weight } from "lucide-react";

import CalculatorShell from "../CalculatorShell";
import { Button } from "@/components/ui/Button";
import ResultCard from "../ResultCard";
import ResultGrid from "../ResultGrid";
import NumberInput from "../NumberInput";

export default function BMRCalculator() {
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(175);
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");

  const result = useMemo(() => {
    const heightInCm = unit === "metric" ? height : height * 2.54;
    const weightInKg = unit === "metric" ? weight : weight * 0.453592;

    let bmr = 0;
    if (gender === "male") {
      bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * age + 5;
    } else {
      bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * age - 161;
    }

    const sedentary = bmr * 1.2;
    const light = bmr * 1.375;
    const moderate = bmr * 1.55;
    const active = bmr * 1.725;
    const veryActive = bmr * 1.9;

    return {
      bmr: Math.round(bmr),
      sedentary: Math.round(sedentary),
      light: Math.round(light),
      moderate: Math.round(moderate),
      active: Math.round(active),
      veryActive: Math.round(veryActive),
      weightInKg: Math.round(weightInKg),
      heightInCm: Math.round(heightInCm),
    };
  }, [age, gender, weight, height, unit]);

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

        {/* Results */}
        {result && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 p-6 text-white text-center">
              <p className="text-sm text-white/70">BMR (Basal Metabolic Rate)</p>
              <p className="text-4xl sm:text-5xl font-bold mt-1">
                {result.bmr} <span className="text-xl font-normal">cal/day</span>
              </p>
              <p className="text-sm text-white/60 mt-2">
                Energy your body needs at rest
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">📊 Daily Calorie Needs</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="text-center p-2 rounded-lg bg-white dark:bg-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Sedentary</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{result.sedentary}</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-white dark:bg-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Light</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{result.light}</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-white dark:bg-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Moderate</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{result.moderate}</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-white dark:bg-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Active</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{result.active}</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-white dark:bg-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Very Active</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{result.veryActive}</p>
                </div>
              </div>
            </div>

            <ResultGrid>
              <ResultCard
                label="BMR"
                value={`${result.bmr} cal`}
                icon="🔥"
              />
              <ResultCard
                label="Maintenance"
                value={`${result.moderate} cal`}
                icon="⚖️"
                subtitle="With moderate activity"
              />
              <ResultCard
                label="Weight"
                value={`${result.weightInKg} kg`}
                icon="⚖️"
              />
            </ResultGrid>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-800">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                💡 <span className="font-medium">What is BMR?</span> BMR is the number of calories your body needs to perform basic life-sustaining functions like breathing, circulation, and cell production.
              </p>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
