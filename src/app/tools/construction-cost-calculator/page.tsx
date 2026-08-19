'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

export default function ConstructionCostCalculator() {
  const [area, setArea] = useState<number>(1000);
  const [unit, setUnit] = useState<'sqft' | 'sqm'>('sqft');
  const [costPerUnit, setCostPerUnit] = useState<number>(150);
  const [laborPercent, setLaborPercent] = useState<number>(30);
  const [materialPercent, setMaterialPercent] = useState<number>(50);
  const [overheadPercent, setOverheadPercent] = useState<number>(10);
  const [contingencyPercent, setContingencyPercent] = useState<number>(10);
  const [result, setResult] = useState<any>(null);

  const calculateCost = () => {
    const areaInSqft = unit === 'sqft' ? area : area * 10.763910416709722;
    const baseCost = areaInSqft * costPerUnit;
    const allocationTotal = laborPercent + materialPercent;
    const labor = allocationTotal > 0 ? baseCost * (laborPercent / allocationTotal) : 0;
    const materials = allocationTotal > 0 ? baseCost * (materialPercent / allocationTotal) : 0;
    const overhead = baseCost * (overheadPercent / 100);
    const subtotal = baseCost + overhead;
    const contingency = subtotal * (contingencyPercent / 100);
    const total = subtotal + contingency;
    const perSqft = total / areaInSqft;

    setResult({
      baseCost,
      labor,
      materials,
      overhead,
      contingency,
      total,
      perSqft,
      areaInSqft
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
    setArea(1000);
    setCostPerUnit(150);
    setLaborPercent(30);
    setMaterialPercent(50);
    setOverheadPercent(10);
    setContingencyPercent(10);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-2">Construction Cost Calculator</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Calculate total construction costs including materials, labor, overhead, and contingency.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Project Area</label>
            <div className="flex gap-3">
              <Input
                type="number"
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                className="flex-1"
                min={1}
              />
              <Select
                value={unit}
                onChange={(e) => setUnit(e.target.value as 'sqft' | 'sqm')}
                options={[
                  { value: 'sqft', label: 'sq ft' },
                  { value: 'sqm', label: 'sq m' }
                ]}
                className="w-32"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Direct Construction Rate (USD/sq ft)</label>
            <Input
              type="number"
              value={costPerUnit}
              onChange={(e) => setCostPerUnit(Number(e.target.value))}
              min={1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Labor Allocation Weight</label>
            <Input
              type="number"
              value={laborPercent}
              onChange={(e) => setLaborPercent(Number(e.target.value))}
              min={0}
              max={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Material Allocation Weight</label>
            <Input
              type="number"
              value={materialPercent}
              onChange={(e) => setMaterialPercent(Number(e.target.value))}
              min={0}
              max={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Overhead (% of base cost)</label>
            <Input
              type="number"
              value={overheadPercent}
              onChange={(e) => setOverheadPercent(Number(e.target.value))}
              min={0}
              max={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contingency (% of base cost)</label>
            <Input
              type="number"
              value={contingencyPercent}
              onChange={(e) => setContingencyPercent(Number(e.target.value))}
              min={0}
              max={100}
            />
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button onClick={calculateCost} className="flex-1">
            Calculate Cost
          </Button>
          <Button variant="outline" onClick={resetCalculator}>
            Reset
          </Button>
        </div>

        {result && (
          <div className="mt-6 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <h3 className="font-bold text-lg mb-4">Cost Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Base Construction</span>
                <span className="font-medium">{formatCurrency(result.baseCost)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Labor</span>
                <span className="font-medium">{formatCurrency(result.labor)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Materials</span>
                <span className="font-medium">{formatCurrency(result.materials)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Overhead</span>
                <span className="font-medium">{formatCurrency(result.overhead)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Contingency</span>
                <span className="font-medium">{formatCurrency(result.contingency)}</span>
              </div>
              <div className="flex justify-between py-3 text-lg font-bold">
                <span>Total Cost</span>
                <span className="text-indigo-600 dark:text-indigo-400">{formatCurrency(result.total)}</span>
              </div>
              <div className="flex justify-between py-2 bg-slate-100 dark:bg-slate-700 rounded-lg px-3">
                <span className="text-sm">Cost per sq ft</span>
                <span className="font-medium">{formatCurrency(result.perSqft)}</span>
              </div>
              <div className="flex justify-between py-2 bg-slate-100 dark:bg-slate-700 rounded-lg px-3">
                <span className="text-sm">Total Area</span>
                <span className="font-medium">{result.areaInSqft.toFixed(0)} sq ft</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <p className="text-sm text-emerald-600 dark:text-emerald-400">Labor and material values allocate the direct cost; they are not added again. Enter a current project-specific USD rate and confirm scope, taxes, escalation, exclusions, and contingency professionally.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
