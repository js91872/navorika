'use client';

import { tools } from '@/data/registry';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { calculateBulkMaterial } from '@/lib/calculations/constructionQuantities';

type GravelResult = ReturnType<typeof calculateBulkMaterial>;

export default function GravelCalculator() {
  const meta = tools.find(t => t.slug === 'gravel-calculator');
  const [length, setLength] = useState<number>(10);
  const [width, setWidth] = useState<number>(10);
  const [depth, setDepth] = useState<number>(0.15);
  const [unit, setUnit] = useState<'m' | 'ft'>('m');
  const [gravelType, setGravelType] = useState<'pea' | 'crushed' | 'river'>('pea');
  const [density, setDensity] = useState(1600);
  const [wastePercent, setWastePercent] = useState(5);
  const [truckPayloadKg, setTruckPayloadKg] = useState(15000);
  const [result, setResult] = useState<GravelResult | null>(null);
  const [error, setError] = useState('');

  const gravelDensities = {
    pea: { name: 'Pea Gravel', density: 1600 },
    crushed: { name: 'Crushed Stone', density: 1750 },
    river: { name: 'River Rock', density: 1800 }
  };

  const calculateGravel = () => {
    try {
      setResult(calculateBulkMaterial({ length, width, depth, unit, densityKgM3: density, wastePercent, truckPayloadKg }));
      setError('');
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : 'Check the material inputs.');
    }
  };

  const resetCalculator = () => {
    setResult(null);
    setLength(10);
    setWidth(10);
    setDepth(0.15);
    setGravelType('pea');
    setDensity(1600);
    setWastePercent(5);
    setTruckPayloadKg(15000);
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-2">Gravel Calculator</h1>
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
              onChange={(e) => {
                const next = e.target.value as 'pea' | 'crushed' | 'river';
                setGravelType(next);
                setDensity(gravelDensities[next].density);
              }}
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
          <div>
            <label className="block text-sm font-medium mb-2">Bulk Density (kg/m³)</label>
            <Input type="number" value={density} onChange={(e) => setDensity(Number(e.target.value))} min={1} step={10} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Waste / Settlement Allowance (%)</label>
            <Input type="number" value={wastePercent} onChange={(e) => setWastePercent(Number(e.target.value))} min={0} step={1} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Truck Payload (kg)</label>
            <Input type="number" value={truckPayloadKg} onChange={(e) => setTruckPayloadKg(Number(e.target.value))} min={1} step={100} />
          </div>
        </div>

        {error && <p role="alert" className="mt-6 text-sm text-red-600">{error}</p>}
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
                <p className="text-lg font-bold">{gravelDensities[gravelType].name}</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Area</p>
                <p className="text-lg font-bold">{result.areaM2.toFixed(2)} m²</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Volume</p>
                <p className="text-lg font-bold">{result.measuredVolumeM3.toFixed(2)} m³ measured / {result.orderVolumeM3.toFixed(2)} m³ to order</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Weight</p>
                <p className="text-lg font-bold">{result.weightKg.toFixed(0)} kg</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg md:col-span-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">Tons Needed</p>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{result.tonnes.toFixed(1)} metric tonnes</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg md:col-span-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">Truck Loads ({(truckPayloadKg / 1000).toFixed(1)} t payload)</p>
                <p className="text-xl font-bold">{result.truckLoads} trucks</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-600 dark:text-amber-400">Weight uses the editable bulk density and includes the entered {wastePercent}% allowance. Confirm delivered density, compaction/settlement and lawful payload with the supplier.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
