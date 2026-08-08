'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Calculator, Ruler, Box, Weight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Container } from '@/components/ui/Container';

interface CementResult {
  totalVolume: number;
  cementBags: number;
  cementWeight: number;
  sandVolume: number;
  aggregateVolume: number;
}

export default function CementCalculator() {
  const [volume, setVolume] = useState<number>(1);
  const [unit, setUnit] = useState<'cubic' | 'cubic_m' | 'cubic_ft'>('cubic');
  const [mixRatio, setMixRatio] = useState<'1:2:3' | '1:1.5:3' | '1:3:6'>('1:2:3');
  const [bagSize, setBagSize] = useState<number>(50);

  const [result, setResult] = useState<CementResult | null>(null);

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
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Package className="h-8 w-8 text-indigo-500" />
          <h1 className="text-3xl md:text-4xl font-bold">Cement Calculator</h1>
        </div>
        <p className="text-lg text-[var(--muted-foreground)] mb-8">
          Calculate the exact number of cement bags needed for your concrete work.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <div className="space-y-6">
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
                      { value: 'cubic', label: 'cu yd' },
                      { value: 'cubic_m', label: 'm³' },
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

              <div className="flex gap-4 pt-4">
                <Button onClick={calculateCement} className="flex-1">
                  Calculate Cement
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
                  <h3 className="text-lg font-bold mb-4">Cement Calculation Results</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-[var(--border)]">
                      <span className="text-[var(--muted-foreground)]">Total Volume</span>
                      <span className="font-medium">{result.totalVolume.toFixed(2)} m³</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[var(--border)]">
                      <span className="text-[var(--muted-foreground)]">Cement Bags Needed</span>
                      <span className="font-bold text-2xl text-indigo-500">{result.cementBags}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[var(--border)]">
                      <span className="text-[var(--muted-foreground)]">Cement Weight</span>
                      <span className="font-medium">{result.cementWeight.toFixed(0)} kg</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[var(--border)]">
                      <span className="text-[var(--muted-foreground)]">Sand Required</span>
                      <span className="font-medium">{result.sandVolume.toFixed(3)} m³</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[var(--border)]">
                      <span className="text-[var(--muted-foreground)]">Aggregate Required</span>
                      <span className="font-medium">{result.aggregateVolume.toFixed(3)} m³</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">
                      💡 Consider adding 5-10% extra for wastage, spillage, and uneven surfaces.
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
