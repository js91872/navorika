'use client';

import { useState } from 'react';
import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

function ExcavationCalculatorContent() {
  const meta = tools.find(t => t.slug === 'excavation-calculator');
  const [length, setLength] = useState<number>(10);
  const [width, setWidth] = useState<number>(10);
  const [depth, setDepth] = useState<number>(1);
  const [unit, setUnit] = useState<'m' | 'ft'>('m');
  const [soilType, setSoilType] = useState<'loose' | 'compacted' | 'rock'>('loose');
  const [result, setResult] = useState<any>(null);

  const soilFactors = {
    loose: { name: 'Loose Soil', factor: 1.0, density: 1600 },
    compacted: { name: 'Compacted Soil', factor: 1.2, density: 2000 },
    rock: { name: 'Rock', factor: 1.5, density: 2600 }
  };

  const calculateExcavation = () => {
    let len = length;
    let wid = width;
    let dep = depth;

    if (unit === 'ft') {
      len = length * 0.3048;
      wid = width * 0.3048;
      dep = depth * 0.3048;
    }

    const volumeM3 = len * wid * dep;
    const factor = soilFactors[soilType];
    const volumeWithFactor = volumeM3 * factor.factor;
    const weight = volumeWithFactor * factor.density;
    const truckLoads = Math.ceil(weight / 15000);

    setResult({
      volumeM3,
      volumeWithFactor,
      weight,
      truckLoads,
      soilType: factor.name,
      dimensions: { length: len, width: wid, depth: dep }
    });
  };

  const resetCalculator = () => {
    setResult(null);
    setLength(10);
    setWidth(10);
    setDepth(1);
    setSoilType('loose');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-2">Excavation Calculator</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Calculate soil excavation volume for foundations and basements.</p>

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
            <label className="block text-sm font-medium mb-2">Soil Type</label>
            <Select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value as 'loose' | 'compacted' | 'rock')}
              options={[
                { value: 'loose', label: 'Loose Soil' },
                { value: 'compacted', label: 'Compacted Soil' },
                { value: 'rock', label: 'Rock' }
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
              min={0.1}
              step={0.1}
            />
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button onClick={calculateExcavation} className="flex-1">
            Calculate Excavation
          </Button>
          <Button variant="outline" onClick={resetCalculator}>
            Reset
          </Button>
        </div>

        {result && (
          <div className="mt-6 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <h3 className="font-bold text-lg mb-4">Excavation Results</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Soil Type</p>
                <p className="text-lg font-bold">{result.soilType}</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Volume (m³)</p>
                <p className="text-lg font-bold">{result.volumeM3.toFixed(2)} m³</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Adjusted Volume</p>
                <p className="text-lg font-bold">{result.volumeWithFactor.toFixed(2)} m³</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Weight</p>
                <p className="text-lg font-bold">{result.weight.toFixed(0)} kg</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg md:col-span-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">Truck Loads (15 ton)</p>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{result.truckLoads} trucks</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-600 dark:text-amber-400">💡 Add 10-15% extra for sloped sides and excavation overbreak.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExcavationCalculator() {
  const meta = tools.find(t => t.slug === 'excavation-calculator');
  return (
    <EnhancedToolWrapper meta={meta}>
      <ExcavationCalculatorContent />
    </EnhancedToolWrapper>
  );
}
