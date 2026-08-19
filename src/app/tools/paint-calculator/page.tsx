'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

export default function PaintCalculator() {
  const [length, setLength] = useState<number>(10);
  const [width, setWidth] = useState<number>(10);
  const [height, setHeight] = useState<number>(3);
  const [unit, setUnit] = useState<'m' | 'ft'>('m');
  const [coats, setCoats] = useState<number>(2);
  const [coverage, setCoverage] = useState<number>(10);
  const [wastage, setWastage] = useState<number>(10);
  const [result, setResult] = useState<any>(null);

  const calculatePaint = () => {
    let len = length;
    let wid = width;
    let hei = height;

    if (unit === 'ft') {
      len = length * 0.3048;
      wid = width * 0.3048;
      hei = height * 0.3048;
    }

    const wallArea = 2 * (len * hei + wid * hei);
    const ceilingArea = len * wid;
    const totalArea = wallArea + ceilingArea;
    const totalWithCoats = totalArea * coats;
    const litersNeeded = totalWithCoats / coverage;
    const withWastage = litersNeeded * (1 + wastage / 100);
    const cansNeeded = Math.ceil(withWastage / 5);

    setResult({
      wallArea,
      ceilingArea,
      totalArea,
      litersNeeded: withWastage,
      cansNeeded,
      coats,
      coverage,
      wastage
    });
  };

  const resetCalculator = () => {
    setResult(null);
    setLength(10);
    setWidth(10);
    setHeight(3);
    setCoats(2);
    setCoverage(10);
    setWastage(10);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-2">Paint Calculator</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Estimate paint quantity needed for walls, ceilings, and surfaces.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Unit System</label>
            <Select
              value={unit}
              onChange={(e) => setUnit(e.target.value as 'm' | 'ft')}
              options={[
                { value: 'm', label: 'Metric (meters)' },
                { value: 'ft', label: 'Imperial (feet)' }
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Room Length</label>
            <Input
              type="number"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              min={0.1}
              step={0.1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Room Width</label>
            <Input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              min={0.1}
              step={0.1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Room Height</label>
            <Input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              min={0.1}
              step={0.1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Number of Coats</label>
            <Select
              value={coats.toString()}
              onChange={(e) => setCoats(Number(e.target.value))}
              options={[
                { value: '1', label: '1 Coat' },
                { value: '2', label: '2 Coats (Recommended)' },
                { value: '3', label: '3 Coats' }
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Coverage (m² per liter)</label>
            <Input
              type="number"
              value={coverage}
              onChange={(e) => setCoverage(Number(e.target.value))}
              min={5}
              max={15}
              step={0.5}
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Typical: 8-12 m²/L</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Wastage (%)</label>
            <Input
              type="number"
              value={wastage}
              onChange={(e) => setWastage(Number(e.target.value))}
              min={0}
              max={20}
              step={1}
            />
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button onClick={calculatePaint} className="flex-1">
            Calculate Paint
          </Button>
          <Button variant="outline" onClick={resetCalculator}>
            Reset
          </Button>
        </div>

        {result && (
          <div className="mt-6 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <h3 className="font-bold text-lg mb-4">Paint Calculation Results</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Wall Area</p>
                <p className="text-lg font-bold">{result.wallArea.toFixed(2)} m²</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Ceiling Area</p>
                <p className="text-lg font-bold">{result.ceilingArea.toFixed(2)} m²</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Area</p>
                <p className="text-lg font-bold">{result.totalArea.toFixed(2)} m²</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg md:col-span-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">Paint Needed (with wastage)</p>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{result.litersNeeded.toFixed(1)} Liters</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg md:col-span-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">5L Cans Needed</p>
                <p className="text-2xl font-bold">{result.cansNeeded} cans</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-600 dark:text-blue-400">The estimate includes all four walls and the ceiling, without subtracting doors or windows. Confirm product coverage and available container sizes.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
