'use client';

import { useMemo, useState } from 'react';
import { MoveDiagonal, Ruler, Triangle } from 'lucide-react';
import { calculateLadderSafeReach } from '@/lib/calculations/ladderSafeReach';

const fieldClass =
  'mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20';

function number(value: string): number {
  const parsed = Number(value);
  return value.trim() !== '' && Number.isFinite(parsed) ? parsed : Number.NaN;
}

export default function LadderSafeReachCalculator() {
  const [ladderLength, setLadderLength] = useState('20');
  const [userHeight, setUserHeight] = useState('5.8');
  const [ladderType, setLadderType] =
    useState<'extension' | 'step'>('extension');

  const outcome = useMemo(() => {
    try {
      return { result: calculateLadderSafeReach({ ladderLengthFeet: number(ladderLength), userHeightFeet: number(userHeight), ladderType }), error: '' };
    } catch (caught) {
      return { result: null, error: caught instanceof Error ? caught.message : 'Check the ladder inputs.' };
    }
  }, [ladderLength, userHeight, ladderType]);
  const result = outcome.result;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7">
        <h2 className="text-xl font-bold">Ladder dimensions</h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            Ladder type
            <select
              value={ladderType}
              onChange={(event) =>
                setLadderType(event.target.value as 'extension' | 'step')
              }
              className={fieldClass}
            >
              <option value="extension">Extension / leaning ladder</option>
              <option value="step">Step ladder</option>
            </select>
          </label>

          <label className="text-sm font-semibold">
            Ladder length (ft)
            <input
              type="number"
              min="0"
              step="0.1"
              value={ladderLength}
              onChange={(event) => setLadderLength(event.target.value)}
              className={fieldClass}
            />
          </label>

          <label className="text-sm font-semibold">
            User height (ft)
            <input
              type="number"
              min="0"
              step="0.1"
              value={userHeight}
              onChange={(event) => setUserHeight(event.target.value)}
              className={fieldClass}
            />
          </label>
        </div>

        {ladderType === 'extension' && result && (
          <div className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
            <div className="mx-auto flex max-w-md items-end justify-center">
              <div className="relative h-64 w-72">
                <div className="absolute bottom-0 right-4 h-60 w-1 bg-[var(--foreground)]" />
                <div className="absolute bottom-0 left-8 right-4 h-1 bg-[var(--foreground)]" />

                <div
                  className="absolute bottom-0 left-14 h-1 origin-left bg-indigo-600"
                  style={{
                    width: '220px',
                    transform: `rotate(-${result.ladderAngleDegrees.toFixed(1)}deg)`,
                  }}
                />

                <span className="absolute bottom-4 left-24 text-xs font-semibold text-[var(--muted-foreground)]">
                  ≈ {result.baseDistanceFeet.toFixed(1)} ft base
                </span>
              </div>
            </div>

            <p className="mt-3 text-center text-xs leading-5 text-[var(--muted-foreground)]">
              Diagram is illustrative and not to scale.
            </p>
          </div>
        )}
      </section>

      <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-lg">
          {!result ? (
            <p role="alert" className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-700 dark:text-red-300">{outcome.error}</p>
          ) : (<>
          <div className="flex items-center gap-3">
            <Triangle className="size-6 text-indigo-600" />
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">
                {ladderType === 'extension'
                  ? '4:1 base distance'
                  : 'Approximate ladder height'}
              </p>
              <p className="text-3xl font-black">
                {ladderType === 'extension'
                  ? result.baseDistanceFeet.toFixed(2)
                  : result.verticalHeightFeet.toFixed(2)}{' '}
                ft
              </p>
            </div>
          </div>

          <dl className="mt-6 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] px-4">
            <div className="flex justify-between gap-4 py-4">
              <dt className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                <Ruler className="size-4" />
                Vertical height
              </dt>
              <dd className="font-bold">
                {result.verticalHeightFeet.toFixed(2)} ft
              </dd>
            </div>

            {ladderType === 'extension' && (
              <div className="flex justify-between gap-4 py-4">
                <dt className="text-sm text-[var(--muted-foreground)]">
                  Ladder angle
                </dt>
                <dd className="font-bold">
                  {result.ladderAngleDegrees.toFixed(1)}°
                </dd>
              </div>
            )}

            <div className="flex justify-between gap-4 py-4">
              <dt className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                <MoveDiagonal className="size-4" />
                Approximate reach
              </dt>
              <dd className="font-bold">
                {result.approximateReachFeet.toFixed(2)} ft
              </dd>
            </div>
          </dl>
          </>)}
        </section>

        <section className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-5 text-sm leading-6">
          <strong>Safety note:</strong> This calculator is for planning only.
          Follow the ladder manufacturer&apos;s instructions, labels, applicable
          workplace rules, and site conditions. Never use an estimated reach
          value to justify standing above a permitted ladder step or rung.
        </section>
      </aside>
    </div>
  );
}
