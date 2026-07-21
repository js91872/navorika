"use client";

import { useState, useMemo } from "react";
import { Square, Grid3x3, Ruler, Calculator, TrendingUp } from "lucide-react";

import CalculatorShell from "../CalculatorShell";
import CalculatorHeader from "../CalculatorHeader";
import { Button } from "@/components/ui/Button";
import ResultGrid from "../ResultGrid";
import ResultCard from "../ResultCard";
import NumberInput from "../NumberInput";
import { formatCurrency, getUserCurrency, getCurrencySymbol } from "@/lib/currency";

interface TileResult {
  area: number;
  tileArea: number;
  tilesNeeded: number;
  tilesWithWaste: number;
  boxesNeeded: number;
  totalCost: number;
  groutNeeded: number;
  layout: {
    rows: number;
    columns: number;
  };
}

export default function TileCalculator() {
  const [surface, setSurface] = useState<"floor" | "wall">("floor");
  
  // Surface dimensions
  const [length, setLength] = useState<number>(5);
  const [width, setWidth] = useState<number>(4);
  const [height, setHeight] = useState<number>(2.8);
  
  // Tile dimensions
  const [tileLength, setTileLength] = useState<number>(0.6);
  const [tileWidth, setTileWidth] = useState<number>(0.6);
  
  // Additional settings
  const [groutWidth, setGroutWidth] = useState<number>(3);
  const [wasteFactor, setWasteFactor] = useState<number>(10);
  const [tilesPerBox, setTilesPerBox] = useState<number>(5);
  const [costPerBox, setCostPerBox] = useState<number>(1200);
  const [pattern, setPattern] = useState<"straight" | "diagonal" | "herringbone">("straight");

  // Get user's currency
  const currencySymbol = useMemo(() => {
    if (typeof window !== 'undefined') {
      return getCurrencySymbol(getUserCurrency());
    }
    return '$';
  }, []);

  const patternFactors = {
    straight: 1.0,
    diagonal: 1.15,
    herringbone: 1.25,
  };

  const calculateTiles = (): TileResult | null => {
    // Calculate surface area
    let area = 0;
    if (surface === "floor") {
      area = length * width;
    } else {
      area = 2 * (length + width) * height;
    }
    
    if (area <= 0) return null;

    const groutInMeters = groutWidth / 1000;
    const effectiveTileLength = tileLength + groutInMeters;
    const effectiveTileWidth = tileWidth + groutInMeters;
    const tileArea = effectiveTileLength * effectiveTileWidth;
    
    const tilesNeeded = Math.ceil(area / tileArea);
    const patternFactor = patternFactors[pattern];
    const tilesWithPattern = Math.ceil(tilesNeeded * patternFactor);
    const wasteMultiplier = 1 + wasteFactor / 100;
    const tilesWithWaste = Math.ceil(tilesWithPattern * wasteMultiplier);
    const boxesNeeded = Math.ceil(tilesWithWaste / tilesPerBox);
    const totalCost = boxesNeeded * costPerBox;
    const groutNeeded = parseFloat((area * 1.5 / 1000).toFixed(2));
    const rows = Math.ceil(length / tileLength);
    const columns = Math.ceil(width / tileWidth);

    return {
      area: parseFloat(area.toFixed(2)),
      tileArea: parseFloat(tileArea.toFixed(4)),
      tilesNeeded,
      tilesWithWaste,
      boxesNeeded,
      totalCost,
      groutNeeded,
      layout: { rows, columns },
    };
  };

  const result = useMemo(() => calculateTiles(), [
    surface,
    length,
    width,
    height,
    tileLength,
    tileWidth,
    groutWidth,
    wasteFactor,
    tilesPerBox,
    costPerBox,
    pattern,
  ]);

  const formatCurrencyLocal = (amount: number) => {
    return formatCurrency(amount);
  };

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="Tile Calculator"
        description="Calculate how many tiles you need for floors and walls."
        icon="🧱"
        accuracy="Accurate tile calculations with pattern & waste"
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Surface Type */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Surface Type</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "floor", label: "Floor", icon: "📐" },
              { value: "wall", label: "Wall", icon: "🧱" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSurface(option.value as any)}
                className={`py-3 px-4 rounded-xl text-sm font-medium transition ${
                  surface === option.value
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

        {/* Surface Dimensions */}
        {surface === "floor" ? (
          <div className="grid gap-4 md:grid-cols-2">
            <NumberInput label="Length (m)" value={length} onChange={setLength} min={0.1} step={0.1} />
            <NumberInput label="Width (m)" value={width} onChange={setWidth} min={0.1} step={0.1} />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            <NumberInput label="Length (m)" value={length} onChange={setLength} min={0.1} step={0.1} />
            <NumberInput label="Width (m)" value={width} onChange={setWidth} min={0.1} step={0.1} />
            <NumberInput label="Height (m)" value={height} onChange={setHeight} min={0.5} step={0.1} />
          </div>
        )}

        {/* Tile Dimensions */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Tile Size</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <NumberInput label="Tile Length (m)" value={tileLength} onChange={setTileLength} min={0.05} max={2} step={0.05} />
            <NumberInput label="Tile Width (m)" value={tileWidth} onChange={setTileWidth} min={0.05} max={2} step={0.05} />
          </div>
        </div>

        {/* Pattern & Settings */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Pattern & Settings</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Pattern</label>
              <select
                value={pattern}
                onChange={(e) => setPattern(e.target.value as any)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
              >
                <option value="straight">Straight (1.0x)</option>
                <option value="diagonal">Diagonal (1.15x)</option>
                <option value="herringbone">Herringbone (1.25x)</option>
              </select>
            </div>
            <NumberInput label="Grout Width (mm)" value={groutWidth} onChange={setGroutWidth} min={1} max={10} step={0.5} />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <NumberInput label="Waste Factor (%)" value={wasteFactor} onChange={setWasteFactor} min={0} max={30} step={1} suffix="%" />
            <NumberInput label="Tiles per Box" value={tilesPerBox} onChange={setTilesPerBox} min={1} max={50} step={1} />
            <NumberInput label={`Cost per Box (${currencySymbol})`} value={costPerBox} onChange={setCostPerBox} min={100} step={50} prefix={currencySymbol} />
          </div>
        </div>

        {result && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-gradient-to-br from-amber-600 to-orange-700 p-6 text-white text-center">
              <p className="text-sm text-amber-200">Tiles Required</p>
              <p className="text-4xl sm:text-5xl font-bold mt-2">
                {result.tilesWithWaste} tiles
              </p>
              <p className="text-sm text-amber-200 mt-1">
                {result.boxesNeeded} boxes • {result.tilesNeeded} without waste
              </p>
            </div>

            <ResultGrid>
              <ResultCard
                label="Area"
                value={`${result.area} m²`}
                icon="📐"
              />
              <ResultCard
                label="Tiles Needed"
                value={result.tilesNeeded.toString()}
                icon="🧱"
              />
              <ResultCard
                label="Boxes Needed"
                value={result.boxesNeeded.toString()}
                icon="📦"
              />
            </ResultGrid>

            <div className="grid gap-4 md:grid-cols-2">
              <ResultCard
                label="Total Cost"
                value={formatCurrencyLocal(result.totalCost)}
                icon="💰"
              />
              <ResultCard
                label="Grout Needed"
                value={`${result.groutNeeded} kg`}
                icon="🏗️"
              />
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">📋 Layout Information</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Rows</span>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{result.layout.rows}</p>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Columns</span>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{result.layout.columns}</p>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Pattern</span>
                  <p className="font-medium text-slate-800 dark:text-slate-200 capitalize">{pattern}</p>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Waste Factor</span>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{wasteFactor}%</p>
                </div>
              </div>
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Tile size: {tileLength}m × {tileWidth}m • Grout: {groutWidth}mm
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
