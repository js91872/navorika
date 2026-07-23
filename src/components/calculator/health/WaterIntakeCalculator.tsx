"use client";

import { useState, useMemo } from "react";
import { Droplets, Activity, Sun, Cloud, Thermometer, Weight } from "lucide-react";

import CalculatorShell from "../CalculatorShell";
import { Button } from "@/components/ui/Button";
import ResultCard from "../ResultCard";
import ResultGrid from "../ResultGrid";
import NumberInput from "../NumberInput";

export default function WaterIntakeCalculator() {
  const [weight, setWeight] = useState<number>(70);
  const [activityLevel, setActivityLevel] = useState<"sedentary" | "moderate" | "active" | "veryActive">("moderate");
  const [climate, setClimate] = useState<"cold" | "moderate" | "hot" | "veryHot">("moderate");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");

  const result = useMemo(() => {
    const weightInKg = unit === "metric" ? weight : weight * 0.453592;

    // Base water intake: 35ml per kg of body weight
    let waterMl = weightInKg * 35;

    // Activity adjustment
    const activityMultipliers = {
      sedentary: 0,
      moderate: 0.3,
      active: 0.5,
      veryActive: 0.8,
    };
    waterMl += weightInKg * activityMultipliers[activityLevel] * 10;

    // Climate adjustment
    const climateMultipliers = {
      cold: 0,
      moderate: 0.1,
      hot: 0.3,
      veryHot: 0.5,
    };
    waterMl += weightInKg * climateMultipliers[climate] * 10;

    const glasses = waterMl / 250; // 1 glass = 250ml
    const liters = waterMl / 1000;

    return {
      waterMl: Math.round(waterMl),
      glasses: Math.round(glasses),
      liters: Math.round(liters * 10) / 10,
      weightInKg: Math.round(weightInKg * 10) / 10,
    };
  }, [weight, activityLevel, climate, unit]);

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
        <div className="grid grid-cols-1 gap-4">
          <NumberInput
            label="Weight"
            value={weight}
            onChange={setWeight}
            min={20}
            max={300}
            step={1}
            suffix={unit === "metric" ? "kg" : "lbs"}
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
            <option value="sedentary">Sedentary (little exercise)</option>
            <option value="moderate">Moderately Active (3-5 days/week)</option>
            <option value="active">Active (6-7 days/week)</option>
            <option value="veryActive">Very Active (athlete)</option>
          </select>
        </div>

        {/* Climate */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Climate</label>
          <select
            value={climate}
            onChange={(e) => setClimate(e.target.value as any)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
          >
            <option value="cold">Cold</option>
            <option value="moderate">Moderate</option>
            <option value="hot">Hot</option>
            <option value="veryHot">Very Hot</option>
          </select>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 p-6 text-white text-center">
              <p className="text-sm text-white/70">Daily Water Intake</p>
              <p className="text-4xl sm:text-5xl font-bold mt-1">
                {result.waterMl} <span className="text-xl font-normal">ml</span>
              </p>
              <p className="text-sm text-white/60 mt-2">
                ≈ {result.glasses} glasses • {result.liters} liters
              </p>
            </div>

            <ResultGrid>
              <ResultCard
                label="Glasses"
                value={`${result.glasses}`}
                icon="🥤"
                subtitle="250ml per glass"
              />
              <ResultCard
                label="Liters"
                value={`${result.liters} L`}
                icon="💧"
              />
              <ResultCard
                label="Weight"
                value={`${result.weightInKg} kg`}
                icon="⚖️"
              />
            </ResultGrid>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">💡 Hydration Tips</h4>
              <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Drink water throughout the day, not just when thirsty</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Increase intake during exercise and hot weather</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Monitor urine color for hydration status</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Include water-rich foods in your diet</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
