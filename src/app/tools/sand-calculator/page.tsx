'use client';

import { useState } from 'react';
import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

function SandCalculatorContent() {
  const meta = tools.find(t => t.slug === 'sand-calculator');
  const [length, setLength] = useState<number>(10);
  const [width, setWidth] = useState<number>(10);
  const [depth, setDepth] = useState<number>(0.5);
  const [unit, setUnit] = useState<'m' | 'ft'>('m');
  const [sandDensity, setSandDensity] = useState<number>(1600);
  const [result, setResult] = useState<any>(null);

  const calculateSand = () => {
    let len = length;
    let wid = width;
    let dep = depth;
    
    if (unit === 'ft') {
      len = length * 0.3048;
      wid = width * 0.3048;
      dep = depth * 0.3048;
    }

    const volume = len * wid * dep;
    const weight = volume * sandDensity;
    const truckLoads = Math.ceil(weight / 15000);
    const bags = Math.ceil(weight / 25);

    setResult({
      volume,
      weight,
      truckLoads,
      bags,
      length: len,
      width: wid,
      depth: dep
    });
  };

  const resetCalculator = () => {
    setResult(null);
    setLength(10);
    setWidth(10);
    setDepth(0.5);
    setSandDensity(1600);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-2">Sand Calculator</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Calculate sand volume and weight for construction projects.</p>

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

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Sand Density (kg/m³)</label>
            <Input
              type="number"
              value={sandDensity}
              onChange={(e) => setSandDensity(Number(e.target.value))}
              min={1400}
              max={1800}
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Typical range: 1400-1800 kg/m³</p>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button onClick={calculateSand} className="flex-1">
            Calculate Sand
          </Button>
          <Button variant="outline" onClick={resetCalculator}>
            Reset
          </Button>
        </div>

        {result && (
          <div className="mt-6 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <h3 className="font-bold text-lg mb-4">Sand Calculation Results</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Sand Volume</p>
                <p className="text-2xl font-bold">{result.volume.toFixed(2)} m³</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Sand Weight</p>
                <p className="text-2xl font-bold">{result.weight.toFixed(0)} kg</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Truck Loads (15 ton)</p>
                <p className="text-lg font-bold">{result.truckLoads} trucks</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">25kg Bags</p>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{result.bags} bags</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-600 dark:text-amber-400">💡 Always order 5-10% extra sand to account for wastage and compaction.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SandCalculator() {
  const meta = tools.find(t => t.slug === 'sand-calculator');
  return (
    <EnhancedToolWrapper meta={meta}>
      <SandCalculatorContent />
    </EnhancedToolWrapper>
  );
}
