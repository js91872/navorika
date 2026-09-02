'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { calculateHouseConstructionCost } from '@/lib/calculations/projectEstimators';
import PrivacyBadges from '@/components/ui/PrivacyBadges';
import ResultActions from '@/components/ui/ResultActions';
import { rowsToCsv } from '@/lib/resultExport';
import { getHouseConstructionRows, getHouseConstructionSummary, type HouseConstructionResult } from '@/lib/houseConstructionPresentation';

export default function HouseConstructionCostCalculator() {
  const [area, setArea] = useState<number>(2000);
  const [unit, setUnit] = useState<'sqft' | 'sqm'>('sqft');
  const [floors, setFloors] = useState<number>(1);
  const [constructionRate, setConstructionRate] = useState<number>(150);
  const [siteAndSoftCosts, setSiteAndSoftCosts] = useState<number>(25000);
  const [contingencyPercent, setContingencyPercent] = useState<number>(10);
  const [landCost, setLandCost] = useState<number>(50000);
  const [result, setResult] = useState<HouseConstructionResult | null>(null);
  const [error, setError] = useState('');

  const calculateCost = () => {
    try {
      setResult(calculateHouseConstructionCost({ area, areaUnit: unit, floors, ratePerSqft: constructionRate, siteAndSoftCosts, contingencyPercent, landCost })); setError('');
    } catch (cause) { setResult(null); setError(cause instanceof Error ? cause.message : 'Enter valid project details.'); }
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
    setError('');
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
        <p className="text-slate-600 dark:text-slate-400">Estimate a house-building budget from your area, rate, allowances, contingency, and land cost.</p>
        <PrivacyBadges slug="house-construction-cost-calculator" className="mb-6 mt-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <span className="mb-2 block text-sm font-medium">House Area</span>
            <div className="flex gap-3">
              <Input
                aria-label="House area"
                inputMode="decimal"
                type="number"
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                className="flex-1"
                min={1}
              />
              <Select
                aria-label="Area unit"
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

          <Input label="Construction Rate (USD/sq ft)" inputMode="decimal" type="number" value={constructionRate} onChange={(e) => setConstructionRate(Number(e.target.value))} min={0} />

          <Input label="Site & Soft Costs (USD)" inputMode="decimal" type="number" value={siteAndSoftCosts} onChange={(e) => setSiteAndSoftCosts(Number(e.target.value))} min={0} />

          <Input label="Contingency (%)" inputMode="decimal" type="number" value={contingencyPercent} onChange={(e) => setContingencyPercent(Number(e.target.value))} min={0} max={100} />

          <Input
              label="Number of Floors"
              inputMode="numeric"
              type="number"
              value={floors}
              onChange={(e) => setFloors(Number(e.target.value))}
              min={1}
              max={3}
            />

          <Input
              label="Land Cost"
              inputMode="decimal"
              type="number"
              value={landCost}
              onChange={(e) => setLandCost(Number(e.target.value))}
              min={0}
            />
        </div>

        <div className="flex gap-4 mt-6">
          <Button onClick={calculateCost} className="flex-1">
            Calculate Cost
          </Button>
          <Button variant="outline" onClick={resetCalculator}>
            Reset
          </Button>
        </div>
        {error && <p role="alert" className="mt-3 text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}

        {result && (
          <div className="mt-6 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl" aria-live="polite">
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
            <ResultActions className="mt-5" actions={[
              { kind: 'copy', label: 'Copy summary', getContent: () => getHouseConstructionSummary(result, formatCurrency) },
              { kind: 'download', label: 'Download CSV', filename: 'house-construction-estimate.csv', mimeType: 'text/csv;charset=utf-8', getContent: () => rowsToCsv(getHouseConstructionRows(result)) },
              { kind: 'print', label: 'Print / Save PDF' },
            ]} />
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-600 dark:text-blue-400">All rates are user-entered planning assumptions in USD. Define exactly what the construction rate and soft-cost allowance include before comparing estimates.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
