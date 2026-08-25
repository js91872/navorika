'use client';

import { useMemo, useState } from 'react';
import { Activity, HeartPulse } from 'lucide-react';
import {
  calculateHeartRateEstimate,
  calculatePulseBpm,
  PULSE_INTERVALS,
  type PulseInterval,
} from '@/lib/calculations/heartRate';

const fieldClass = 'mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-[var(--foreground)] outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20';

function readNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function HeartRateCalculator() {
  const [beatsCounted, setBeatsCounted] = useState('18');
  const [interval, setInterval] = useState<PulseInterval>(15);
  const [age, setAge] = useState('40');
  const [restingHeartRate, setRestingHeartRate] = useState('70');

  const pulseBpm = useMemo(
    () => calculatePulseBpm(readNumber(beatsCounted), interval),
    [beatsCounted, interval],
  );

  const ageValue = readNumber(age);
  const restingValue = readNumber(restingHeartRate);
  const estimate = useMemo(
    () => calculateHeartRateEstimate(ageValue, restingValue),
    [ageValue, restingValue],
  );
  const ageIsValid = ageValue >= 18 && ageValue <= 100;
  const restingIsValid = restingValue >= 20 && restingValue < estimate.estimatedMaximum;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7" aria-labelledby="manual-pulse-heading">
        <div className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400"><HeartPulse className="size-6" /></span>
          <div>
            <h2 id="manual-pulse-heading" className="text-xl font-bold">Convert a manual pulse count to BPM</h2>
            <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">Count your pulse yourself, then enter the number of beats. This calculator does not detect or measure your pulse.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            Beats counted
            <input aria-label="Beats counted manually" type="number" min="0" step="1" value={beatsCounted} onChange={(event) => setBeatsCounted(event.target.value)} className={fieldClass} />
          </label>
          <label className="text-sm font-semibold">
            Counting interval
            <select value={interval} onChange={(event) => setInterval(Number(event.target.value) as PulseInterval)} className={fieldClass}>
              {PULSE_INTERVALS.map((seconds) => <option key={seconds} value={seconds}>{seconds} seconds</option>)}
            </select>
          </label>
        </div>

        <div className="mt-6 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5" aria-live="polite">
          <p className="text-sm font-semibold text-[var(--muted-foreground)]">Calculated heart rate</p>
          <p className="mt-1 text-4xl font-black text-[var(--foreground)]">{pulseBpm} <span className="text-xl">BPM</span></p>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">{readNumber(beatsCounted)} beats × (60 ÷ {interval} seconds)</p>
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7" aria-labelledby="exercise-estimate-heading">
        <div className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"><Activity className="size-6" /></span>
          <div>
            <h2 id="exercise-estimate-heading" className="text-xl font-bold">Age-based exercise estimates</h2>
            <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">Uses the broad 220 − age estimate. It does not measure your personal maximum heart rate.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            Age (years)
            <input type="number" min="18" max="100" step="1" value={age} onChange={(event) => setAge(event.target.value)} className={fieldClass} />
          </label>
          <label className="text-sm font-semibold">
            Resting heart rate (BPM)
            <input type="number" min="20" max="220" step="1" value={restingHeartRate} onChange={(event) => setRestingHeartRate(event.target.value)} className={fieldClass} />
          </label>
        </div>

        {!ageIsValid && <p className="mt-3 text-sm font-semibold text-red-600 dark:text-red-400">Enter an adult age from 18 to 100.</p>}
        {ageIsValid && !restingIsValid && <p className="mt-3 text-sm font-semibold text-red-600 dark:text-red-400">Enter a resting rate below the age-estimated maximum.</p>}

        {ageIsValid && restingIsValid && (
          <div className="mt-6 space-y-4" aria-live="polite">
            <dl className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4"><dt className="text-sm text-[var(--muted-foreground)]">Estimated maximum</dt><dd className="mt-1 text-2xl font-black">{estimate.estimatedMaximum} BPM</dd><p className="mt-1 text-xs text-[var(--muted-foreground)]">220 − {ageValue}; population estimate</p></div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4"><dt className="text-sm text-[var(--muted-foreground)]">Heart-rate reserve</dt><dd className="mt-1 text-2xl font-black">{estimate.heartRateReserve} BPM</dd><p className="mt-1 text-xs text-[var(--muted-foreground)]">Estimated maximum − resting rate</p></div>
            </dl>
            <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
              <div className="flex flex-col justify-between gap-1 bg-emerald-500/10 px-4 py-3 sm:flex-row sm:items-center"><span className="font-semibold">Moderate intensity (50–70%)</span><strong>{estimate.moderateRange.min}–{estimate.moderateRange.max} BPM</strong></div>
              <div className="flex flex-col justify-between gap-1 border-t border-[var(--border)] bg-amber-500/10 px-4 py-3 sm:flex-row sm:items-center"><span className="font-semibold">Vigorous intensity (70–85%)</span><strong>{estimate.vigorousRange.min}–{estimate.vigorousRange.max} BPM</strong></div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
