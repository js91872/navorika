'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Grid, Ruler, Weight, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Container } from '@/components/ui/Container';

interface RebarResult {
  totalBars: number;
  totalLength: number;
  totalWeight: number;
  spacing: number;
}

export default function RebarCalculator() {
  const [length, setLength] = useState<number>(10);
  const [width, setWidth] = useState<number>(10);
  const [barSize, setBarSize] = useState<number>(12);
  const [spacing, setSpacing] = useState<number>(150);
  const [cover, setCover] = useState<number>(25);
  const [direction, setDirection] = useState<'both' | 'lengthwise' | 'widthwise'>('both');

  const [result, setResult] = useState<RebarResult | null>(null);

  const barWeights: { [key: number]: number } = {
    8: 0.395,
    10: 0.617,
    12: 0.888,
    16: 1.579,
    20: 2.467,
    25: 3.854,
    32: 6.313
  };

  const calculateRebar = () => {
    const coverM = cover / 1000;
    const spacingM = spacing / 1000;
    const lengthM = length - (2 * coverM);
    const widthM = width - (2 * coverM);
    const weightPerMeter = barWeights[barSize] || 0.888;

    let barsLengthwise = 0;
    let barsWidthwise = 0;
    let totalLength = 0;

    if (direction === 'both' || direction === 'lengthwise') {
      barsLengthwise = Math.floor(widthM / spacingM) + 1;
      totalLength += barsLengthwise * lengthM;
    }

    if (direction === 'both' || direction === 'widthwise') {
      barsWidthwise = Math.floor(lengthM / spacingM) + 1;
      totalLength += barsWidthwise * widthM;
    }

    const totalBars = barsLengthwise + barsWidthwise;
    const totalWeight = totalLength * weightPerMeter;

    setResult({
      totalBars,
      totalLength,
      totalWeight,
      spacing
    });
  };

  const resetCalculator = () => {
    setResult(null);
    setLength(10);
    setWidth(10);
    setBarSize(12);
    setSpacing(150);
    setCover(25);
    setDirection('both');
  };

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Grid className="h-8 w-8 text-indigo-500" />
          <h1 className="text-3xl md:text-4xl font-bold">Rebar Calculator</h1>
        </div>
        <p className="text-lg text-[var(--muted-foreground)] mb-8">
          Calculate rebar quantity and weight for reinforced concrete structures.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Slab Length (m)</label>
                <Input
                  type="number"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  min={0.5}
                  step={0.1}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Slab Width (m)</label>
                <Input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  min={0.5}
                  step={0.1}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bar Size (mm)</label>
                <Select
                  value={barSize.toString()}
                  onChange={(e) => setBarSize(Number(e.target.value))}
                  options={[
                    { value: '8', label: '8mm (#2.5)' },
                    { value: '10', label: '10mm (#3)' },
                    { value: '12', label: '12mm (#4)' },
                    { value: '16', label: '16mm (#5)' },
                    { value: '20', label: '20mm (#6)' },
                    { value: '25', label: '25mm (#8)' },
                    { value: '32', label: '32mm (#10)' }
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Spacing (mm)</label>
                <Input
                  type="number"
                  value={spacing}
                  onChange={(e) => setSpacing(Number(e.target.value))}
                  min={50}
                  step={10}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Cover (mm)</label>
                <Input
                  type="number"
                  value={cover}
                  onChange={(e) => setCover(Number(e.target.value))}
                  min={15}
                  step={5}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Reinforcement Direction</label>
                <Select
                  value={direction}
                  onChange={(e) => setDirection(e.target.value as 'both' | 'lengthwise' | 'widthwise')}
                  options={[
                    { value: 'both', label: 'Both Directions' },
                    { value: 'lengthwise', label: 'Lengthwise Only' },
                    { value: 'widthwise', label: 'Widthwise Only' }
                  ]}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={calculateRebar} className="flex-1">
                  Calculate Rebar
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
                  <h3 className="text-lg font-bold mb-4">Rebar Results</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-[var(--border)]">
                      <span className="text-[var(--muted-foreground)]">Total Bars</span>
                      <span className="font-bold text-xl text-indigo-500">{result.totalBars}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[var(--border)]">
                      <span className="text-[var(--muted-foreground)]">Total Length</span>
                      <span className="font-medium">{result.totalLength.toFixed(1)} m</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[var(--border)]">
                      <span className="text-[var(--muted-foreground)]">Total Weight</span>
                      <span className="font-bold">{result.totalWeight.toFixed(0)} kg</span>
                    </div>
                    <div className="flex justify-between py-2 bg-[var(--muted)]/30 rounded-lg px-3">
                      <span className="text-sm">Weight in Tons</span>
                      <span className="font-medium">{(result.totalWeight / 1000).toFixed(2)} tons</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">
                      💡 Consider adding 5-10% extra for lapping, wastage, and extras.
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
