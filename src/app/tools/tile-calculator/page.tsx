'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

export default function TileCalculator() {
  const [length, setLength] = useState<number>(10);
  const [width, setWidth] = useState<number>(10);
  const [tileLength, setTileLength] = useState<number>(60);
  const [tileWidth, setTileWidth] = useState<number>(60);
  const [unit, setUnit] = useState<'m' | 'ft'>('m');
  const [tileUnit, setTileUnit] = useState<'cm' | 'inch'>('cm');
  const [gap, setGap] = useState<number>(3);
  const [wastage, setWastage] = useState<number>(10);
  const [result, setResult] = useState<any>(null);

  const calculateTiles = () => {
    let len = length;
    let wid = width;

    if (unit === 'ft') {
      len = length * 0.3048;
      wid = width * 0.3048;
    }

    let tileLen = tileLength;
    let tileWid = tileWidth;

    if (tileUnit === 'inch') {
      tileLen = tileLength * 0.0254;
      tileWid = tileWidth * 0.0254;
    } else {
      tileLen = tileLength / 100;
      tileWid = tileWidth / 100;
    }

    const gapM = gap / 1000;
    const tileWithGapL = tileLen + gapM;
    const tileWithGapW = tileWid + gapM;

    const area = len * wid;
    const tileArea = tileLen * tileWid;
    const tilesAlongLength = Math.ceil((len + gapM) / tileWithGapL);
    const tilesAlongWidth = Math.ceil((wid + gapM) / tileWithGapW);
    const fittedTiles = tilesAlongLength * tilesAlongWidth;
    const tilesNeeded = Math.ceil(fittedTiles * (1 + wastage / 100));

    setResult({
      area,
      tileArea,
      tilesNeeded,
      fittedTiles,
      tilesAlongLength,
      tilesAlongWidth,
      gap,
      wastage,
      tileDimensions: `${tileLength}x${tileWidth} ${tileUnit}`
    });
  };

  const resetCalculator = () => {
    setResult(null);
    setLength(10);
    setWidth(10);
    setTileLength(60);
    setTileWidth(60);
    setGap(3);
    setWastage(10);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-2">Tile Calculator</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Calculate number of tiles required for floors and walls.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Area Unit</label>
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
            <label className="block text-sm font-medium mb-2">Room Length</label>
            <Input
              type="number"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              min={0.1}
              step={0.1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Room Width</label>
            <Input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              min={0.1}
              step={0.1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tile Unit</label>
            <Select
              value={tileUnit}
              onChange={(e) => setTileUnit(e.target.value as 'cm' | 'inch')}
              options={[
                { value: 'cm', label: 'Centimeters (cm)' },
                { value: 'inch', label: 'Inches (in)' }
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tile Length</label>
            <Input
              type="number"
              value={tileLength}
              onChange={(e) => setTileLength(Number(e.target.value))}
              min={1}
              step={1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tile Width</label>
            <Input
              type="number"
              value={tileWidth}
              onChange={(e) => setTileWidth(Number(e.target.value))}
              min={1}
              step={1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Joint Gap (mm)</label>
            <Input
              type="number"
              value={gap}
              onChange={(e) => setGap(Number(e.target.value))}
              min={0}
              max={10}
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
          <Button onClick={calculateTiles} className="flex-1">
            Calculate Tiles
          </Button>
          <Button variant="outline" onClick={resetCalculator}>
            Reset
          </Button>
        </div>

        {result && (
          <div className="mt-6 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <h3 className="font-bold text-lg mb-4">Tile Calculation Results</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Area to Cover</p>
                <p className="text-lg font-bold">{result.area.toFixed(2)} m²</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Tile Area</p>
                <p className="text-lg font-bold">{result.tileArea.toFixed(4)} m²</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg md:col-span-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Tiles Needed</p>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{result.tilesNeeded.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Fitted Grid</p>
                <p className="text-xl font-bold">{result.tilesAlongLength} × {result.tilesAlongWidth}</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Tiles Before Waste</p>
                <p className="text-xl font-bold">{result.fittedTiles}</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-600 dark:text-amber-400">The total already includes {result.wastage}% waste. Divide it by the actual tiles-per-box shown by the manufacturer and round boxes upward.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
