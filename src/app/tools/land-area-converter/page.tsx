'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

export default function LandAreaConverter() {
  const [value, setValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<'sqft' | 'sqm' | 'acre' | 'hectare' | 'sqyd'>('acre');
  const [toUnit, setToUnit] = useState<'sqft' | 'sqm' | 'acre' | 'hectare' | 'sqyd'>('sqft');
  const [result, setResult] = useState<any>(null);

  const conversionFactors: { [key: string]: number } = {
    sqft: 1,
    sqm: 10.763910416709722,
    acre: 43560,
    hectare: 107639.10416709722,
    sqyd: 9
  };

  const unitLabels = {
    sqft: 'Square Feet (sq ft)',
    sqm: 'Square Meters (m²)',
    acre: 'Acres',
    hectare: 'Hectares (ha)',
    sqyd: 'Square Yards (sq yd)'
  };

  const convertArea = () => {
    const factorFrom = conversionFactors[fromUnit];
    const factorTo = conversionFactors[toUnit];
    const inSqft = value * factorFrom;
    const convertedValue = inSqft / factorTo;

    setResult({
      originalValue: value,
      fromUnit: unitLabels[fromUnit],
      toUnit: unitLabels[toUnit],
      convertedValue: convertedValue,
      inSqft: inSqft
    });
  };

  const resetConverter = () => {
    setResult(null);
    setValue(1);
    setFromUnit('acre');
    setToUnit('sqft');
  };

  const formatNumber = (num: number) => {
    if (num > 1000000) {
      return num.toExponential(2);
    }
    return num.toLocaleString(undefined, { maximumFractionDigits: 4 });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-2">Land Area Converter</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Convert between different land measurement units and area formats.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Value</label>
            <Input
              type="number"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              min={0}
              step={0.01}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">From Unit</label>
            <Select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value as any)}
              options={[
                { value: 'sqft', label: unitLabels.sqft },
                { value: 'sqm', label: unitLabels.sqm },
                { value: 'acre', label: unitLabels.acre },
                { value: 'hectare', label: unitLabels.hectare },
                { value: 'sqyd', label: unitLabels.sqyd }
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">To Unit</label>
            <Select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value as any)}
              options={[
                { value: 'sqft', label: unitLabels.sqft },
                { value: 'sqm', label: unitLabels.sqm },
                { value: 'acre', label: unitLabels.acre },
                { value: 'hectare', label: unitLabels.hectare },
                { value: 'sqyd', label: unitLabels.sqyd }
              ]}
            />
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button onClick={convertArea} className="flex-1">
            Convert
          </Button>
          <Button variant="outline" onClick={resetConverter}>
            Reset
          </Button>
        </div>

        {result && (
          <div className="mt-6 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <h3 className="font-bold text-lg mb-4">Conversion Result</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">From</p>
                <p className="text-xl font-bold">{result.originalValue} {result.fromUnit}</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">To</p>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{formatNumber(result.convertedValue)} {result.toUnit}</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg md:col-span-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">Equivalent in Square Feet</p>
                <p className="text-xl font-bold">{formatNumber(result.inSqft)} sq ft</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-600 dark:text-blue-400">Conversions use fixed international area-unit relationships and rounded display values.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
