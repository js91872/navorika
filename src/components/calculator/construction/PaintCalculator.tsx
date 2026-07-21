"use client";

import { useState, useMemo } from "react";
import { PaintRoller, Ruler, Door, Window, Square, Home } from "lucide-react";

import CalculatorShell from "../CalculatorShell";
import CalculatorHeader from "../CalculatorHeader";
import { Button } from "@/components/ui/Button";
import ResultGrid from "../ResultGrid";
import ResultCard from "../ResultCard";
import NumberInput from "../NumberInput";

interface PaintResult {
  wallArea: number;
  ceilingArea: number;
  totalArea: number;
  doorsArea: number;
  windowsArea: number;
  netArea: number;
  litersNeeded: number;
  gallonsNeeded: number;
  coats: number;
  totalLiters: number;
  totalCost: number;
}

export default function PaintCalculator() {
  const [roomLength, setRoomLength] = useState<number>(5);
  const [roomWidth, setRoomWidth] = useState<number>(4);
  const [roomHeight, setRoomHeight] = useState<number>(2.8);
  const [doors, setDoors] = useState<number>(1);
  const [windows, setWindows] = useState<number>(2);
  const [coveragePerLiter, setCoveragePerLiter] = useState<number>(10);
  const [coats, setCoats] = useState<number>(2);
  const [costPerLiter, setCostPerLiter] = useState<number>(300);
  const [includeCeiling, setIncludeCeiling] = useState<boolean>(true);
  const [wasteFactor, setWasteFactor] = useState<number>(10);

  const calculatePaint = (): PaintResult | null => {
    // Wall area (4 walls)
    const wallArea = 2 * (roomLength + roomWidth) * roomHeight;
    
    // Ceiling area
    const ceilingArea = includeCeiling ? roomLength * roomWidth : 0;
    
    // Doors (average door area: 2.1m x 0.9m = 1.89 sqm)
    const doorArea = doors * 1.89;
    
    // Windows (average window area: 1.2m x 1.5m = 1.8 sqm)
    const windowArea = windows * 1.8;
    
    const totalArea = wallArea + ceilingArea;
    const netArea = totalArea - doorArea - windowArea;
    
    if (netArea <= 0) return null;
    
    // Calculate paint needed (with waste factor)
    const wasteMultiplier = 1 + wasteFactor / 100;
    const litersNeeded = (netArea / coveragePerLiter) * coats * wasteMultiplier;
    const gallonsNeeded = litersNeeded / 3.785;
    
    const totalLiters = Math.ceil(litersNeeded);
    const totalCost = totalLiters * costPerLiter;

    return {
      wallArea: parseFloat(wallArea.toFixed(2)),
      ceilingArea: parseFloat(ceilingArea.toFixed(2)),
      totalArea: parseFloat(totalArea.toFixed(2)),
      doorsArea: parseFloat(doorArea.toFixed(2)),
      windowsArea: parseFloat(windowArea.toFixed(2)),
      netArea: parseFloat(netArea.toFixed(2)),
      litersNeeded: parseFloat(litersNeeded.toFixed(2)),
      gallonsNeeded: parseFloat(gallonsNeeded.toFixed(2)),
      coats,
      totalLiters,
      totalCost: Math.round(totalCost),
    };
  };

  const result = useMemo(() => calculatePaint(), [
    roomLength,
    roomWidth,
    roomHeight,
    doors,
    windows,
    coveragePerLiter,
    coats,
    costPerLiter,
    includeCeiling,
    wasteFactor,
  ]);

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="Paint Calculator"
        description="Calculate how much paint you need for your painting project."
        icon="🎨"
        accuracy="Accurate paint calculations"
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Room Dimensions */}
        <div className="grid gap-4 md:grid-cols-3">
          <NumberInput label="Room Length (m)" value={roomLength} onChange={setRoomLength} min={1} step={0.1} />
          <NumberInput label="Room Width (m)" value={roomWidth} onChange={setRoomWidth} min={1} step={0.1} />
          <NumberInput label="Room Height (m)" value={roomHeight} onChange={setRoomHeight} min={2} step={0.1} />
        </div>

        {/* Doors & Windows */}
        <div className="grid gap-4 md:grid-cols-2">
          <NumberInput label="Number of Doors" value={doors} onChange={setDoors} min={0} step={1} />
          <NumberInput label="Number of Windows" value={windows} onChange={setWindows} min={0} step={1} />
        </div>

        {/* Paint Settings */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Paint Settings</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <NumberInput 
              label="Coverage (sqm/liter)" 
              value={coveragePerLiter} 
              onChange={setCoveragePerLiter} 
              min={5} 
              step={0.5} 
            />
            <NumberInput label="Number of Coats" value={coats} onChange={setCoats} min={1} max={4} step={1} />
            <NumberInput label="Cost per Liter (₹)" value={costPerLiter} onChange={setCostPerLiter} min={50} step={50} prefix="₹" />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <NumberInput label="Waste Factor (%)" value={wasteFactor} onChange={setWasteFactor} min={0} max={30} step={1} suffix="%" />
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="includeCeiling"
                checked={includeCeiling}
                onChange={(e) => setIncludeCeiling(e.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600"
              />
              <label htmlFor="includeCeiling" className="text-sm text-slate-700 dark:text-slate-300">
                Include Ceiling
              </label>
            </div>
          </div>
        </div>

        {result && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 p-6 text-white text-center">
              <p className="text-sm text-purple-200">Paint Required</p>
              <p className="text-4xl sm:text-5xl font-bold mt-2">
                {result.totalLiters} L
              </p>
              <p className="text-sm text-purple-200 mt-1">
                ≈ {result.gallonsNeeded.toFixed(1)} gallons
              </p>
            </div>

            <ResultGrid>
              <ResultCard
                label="Total Area"
                value={`${result.totalArea} m²`}
                icon="📐"
              />
              <ResultCard
                label="Net Area (paintable)"
                value={`${result.netArea} m²`}
                icon="🎯"
              />
              <ResultCard
                label="Total Cost"
                value={`₹${result.totalCost.toLocaleString()}`}
                icon="💰"
              />
            </ResultGrid>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">📋 Area Breakdown</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Walls</span>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{result.wallArea} m²</p>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Ceiling</span>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{result.ceilingArea} m²</p>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Doors</span>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{result.doorsArea} m²</p>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Windows</span>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{result.windowsArea} m²</p>
                </div>
              </div>
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {coats} coats • {coveragePerLiter} m²/L coverage • Waste: {wasteFactor}%
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
