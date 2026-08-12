'use client';

import { useState } from 'react';
import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

function CementCalculatorContent() {
  const meta = tools.find(t => t.slug === 'cement-calculator');
  const [volume, setVolume] = useState<number>(1);
  const [unit, setUnit] = useState<'cubic' | 'cubic_m' | 'cubic_ft'>('cubic_m');
  const [mixRatio, setMixRatio] = useState<'1:2:3' | '1:1.5:3' | '1:3:6'>('1:2:3');
  const [bagSize, setBagSize] = useState<number>(50);
  const [result, setResult] = useState<any>(null);

  const ratioMap = {
    '1:2:3': { cement: 1, sand: 2, aggregate: 3 },
    '1:1.5:3': { cement: 1, sand: 1.5, aggregate: 3 },
    '1:3:6': { cement: 1, sand: 3, aggregate: 6 }
  };

  const calculateCement = () => {
    let volumeInM3 = volume;
    if (unit === 'cubic_ft') volumeInM3 = volume / 35.315;
    else if (unit === 'cubic') volumeInM3 = volume * 0.0283;

    const ratio = ratioMap[mixRatio];
    const totalParts = ratio.cement + ratio.sand + ratio.aggregate;
    
    const cementPart = (volumeInM3 * ratio.cement) / totalParts;
    const sandPart = (volumeInM3 * ratio.sand) / totalParts;
    const aggregatePart = (volumeInM3 * ratio.aggregate) / totalParts;

    const cementWeight = cementPart * 1440;
    const cementBags = cementWeight / bagSize;

    setResult({
      totalVolume: volumeInM3,
      cementBags: Math.ceil(cementBags),
      cementWeight: cementWeight,
      sandVolume: sandPart,
      aggregateVolume: aggregatePart
    });
  };

  const resetCalculator = () => {
    setResult(null);
    setVolume(1);
    setMixRatio('1:2:3');
    setBagSize(50);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-2">Cement Calculator</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Calculate the exact number of cement bags needed for your concrete work.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Concrete Volume</label>
            <div className="flex gap-3">
              <Input
                type="number"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="flex-1"
                min={0.1}
                step={0.1}
              />
              <Select
                value={unit}
                onChange={(e) => setUnit(e.target.value as 'cubic' | 'cubic_m' | 'cubic_ft')}
                options={[
                  { value: 'cubic_m', label: 'm³' },
                  { value: 'cubic', label: 'cu yd' },
                  { value: 'cubic_ft', label: 'ft³' }
                ]}
                className="w-32"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mix Ratio (Cement:Sand:Aggregate)</label>
            <Select
              value={mixRatio}
              onChange={(e) => setMixRatio(e.target.value as '1:2:3' | '1:1.5:3' | '1:3:6')}
              options={[
                { value: '1:2:3', label: '1:2:3 (Standard)' },
                { value: '1:1.5:3', label: '1:1.5:3 (Strong)' },
                { value: '1:3:6', label: '1:3:6 (Foundation)' }
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cement Bag Size (kg)</label>
            <Select
              value={bagSize.toString()}
              onChange={(e) => setBagSize(Number(e.target.value))}
              options={[
                { value: '25', label: '25 kg' },
                { value: '40', label: '40 kg' },
                { value: '50', label: '50 kg (Standard)' }
              ]}
            />
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button onClick={calculateCement} className="flex-1">
            Calculate Cement
          </Button>
          <Button variant="outline" onClick={resetCalculator}>
            Reset
          </Button>
        </div>

        {result && (
          <div className="mt-6 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <h3 className="font-bold text-lg mb-4">Results</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Cement Bags Needed</p>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{result.cementBags}</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Cement Weight</p>
                <p className="text-2xl font-bold">{result.cementWeight.toFixed(0)} kg</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Sand Required</p>
                <p className="text-lg font-bold">{result.sandVolume.toFixed(3)} m³</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Aggregate Required</p>
                <p className="text-lg font-bold">{result.aggregateVolume.toFixed(3)} m³</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <p className="text-sm text-emerald-600 dark:text-emerald-400">💡 Consider adding 5-10% extra for wastage and spillage.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CementCalculator() {
  const meta = tools.find(t => t.slug === 'cement-calculator');
  return (
    <EnhancedToolWrapper meta={meta}>
      <CementCalculatorContent />
    </EnhancedToolWrapper>
  );
}
