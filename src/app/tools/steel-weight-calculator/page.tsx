'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

export default function SteelWeightCalculator() {
  const [shape, setShape] = useState<'round' | 'square' | 'rectangular' | 'i-beam'>('round');
  const [diameter, setDiameter] = useState<number>(12);
  const [width, setWidth] = useState<number>(100);
  const [height, setHeight] = useState<number>(200);
  const [length, setLength] = useState<number>(12);
  const [thickness, setThickness] = useState<number>(5);
  const [quantity, setQuantity] = useState<number>(1);
  const [result, setResult] = useState<any>(null);

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
      totalLength: lengthM * quantityVal,
      quantity: quantityVal
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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-2">Steel Weight Calculator</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Calculate the weight of steel bars, beams, and structural steel.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>

        <div className="flex gap-4 mt-6">
          <Button onClick={calculateWeight} className="flex-1">
            Calculate Weight
          </Button>
          <Button variant="outline" onClick={resetCalculator}>
            Reset
          </Button>
        </div>

        {result && (
          <div className="mt-6 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <h3 className="font-bold text-lg mb-4">Steel Weight Results</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Weight per Meter</p>
                <p className="text-lg font-bold">{result.perMeterWeight.toFixed(2)} kg/m</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Length</p>
                <p className="text-lg font-bold">{result.totalLength.toFixed(2)} m</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg md:col-span-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Weight</p>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{result.weight.toFixed(0)} kg</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg md:col-span-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">Weight in Tons</p>
                <p className="text-lg font-bold">{(result.weight / 1000).toFixed(2)} tons</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-600 dark:text-blue-400">Uses a fixed density of 7,850 kg/m³ and ideal sharp-edged geometry. Verify published section mass for manufactured profiles.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
