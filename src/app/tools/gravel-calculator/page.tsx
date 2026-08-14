'use client';

import { useState } from 'react';
import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

function GravelCalculatorContent() {
  const meta = tools.find(t => t.slug === 'gravel-calculator');
  const [length, setLength] = useState<number>(10);
  const [width, setWidth] = useState<number>(10);
  const [depth, setDepth] = useState<number>(0.15);
  const [unit, setUnit] = useState<'m' | 'ft'>('m');
  const [gravelType, setGravelType] = useState<'pea' | 'crushed' | 'river'>('pea');
  const [result, setResult] = useState<any>(null);

  const gravelDensities = {
    pea: { name: 'Pea Gravel', density: 1600 },
    crushed: { name: 'Crushed Stone', density: 1750 },
    river: { name: 'River Rock', density: 1800 }
  };

  const calculateGravel = () => {
    let len = length;
    let wid = width;
    let dep = depth;

    if (unit === 'ft') {
      len = length * 0.3048;
      wid = width * 0.3048;
      dep = depth * 0.3048;
    }

    const volume = len * wid * dep;
    const density = gravelDensities[gravelType].density;
    const weight = volume * density;
    const tons = weight / 1000;
    const truckLoads = Math.ceil(tons / 15);

    setResult({
      volume,
      weight,
      tons,
      truckLoads,
      gravelType: gravelDensities[gravelType].name,
      area: len * wid
    });
  };

  const resetCalculator = () => {
    setResult(null);
    setLength(10);
    setWidth(10);
    setDepth(0.15);
    setGravelType('pea');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-2">Gravel Calculator</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Calculate gravel volume for driveways, pathways, and drainage.</p>

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
            <label className="block text-sm font-medium mb-2">Gravel Type</label>
            <Select
              value={gravelType}
              onChange={(e) => setGravelType(e.target.value as 'pea' | 'crushed' | 'river')}
              options={[
                { value: 'pea', label: 'Pea Gravel' },
                { value: 'crushed', label: 'Crushed Stone' },
                { value: 'river', label: 'River Rock' }
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Length</label>
            <Input
              type="number"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              min={0.1}
              step={0.1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Width</label>
            <Input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              min={0.1}
              step={0.1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Depth</label>
            <Input
              type="number"
              value={depth}
              onChange={(e) => setDepth(Number(e.target.value))}
              min={0.01}
              step={0.01}
            />
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button onClick={calculateGravel} className="flex-1">
            Calculate Gravel
          </Button>
          <Button variant="outline" onClick={resetCalculator}>
            Reset
          </Button>
        </div>

        {result && (
          <div className="mt-6 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <h3 className="font-bold text-lg mb-4">Gravel Calculation Results</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Gravel Type</p>
                <p className="text-lg font-bold">{result.gravelType}</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Area</p>
                <p className="text-lg font-bold">{result.area.toFixed(2)} m²</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Volume</p>
                <p className="text-lg font-bold">{result.volume.toFixed(2)} m³</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Weight</p>
                <p className="text-lg font-bold">{result.weight.toFixed(0)} kg</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg md:col-span-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">Tons Needed</p>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{result.tons.toFixed(1)} tons</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg md:col-span-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">Truck Loads (15 tons)</p>
                <p className="text-xl font-bold">{result.truckLoads} trucks</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-600 dark:text-amber-400">💡 Order 10-15% extra for compaction and settling.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GravelCalculator() {
  const meta = tools.find(t => t.slug === 'gravel-calculator');
  return (
    <EnhancedToolWrapper meta={meta}>
      <GravelCalculatorContent />
    </EnhancedToolWrapper>
  );
}
