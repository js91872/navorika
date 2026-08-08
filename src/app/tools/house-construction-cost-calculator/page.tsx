'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Calculator, DollarSign, TrendingUp, Building } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Container } from '@/components/ui/Container';

interface HouseCostResult {
  totalCost: number;
  costPerSqft: number;
  baseCost: number;
  finishingCost: number;
  permitCost: number;
  interiorCost: number;
  landscapingCost: number;
}

export default function HouseConstructionCostCalculator() {
  const [area, setArea] = useState<number>(2000);
  const [unit, setUnit] = useState<'sqft' | 'sqm'>('sqft');
  const [quality, setQuality] = useState<'standard' | 'premium' | 'luxury'>('standard');
  const [floors, setFloors] = useState<number>(1);
  const [landCost, setLandCost] = useState<number>(50000);

  const [result, setResult] = useState<HouseCostResult | null>(null);

  const qualityMultipliers = {
    standard: { base: 150, finishing: 40, interior: 30, landscaping: 10 },
    premium: { base: 250, finishing: 70, interior: 60, landscaping: 20 },
    luxury: { base: 400, finishing: 120, interior: 100, landscaping: 35 }
  };

  const calculateCost = () => {
    const areaInSqft = unit === 'sqft' ? area : area * 10.764;
    const totalArea = areaInSqft * floors;
    const multipliers = qualityMultipliers[quality];

    const baseCost = totalArea * multipliers.base;
    const finishingCost = totalArea * multipliers.finishing;
    const interiorCost = totalArea * multipliers.interior;
    const landscapingCost = totalArea * multipliers.landscaping;
    const permitCost = totalArea * 5;
    const totalCost = baseCost + finishingCost + interiorCost + landscapingCost + permitCost + landCost;
    const costPerSqft = totalCost / totalArea;

    setResult({
      totalCost,
      costPerSqft,
      baseCost,
      finishingCost,
      permitCost,
      interiorCost,
      landscapingCost
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
    setQuality('standard');
    setFloors(1);
    setLandCost(50000);
  };

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Home className="h-8 w-8 text-indigo-500" />
          <h1 className="text-3xl md:text-4xl font-bold">House Construction Cost Calculator</h1>
        </div>
        <p className="text-lg text-[var(--muted-foreground)] mb-8">
          Estimate your home building costs with detailed breakdown.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <div className="space-y-6">
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
                <label className="block text-sm font-medium mb-2">Construction Quality</label>
                <Select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value as 'standard' | 'premium' | 'luxury')}
                  options={[
                    { value: 'standard', label: 'Standard ($150/sqft)' },
                    { value: 'premium', label: 'Premium ($250/sqft)' },
                    { value: 'luxury', label: 'Luxury ($400/sqft)' }
                  ]}
                />
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

              <div className="flex gap-4 pt-4">
                <Button onClick={calculateCost} className="flex-1">
                  Calculate Cost
                </Button>
                <Button variant="outline" onClick={resetCalculator}>
                  Reset
                </Button>
              </div>
            </div>
          </Card>

          <div>
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="p-6">
                  <h3 className="text-lg font-bold mb-4">Cost Breakdown</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-[var(--border)]">
                      <span className="text-[var(--muted-foreground)]">Base Construction</span>
                      <span className="font-medium">{formatCurrency(result.baseCost)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[var(--border)]">
                      <span className="text-[var(--muted-foreground)]">Finishing</span>
                      <span className="font-medium">{formatCurrency(result.finishingCost)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[var(--border)]">
                      <span className="text-[var(--muted-foreground)]">Interior Design</span>
                      <span className="font-medium">{formatCurrency(result.interiorCost)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[var(--border)]">
                      <span className="text-[var(--muted-foreground)]">Landscaping</span>
                      <span className="font-medium">{formatCurrency(result.landscapingCost)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[var(--border)]">
                      <span className="text-[var(--muted-foreground)]">Permits & Fees</span>
                      <span className="font-medium">{formatCurrency(result.permitCost)}</span>
                    </div>
                    <div className="flex justify-between py-3 text-lg font-bold">
                      <span>Total House Cost</span>
                      <span className="text-indigo-500">{formatCurrency(result.totalCost)}</span>
                    </div>
                    <div className="flex justify-between py-2 bg-[var(--muted)]/30 rounded-lg px-3">
                      <span className="text-sm">Cost per sq ft</span>
                      <span className="font-medium">{formatCurrency(result.costPerSqft)}</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      💡 This estimate includes construction, finishing, interior design, landscaping, and permits.
                    </p>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </Container>
  );
}
