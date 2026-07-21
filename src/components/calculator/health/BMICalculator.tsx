"use client";

import { useMemo, useState } from "react";
import { Activity, Ruler, Weight } from "lucide-react";

import CalculatorShell from "../CalculatorShell";
import CalculatorHeader from "../CalculatorHeader";
import NumberInput from "../NumberInput";
import Slider from "../Slider";
import ResultGrid from "../ResultGrid";
import ResultCard from "../ResultCard";

import { calculateBMI } from "@/lib/calculations/bmi";
import { formatNumber } from "@/lib/format/currency";
import { bmiConfig } from "@/config/calculators/bmi";

export default function BMICalculator() {
  const [weight, setWeight] = useState(bmiConfig.weight.default);
  const [height, setHeight] = useState(bmiConfig.height.default);
  const [unit, setUnit] = useState(bmiConfig.unit.default);
  const [age, setAge] = useState(bmiConfig.age.default);
  const [gender, setGender] = useState(bmiConfig.gender.default);

  const result = useMemo(() => {
    return calculateBMI({
      weight,
      height,
      unit: unit as 'metric' | 'imperial',
      age,
      gender: gender as 'male' | 'female',
    });
  }, [weight, height, unit, age, gender]);

  const weightUnit = unit === 'metric' ? 'kg' : 'lbs';
  const heightUnit = unit === 'metric' ? 'cm' : 'in';

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="BMI Calculator"
        description="Calculate your Body Mass Index and understand your health category."
        icon="⚖️"
        accuracy="Based on WHO guidelines"
      />

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          {/* LEFT PANEL - Inputs */}
          <div className="space-y-6">
            {/* Unit Selection */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Unit System</label>
              <div className="grid grid-cols-2 gap-3">
                {bmiConfig.unit.options.map((option) => (
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
                min={bmiConfig.weight.min}
                max={bmiConfig.weight.max}
                step={bmiConfig.weight.step}
              />
              <Slider
                value={weight}
                min={bmiConfig.weight.min}
                max={bmiConfig.weight.max}
                step={bmiConfig.weight.step}
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
                min={bmiConfig.height.min}
                max={bmiConfig.height.max}
                step={bmiConfig.height.step}
              />
              <Slider
                value={height}
                min={bmiConfig.height.min}
                max={bmiConfig.height.max}
                step={bmiConfig.height.step}
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
                min={bmiConfig.age.min}
                max={bmiConfig.age.max}
                step={bmiConfig.age.step}
              />
              <Slider
                value={age}
                min={bmiConfig.age.min}
                max={bmiConfig.age.max}
                step={bmiConfig.age.step}
                onChange={setAge}
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Gender</label>
              <div className="grid grid-cols-2 gap-3">
                {bmiConfig.gender.options.map((option) => (
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
          </div>

          {/* RIGHT PANEL - Results */}
          <div className="space-y-6">
            {/* BMI Display */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white text-center">
              <p className="text-sm text-blue-200">Your BMI</p>
              <p className="text-5xl font-bold mt-1">{result.bmi}</p>
              <p className={`mt-2 text-lg font-semibold ${result.color}`}>
                {result.category}
              </p>
              <div className="mt-3 flex justify-center gap-4 text-xs text-blue-200">
                <span>Risk Level: {result.riskLevel}</span>
              </div>
            </div>

            <ResultGrid>
              <ResultCard
                label="Category"
                value={result.category}
                subtitle={result.riskLevel}
              />
              <ResultCard
                label="Healthy Weight Range"
                value={`${result.healthyWeightRange.min} - ${result.healthyWeightRange.max}`}
                subtitle={unit === 'metric' ? 'kg' : 'lbs'}
              />
            </ResultGrid>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-600">{result.description}</p>
            </div>
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
