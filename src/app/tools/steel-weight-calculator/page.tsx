'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Weight, Ruler, Calculator, Box } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Container } from '@/components/ui/Container';

interface SteelResult {
  weight: number;
  perMeterWeight: number;
  totalLength: number;
}

export default function SteelWeightCalculator() {
  const [shape, setShape] = useState<'round' | 'square' | 'rectangular' | 'i-beam'>('round');
  const [diameter, setDiameter] = useState<number>(12);
  const [width, setWidth] = useState<number>(100);
  const [height, setHeight] = useState<number>(200);
  const [length, setLength] = useState<number>(12);
  const [thickness, setThickness] = useState<number>(5);
  const [quantity, setQuantity] = useState<number>(1);

  const [result, setResult] = useState<SteelResult | null>(null);

  const calculateWeight = () => {
    let weight = 0;
    let perMeterWeight = 0;
    const density = 7850;
    const lengthM = length;
    const quantityVal = quantity;

    switch(shape) {
      case 'round':
        const radiusM = (diameter / 1000) / 2;
        const areaRound = Math.PI * radiusM * radiusM;
        perMeterWeight = areaRound * density;
        weight = perMeterWeight * lengthM * quantityVal;
        break;
      case 'square':
        const sideM = width / 1000;
        const areaSquare = sideM * sideM;
        perMeterWeight = areaSquare * density;
        weight = perMeterWeight * lengthM * quantityVal;
        break;
      case 'rectangular':
        const widthM = width / 1000;
        const heightM = height / 1000;
        const areaRect = widthM * heightM;
        perMeterWeight = areaRect * density;
        weight = perMeterWeight * lengthM * quantityVal;
        break;
      case 'i-beam':
        const flangeWidth = width / 1000;
        const webHeight = height / 1000;
        const flangeThick = thickness / 1000;
        const areaI = (flangeWidth * flangeThick * 2) + (webHeight * flangeThick);
        perMeterWeight = areaI * density;
        weight = perMeterWeight * lengthM * quantityVal;
        break;
    }

    setResult({
      weight: weight,
      perMeterWeight: perMeterWeight,
      totalLength: lengthM * quantityVal
    });
  };

  const resetCalculator = () => {
    setResult(null);
    setShape('round');
    setDiameter(12);
    setWidth(100);
    setHeight(200);
    setLength(12);
    setThickness(5);
    setQuantity(1);
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
          <h1 className="text-3xl md:text-4xl font-bold">Steel Weight Calculator</h1>
        </div>
        <p className="text-lg text-[var(--muted-foreground)] mb-8">
          Calculate the weight of steel bars, beams, and structural steel.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Steel Shape</label>
                <Select
                  value={shape}
                  onChange={(e) => setShape(e.target.value as any)}
                  options={[
                    { value: 'round', label: 'Round Bar' },
                    { value: 'square', label: 'Square Bar' },
                    { value: 'rectangular', label: 'Rectangular' },
                    { value: 'i-beam', label: 'I-Beam' }
                  ]}
                />
              </div>

              {shape === 'round' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Diameter (mm)</label>
                  <Input
                    type="number"
                    value={diameter}
                    onChange={(e) => setDiameter(Number(e.target.value))}
                    min={1}
                  />
                </div>
              )}

              {(shape === 'square' || shape === 'rectangular') && (
                <div>
                  <label className="block text-sm font-medium mb-2">Width (mm)</label>
                  <Input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    min={1}
                  />
                </div>
              )}

              {shape === 'rectangular' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Height (mm)</label>
                  <Input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    min={1}
                  />
                </div>
              )}

              {shape === 'i-beam' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Flange Width (mm)</label>
                    <Input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                      min={1}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Web Height (mm)</label>
                    <Input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      min={1}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Thickness (mm)</label>
                    <Input
                      type="number"
                      value={thickness}
                      onChange={(e) => setThickness(Number(e.target.value))}
                      min={1}
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Length (meters)</label>
                <Input
                  type="number"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  min={0.1}
                  step={0.1}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Quantity</label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  min={1}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={calculateWeight} className="flex-1">
                  Calculate Weight
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
                  <h3 className="text-lg font-bold mb-4">Steel Weight Results</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-[var(--border)]">
                      <span className="text-[var(--muted-foreground)]">Weight per Meter</span>
                      <span className="font-medium">{result.perMeterWeight.toFixed(2)} kg/m</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[var(--border)]">
                      <span className="text-[var(--muted-foreground)]">Total Length</span>
                      <span className="font-medium">{result.totalLength.toFixed(2)} m</span>
                    </div>
                    <div className="flex justify-between py-2 text-lg font-bold">
                      <span>Total Weight</span>
                      <span className="text-2xl text-indigo-500">{result.weight.toFixed(0)} kg</span>
                    </div>
                    <div className="flex justify-between py-2 bg-[var(--muted)]/30 rounded-lg px-3">
                      <span className="text-sm">Weight in Tons</span>
                      <span className="font-medium">{(result.weight / 1000).toFixed(2)} tons</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      💡 Steel density used: 7850 kg/m³. This is standard for mild steel.
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
