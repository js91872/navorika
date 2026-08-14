'use client';

import { useState } from 'react';
import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

function AsphaltCalculatorContent() {
  const meta = tools.find(t => t.slug === 'asphalt-calculator');
  const [length, setLength] = useState<number>(20);
  const [width, setWidth] = useState<number>(10);
  const [thickness, setThickness] = useState<number>(75);
  const [unit, setUnit] = useState<'m' | 'ft'>('m');
  const [thicknessUnit, setThicknessUnit] = useState<'mm' | 'inch'>('mm');
  const [asphaltDensity, setAsphaltDensity] = useState<number>(2240);
  const [wastage, setWastage] = useState<number>(5);
  const [result, setResult] = useState<any>(null);

  const calculateAsphalt = () => {
    let len = length;
    let wid = width;

    if (unit === 'ft') {
      len = length * 0.3048;
      wid = width * 0.3048;
    }

    let thick = thickness;
    if (thicknessUnit === 'inch') {
      thick = thickness * 25.4;
    }
    const thickM = thick / 1000;

    const volume = len * wid * thickM;
    const weight = volume * asphaltDensity;
    const tons = weight / 1000;
    const tonsWithWaste = tons * (1 + wastage / 100);
    const truckLoads = Math.ceil(tonsWithWaste / 20);

    setResult({
      volume,
      weight,
      tons: tonsWithWaste,
      truckLoads,
      area: len * wid,
      thickness: thick
    });
  };

  const resetCalculator = () => {
    setResult(null);
    setLength(20);
    setWidth(10);
    setThickness(75);
    setAsphaltDensity(2240);
    setWastage(5);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-2">Asphalt Calculator</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Estimate asphalt quantity for driveways, roads, and parking lots.</p>

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
            <label className="block text-sm font-medium mb-2">Thickness</label>
            <div className="flex gap-3">
              <Input
                type="number"
                value={thickness}
                onChange={(e) => setThickness(Number(e.target.value))}
                className="flex-1"
                min={25}
                step={5}
              />
              <Select
                value={thicknessUnit}
                onChange={(e) => setThicknessUnit(e.target.value as 'mm' | 'inch')}
                options={[
                  { value: 'mm', label: 'mm' },
                  { value: 'inch', label: 'in' }
                ]}
                className="w-24"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Asphalt Density (kg/m³)</label>
            <Input
              type="number"
              value={asphaltDensity}
              onChange={(e) => setAsphaltDensity(Number(e.target.value))}
              min={2000}
              max={2500}
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Typical: 2240 kg/m³</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Wastage (%)</label>
            <Input
              type="number"
              value={wastage}
              onChange={(e) => setWastage(Number(e.target.value))}
              min={0}
              max={15}
              step={1}
            />
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button onClick={calculateAsphalt} className="flex-1">
            Calculate Asphalt
          </Button>
          <Button variant="outline" onClick={resetCalculator}>
            Reset
          </Button>
        </div>

        {result && (
          <div className="mt-6 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <h3 className="font-bold text-lg mb-4">Asphalt Calculation Results</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Area</p>
                <p className="text-lg font-bold">{result.area.toFixed(2)} m²</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Thickness</p>
                <p className="text-lg font-bold">{result.thickness.toFixed(0)} mm</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Volume</p>
                <p className="text-lg font-bold">{result.volume.toFixed(2)} m³</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg md:col-span-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">Asphalt Needed (with wastage)</p>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{result.tons.toFixed(1)} Tons</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg md:col-span-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">Truck Loads (20 tons)</p>
                <p className="text-xl font-bold">{result.truckLoads} trucks</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-600 dark:text-amber-400">💡 Order {result.truckLoads} trucks to be safe. Asphalt must be laid while hot!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AsphaltCalculator() {
  const meta = tools.find(t => t.slug === 'asphalt-calculator');
  return (
    <EnhancedToolWrapper meta={meta}>
      <AsphaltCalculatorContent />
    </EnhancedToolWrapper>
  );
}
