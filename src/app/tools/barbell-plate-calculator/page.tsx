'use client';

import { useMemo, useState } from 'react';
import { Dumbbell, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

type Unit = 'kg' | 'lb';

const KG_PLATES = [25, 20, 15, 10, 5, 2.5, 1.25];
const LB_PLATES = [55, 45, 35, 25, 10, 5, 2.5];

function formatWeight(value: number) {
  return Number(value.toFixed(2)).toString();
}

export default function BarbellPlateCalculator() {
  const [unit, setUnit] = useState<Unit>('kg');
  const [targetWeight, setTargetWeight] = useState(100);
  const [barWeight, setBarWeight] = useState(20);

  const plates = unit === 'kg' ? KG_PLATES : LB_PLATES;

  const result = useMemo(() => {
    if (
      !Number.isFinite(targetWeight) ||
      !Number.isFinite(barWeight) ||
      targetWeight <= 0 ||
      barWeight < 0
    ) {
      return {
        valid: false,
        error: 'Enter valid positive weights.',
      } as const;
    }

    if (targetWeight < barWeight) {
      return {
        valid: false,
        error: 'Target weight cannot be lower than the bar weight.',
      } as const;
    }

    let remainingPerSide = (targetWeight - barWeight) / 2;

    const combination: Array<{
      plate: number;
      countPerSide: number;
    }> = [];

    for (const plate of plates) {
      const count = Math.floor((remainingPerSide + 1e-9) / plate);

      if (count > 0) {
        combination.push({
          plate,
          countPerSide: count,
        });

        remainingPerSide -= count * plate;
      }
    }

    const loadedPerSide =
      (targetWeight - barWeight) / 2 - remainingPerSide;

    const achievedWeight = barWeight + loadedPerSide * 2;
    const difference = targetWeight - achievedWeight;

    return {
      valid: true,
      combination,
      loadedPerSide,
      achievedWeight,
      difference,
      exact: Math.abs(difference) < 0.001,
      totalPlateWeight: loadedPerSide * 2,
    } as const;
  }, [targetWeight, barWeight, plates]);

  const changeUnit = (nextUnit: Unit) => {
    setUnit(nextUnit);

    if (nextUnit === 'kg') {
      setBarWeight(20);
      setTargetWeight(100);
    } else {
      setBarWeight(45);
      setTargetWeight(225);
    }
  };

  const reset = () => {
    setUnit('kg');
    setTargetWeight(100);
    setBarWeight(20);
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
          Gym & Weight Utility
        </div>

        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
          Barbell Plate Calculator
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
          Enter your target barbell weight and instantly see which plates to
          load on each side of the bar.
        </p>
      </div>

      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6">
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <Dumbbell className="h-5 w-5 text-indigo-500" />
            <h2 className="text-xl font-bold">Load settings</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">
                Weight unit
              </label>

              <Select
                value={unit}
                onChange={(e) => changeUnit(e.target.value as Unit)}
                options={[
                  { value: 'kg', label: 'Kilograms (kg)' },
                  { value: 'lb', label: 'Pounds (lb)' },
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Target total weight
              </label>

              <div className="relative">
                <Input
                  type="number"
                  min={0}
                  step={unit === 'kg' ? 0.5 : 1}
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(Number(e.target.value))}
                  className="pr-14"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                  {unit}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Bar weight
              </label>

              <Select
                value={barWeight.toString()}
                onChange={(e) => setBarWeight(Number(e.target.value))}
                options={
                  unit === 'kg'
                    ? [
                        { value: '20', label: '20 kg — Olympic bar' },
                        { value: '15', label: '15 kg — Women’s Olympic bar' },
                        { value: '10', label: '10 kg — Training bar' },
                        { value: '0', label: '0 kg — Custom / no bar' },
                      ]
                    : [
                        { value: '45', label: '45 lb — Olympic bar' },
                        { value: '35', label: '35 lb — Women’s bar' },
                        { value: '25', label: '25 lb — Training bar' },
                        { value: '0', label: '0 lb — Custom / no bar' },
                      ]
                }
              />
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 dark:bg-slate-800 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Available plate sizes
            </p>

            <div className="flex flex-wrap gap-2">
              {plates.map((plate) => (
                <span
                  key={plate}
                  className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold"
                >
                  {plate} {unit}
                </span>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            onClick={reset}
            className="w-full mt-6"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </section>

        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
          <h2 className="text-xl font-bold mb-6">Plates per side</h2>

          {result.valid ? (
            <>
              <div
                className={`rounded-2xl border p-5 ${
                  result.exact
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                    : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
                }`}
              >
                <p className="text-xs uppercase tracking-wider font-bold text-slate-500 mb-2">
                  {result.exact ? 'Exact target available' : 'Closest lower load'}
                </p>

                <p className="text-4xl font-black">
                  {formatWeight(result.achievedWeight)} {unit}
                </p>

                {!result.exact && (
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-2">
                    {formatWeight(result.difference)} {unit} below your target
                    with the available plate sizes.
                  </p>
                )}
              </div>

              <div className="mt-6">
                {result.combination.length > 0 ? (
                  <div className="space-y-3">
                    {result.combination.map(({ plate, countPerSide }) => (
                      <div
                        key={plate}
                        className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 dark:bg-slate-800 p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-14 rounded-full bg-indigo-500/10 border-4 border-indigo-500 flex items-center justify-center font-black text-indigo-600 dark:text-indigo-400">
                            {plate}
                          </div>

                          <div>
                            <p className="font-bold">
                              {plate} {unit} plate
                            </p>
                            <p className="text-xs text-slate-500">
                              Load on both sides
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-black">
                            × {countPerSide}
                          </p>
                          <p className="text-xs text-slate-500">
                            per side
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-6 text-center text-slate-500">
                    No plates required. Target equals the bar weight.
                  </div>
                )}
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mt-6">
                <SummaryCard
                  label="Bar"
                  value={`${formatWeight(barWeight)} ${unit}`}
                />

                <SummaryCard
                  label="Plates per side"
                  value={`${formatWeight(result.loadedPerSide)} ${unit}`}
                />

                <SummaryCard
                  label="Total plate weight"
                  value={`${formatWeight(result.totalPlateWeight)} ${unit}`}
                />
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                <p className="text-sm font-bold mb-2">Loading rule</p>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Load the same plate combination on the left and right sides
                  of the bar. The calculator uses the largest available plates
                  first.
                </p>
              </div>
            </>
          ) : (
            <div className="rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 p-5">
              <p className="font-bold text-red-700 dark:text-red-300 mb-2">
                Cannot calculate plate loading
              </p>

              <p className="text-sm text-red-600 dark:text-red-400">
                {result.error}
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4">
      <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">
        {label}
      </p>

      <p className="text-lg font-black">{value}</p>
    </div>
  );
}
