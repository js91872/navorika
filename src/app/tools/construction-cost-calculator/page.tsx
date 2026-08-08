'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, DollarSign, Home, Wrench, Building, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ResultCard } from '@/components/ui/ResultCard';
import { Container } from '@/components/ui/Container';

interface CostBreakdown {
  baseCost: number;
  labor: number;
  materials: number;
  overhead: number;
  contingency: number;
  total: number;
  perSqft: number;
}

export default function ConstructionCostCalculator() {
  const [area, setArea] = useState<number>(1000);
  const [unit, setUnit] = useState<'sqft' | 'sqm'>('sqft');
  const [costPerUnit, setCostPerUnit] = useState<number>(150);
  const [laborPercent, setLaborPercent] = useState<number>(30);
  const [materialPercent, setMaterialPercent] = useState<number>(50);
  const [overheadPercent, setOverheadPercent] = useState<number>(10);
  const [contingencyPercent, setContingencyPercent] = useState<number>(10);
  const [result, setResult] = useState<CostBreakdown | null>(null);

  const calculateCost = () => {
    const areaInSqft = unit === 'sqft' ? area : area * 10.764;
    const baseCost = areaInSqft * costPerUnit;
    
    const labor = baseCost * (laborPercent / 100);
    const materials = baseCost * (materialPercent / 100);
    const overhead = baseCost * (overheadPercent / 100);
    const contingency = baseCost * (contingencyPercent / 100);
    const total = baseCost + labor + materials + overhead + contingency;
    const perSqft = total / areaInSqft;

    setResult({
      baseCost,
      labor,
      materials,
      overhead,
      contingency,
      total,
      perSqft
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
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="h-8 w-8 text-indigo-500" />
          <h1 className="text-3xl md:text-4xl font-bold">Construction Cost Calculator</h1>
        </div>
        <p className="text-lg text-[var(--muted-foreground)] mb-8">
          Get accurate construction cost estimates with detailed breakdown.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <div className="space-y-6">
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
                <label className="block text-sm font-medium mb-2">Cost per sq ft</label>
                <Input
                  type="number"
                  value={costPerUnit}
                  onChange={(e) => setCostPerUnit(Number(e.target.value))}
                  min={1}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Labor (% of base cost)</label>
                <Input
                  type="number"
                  value={laborPercent}
                  onChange={(e) => setLaborPercent(Number(e.target.value))}
                  min={0}
                  max={100}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Materials (% of base cost)</label>
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
                      <span className="text-[var(--muted-foreground)]">Labor</span>
                      <span className="font-medium">{formatCurrency(result.labor)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[var(--border)]">
                      <span className="text-[var(--muted-foreground)]">Materials</span>
                      <span className="font-medium">{formatCurrency(result.materials)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[var(--border)]">
                      <span className="text-[var(--muted-foreground)]">Overhead</span>
                      <span className="font-medium">{formatCurrency(result.overhead)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[var(--border)]">
                      <span className="text-[var(--muted-foreground)]">Contingency</span>
                      <span className="font-medium">{formatCurrency(result.contingency)}</span>
                    </div>
                    <div className="flex justify-between py-3 text-lg font-bold">
                      <span>Total Cost</span>
                      <span className="text-indigo-500">{formatCurrency(result.total)}</span>
                    </div>
                    <div className="flex justify-between py-2 bg-[var(--muted)]/30 rounded-lg px-3">
                      <span className="text-sm">Cost per sq ft</span>
                      <span className="font-medium">{formatCurrency(result.perSqft)}</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">
                      💡 This is an estimate based on industry standards. Actual costs may vary by location and market conditions.
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
