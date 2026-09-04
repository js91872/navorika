'use client';

import { Calendar, CheckCircle2, AlertTriangle, Plus, Trash2, Info, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { calculateSchengenStay, type SchengenTrip } from '@/lib/calculations/schengen';
import ResultActions, { type ResultAction } from '@/components/ui/ResultActions';
import { toolUx } from '@/data/toolUx';
import { rowsToCsv } from '@/lib/resultExport';

const fieldClass = 'mt-1 w-full min-w-0 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20';

const initialTrips: SchengenTrip[] = [
  { id: 'trip-1', entryDate: '2026-06-01', exitDate: '2026-06-20', label: 'Summer vacation' },
  { id: 'trip-2', entryDate: '2026-07-15', exitDate: '2026-08-05', label: 'Business conference' },
];

export default function SchengenCalculator() {
  const [referenceDate, setReferenceDate] = useState('2026-09-04');
  const [trips, setTrips] = useState<SchengenTrip[]>(initialTrips);

  const result = useMemo(() => calculateSchengenStay({ referenceDate, trips }), [referenceDate, trips]);

  const updateTrip = (id: string, key: 'entryDate' | 'exitDate' | 'label', value: string) => {
    setTrips((items) => items.map((trip) => (trip.id === id ? { ...trip, [key]: value } : trip)));
  };

  const addTrip = () => {
    setTrips((items) => [
      ...items,
      { id: `trip-${Date.now()}`, entryDate: referenceDate, exitDate: referenceDate, label: `Trip ${items.length + 1}` },
    ]);
  };

  const removeTrip = (id: string) => {
    setTrips((items) => items.filter((trip) => trip.id !== id));
  };

  const reset = () => {
    setReferenceDate('2026-09-04');
    setTrips(initialTrips);
  };

  const resultRows = [
    ['Reference date', result.referenceDate],
    ['Rolling 180-day window start', result.windowStart],
    ['Days used in window', `${result.daysUsed} / 90 days`],
    ['Days remaining', `${result.daysRemaining} days`],
    ['Compliance status', result.compliant ? 'Within 90-day allowance' : `Overstay by ${result.overstayDays} days`],
  ] as const;

  const summary = `Schengen 90/180-day stay assessment\n${resultRows.map(([label, value]) => `${label}: ${value}`).join('\n')}`;

  const slug = 'schengen-90-180-day-calculator';
  const actions = (toolUx[slug]?.resultActions ?? ['copy-summary', 'download-csv', 'print']).reduce<ResultAction[]>((items, kind) => {
    if (kind === 'copy-summary') items.push({ kind: 'copy', label: 'Copy summary', getContent: () => summary });
    if (kind === 'download-csv') items.push({ kind: 'download', label: 'Download CSV', filename: `${slug}-results.csv`, mimeType: 'text/csv;charset=utf-8', getContent: () => rowsToCsv([['Metric', 'Value'], ...resultRows]) });
    if (kind === 'print') items.push({ kind: 'print', label: 'Print / Save PDF' });
    return items;
  }, []);

  return (
    <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
      <section className="min-w-0 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Calendar className="size-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-bold">Stays & reference date</h2>
          </div>
          <button
            type="button"
            onClick={addTrip}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700"
          >
            <Plus className="size-4" /> Add stay
          </button>
        </div>

        <div className="mt-6">
          <label className="block max-w-sm text-sm font-semibold">
            Evaluation reference date
            <input
              type="date"
              className={fieldClass}
              value={referenceDate}
              onChange={(e) => setReferenceDate(e.target.value)}
            />
            <span className="mt-1 block text-xs font-normal text-[var(--muted-foreground)]">
              The 180-day rolling evaluation window ends on this date.
            </span>
          </label>
        </div>

        <div className="mt-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Entered Schengen stays</h3>
          {trips.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-center text-sm text-[var(--muted-foreground)]">
              No stays entered. Click &ldquo;Add stay&rdquo; above to record travel dates.
            </p>
          ) : (
            trips.map((trip) => (
              <fieldset key={trip.id} className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
                <legend className="sr-only">{trip.label || 'Schengen trip'}</legend>
                <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto]">
                  <label className="min-w-0 text-sm font-semibold">
                    Description / country
                    <input
                      type="text"
                      className={fieldClass}
                      value={trip.label ?? ''}
                      placeholder="e.g. France & Italy"
                      onChange={(e) => updateTrip(trip.id!, 'label', e.target.value)}
                    />
                  </label>
                  <label className="min-w-0 text-sm font-semibold">
                    Entry date
                    <input
                      type="date"
                      className={fieldClass}
                      value={trip.entryDate}
                      onChange={(e) => updateTrip(trip.id!, 'entryDate', e.target.value)}
                    />
                  </label>
                  <label className="min-w-0 text-sm font-semibold">
                    Exit date
                    <input
                      type="date"
                      className={fieldClass}
                      value={trip.exitDate}
                      onChange={(e) => updateTrip(trip.id!, 'exitDate', e.target.value)}
                    />
                  </label>
                  <button
                    type="button"
                    aria-label={`Remove stay ${trip.label || ''}`}
                    onClick={() => removeTrip(trip.id!)}
                    className="mt-6 self-center rounded-xl border border-red-500/30 p-2 text-red-600 hover:bg-red-500/10 disabled:opacity-40"
                  >
                    <Trash2 className="size-5" />
                  </button>
                </div>
              </fieldset>
            ))
          )}
        </div>

        <button
          type="button"
          className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold hover:bg-[var(--muted)]"
          onClick={reset}
        >
          <RotateCcw className="size-4" /> Reset example
        </button>
      </section>

      <aside className="min-w-0 rounded-3xl border border-indigo-500/20 bg-indigo-500/5 p-5 sm:p-7">
        <h2 className="text-xl font-bold">Stay assessment</h2>

        <div className={`mt-5 flex items-center gap-3 rounded-2xl border p-4 ${result.compliant ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300' : 'border-red-500/30 bg-red-500/10 text-red-800 dark:text-red-300'}`}>
          {result.compliant ? <CheckCircle2 className="size-6 shrink-0" /> : <AlertTriangle className="size-6 shrink-0" />}
          <div>
            <p className="font-bold">{result.compliant ? 'Within 90-day allowance' : '90-day limit exceeded'}</p>
            <p className="text-xs leading-5">
              {result.compliant
                ? `${result.daysRemaining} days remaining in this 180-day window`
                : `Exceeds maximum stay by ${result.overstayDays} day(s)`}
            </p>
          </div>
        </div>

        <dl className="mt-5 grid gap-3">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
            <dt className="text-sm text-[var(--muted-foreground)]">Days used in rolling window</dt>
            <dd className="mt-1 text-2xl font-black">{result.daysUsed} <span className="text-sm font-normal text-[var(--muted-foreground)]">/ 90 days</span></dd>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
            <dt className="text-sm text-[var(--muted-foreground)]">Days remaining</dt>
            <dd className="mt-1 text-2xl font-black text-indigo-600 dark:text-indigo-400">{result.daysRemaining} days</dd>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
            <dt className="text-sm text-[var(--muted-foreground)]">Rolling 180-day window</dt>
            <dd className="mt-1 text-sm font-bold">{result.windowStart} to {result.referenceDate}</dd>
          </div>
        </dl>

        <ResultActions actions={actions} className="mt-5" />

        <div className="mt-5 flex gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm leading-6">
          <Info className="mt-0.5 size-5 shrink-0" />
          <p>
            This calculator is a personal planning tool for short-stay Schengen tracking. It does not constitute legal or immigration advice. Visa rules, bilateral exemptions, and local entry requirements should be verified with official border authorities.
          </p>
        </div>
      </aside>
    </div>
  );
}
