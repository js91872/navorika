'use client';

import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  CircleX,
  Ruler,
  Square,
} from 'lucide-react';
import { calculateEgressWindow } from '@/lib/calculations/egressWindow';

const fieldClass =
  'mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20';

function number(value: string): number {
  const parsed = Number(value);
  return value.trim() !== '' && Number.isFinite(parsed) ? parsed : Number.NaN;
}

export default function EgressWindowCodeChecker() {
  const [width, setWidth] = useState('24');
  const [height, setHeight] = useState('36');
  const [sill, setSill] = useState('42');
  const [gradeFloor, setGradeFloor] = useState(false);

  const outcome = useMemo(() => {
    try {
      return { result: calculateEgressWindow({ clearWidthInches: number(width), clearHeightInches: number(height), sillHeightInches: number(sill), gradeFloorOpening: gradeFloor }), error: '' };
    } catch (caught) {
      return { result: null, error: caught instanceof Error ? caught.message : 'Check the opening dimensions.' };
    }
  }, [width, height, sill, gradeFloor]);
  const result = outcome.result;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(330px,0.8fr)]">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7">
        <div className="flex items-center gap-3">
          <Square className="size-6 text-indigo-600" />
          <h2 className="text-xl font-bold">
            Net clear opening
          </h2>
        </div>

        <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
          Enter the actual clear opening produced by normal
          operation of the window—not the rough opening or
          outside frame dimensions.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <label className="text-sm font-semibold">
            Clear width (in)
            <input
              type="number"
              min="0"
              step="0.1"
              value={width}
              onChange={(event) =>
                setWidth(event.target.value)
              }
              className={fieldClass}
            />
          </label>

          <label className="text-sm font-semibold">
            Clear height (in)
            <input
              type="number"
              min="0"
              step="0.1"
              value={height}
              onChange={(event) =>
                setHeight(event.target.value)
              }
              className={fieldClass}
            />
          </label>

          <label className="text-sm font-semibold">
            Bottom of clear opening above floor (in)
            <input
              type="number"
              min="0"
              step="0.1"
              value={sill}
              onChange={(event) =>
                setSill(event.target.value)
              }
              className={fieldClass}
            />
          </label>
        </div>

        <label className="mt-6 flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
          <input
            type="checkbox"
            checked={gradeFloor}
            onChange={(event) =>
              setGradeFloor(event.target.checked)
            }
            className="mt-1"
          />

          <span>
            <span className="block font-semibold">
              Apply grade-floor 5.0 ft² exception
            </span>

            <span className="mt-1 block text-xs leading-5 text-[var(--muted-foreground)]">
              Select this only when the opening qualifies as a
              grade-floor emergency escape and rescue opening under
              the locally adopted code.
            </span>
          </span>
        </label>

        <div className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
          <div className="mx-auto max-w-md">
            <div className="relative h-72 border-b-4 border-l-4 border-[var(--foreground)]">
              <div
                className="absolute bottom-8 left-8 border-4 border-indigo-500 bg-indigo-500/10"
                style={{
                  width: '62%',
                  height: '58%',
                }}
              />

              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs font-semibold">
                Clear width: {Number.isFinite(number(width)) ? number(width).toFixed(1) : '—'} in
              </span>

              <span className="absolute left-1 top-1/3 -rotate-90 text-xs font-semibold">
                Height: {Number.isFinite(number(height)) ? number(height).toFixed(1) : '—'} in
              </span>
            </div>

            <p className="mt-3 text-center text-xs text-[var(--muted-foreground)]">
              Illustration is not to scale.
            </p>
          </div>
        </div>
      </section>

      <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-lg">
          {!result ? (
            <p role="alert" className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-700 dark:text-red-300">{outcome.error}</p>
          ) : (<>
          <div
            className={`rounded-2xl border p-5 ${
              result.passed
                ? 'border-emerald-500/30 bg-emerald-500/10'
                : 'border-red-500/30 bg-red-500/10'
            }`}
          >
            <div className="flex items-center gap-2">
              {result.passed ? (
                <CheckCircle2 className="size-6 text-emerald-600" />
              ) : (
                <CircleX className="size-6 text-red-600" />
              )}

              <p className="text-lg font-black">
                {result.passed
                  ? 'Meets selected IRC dimension checks'
                  : 'Does not meet all selected checks'}
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <Ruler className="size-5 text-indigo-600" />
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">
                Net clear opening area
              </p>
              <p className="text-3xl font-black">
                {result.clearAreaSqFt.toFixed(2)} ft²
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {result.criteria.map((criterion) => (
              <div
                key={criterion.id}
                className="rounded-2xl border border-[var(--border)] p-4"
              >
                <div className="flex items-start gap-3">
                  {criterion.passed ? (
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                  ) : (
                    <CircleX className="mt-0.5 size-5 shrink-0 text-red-600" />
                  )}

                  <div className="min-w-0">
                    <p className="font-semibold">
                      {criterion.label}
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                      {criterion.actual} · {criterion.required}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </>)}
        </section>

        <section className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-5 text-sm leading-6">
          <strong>Code note:</strong> Passing these dimensions does
          not by itself make a room a legal bedroom. Local code
          adoption, window wells, opening operation, smoke alarms,
          ceiling height, ventilation, permits and other requirements
          may apply.
        </section>
      </aside>
    </div>
  );
}
