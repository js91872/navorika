'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

export default function WaterTankCalculator() {
  const [shape, setShape] = useState<'rectangular' | 'cylindrical' | 'spherical'>('rectangular');
  const [length, setLength] = useState<number>(2);
  const [width, setWidth] = useState<number>(1.5);
  const [height, setHeight] = useState<number>(1.5);
  const [diameter, setDiameter] = useState<number>(1.5);
  const [radius, setRadius] = useState<number>(1);
  const [unit, setUnit] = useState<'m' | 'ft'>('m');
  const [result, setResult] = useState<any>(null);

  const calculateTank = () => {
    let len = length, wid = width, hei = height, dia = diameter, rad = radius;
    
    if (unit === 'ft') {
      len = length * 0.3048;
      wid = width * 0.3048;
      hei = height * 0.3048;
      dia = diameter * 0.3048;
      rad = radius * 0.3048;
    }

    let volumeM3 = 0;
    let volumeLiters = 0;
    let volumeGallons = 0;

    switch(shape) {
      case 'rectangular':
        volumeM3 = len * wid * hei;
        break;
      case 'cylindrical':
        volumeM3 = Math.PI * Math.pow(dia/2, 2) * hei;
        break;
      case 'spherical':
        volumeM3 = (4/3) * Math.PI * Math.pow(rad, 3);
        break;
    }

    volumeLiters = volumeM3 * 1000;
    volumeGallons = volumeLiters * 0.264172;

    setResult({
      volumeM3,
      volumeLiters,
      volumeGallons,
      shape,
      dimensions: { length: len, width: wid, height: hei, diameter: dia, radius: rad }
    });
  };

  const resetCalculator = () => {
    setResult(null);
    setShape('rectangular');
    setLength(2);
    setWidth(1.5);
    setHeight(1.5);
    setDiameter(1.5);
    setRadius(1);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-2">Water Tank Calculator</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Calculate water tank capacity and dimensions for storage.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Tank Shape</label>
            <Select
              value={shape}
              onChange={(e) => setShape(e.target.value as 'rectangular' | 'cylindrical' | 'spherical')}
              options={[
                { value: 'rectangular', label: 'Rectangular' },
                { value: 'cylindrical', label: 'Cylindrical' },
                { value: 'spherical', label: 'Spherical' }
              ]}
            />
          </div>

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

          {shape === 'rectangular' && (
            <>
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
                <label className="block text-sm font-medium mb-2">Height</label>
                <Input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  min={0.1}
                  step={0.1}
                />
              </div>
            </>
          )}

          {shape === 'cylindrical' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Diameter</label>
                <Input
                  type="number"
                  value={diameter}
                  onChange={(e) => setDiameter(Number(e.target.value))}
                  min={0.1}
                  step={0.1}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Height</label>
                <Input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  min={0.1}
                  step={0.1}
                />
              </div>
            </>
          )}

          {shape === 'spherical' && (
            <div>
              <label className="block text-sm font-medium mb-2">Radius</label>
              <Input
                type="number"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                min={0.1}
                step={0.1}
              />
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-6">
          <Button onClick={calculateTank} className="flex-1">
            Calculate Tank Capacity
          </Button>
          <Button variant="outline" onClick={resetCalculator}>
            Reset
          </Button>
        </div>

        {result && (
          <div className="mt-6 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <h3 className="font-bold text-lg mb-4">Tank Capacity Results</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Volume</p>
                <p className="text-xl font-bold">{result.volumeM3.toFixed(2)} m³</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg md:col-span-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">Liters</p>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{result.volumeLiters.toFixed(0)} L</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg md:col-span-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">Gallons (US)</p>
                <p className="text-2xl font-bold">{result.volumeGallons.toFixed(0)} gal</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-600 dark:text-blue-400">This is theoretical geometric capacity; usable capacity may be lower because of freeboard, fittings, wall thickness, and operating limits.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
