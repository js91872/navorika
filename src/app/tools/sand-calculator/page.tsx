'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Weight, Calculator, Ruler, Box } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Container } from '@/components/ui/Container';

interface SandResult {
  volume: number;
  weight: number;
  truckLoads: number;
  bags: number;
}

export default function SandCalculator() {
  const [length, setLength] = useState<number>(10);
  const [width, setWidth] = useState<number>(10);
  const [depth, setDepth] = useState<number>(0.5);
  const [unit, setUnit] = useState<'m' | 'ft'>('m');
  const [sandDensity, setSandDensity] = useState<number>(1600);

  const [result, setResult] = useState<SandResult | null>(null);

  const calculateSand = () => {
    let len = length;
    let wid = width;
    let dep = depth;
    
    if (unit === 'ft') {
      len = length * 0.3048;
      wid = width * 0.3048;
      dep = depth * 0.3048;
    }

    const volume = len * wid * dep;
    const weight = volume * sandDensity;
    const truckLoads = Math.ceil(weight / 15000);
    const bags = Math.ceil(weight / 25);

    setResult({
      volume,
      weight,
      truckLoads,
      bags
    });
  };

  const resetCalculator = () => {
    setResult(null);
    setLength(10);
    setWidth(10);
    setDepth(0.5);
    setSandDensity(1600);
  };

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Weight className="h-8 w-8 text-indigo-500" />
          <h1 className="text-3xl md:text-4xl font-bold">Sand Calculator</h1>
        </div>
        <p className="text-lg text-[var(--muted-foreground)] mb-8">
          Calculate the exact sand volume and weight needed for your construction project.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <div className="space-y-6">
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
                <label className="block text-sm font-medium mb-2">Length</label>
                <Input
                  type="number"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  min={0.1}
                  step={0.1}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Width</label>
                <Input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  min={0.1}
                  step={0.1}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Depth</label>
                <Input
                  type="number"
                  value={depth}
                  onChange={(e) => setDepth(Number(e.target.value))}
                  min={0.01}
                  step={0.01}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sand Density (kg/m³)</label>
                <Input
                  type="number"
                  value={sandDensity}
                  onChange={(e) => setSandDensity(Number(e.target.value))}
                  min={1400}
                  max={1800}
                />
                <p className="text-xs text-[var(--muted-foreground)] mt-1">Typical range: 1400-1800 kg/m³</p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={calculateSand} className="flex-1">
                  Calculate Sand
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
                  <h3 className="text-lg font-bold mb-4">Sand Calculation Results</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-[var(--border)]">
                      <span className="text-[var(--muted-foreground)]">Sand Volume</span>
                      <span className="font-medium">{result.volume.toFixed(2)} m³</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[var(--border)]">
                      <span className="text-[var(--muted-foreground)]">Sand Weight</span>
                      <span className="font-medium">{result.weight.toFixed(0)} kg</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[var(--border)]">
                      <span className="text-[var(--muted-foreground)]">Truck Loads (15 ton)</span>
                      <span className="font-medium">{result.truckLoads} trucks</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[var(--border)]">
                      <span className="text-[var(--muted-foreground)]">25kg Bags</span>
                      <span className="font-bold text-2xl text-indigo-500">{result.bags} bags</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                      💡 Always order 5-10% extra sand to account for wastage and compaction.
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
