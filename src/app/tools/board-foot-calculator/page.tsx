'use client';

import { useMemo, useState } from 'react';
import { RotateCcw, Trees } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

type Unit = 'imperial' | 'metric';

function fmt(n: number, digits = 2) {
  return Number(n.toFixed(digits)).toLocaleString();
}

export default function BoardFootCalculator() {
  const [unit, setUnit] = useState<Unit>('imperial');
  const [thickness, setThickness] = useState(1);
  const [width, setWidth] = useState(8);
  const [length, setLength] = useState(8);
  const [quantity, setQuantity] = useState(10);
  const [price, setPrice] = useState(4.5);

  const result = useMemo(() => {
    if (
      [thickness, width, length, quantity].some(
        (v) => !Number.isFinite(v) || v <= 0
      ) ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      return { valid: false, error: 'Enter dimensions and quantity greater than zero.' } as const;
    }

    let boardFeetEach: number;

    if (unit === 'imperial') {
      // thickness and width in inches, length in feet
      boardFeetEach = (thickness * width * length) / 12;
    } else {
      // thickness/width mm, length metres
      const cubicMetresEach =
        (thickness / 1000) * (width / 1000) * length;

      boardFeetEach = cubicMetresEach / 0.002359737216;
    }

    const totalBoardFeet = boardFeetEach * quantity;
    const totalCost = totalBoardFeet * price;

    return {
      valid: true,
      boardFeetEach,
      totalBoardFeet,
      totalCost,
    } as const;
  }, [unit, thickness, width, length, quantity, price]);

  const changeUnit = (next: Unit) => {
    setUnit(next);

    if (next === 'imperial') {
      setThickness(1);
      setWidth(8);
      setLength(8);
    } else {
      setThickness(25);
      setWidth(200);
      setLength(2.4);
    }
  };

  const reset = () => {
    setUnit('imperial');
    setThickness(1);
    setWidth(8);
    setLength(8);
    setQuantity(10);
    setPrice(4.5);
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
          Lumber & Woodworking
        </div>

        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
          Board Foot Calculator
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
          Calculate lumber board feet from thickness, width, length and quantity,
          with an optional estimated material cost.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <Trees className="h-5 w-5 text-amber-600" />
            <h2 className="text-xl font-bold">Lumber dimensions</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Measurement system</label>
              <Select
                value={unit}
                onChange={(e) => changeUnit(e.target.value as Unit)}
                options={[
                  { value: 'imperial', label: 'Imperial — inches & feet' },
                  { value: 'metric', label: 'Metric — mm & metres' },
                ]}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                label="Thickness"
                value={thickness}
                suffix={unit === 'imperial' ? 'in' : 'mm'}
                onChange={setThickness}
              />
              <Field
                label="Width"
                value={width}
                suffix={unit === 'imperial' ? 'in' : 'mm'}
                onChange={setWidth}
              />
              <Field
                label="Length"
                value={length}
                suffix={unit === 'imperial' ? 'ft' : 'm'}
                onChange={setLength}
              />
              <Field
                label="Quantity"
                value={quantity}
                suffix="pcs"
                onChange={setQuantity}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Price per board foot (optional)
              </label>
              <Input
                type="number"
                min={0}
                step={0.01}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
              <p className="text-xs text-slate-500 mt-2">
                Enter the price in your preferred currency.
              </p>
            </div>
          </div>

          <Button variant="outline" onClick={reset} className="w-full mt-7">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </section>

        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
          <h2 className="text-xl font-bold mb-6">Lumber estimate</h2>

          {result.valid ? (
            <>
              <div className="rounded-3xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-200 dark:border-amber-800 p-6 text-center">
                <p className="text-xs uppercase tracking-wider font-bold text-amber-700 dark:text-amber-400 mb-2">
                  Total board feet
                </p>
                <p className="text-5xl font-black">{fmt(result.totalBoardFeet)}</p>
                <p className="text-sm text-slate-500 mt-2">board feet</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mt-5">
                <Card
                  label="Per piece"
                  value={`${fmt(result.boardFeetEach)} bd ft`}
                />
                <Card
                  label="Estimated cost"
                  value={fmt(result.totalCost)}
                />
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 dark:bg-slate-800 p-5">
                <p className="font-bold mb-2">Imperial formula</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Board feet = thickness (in) × width (in) × length (ft) ÷ 12 × quantity.
                </p>
              </div>
            </>
          ) : (
            <ErrorBox message={result.error} />
          )}
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  suffix: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="relative">
        <Input
          type="number"
          min={0}
          step="any"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="pr-14"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
          {suffix}
        </span>
      </div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4">
      <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">{label}</p>
      <p className="text-xl font-black">{value}</p>
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 p-5">
      <p className="font-bold text-red-700 dark:text-red-300">Cannot calculate</p>
      <p className="text-sm text-red-600 dark:text-red-400 mt-2">{message}</p>
    </div>
  );
}
