"use client";

import { useState, useMemo } from "react";
import { Ruler, Box, Building, Calculator, Truck } from "lucide-react";

import CalculatorShell from "../CalculatorShell";
import CalculatorHeader from "../CalculatorHeader";
import { Button } from "@/components/ui/Button";
import ResultGrid from "../ResultGrid";
import ResultCard from "../ResultCard";
import NumberInput from "../NumberInput";

interface ConcreteResult {
  volumeCubicMeters: number;
  volumeCubicYards: number;
  bags50kg: number;
  bags40kg: number;
  totalCost: number;
  cementRequired: number;
  sandRequired: number;
  aggregateRequired: number;
}

export default function ConcreteCalculator() {
  const [shape, setShape] = useState<"slab" | "column" | "footing">("slab");
  
  // Slab dimensions
  const [length, setLength] = useState<number>(5);
  const [width, setWidth] = useState<number>(4);
  const [thickness, setThickness] = useState<number>(0.15);
  
  // Column dimensions
  const [diameter, setDiameter] = useState<number>(0.3);
  const [height, setHeight] = useState<number>(3);
  
  // Footing dimensions
  const [footingLength, setFootingLength] = useState<number>(1.5);
  const [footingWidth, setFootingWidth] = useState<number>(1.5);
  const [footingThickness, setFootingThickness] = useState<number>(0.3);
  
  const [bagSize, setBagSize] = useState<50 | 40>(50);
  const [costPerBag, setCostPerBag] = useState<number>(400);
  const [mixRatio, setMixRatio] = useState<"1:2:4" | "1:1.5:3" | "1:1:2">("1:2:4");
  const [wasteFactor, setWasteFactor] = useState<number>(10);

  const mixRatios = {
    "1:2:4": { cement: 1, sand: 2, aggregate: 4 },
    "1:1.5:3": { cement: 1, sand: 1.5, aggregate: 3 },
    "1:1:2": { cement: 1, sand: 1, aggregate: 2 },
  };

  const calculateVolume = (): number => {
    switch (shape) {
      case "slab":
        return length * width * thickness;
      case "column":
        const radius = diameter / 2;
        return Math.PI * radius * radius * height;
      case "footing":
        return footingLength * footingWidth * footingThickness;
      default:
        return 0;
    }
  };

  const calculateConcrete = (): ConcreteResult | null => {
    const volume = calculateVolume();
    if (volume <= 0) return null;

    const wasteMultiplier = 1 + wasteFactor / 100;
    const volumeWithWaste = volume * wasteMultiplier;

    // Convert to cubic yards (1 cubic meter = 1.30795 cubic yards)
    const volumeCubicYards = volumeWithWaste * 1.30795;

    // Calculate bags (standard: 1 bag of 50kg cement = ~0.035 cubic meters)
    const cementPerBag = bagSize === 50 ? 0.035 : 0.028;
    const bagsNeeded = Math.ceil(volumeWithWaste / cementPerBag);

    // Calculate materials based on mix ratio
    const ratio = mixRatios[mixRatio];
    const totalParts = ratio.cement + ratio.sand + ratio.aggregate;
    
    // In cubic meters
    const cementRequired = (volumeWithWaste * ratio.cement) / totalParts;
    const sandRequired = (volumeWithWaste * ratio.sand) / totalParts;
    const aggregateRequired = (volumeWithWaste * ratio.aggregate) / totalParts;

    // Cost calculation
    const totalCost = bagsNeeded * costPerBag;

    return {
      volumeCubicMeters: parseFloat(volumeWithWaste.toFixed(2)),
      volumeCubicYards: parseFloat(volumeCubicYards.toFixed(2)),
      bags50kg: bagSize === 50 ? bagsNeeded : Math.ceil(volumeWithWaste / 0.028),
      bags40kg: bagSize === 40 ? bagsNeeded : Math.ceil(volumeWithWaste / 0.035),
      totalCost: Math.round(totalCost),
      cementRequired: parseFloat(cementRequired.toFixed(2)),
      sandRequired: parseFloat(sandRequired.toFixed(2)),
      aggregateRequired: parseFloat(aggregateRequired.toFixed(2)),
    };
  };

  const result = useMemo(() => calculateConcrete(), [
    shape,
    length,
    width,
    thickness,
    diameter,
    height,
    footingLength,
    footingWidth,
    footingThickness,
    bagSize,
    costPerBag,
    mixRatio,
    wasteFactor,
  ]);

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="Concrete Calculator"
        description="Calculate concrete volume and materials needed for your project."
        icon="🏗️"
        accuracy="Accurate concrete calculations"
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Shape Selection */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Structure Type</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "slab", label: "Slab", icon: "📐" },
              { value: "column", label: "Column", icon: "🏛️" },
              { value: "footing", label: "Footing", icon: "🏗️" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setShape(option.value as any)}
                className={`py-3 px-4 rounded-xl text-sm font-medium transition ${
                  shape === option.value
                    ? 'bg-blue-600 text-white dark:bg-blue-500'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                <span className="mr-1">{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dimensions based on shape */}
        {shape === "slab" && (
          <div className="grid gap-4 md:grid-cols-3">
            <NumberInput label="Length (m)" value={length} onChange={setLength} min={0.1} step={0.1} />
            <NumberInput label="Width (m)" value={width} onChange={setWidth} min={0.1} step={0.1} />
            <NumberInput label="Thickness (m)" value={thickness} onChange={setThickness} min={0.05} step={0.01} />
          </div>
        )}

        {shape === "column" && (
          <div className="grid gap-4 md:grid-cols-2">
            <NumberInput label="Diameter (m)" value={diameter} onChange={setDiameter} min={0.1} step={0.05} />
            <NumberInput label="Height (m)" value={height} onChange={setHeight} min={0.5} step={0.1} />
          </div>
        )}

        {shape === "footing" && (
          <div className="grid gap-4 md:grid-cols-3">
            <NumberInput label="Length (m)" value={footingLength} onChange={setFootingLength} min={0.5} step={0.1} />
            <NumberInput label="Width (m)" value={footingWidth} onChange={setFootingWidth} min={0.5} step={0.1} />
            <NumberInput label="Thickness (m)" value={footingThickness} onChange={setFootingThickness} min={0.1} step={0.05} />
          </div>
        )}

        {/* Material Settings */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Material Settings</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Mix Ratio</label>
              <select
                value={mixRatio}
                onChange={(e) => setMixRatio(e.target.value as any)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
              >
                <option value="1:2:4">1:2:4 (Standard)</option>
                <option value="1:1.5:3">1:1.5:3 (Strong)</option>
                <option value="1:1:2">1:1:2 (High Strength)</option>
              </select>
            </div>
            <NumberInput label="Bag Size (kg)" value={bagSize} onChange={(v) => setBagSize(v as 50 | 40)} min={40} max={50} step={10} />
            <NumberInput label="Cost per Bag (₹)" value={costPerBag} onChange={setCostPerBag} min={100} step={50} prefix="₹" />
          </div>
          <div className="mt-4">
            <NumberInput label="Waste Factor (%)" value={wasteFactor} onChange={setWasteFactor} min={0} max={30} step={1} suffix="%" />
          </div>
        </div>

        {result && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white text-center">
              <p className="text-sm text-blue-200">Total Concrete Required</p>
              <p className="text-4xl sm:text-5xl font-bold mt-2">
                {result.volumeCubicMeters} m³
              </p>
              <p className="text-sm text-blue-200 mt-1">
                ≈ {result.volumeCubicYards} cubic yards
              </p>
            </div>

            <ResultGrid>
              <ResultCard
                label={`${bagSize}kg Bags`}
                value={bagSize === 50 ? result.bags50kg.toString() : result.bags40kg.toString()}
                icon="🛒"
              />
              <ResultCard
                label="Total Cost"
                value={`₹${result.totalCost.toLocaleString()}`}
                icon="💰"
              />
              <ResultCard
                label="Cement Required"
                value={`${result.cementRequired} m³`}
                icon="🧱"
              />
            </ResultGrid>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">📋 Material Breakdown</h4>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Cement</span>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{result.cementRequired} m³</p>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Sand</span>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{result.sandRequired} m³</p>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Aggregate</span>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{result.aggregateRequired} m³</p>
                </div>
              </div>
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Mix Ratio: {mixRatio} • Waste Factor: {wasteFactor}%
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
