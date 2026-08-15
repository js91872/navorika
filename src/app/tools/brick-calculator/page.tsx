'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

function BrickCalculatorContent() {
  const meta = tools.find(t => t.slug === 'brick-calculator');
  const [length, setLength] = useState<number>(10);
  const [width, setWidth] = useState<number>(10);
  const [height, setHeight] = useState<number>(3);
  const [unit, setUnit] = useState<'m' | 'ft'>('m');
  const [brickSize, setBrickSize] = useState<'standard' | 'modular' | 'custom'>('standard');
  const [mortarThickness, setMortarThickness] = useState<number>(10);
  const [wastage, setWastage] = useState<number>(5);
  const [result, setResult] = useState<any>(null);

  const brickDimensions = {
    standard: { length: 0.23, width: 0.11, height: 0.07 },
    modular: { length: 0.19, width: 0.09, height: 0.09 },
    custom: { length: 0.23, width: 0.11, height: 0.07 }
  };

  const calculateBricks = () => {
    let len = length;
    let wid = width;
    let hei = height;

    if (unit === 'ft') {
      len = length * 0.3048;
      wid = width * 0.3048;
      hei = height * 0.3048;
    }

    const dims = brickDimensions[brickSize];
    const mortarM = mortarThickness / 1000;

    const brickLength = dims.length + mortarM;
    const brickWidth = dims.width + mortarM;
    const brickHeight = dims.height + mortarM;

    const bricksPerM2 = 1 / (brickLength * brickHeight);
    const area = len * wid;
    const volume = len * wid * hei;
    const totalBricks = Math.ceil(area * bricksPerM2 * (1 + wastage / 100));

    setResult({
      totalBricks,
      area,
      volume,
      bricksPerM2,
      wallHeight: hei,
      wallLength: len,
      wallWidth: wid
    });
  };

  const resetCalculator = () => {
    setResult(null);
    setLength(10);
    setWidth(10);
    setHeight(3);
    setBrickSize('standard');
    setMortarThickness(10);
    setWastage(5);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-2">Brick Calculator</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Calculate the number of bricks needed for your construction project.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <label className="block text-sm font-medium mb-2">Wall Length</label>
            <Input
              type="number"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              min={0.1}
              step={0.1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Wall Width</label>
            <Input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              min={0.1}
              step={0.1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Wall Height</label>
            <Input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              min={0.1}
              step={0.1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Brick Size</label>
            <Select
              value={brickSize}
              onChange={(e) => setBrickSize(e.target.value as 'standard' | 'modular' | 'custom')}
              options={[
                { value: 'standard', label: 'Standard (230×110×70mm)' },
                { value: 'modular', label: 'Modular (190×90×90mm)' },
                { value: 'custom', label: 'Custom Size' }
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mortar Thickness (mm)</label>
            <Input
              type="number"
              value={mortarThickness}
              onChange={(e) => setMortarThickness(Number(e.target.value))}
              min={5}
              max={15}
              step={1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Wastage (%)</label>
            <Input
              type="number"
              value={wastage}
              onChange={(e) => setWastage(Number(e.target.value))}
              min={0}
              max={20}
              step={1}
            />
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button onClick={calculateBricks} className="flex-1">
            Calculate Bricks
          </Button>
          <Button variant="outline" onClick={resetCalculator}>
            Reset
          </Button>
        </div>

        {result && (
          <div className="mt-6 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <h3 className="font-bold text-lg mb-4">Brick Calculation Results</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg md:col-span-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Bricks Needed</p>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {result.totalBricks.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Wall Area</p>
                <p className="text-lg font-bold">{result.area.toFixed(2)} m²</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Wall Volume</p>
                <p className="text-lg font-bold">{result.volume.toFixed(2)} m³</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Bricks per m²</p>
                <p className="text-lg font-bold">{result.bricksPerM2.toFixed(0)}</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Wall Height</p>
                <p className="text-lg font-bold">{result.wallHeight.toFixed(2)} m</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-600 dark:text-amber-400">💡 Remember to add {wastage}% wastage. Order {Math.ceil(result.totalBricks * 1.1).toLocaleString()} bricks to be safe.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BrickCalculatorWrapper() {
  const meta = tools.find(t => t.slug === 'brick-calculator');
  return (
    <EnhancedToolWrapper meta={meta}>
      <BrickCalculatorContent />
    </EnhancedToolWrapper>
  );
}
