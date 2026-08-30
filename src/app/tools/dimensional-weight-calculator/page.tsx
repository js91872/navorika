'use client';

import { useMemo, useState } from 'react';
import { Box, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { calculateDimensionalWeight } from '@/lib/calculations/projectEstimators';

type System = 'metric' | 'imperial';

function fmt(n: number, digits = 2) {
  return Number(n.toFixed(digits)).toLocaleString();
}

export default function DimensionalWeightCalculator() {
  const [system, setSystem] = useState<System>('metric');
  const [length, setLength] = useState(50);
  const [width, setWidth] = useState(40);
  const [height, setHeight] = useState(30);
  const [actualWeight, setActualWeight] = useState(8);
  const [divisor, setDivisor] = useState(5000);

  const result = useMemo(() => {
    try { return { valid: true, ...calculateDimensionalWeight({ length, width, height, actualWeight, divisor }) } as const; }
    catch (cause) { return { valid: false, error: cause instanceof Error ? cause.message : 'Enter valid package details.' } as const; }
  }, [length, width, height, actualWeight, divisor]);

  const switchSystem = (next: System) => {
    setSystem(next);

    if (next === 'metric') {
      setLength(50);
      setWidth(40);
      setHeight(30);
      setActualWeight(8);
      setDivisor(5000);
    } else {
      setLength(20);
      setWidth(16);
      setHeight(12);
      setActualWeight(18);
      setDivisor(139);
    }
  };

  const reset = () => {
    setSystem('metric');
    setLength(50);
    setWidth(40);
    setHeight(30);
    setActualWeight(8);
    setDivisor(5000);
  };

  const dimUnit = system === 'metric' ? 'cm' : 'in';
  const weightUnit = system === 'metric' ? 'kg' : 'lb';

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold uppercase tracking-wider mb-4">
          Shipping & Ecommerce Utility
        </div>

        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
          Dimensional Weight Calculator
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
          Calculate volumetric or dimensional shipping weight and compare it
          with actual package weight to estimate billable weight.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <Box className="h-5 w-5 text-violet-500" />
            <h2 className="text-xl font-bold">Package details</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Measurement system</label>
              <Select
                value={system}
                onChange={(e) => switchSystem(e.target.value as System)}
                options={[
                  { value: 'metric', label: 'Metric — cm & kg' },
                  { value: 'imperial', label: 'Imperial — inches & lb' },
                ]}
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Length" value={length} suffix={dimUnit} onChange={setLength} />
              <Field label="Width" value={width} suffix={dimUnit} onChange={setWidth} />
              <Field label="Height" value={height} suffix={dimUnit} onChange={setHeight} />
            </div>

            <Field
              label="Actual package weight"
              value={actualWeight}
              suffix={weightUnit}
              onChange={setActualWeight}
            />

            <div>
              <label className="block text-sm font-medium mb-2">
                Dimensional divisor
              </label>
              <Input
                type="number"
                min={1}
                step={1}
                value={divisor}
                onChange={(e) => setDivisor(Number(e.target.value))}
              />
              <p className="text-xs text-slate-500 mt-2">
                Use the divisor specified by your carrier and service.
                Common values vary by carrier, route and shipping product.
              </p>
            </div>
          </div>

          <Button variant="outline" onClick={reset} className="w-full mt-7">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </section>

        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
          <h2 className="text-xl font-bold mb-6">Shipping weight</h2>

          {result.valid ? (
            <>
              <div className="rounded-3xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-200 dark:border-violet-800 p-6 text-center">
                <p className="text-xs uppercase tracking-wider font-bold text-violet-600 dark:text-violet-400 mb-2">
                  Estimated billable weight
                </p>
                <p className="text-5xl font-black">
                  {fmt(result.billableWeight)} {weightUnit}
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  Higher of actual and dimensional weight
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mt-5">
                <Card
                  label="Actual weight"
                  value={`${fmt(actualWeight)} ${weightUnit}`}
                />
                <Card
                  label="Dimensional weight"
                  value={`${fmt(result.dimensionalWeight)} ${weightUnit}`}
                />
                <Card
                  label="Package volume"
                  value={`${fmt(result.volume)} ${dimUnit}³`}
                />
                <Card
                  label="Controlling weight"
                  value={result.chargedBy}
                />
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 dark:bg-slate-800 p-5">
                <p className="font-bold mb-2">Formula</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Dimensional weight = length × width × height ÷ dimensional divisor.
                </p>
              </div>

              <div className="mt-6 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-4">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Carrier rules can require dimension rounding, weight rounding,
                  special divisors, oversize charges or different formulas.
                  Confirm the current rules for your shipment.
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
