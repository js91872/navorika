'use client';

import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Gauge,
  Timer,
  TriangleAlert,
  Wind,
} from 'lucide-react';
import { calculateAirCompressor } from '@/lib/calculations/airCompressor';

const fieldClass =
  'mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20';

function numeric(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function clamp(value: string): string {
  if (value === '') return '';
  const number = Number(value);
  return Number.isFinite(number) && number < 0 ? '0' : value;
}

const commonTools = [
  { name: 'Custom tool', cfm: '', psi: '' },
  { name: 'Impact wrench', cfm: '5', psi: '90' },
  { name: 'Air ratchet', cfm: '4', psi: '90' },
  { name: 'Brad nailer', cfm: '1', psi: '90' },
  { name: 'Framing nailer', cfm: '2.5', psi: '90' },
  { name: 'Die grinder', cfm: '6', psi: '90' },
  { name: 'Orbital sander', cfm: '8', psi: '90' },
  { name: 'Spray gun', cfm: '10', psi: '40' },
];

export default function AirCompressorCalculator() {
  const [compressorScfm, setCompressorScfm] = useState('5');
  const [compressorPsi, setCompressorPsi] = useState('125');
  const [tankGallons, setTankGallons] = useState('20');

  const [toolPreset, setToolPreset] = useState('Impact wrench');
  const [toolCfm, setToolCfm] = useState('5');
  const [toolPsi, setToolPsi] = useState('90');
  const [usagePercent, setUsagePercent] = useState('50');

  const result = useMemo(
    () =>
      calculateAirCompressor({
        compressorScfm: numeric(compressorScfm),
        compressorRatedPsi: numeric(compressorPsi),
        tankGallons: numeric(tankGallons),
        toolCfm: numeric(toolCfm),
        toolPsi: numeric(toolPsi),
        usagePercent: numeric(usagePercent),
      }),
    [
      compressorScfm,
      compressorPsi,
      tankGallons,
      toolCfm,
      toolPsi,
      usagePercent,
    ],
  );

  const chooseTool = (name: string) => {
    setToolPreset(name);

    const preset = commonTools.find((tool) => tool.name === name);
    if (!preset || name === 'Custom tool') return;

    setToolCfm(preset.cfm);
    setToolPsi(preset.psi);
  };

  const status =
    result.status === 'comfortable'
      ? {
          label: 'Compressor should keep up',
          description:
            'Estimated average air demand is comfortably below compressor output.',
          Icon: CheckCircle2,
          className:
            'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
        }
      : result.status === 'borderline'
        ? {
            label: 'Borderline capacity',
            description:
              'Average demand is close to rated compressor output. Real pressure drop and recovery may matter.',
            Icon: TriangleAlert,
            className:
              'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300',
          }
        : {
            label: 'Compressor may fall behind',
            description:
              'Estimated average tool demand exceeds compressor output.',
            Icon: TriangleAlert,
            className:
              'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300',
          };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
      <div className="space-y-6">
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7">
          <div className="flex items-center gap-3">
            <Gauge className="size-6 text-indigo-600" />
            <h2 className="text-xl font-bold">Compressor specifications</h2>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <label className="text-sm font-semibold">
              Compressor SCFM
              <input
                type="number"
                min="0"
                step="0.1"
                value={compressorScfm}
                onChange={(event) =>
                  setCompressorScfm(clamp(event.target.value))
                }
                className={fieldClass}
              />
            </label>

            <label className="text-sm font-semibold">
              Maximum / tank PSI
              <input
                type="number"
                min="0"
                step="1"
                value={compressorPsi}
                onChange={(event) =>
                  setCompressorPsi(clamp(event.target.value))
                }
                className={fieldClass}
              />
            </label>

            <label className="text-sm font-semibold">
              Tank size (gallons)
              <input
                type="number"
                min="0"
                step="0.1"
                value={tankGallons}
                onChange={(event) =>
                  setTankGallons(clamp(event.target.value))
                }
                className={fieldClass}
              />
            </label>
          </div>

          <p className="mt-4 text-xs leading-5 text-[var(--muted-foreground)]">
            Use the SCFM rating at or near the pressure required by your air
            tool whenever the manufacturer provides it.
          </p>
        </section>

        <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7">
          <div className="flex items-center gap-3">
            <Wind className="size-6 text-indigo-600" />
            <h2 className="text-xl font-bold">Air tool demand</h2>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold sm:col-span-2">
              Tool
              <select
                value={toolPreset}
                onChange={(event) => chooseTool(event.target.value)}
                className={fieldClass}
              >
                {commonTools.map((tool) => (
                  <option key={tool.name} value={tool.name}>
                    {tool.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-semibold">
              Tool air demand (CFM)
              <input
                type="number"
                min="0"
                step="0.1"
                value={toolCfm}
                onChange={(event) => {
                  setToolPreset('Custom tool');
                  setToolCfm(clamp(event.target.value));
                }}
                className={fieldClass}
              />
            </label>

            <label className="text-sm font-semibold">
              Required pressure (PSI)
              <input
                type="number"
                min="0"
                step="1"
                value={toolPsi}
                onChange={(event) => {
                  setToolPreset('Custom tool');
                  setToolPsi(clamp(event.target.value));
                }}
                className={fieldClass}
              />
            </label>

            <label className="text-sm font-semibold sm:col-span-2">
              Tool usage / duty cycle (%)
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={usagePercent}
                onChange={(event) =>
                  setUsagePercent(
                    String(Math.min(100, numeric(event.target.value))),
                  )
                }
                className={fieldClass}
              />
            </label>
          </div>

          <p className="mt-4 text-xs leading-5 text-[var(--muted-foreground)]">
            Usage percentage describes how much of each minute the tool is
            actually consuming air. A continuously running grinder may be near
            100%, while an impact wrench may be used intermittently.
          </p>
        </section>
      </div>

      <aside
        className="space-y-6 lg:sticky lg:top-24 lg:self-start"
        aria-label="Air compressor results"
      >
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-lg">
          <p className="text-sm text-[var(--muted-foreground)]">
            Average air demand
          </p>

          <p className="mt-1 text-4xl font-black">
            {result.averageToolCfm.toFixed(2)} CFM
          </p>

          <div
            className={`mt-5 rounded-2xl border p-4 ${status.className}`}
          >
            <div className="flex items-center gap-2 font-bold">
              <status.Icon className="size-5" />
              {status.label}
            </div>
            <p className="mt-2 text-sm leading-6">{status.description}</p>
          </div>

          <dl className="mt-6 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] px-4">
            <div className="flex justify-between gap-4 py-4">
              <dt className="text-sm text-[var(--muted-foreground)]">
                Compressor output
              </dt>
              <dd className="font-bold">
                {numeric(compressorScfm).toFixed(2)} SCFM
              </dd>
            </div>

            <div className="flex justify-between gap-4 py-4">
              <dt className="text-sm text-[var(--muted-foreground)]">
                Recommended minimum
              </dt>
              <dd className="font-bold">
                {result.recommendedScfm.toFixed(2)} SCFM
              </dd>
            </div>

            <div className="flex justify-between gap-4 py-4">
              <dt className="text-sm text-[var(--muted-foreground)]">
                Output margin
              </dt>
              <dd className="font-bold">
                {result.continuousSurplusCfm >= 0 ? '+' : ''}
                {result.continuousSurplusCfm.toFixed(2)} CFM
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="flex items-center gap-2">
            <Timer className="size-5 text-indigo-600" />
            <h2 className="font-bold">Tank runtime estimate</h2>
          </div>

          {result.approximateRuntimeMinutes === null ? (
            <p className="mt-4 text-sm leading-6 text-[var(--muted-foreground)]">
              Average compressor output meets or exceeds estimated average
              demand, so there is no simple tank-depletion runtime.
            </p>
          ) : (
            <>
              <p className="mt-4 text-3xl font-black">
                {result.approximateRuntimeMinutes.toFixed(1)} min
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Approximate buffer before pressure falls toward the tool
                requirement, assuming the entered values.
              </p>
            </>
          )}
        </section>
      </aside>
    </div>
  );
}
