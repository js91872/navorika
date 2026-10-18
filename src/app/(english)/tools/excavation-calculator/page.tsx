'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { calculateExcavation as calculateExcavationQuantity } from '@/lib/calculations/constructionQuantities';

type ExcavationResult = ReturnType<typeof calculateExcavationQuantity>;

export default function ExcavationCalculator() {
  const [length, setLength] = useState<number>(10);
  const [width, setWidth] = useState<number>(10);
  const [depth, setDepth] = useState<number>(1);
  const [unit, setUnit] = useState<'m' | 'ft'>('m');
  const [swellPercent, setSwellPercent] = useState<number>(20);
  const [looseDensity, setLooseDensity] = useState<number>(1600);
  const [truckPayload, setTruckPayload] = useState<number>(15000);
  const [result, setResult] = useState<ExcavationResult | null>(null);
  const [error, setError] = useState('');

  const calculateExcavation = () => {
    try {
      setResult(calculateExcavationQuantity({ length, width, depth, unit, swellPercent, looseDensityKgM3: looseDensity, truckPayloadKg: truckPayload }));
      setError('');
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : 'Check the excavation inputs.');
    }
  };

  const resetCalculator = () => {
    setResult(null);
    setLength(10);
    setWidth(10);
    setDepth(1);
    setSwellPercent(20);
    setLooseDensity(1600);
    setTruckPayload(15000);
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-2">Excavation Calculator</h1>
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
            <label className="block text-sm font-medium mb-2">Swell Allowance (%)</label>
            <Input type="number" value={swellPercent} onChange={(e) => setSwellPercent(Number(e.target.value))} min={0} max={100} step={1} />
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
          <div>
            <label className="block text-sm font-medium mb-2">Loose Material Density (kg/m³)</label>
            <Input type="number" value={looseDensity} onChange={(e) => setLooseDensity(Number(e.target.value))} min={100} step={10} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Truck Payload (kg)</label>
            <Input type="number" value={truckPayload} onChange={(e) => setTruckPayload(Number(e.target.value))} min={100} step={100} />
          </div>
        </div>

        {error && <p role="alert" className="mt-6 text-sm text-red-600">{error}</p>}
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
                <p className="text-sm text-slate-500 dark:text-slate-400">Entered Swell</p>
                <p className="text-lg font-bold">{swellPercent}%</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Volume (m³)</p>
                <p className="text-lg font-bold">{result.bankVolumeM3.toFixed(2)} m³</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Loose Volume</p>
                <p className="text-lg font-bold">{result.looseVolumeM3.toFixed(2)} m³</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Weight</p>
                <p className="text-lg font-bold">{result.looseWeightKg.toFixed(0)} kg</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg md:col-span-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">Truck Loads ({(truckPayload / 1000).toFixed(1)} t payload)</p>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{result.truckLoads} trucks</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-600 dark:text-amber-400">Use site-specific swell, loose density, and lawful payload values. Sloped sides, shoring clearance, overbreak, groundwater, access, and axle limits are not modeled.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
