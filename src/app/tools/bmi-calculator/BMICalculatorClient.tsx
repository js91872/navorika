'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, RefreshCw, Ruler, Scale } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { calculateBMI, type BMIResult } from '@/lib/calculations/bmi';
import { cn } from '@/lib/utils';

type Unit = 'metric' | 'imperial';

export default function BMICalculatorClient() {
  const [unit, setUnit] = useState<Unit>('metric');
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [feet, setFeet] = useState(5);
  const [inches, setInches] = useState(9);
  const [result, setResult] = useState<BMIResult | null>(null);
  const [error, setError] = useState('');

  const changeUnit = (nextUnit: Unit) => {
    setUnit(nextUnit);
    setResult(null);
    setError('');
  };

  const calculate = () => {
    const invalid = weight <= 0 || (unit === 'metric' ? height <= 0 : feet <= 0 || inches < 0 || inches > 11);
    if (invalid) {
      setResult(null);
      setError('Enter a valid weight and height.');
      return;
    }
    setError('');
    setResult(calculateBMI({ weight, height, unit, feet, inches }));
  };

  const reset = () => {
    setWeight(70); setHeight(175); setFeet(5); setInches(9); setResult(null); setError('');
  };

  return (
    <section aria-labelledby="calculator-heading" className="mx-auto max-w-4xl">
      <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-xl shadow-indigo-950/5">
        <div className="border-b border-[var(--border)] bg-gradient-to-r from-indigo-500/10 via-violet-500/5 to-transparent px-6 py-5 sm:px-8">
          <h2 id="calculator-heading" className="flex items-center gap-3 text-xl font-bold">
            <span className="grid size-10 place-items-center rounded-xl bg-indigo-600 text-white"><Calculator aria-hidden="true" className="size-5" /></span>
            Calculate your BMI
          </h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">Choose a unit system, then enter your current weight and height.</p>
        </div>

        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-6">
            <fieldset>
              <legend className="mb-2 text-sm font-semibold">Unit system</legend>
              <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[var(--muted)] p-1.5">
                {(['metric', 'imperial'] as const).map((option) => (
                  <button key={option} type="button" aria-pressed={unit === option} onClick={() => changeUnit(option)} className={cn('rounded-xl px-4 py-2.5 text-sm font-semibold capitalize transition-all', unit === option ? 'bg-[var(--card)] text-indigo-600 shadow-sm dark:text-indigo-400' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]')}>{option}</button>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="bmi-weight" className="mb-2 flex items-center gap-2 text-sm font-semibold"><Scale aria-hidden="true" className="size-4 text-indigo-500" />Weight ({unit === 'metric' ? 'kg' : 'lb'})</label>
              <Input id="bmi-weight" type="number" inputMode="decimal" min={1} step={0.1} value={weight} onChange={(event) => setWeight(Number(event.target.value))} />
            </div>

            <div>
              <label htmlFor="bmi-height" className="mb-2 flex items-center gap-2 text-sm font-semibold"><Ruler aria-hidden="true" className="size-4 text-indigo-500" />Height ({unit === 'metric' ? 'cm' : 'ft and in'})</label>
              {unit === 'metric' ? (
                <Input id="bmi-height" type="number" inputMode="decimal" min={1} step={0.1} value={height} onChange={(event) => setHeight(Number(event.target.value))} />
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Input id="bmi-height" aria-label="Height in feet" type="number" inputMode="numeric" min={1} max={8} value={feet} onChange={(event) => setFeet(Number(event.target.value))} />
                  <Input aria-label="Additional height in inches" type="number" inputMode="decimal" min={0} max={11} step={0.1} value={inches} onChange={(event) => setInches(Number(event.target.value))} />
                </div>
              )}
            </div>

            {error && <p role="alert" className="text-sm font-medium text-rose-600 dark:text-rose-400">{error}</p>}
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={calculate} fullWidth>Calculate BMI</Button>
              <Button onClick={reset} variant="outline" fullWidth icon={<RefreshCw className="size-4" />}>Reset</Button>
            </div>
          </div>

          <div aria-live="polite" className="min-h-72">
            {result ? (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="h-full rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.06] p-6">
                <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Your result</p>
                <p className="mt-3 text-6xl font-black tracking-tight">{result.bmi.toFixed(1)}</p>
                <p className="mt-2 text-xl font-bold">{result.category}</p>
                <div className="mt-6 border-t border-indigo-500/15 pt-5">
                  <p className="text-sm text-[var(--muted-foreground)]">Healthy-weight range for this height</p>
                  <p className="mt-1 text-lg font-bold">{result.healthyWeightRange.min.toFixed(1)}–{result.healthyWeightRange.max.toFixed(1)} {unit === 'metric' ? 'kg' : 'lb'}</p>
                </div>
                <p className="mt-5 text-xs leading-relaxed text-[var(--muted-foreground)]">BMI is an adult screening measure, not a diagnosis.</p>
              </motion.div>
            ) : (
              <div className="grid h-full min-h-72 place-items-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--muted)]/40 p-8 text-center">
                <div><div className="mx-auto grid size-14 place-items-center rounded-2xl bg-indigo-500/10 text-2xl">⚖️</div><p className="mt-4 font-semibold">Your result will appear here</p><p className="mt-1 text-sm text-[var(--muted-foreground)]">Nothing is uploaded or stored.</p></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
