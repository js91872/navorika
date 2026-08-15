'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

function RebarCalculatorContent() {
  const meta = tools.find(t => t.slug === 'rebar-calculator');
  const [length, setLength] = useState<number>(10);
  const [width, setWidth] = useState<number>(10);
  const [barSize, setBarSize] = useState<number>(12);
  const [spacing, setSpacing] = useState<number>(150);
  const [cover, setCover] = useState<number>(25);
  const [direction, setDirection] = useState<'both' | 'lengthwise' | 'widthwise'>('both');
  const [result, setResult] = useState<any>(null);

  const barWeights: { [key: number]: number } = {
    8: 0.395,
    10: 0.617,
    12: 0.888,
    16: 1.579,
    20: 2.467,
    25: 3.854,
    32: 6.313
  };

  const calculateRebar = () => {
    const coverM = cover / 1000;
    const spacingM = spacing / 1000;
    const lengthM = length - (2 * coverM);
    const widthM = width - (2 * coverM);
    const weightPerMeter = barWeights[barSize] || 0.888;

    let barsLengthwise = 0;
    let barsWidthwise = 0;
    let totalLength = 0;

    if (direction === 'both' || direction === 'lengthwise') {
      barsLengthwise = Math.floor(widthM / spacingM) + 1;
      totalLength += barsLengthwise * lengthM;
    }

    if (direction === 'both' || direction === 'widthwise') {
      barsWidthwise = Math.floor(lengthM / spacingM) + 1;
      totalLength += barsWidthwise * widthM;
    }

    const totalBars = barsLengthwise + barsWidthwise;
    const totalWeight = totalLength * weightPerMeter;

    setResult({
      totalBars,
      totalLength,
      totalWeight,
      barsLengthwise,
      barsWidthwise,
      weightPerMeter
    });
  };

  const resetCalculator = () => {
    setResult(null);
    setLength(10);
    setWidth(10);
    setBarSize(12);
    setSpacing(150);
    setCover(25);
    setDirection('both');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-2">Rebar Calculator</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Calculate rebar quantity and weight for reinforced concrete structures.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Slab Length (m)</label>
            <Input
              type="number"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              min={0.5}
              step={0.1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Slab Width (m)</label>
            <Input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              min={0.5}
              step={0.1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Bar Size (mm)</label>
            <Select
              value={barSize.toString()}
              onChange={(e) => setBarSize(Number(e.target.value))}
              options={[
                { value: '8', label: '8mm (#2.5)' },
                { value: '10', label: '10mm (#3)' },
                { value: '12', label: '12mm (#4)' },
                { value: '16', label: '16mm (#5)' },
                { value: '20', label: '20mm (#6)' },
                { value: '25', label: '25mm (#8)' },
                { value: '32', label: '32mm (#10)' }
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Spacing (mm)</label>
            <Input
              type="number"
              value={spacing}
              onChange={(e) => setSpacing(Number(e.target.value))}
              min={50}
              step={10}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cover (mm)</label>
            <Input
              type="number"
              value={cover}
              onChange={(e) => setCover(Number(e.target.value))}
              min={15}
              step={5}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Reinforcement Direction</label>
            <Select
              value={direction}
              onChange={(e) => setDirection(e.target.value as 'both' | 'lengthwise' | 'widthwise')}
              options={[
                { value: 'both', label: 'Both Directions' },
                { value: 'lengthwise', label: 'Lengthwise Only' },
                { value: 'widthwise', label: 'Widthwise Only' }
              ]}
            />
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button onClick={calculateRebar} className="flex-1">
            Calculate Rebar
          </Button>
          <Button variant="outline" onClick={resetCalculator}>
            Reset
          </Button>
        </div>

        {result && (
          <div className="mt-6 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <h3 className="font-bold text-lg mb-4">Rebar Results</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Bars</p>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{result.totalBars}</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Length</p>
                <p className="text-xl font-bold">{result.totalLength.toFixed(1)} m</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Weight</p>
                <p className="text-2xl font-bold">{result.totalWeight.toFixed(0)} kg</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Weight in Tons</p>
                <p className="text-lg font-bold">{(result.totalWeight / 1000).toFixed(2)} tons</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">Lengthwise Bars</p>
                <p className="font-bold">{result.barsLengthwise}</p>
              </div>
              <div className="p-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">Widthwise Bars</p>
                <p className="font-bold">{result.barsWidthwise}</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <p className="text-sm text-emerald-600 dark:text-emerald-400">💡 Consider adding 5-10% extra for lapping, wastage, and extras.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RebarCalculatorWrapper() {
  const meta = tools.find(t => t.slug === 'rebar-calculator');
  return (
    <EnhancedToolWrapper meta={meta}>
      <RebarCalculatorContent />
    </EnhancedToolWrapper>
  );
}
