'use client';

import { useMemo, useState } from 'react';
import { Ruler, Scissors, Target } from 'lucide-react';
import { calculateSawKerf } from '@/lib/calculations/sawKerf';

const fieldClass =
  'mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20';

function number(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

export default function SawKerfCalculator() {
  const [stockWidth, setStockWidth] = useState('11.25');
  const [pieceWidth, setPieceWidth] = useState('3.5');
  const [kerfWidth, setKerfWidth] = useState('0.125');

  const result = useMemo(
    () =>
      calculateSawKerf({
        stockWidth: number(stockWidth),
        pieceWidth: number(pieceWidth),
        kerfWidth: number(kerfWidth),
      }),
    [stockWidth, pieceWidth, kerfWidth],
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7">
        <div className="flex items-center gap-3">
          <Scissors className="size-6 text-indigo-600" />
          <h2 className="text-xl font-bold">Board and blade dimensions</h2>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <label className="text-sm font-semibold">
            Stock width
            <input
              type="number"
              min="0"
              step="any"
              value={stockWidth}
              onChange={(event) => setStockWidth(event.target.value)}
              className={fieldClass}
            />
          </label>

          <label className="text-sm font-semibold">
            Desired piece width
            <input
              type="number"
              min="0"
              step="any"
              value={pieceWidth}
              onChange={(event) => setPieceWidth(event.target.value)}
              className={fieldClass}
            />
          </label>

          <label className="text-sm font-semibold">
            Saw kerf
            <input
              type="number"
              min="0"
              step="any"
              value={kerfWidth}
              onChange={(event) => setKerfWidth(event.target.value)}
              className={fieldClass}
            />
          </label>
        </div>

        <p className="mt-4 text-xs leading-5 text-[var(--muted-foreground)]">
          Use the same measurement unit for all three inputs. For example,
          inches for stock width, piece width, and kerf.
        </p>

        <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
          <p className="mb-4 text-sm font-semibold">Cut layout preview</p>

          <div className="flex h-16 w-full overflow-hidden rounded-lg border border-[var(--border)]">
            {result.pieces > 0 &&
              Array.from({ length: result.pieces }).map((_, index) => (
                <div
                  key={index}
                  className="flex min-w-0 items-center justify-center border-r border-[var(--border)] bg-indigo-500/10 px-1 text-xs font-bold"
                  style={{
                    flex:
                      number(stockWidth) > 0
                        ? number(pieceWidth) / number(stockWidth)
                        : 0,
                  }}
                >
                  {index + 1}
                </div>
              ))}

            {result.offcut > 0 && (
              <div
                className="flex min-w-0 items-center justify-center bg-[var(--muted)] px-1 text-xs"
                style={{
                  flex:
                    number(stockWidth) > 0
                      ? result.offcut / number(stockWidth)
                      : 0,
                }}
              >
                Offcut
              </div>
            )}
          </div>
        </div>
      </section>

      <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <Target className="size-6 text-indigo-600" />
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">
                Full-width pieces
              </p>
              <p className="text-4xl font-black">{result.pieces}</p>
            </div>
          </div>

          <dl className="mt-6 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] px-4">
            <div className="flex justify-between py-4">
              <dt className="text-sm text-[var(--muted-foreground)]">
                Required cuts
              </dt>
              <dd className="font-bold">{result.cuts}</dd>
            </div>

            <div className="flex justify-between py-4">
              <dt className="text-sm text-[var(--muted-foreground)]">
                Total kerf loss
              </dt>
              <dd className="font-bold">
                {result.totalKerfLoss.toFixed(3)}
              </dd>
            </div>

            <div className="flex justify-between py-4">
              <dt className="text-sm text-[var(--muted-foreground)]">
                Remaining offcut
              </dt>
              <dd className="font-bold">{result.offcut.toFixed(3)}</dd>
            </div>

            <div className="flex justify-between py-4">
              <dt className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                <Ruler className="size-4" />
                Piece efficiency
              </dt>
              <dd className="font-bold">
                {result.efficiencyPercent.toFixed(1)}%
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 text-sm leading-6 text-[var(--muted-foreground)]">
          Actual cut yield can differ because of blade runout, trimming,
          jointing, defects, measurement tolerance and required finishing
          allowance.
        </section>
      </aside>
    </div>
  );
}
