'use client';

import { useState } from 'react';
import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

function RoofAreaCalculatorContent() {
  const meta = tools.find(t => t.slug === 'roof-area-calculator');
  const [length, setLength] = useState<number>(10);
  const [width, setWidth] = useState<number>(10);
  const [pitch, setPitch] = useState<number>(4);
  const [unit, setUnit] = useState<'m' | 'ft'>('m');
  const [overhang, setOverhang] = useState<number>(0.3);
  const [result, setResult] = useState<any>(null);

  const calculateRoof = () => {
    let len = length;
    let wid = width;

    if (unit === 'ft') {
      len = length * 0.3048;
      wid = width * 0.3048;
    }

    const pitchFactor = Math.sqrt(1 + Math.pow(pitch / 12, 2));
    const totalLength = len + (2 * overhang);
    const totalWidth = wid + (2 * overhang);
    const flatArea = totalLength * totalWidth;
    const roofArea = flatArea * pitchFactor;

    const shinglesNeeded = roofArea * 1.1;
    const bundlesNeeded = Math.ceil(shinglesNeeded / 3.33);
    const squaresNeeded = Math.ceil(roofArea / 9.29);

    setResult({
      roofArea,
      flatArea,
      pitchFactor,
      shinglesNeeded,
      bundlesNeeded,
      squaresNeeded,
      totalLength,
      totalWidth,
      pitch
    });
  };

  const resetCalculator = () => {
    setResult(null);
    setLength(10);
    setWidth(10);
    setPitch(4);
    setOverhang(0.3);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-2">Roof Area Calculator</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Calculate roof area, slope, and materials needed for roofing.</p>

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
            <label className="block text-sm font-medium mb-2">Building Length</label>
            <Input
              type="number"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              min={0.1}
              step={0.1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Building Width</label>
            <Input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              min={0.1}
              step={0.1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Roof Pitch (rise per 12)</label>
            <Input
              type="number"
              value={pitch}
              onChange={(e) => setPitch(Number(e.target.value))}
              min={0}
              max={12}
              step={0.5}
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">e.g., 4/12 pitch means 4" rise per 12" run</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Overhang (meters)</label>
            <Input
              type="number"
              value={overhang}
              onChange={(e) => setOverhang(Number(e.target.value))}
              min={0}
              step={0.05}
            />
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button onClick={calculateRoof} className="flex-1">
            Calculate Roof Area
          </Button>
          <Button variant="outline" onClick={resetCalculator}>
            Reset
          </Button>
        </div>

        {result && (
          <div className="mt-6 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <h3 className="font-bold text-lg mb-4">Roof Calculation Results</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Flat Area</p>
                <p className="text-lg font-bold">{result.flatArea.toFixed(2)} m²</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Roof Area (with pitch)</p>
                <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{result.roofArea.toFixed(2)} m²</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Pitch Factor</p>
                <p className="text-lg font-bold">{result.pitchFactor.toFixed(3)}</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Squares (100 sq ft)</p>
                <p className="text-lg font-bold">{result.squaresNeeded}</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Shingles Needed</p>
                <p className="text-lg font-bold">{result.shinglesNeeded.toFixed(2)} m²</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Bundles of Shingles</p>
                <p className="text-lg font-bold">{result.bundlesNeeded} bundles</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-600 dark:text-blue-400">💡 Always add 10-15% extra for waste, cutting, and ridge caps.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RoofAreaCalculator() {
  const meta = tools.find(t => t.slug === 'roof-area-calculator');
  return (
    <EnhancedToolWrapper meta={meta}>
      <RoofAreaCalculatorContent />
    </EnhancedToolWrapper>
  );
}
