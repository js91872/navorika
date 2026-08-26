'use client';

import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  HardHat,
  Info,
  Users,
} from 'lucide-react';
import { calculateOshaPortableToilets } from '@/lib/calculations/oshaPortableToilet';

const fieldClass =
  'mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20';

function number(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(1, parsed) : 1;
}

export default function OshaPortableToiletCalculator() {
  const [workers, setWorkers] = useState('25');

  const result = useMemo(
    () => calculateOshaPortableToilets(number(workers)),
    [workers],
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.8fr)]">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7">
        <div className="flex items-center gap-3">
          <HardHat className="size-6 text-indigo-600" />
          <h2 className="text-xl font-bold">
            Construction workforce
          </h2>
        </div>

        <label className="mt-6 block text-sm font-semibold">
          Employees on the jobsite
          <input
            type="number"
            min="1"
            step="1"
            value={workers}
            onChange={(event) =>
              setWorkers(event.target.value)
            }
            className={fieldClass}
          />
        </label>

        <div className="mt-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 size-5 shrink-0 text-indigo-600" />

            <div>
              <h3 className="font-bold">
                OSHA construction-site calculation
              </h3>

              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                This mode follows the workforce thresholds in
                29 CFR 1926.51(c)(1), Table D-1. It is not an
                event-planning calculator and does not use a
                male/female attendance ratio.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border)]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--muted)]">
              <tr>
                <th className="px-4 py-3 font-bold">
                  Employees
                </th>
                <th className="px-4 py-3 font-bold">
                  OSHA Table D-1
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--border)]">
              <tr>
                <td className="px-4 py-3">
                  20 or fewer
                </td>
                <td className="px-4 py-3">
                  1 toilet facility
                </td>
              </tr>

              <tr>
                <td className="px-4 py-3">
                  More than 20, under 200
                </td>
                <td className="px-4 py-3">
                  1 seat + 1 urinal per 40 workers
                </td>
              </tr>

              <tr>
                <td className="px-4 py-3">
                  200 or more
                </td>
                <td className="px-4 py-3">
                  1 seat + 1 urinal per 50 workers
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-indigo-500/10 text-indigo-600">
              <Users className="size-6" />
            </span>

            <div>
              <p className="text-sm text-[var(--muted-foreground)]">
                Workforce
              </p>
              <p className="text-3xl font-black">
                {result.workers}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="size-5" />
              OSHA minimum calculation
            </div>

            <p className="mt-3 text-sm leading-6">
              {result.summary}
            </p>
          </div>

          {result.regime === 'up-to-20' ? (
            <div className="mt-6">
              <p className="text-sm text-[var(--muted-foreground)]">
                Minimum toilet facilities
              </p>
              <p className="mt-1 text-4xl font-black">
                {result.toiletFacilities}
              </p>
            </div>
          ) : (
            <dl className="mt-6 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] px-4">
              <div className="flex justify-between gap-4 py-4">
                <dt className="text-sm text-[var(--muted-foreground)]">
                  Toilet seats
                </dt>
                <dd className="text-xl font-black">
                  {result.toiletSeats}
                </dd>
              </div>

              <div className="flex justify-between gap-4 py-4">
                <dt className="text-sm text-[var(--muted-foreground)]">
                  Urinals
                </dt>
                <dd className="text-xl font-black">
                  {result.urinals}
                </dd>
              </div>

              <div className="flex justify-between gap-4 py-4">
                <dt className="text-sm text-[var(--muted-foreground)]">
                  Fixture sets
                </dt>
                <dd className="text-xl font-black">
                  {result.toiletFacilities}
                </dd>
              </div>
            </dl>
          )}
        </section>

        <section className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-5 text-sm leading-6">
          <strong>Important:</strong> Portable toilets differ in
          fixture configuration. For workforces above 20, the
          calculated fixture-set count assumes one seat and one
          urinal per set. Local codes, contracts, servicing needs
          or actual unit configuration can require additional units.
        </section>
      </aside>
    </div>
  );
}
