'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

function FlooringCalculatorContent() {
  const meta = tools.find(t => t.slug === 'flooring-calculator');
  const [length, setLength] = useState<number>(10);
  const [width, setWidth] = useState<number>(10);
  const [unit, setUnit] = useState<'m' | 'ft'>('m');
  const [flooringType, setFlooringType] = useState<'hardwood' | 'laminate' | 'vinyl' | 'carpet' | 'tile'>('hardwood');
  const [costPerSqft, setCostPerSqft] = useState<number>(8);
  const [laborCost, setLaborCost] = useState<number>(3);
  const [wastage, setWastage] = useState<number>(10);
  const [result, setResult] = useState<any>(null);

  const flooringCosts = {
    hardwood: { name: 'Hardwood', avgCost: 8 },
    laminate: { name: 'Laminate', avgCost: 4 },
    vinyl: { name: 'Vinyl', avgCost: 3 },
    carpet: { name: 'Carpet', avgCost: 5 },
    tile: { name: 'Tile', avgCost: 6 }
  };

  const calculateFlooring = () => {
    let len = length;
    let wid = width;

    if (unit === 'ft') {
      len = length * 0.3048;
      wid = width * 0.3048;
    }

    const areaSqft = len * wid * 10.764;
    const areaSqftWithWastage = areaSqft * (1 + wastage / 100);
    const materialCost = areaSqftWithWastage * costPerSqft;
    const laborCostTotal = areaSqftWithWastage * laborCost;
    const totalCost = materialCost + laborCostTotal;

    setResult({
      areaSqft,
      areaSqftWithWastage,
      materialCost,
      laborCostTotal,
      totalCost,
      costPerSqft,
      laborCost,
      flooringType: flooringCosts[flooringType].name
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const resetCalculator = () => {
    setResult(null);
    setLength(10);
    setWidth(10);
    setFlooringType('hardwood');
    setCostPerSqft(8);
    setLaborCost(3);
    setWastage(10);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-2">Flooring Calculator</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Estimate flooring materials including hardwood, laminate, and vinyl.</p>

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
            <label className="block text-sm font-medium mb-2">Room Length</label>
            <Input
              type="number"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              min={0.1}
              step={0.1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Room Width</label>
            <Input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              min={0.1}
              step={0.1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Flooring Type</label>
            <Select
              value={flooringType}
              onChange={(e) => {
                const type = e.target.value as 'hardwood' | 'laminate' | 'vinyl' | 'carpet' | 'tile';
                setFlooringType(type);
                setCostPerSqft(flooringCosts[type].avgCost);
              }}
              options={[
                { value: 'hardwood', label: 'Hardwood ($8/sqft)' },
                { value: 'laminate', label: 'Laminate ($4/sqft)' },
                { value: 'vinyl', label: 'Vinyl ($3/sqft)' },
                { value: 'carpet', label: 'Carpet ($5/sqft)' },
                { value: 'tile', label: 'Tile ($6/sqft)' }
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cost per sq ft</label>
            <Input
              type="number"
              value={costPerSqft}
              onChange={(e) => setCostPerSqft(Number(e.target.value))}
              min={1}
              step={0.5}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Labor Cost (per sq ft)</label>
            <Input
              type="number"
              value={laborCost}
              onChange={(e) => setLaborCost(Number(e.target.value))}
              min={0}
              step={0.5}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Wastage (%)</label>
            <Input
              type="number"
              value={wastage}
              onChange={(e) => setWastage(Number(e.target.value))}
              min={0}
              max={20}
              step={1}
            />
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button onClick={calculateFlooring} className="flex-1">
            Calculate Flooring
          </Button>
          <Button variant="outline" onClick={resetCalculator}>
            Reset
          </Button>
        </div>

        {result && (
          <div className="mt-6 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <h3 className="font-bold text-lg mb-4">Flooring Cost Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Flooring Type</span>
                <span className="font-medium">{result.flooringType}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Area (with wastage)</span>
                <span className="font-medium">{result.areaSqftWithWastage.toFixed(0)} sq ft</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Material Cost</span>
                <span className="font-medium">{formatCurrency(result.materialCost)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Labor Cost</span>
                <span className="font-medium">{formatCurrency(result.laborCostTotal)}</span>
              </div>
              <div className="flex justify-between py-3 text-lg font-bold">
                <span>Total Cost</span>
                <span className="text-indigo-600 dark:text-indigo-400">{formatCurrency(result.totalCost)}</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <p className="text-sm text-emerald-600 dark:text-emerald-400">💡 Cost per sq ft: {formatCurrency(result.costPerSqft)} + {formatCurrency(result.laborCost)} labor = {formatCurrency(result.costPerSqft + result.laborCost)}/sq ft</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FlooringCalculatorWrapper() {
  const meta = tools.find(t => t.slug === 'flooring-calculator');
  return (
    <EnhancedToolWrapper meta={meta}>
      <FlooringCalculatorContent />
    </EnhancedToolWrapper>
  );
}
