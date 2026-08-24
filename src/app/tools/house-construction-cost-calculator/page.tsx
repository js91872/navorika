'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

export default function HouseConstructionCostCalculator() {
  const [area, setArea] = useState<number>(2000);
  const [unit, setUnit] = useState<'sqft' | 'sqm'>('sqft');
  const [floors, setFloors] = useState<number>(1);
  const [constructionRate, setConstructionRate] = useState<number>(150);
  const [siteAndSoftCosts, setSiteAndSoftCosts] = useState<number>(25000);
  const [contingencyPercent, setContingencyPercent] = useState<number>(10);
  const [landCost, setLandCost] = useState<number>(50000);
  const [result, setResult] = useState<any>(null);

  const calculateCost = () => {
    const areaInSqft = unit === 'sqft' ? area : area * 10.763910416709722;
    const totalArea = areaInSqft * floors;
    const directConstructionCost = totalArea * constructionRate;
    const contingency = directConstructionCost * (contingencyPercent / 100);
    const projectCostExcludingLand = directConstructionCost + contingency + siteAndSoftCosts;
    const totalCost = projectCostExcludingLand + landCost;
    const constructionCostPerSqft = projectCostExcludingLand / totalArea;

    setResult({
      totalCost,
      constructionCostPerSqft,
      directConstructionCost,
      contingency,
      siteAndSoftCosts,
      projectCostExcludingLand,
      landCost,
      totalArea
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
    setArea(2000);
    setFloors(1);
    setConstructionRate(150);
    setSiteAndSoftCosts(25000);
    setContingencyPercent(10);
    setLandCost(50000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-2">House Construction Cost Calculator</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Estimate your home building costs with detailed breakdown by quality level.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">House Area</label>
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
            <label className="block text-sm font-medium mb-2">Construction Rate (USD/sq ft)</label>
            <Input type="number" value={constructionRate} onChange={(e) => setConstructionRate(Number(e.target.value))} min={0} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Site & Soft Costs (USD)</label>
            <Input type="number" value={siteAndSoftCosts} onChange={(e) => setSiteAndSoftCosts(Number(e.target.value))} min={0} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contingency (%)</label>
            <Input type="number" value={contingencyPercent} onChange={(e) => setContingencyPercent(Number(e.target.value))} min={0} max={100} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Number of Floors</label>
            <Input
              type="number"
              value={floors}
              onChange={(e) => setFloors(Number(e.target.value))}
              min={1}
              max={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Land Cost</label>
            <Input
              type="number"
              value={landCost}
              onChange={(e) => setLandCost(Number(e.target.value))}
              min={0}
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
                <span className="text-slate-600 dark:text-slate-400">Direct Construction</span>
                <span className="font-medium">{formatCurrency(result.directConstructionCost)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Contingency</span>
                <span className="font-medium">{formatCurrency(result.contingency)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Site & Soft Costs</span>
                <span className="font-medium">{formatCurrency(result.siteAndSoftCosts)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Project Excluding Land</span>
                <span className="font-medium">{formatCurrency(result.projectCostExcludingLand)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Land Cost</span>
                <span className="font-medium">{formatCurrency(result.landCost)}</span>
              </div>
              <div className="flex justify-between py-3 text-lg font-bold">
                <span>Total House Cost</span>
                <span className="text-indigo-600 dark:text-indigo-400">{formatCurrency(result.totalCost)}</span>
              </div>
              <div className="flex justify-between py-2 bg-slate-100 dark:bg-slate-700 rounded-lg px-3">
                <span className="text-sm">Cost per sq ft</span>
                <span className="font-medium">{formatCurrency(result.constructionCostPerSqft)}</span>
              </div>
              <div className="flex justify-between py-2 bg-slate-100 dark:bg-slate-700 rounded-lg px-3">
                <span className="text-sm">Total Area</span>
                <span className="font-medium">{result.totalArea.toFixed(0)} sq ft</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-600 dark:text-blue-400">All rates are user-entered planning assumptions in USD. Define exactly what the construction rate and soft-cost allowance include before comparing estimates.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
