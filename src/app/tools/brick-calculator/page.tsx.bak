'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Ruler, Package } from 'lucide-react';
import { tools } from '@/data/registry';

export default function BrickCalculator() {
  const meta = tools.find(t => t.slug === 'brick-calculator');
  const [wallLength, setWallLength] = useState(10);
  const [wallHeight, setWallHeight] = useState(3);
  const [wallThickness, setWallThickness] = useState(0.23);
  const [brickLength, setBrickLength] = useState(19);
  const [brickHeight, setBrickHeight] = useState(9);
  const [brickWidth, setBrickWidth] = useState(9);
  const [mortar, setMortar] = useState(10);
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    const wallVolume = wallLength * wallHeight * wallThickness;
    const brickVolume = (brickLength / 100) * (brickHeight / 100) * (brickWidth / 100);
    const mortarVolume = (wallVolume * mortar) / 100;
    const effectiveBrickVolume = brickVolume + mortarVolume;
    const bricks = Math.ceil(wallVolume / effectiveBrickVolume);

    setResult({ bricks, mortarVolume, wallVolume });
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/tools" className="inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Tools
        </Link>

        <h1 className="text-3xl font-bold mb-2">Brick Calculator</h1>
        <p className="text-[var(--muted-foreground)] mb-8">Calculate the number of bricks needed for your wall</p>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-[var(--muted-foreground)]">Wall Length (m)</label>
                <input type="number" value={wallLength} onChange={(e) => setWallLength(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-[var(--muted)] border border-[var(--border)]" />
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--muted-foreground)]">Wall Height (m)</label>
                <input type="number" value={wallHeight} onChange={(e) => setWallHeight(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-[var(--muted)] border border-[var(--border)]" />
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--muted-foreground)]">Wall Thickness (m)</label>
                <input type="number" step="0.01" value={wallThickness} onChange={(e) => setWallThickness(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-[var(--muted)] border border-[var(--border)]" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-[var(--muted-foreground)]">Brick Length (cm)</label>
                <input type="number" value={brickLength} onChange={(e) => setBrickLength(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-[var(--muted)] border border-[var(--border)]" />
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--muted-foreground)]">Brick Height (cm)</label>
                <input type="number" value={brickHeight} onChange={(e) => setBrickHeight(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-[var(--muted)] border border-[var(--border)]" />
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--muted-foreground)]">Brick Width (cm)</label>
                <input type="number" value={brickWidth} onChange={(e) => setBrickWidth(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-[var(--muted)] border border-[var(--border)]" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--muted-foreground)]">Mortar Thickness (%)</label>
              <input type="number" value={mortar} onChange={(e) => setMortar(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-[var(--muted)] border border-[var(--border)]" />
            </div>

            <button onClick={handleCalculate} className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors">
              Calculate Bricks
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
            {result ? (
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Results</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[var(--muted)]">
                    <div className="text-xs text-[var(--muted-foreground)]">Bricks Required</div>
                    <div className="text-lg font-bold">{result.bricks} bricks</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--muted)]">
                    <div className="text-xs text-[var(--muted-foreground)]">Wall Volume</div>
                    <div className="text-lg font-bold">{result.wallVolume.toFixed(2)} m³</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--muted)] col-span-2">
                    <div className="text-xs text-[var(--muted-foreground)]">Mortar Required</div>
                    <div className="text-lg font-bold">{result.mortarVolume.toFixed(2)} m³</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-[var(--muted-foreground)]">
                <div className="text-center">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>Enter dimensions and click Calculate</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
