'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Plus, Scale, Trash2 } from 'lucide-react';
import {
  calculateDumpsterWeight,
  DEBRIS_MATERIALS,
  DEBRIS_UNIT_LABELS,
  getAllowedUnits,
  getDebrisMaterial,
  type DebrisLineInput,
  type DebrisUnit,
  type MaterialCondition,
} from '@/lib/calculations/dumpsterWeight';

interface DebrisRow {
  id: number;
  materialId: string;
  customName: string;
  quantity: string;
  unit: DebrisUnit;
  customWeight: string;
}

const dumpsterSizes = ['10', '15', '20', '30', '40', 'custom'] as const;
const fieldClass = 'w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20';

function toNonNegativeNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function clampNumericInput(value: string): string {
  if (value === '') return '';
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed < 0 ? '0' : value;
}

function createRow(id: number, materialId = 'mixed-construction'): DebrisRow {
  return {
    id,
    materialId,
    customName: '',
    quantity: '1',
    unit: getAllowedUnits(materialId)[0],
    customWeight: '500',
  };
}

export default function DumpsterWeightCalculator() {
  const [dumpsterSize, setDumpsterSize] = useState<(typeof dumpsterSizes)[number]>('20');
  const [customDumpsterSize, setCustomDumpsterSize] = useState('20');
  const [allowance, setAllowance] = useState('2');
  const [overageRate, setOverageRate] = useState('100');
  const [condition, setCondition] = useState<MaterialCondition>('typical');
  const [rows, setRows] = useState<DebrisRow[]>([createRow(1, 'concrete')]);
  const [nextId, setNextId] = useState(2);

  const calculationLines = useMemo<DebrisLineInput[]>(() => rows.map((row) => ({
    materialId: row.materialId,
    quantity: toNonNegativeNumber(row.quantity),
    unit: row.unit,
    customWeightLbPerUnit: row.materialId === 'custom' ? toNonNegativeNumber(row.customWeight) : undefined,
  })), [rows]);

  const result = useMemo(() => calculateDumpsterWeight(
    calculationLines,
    toNonNegativeNumber(allowance),
    toNonNegativeNumber(overageRate),
    condition,
  ), [allowance, calculationLines, condition, overageRate]);

  const selectedCapacity = dumpsterSize === 'custom'
    ? toNonNegativeNumber(customDumpsterSize)
    : Number(dumpsterSize);
  const knownVolumePercent = selectedCapacity > 0 ? (result.knownVolumeCubicYards / selectedCapacity) * 100 : 0;

  const status = result.totalTons > result.allowanceTons
    ? { label: 'Likely Weight Overage', className: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300', Icon: AlertTriangle }
    : result.allowanceTons > 0 && result.totalTons >= result.allowanceTons * 0.9
      ? { label: 'Close to Weight Limit', className: 'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300', Icon: AlertTriangle }
      : { label: 'Within Weight Allowance', className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300', Icon: CheckCircle2 };

  const updateRow = (id: number, patch: Partial<DebrisRow>) => {
    setRows((current) => current.map((row) => row.id === id ? { ...row, ...patch } : row));
  };

  const changeMaterial = (id: number, materialId: string) => {
    updateRow(id, { materialId, unit: getAllowedUnits(materialId)[0] });
  };

  const addRow = () => {
    setRows((current) => [...current, createRow(nextId)]);
    setNextId((current) => current + 1);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
      <div className="space-y-6">
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7" aria-labelledby="dumpster-details-heading">
          <h2 id="dumpster-details-heading" className="text-xl font-bold">Dumpster details</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <label className="text-sm font-semibold">
              Dumpster size
              <select value={dumpsterSize} onChange={(event) => setDumpsterSize(event.target.value as (typeof dumpsterSizes)[number])} className={`${fieldClass} mt-2`}>
                {dumpsterSizes.map((size) => <option key={size} value={size}>{size === 'custom' ? 'Custom' : `${size} cubic yards`}</option>)}
              </select>
            </label>
            {dumpsterSize === 'custom' && (
              <label className="text-sm font-semibold">
                Custom capacity (yd³)
                <input aria-label="Custom dumpster capacity in cubic yards" type="number" min="0" step="0.1" value={customDumpsterSize} onChange={(event) => setCustomDumpsterSize(clampNumericInput(event.target.value))} className={`${fieldClass} mt-2`} />
              </label>
            )}
            <label className="text-sm font-semibold">
              Included weight (tons)
              <input type="number" min="0" step="0.1" value={allowance} onChange={(event) => setAllowance(clampNumericInput(event.target.value))} className={`${fieldClass} mt-2`} />
            </label>
            <label className="text-sm font-semibold">
              Overage fee ($/ton)
              <input type="number" min="0" step="0.01" value={overageRate} onChange={(event) => setOverageRate(clampNumericInput(event.target.value))} className={`${fieldClass} mt-2`} />
            </label>
          </div>
          <p className="mt-4 text-xs leading-5 text-[var(--muted-foreground)]">Dumpster size describes volume only. Enter the included tonnage and fee shown in your rental quote or contract.</p>
        </section>

        <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7" aria-labelledby="debris-heading">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 id="debris-heading" className="text-xl font-bold">Debris materials</h2>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">Add each material separately for a clearer estimate.</p>
            </div>
            <label className="text-sm font-semibold sm:w-44">
              Material condition
              <select value={condition} onChange={(event) => setCondition(event.target.value as MaterialCondition)} className={`${fieldClass} mt-2`}>
                <option value="dry">Dry (estimate)</option>
                <option value="typical">Typical</option>
                <option value="wet">Wet (estimate)</option>
              </select>
            </label>
          </div>
          <p className="mt-3 text-xs leading-5 text-[var(--muted-foreground)]">Condition adjusts moisture-sensitive estimated materials only. Direct pound and ton entries are not adjusted.</p>

          <div className="mt-5 space-y-4">
            {rows.map((row, index) => {
              const material = getDebrisMaterial(row.materialId);
              const allowedUnits = getAllowedUnits(row.materialId);
              const customFactorRequired = row.materialId === 'custom' && row.unit !== 'tons' && row.unit !== 'pounds';
              return (
                <fieldset key={row.id} className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
                  <legend className="px-1 text-xs font-bold uppercase tracking-wide text-[var(--muted-foreground)]">Material {index + 1}</legend>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr_auto] lg:items-end">
                    <label className="text-sm font-semibold">
                      Material
                      <select value={row.materialId} onChange={(event) => changeMaterial(row.id, event.target.value)} className={`${fieldClass} mt-2`}>
                        {DEBRIS_MATERIALS.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
                      </select>
                    </label>
                    <label className="text-sm font-semibold">
                      Quantity
                      <input type="number" min="0" step="any" value={row.quantity} onChange={(event) => updateRow(row.id, { quantity: clampNumericInput(event.target.value) })} className={`${fieldClass} mt-2`} />
                    </label>
                    <label className="text-sm font-semibold">
                      Unit
                      <select value={row.unit} onChange={(event) => updateRow(row.id, { unit: event.target.value as DebrisUnit })} className={`${fieldClass} mt-2`}>
                        {allowedUnits.map((unit) => <option key={unit} value={unit}>{DEBRIS_UNIT_LABELS[unit]}</option>)}
                      </select>
                    </label>
                    <button type="button" onClick={() => setRows((current) => current.filter(({ id }) => id !== row.id))} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-red-500/20 px-3 text-sm font-semibold text-red-600 transition hover:bg-red-500/10" aria-label={`Remove material ${index + 1}`}>
                      <Trash2 className="size-4" /><span className="lg:hidden">Remove</span>
                    </button>
                  </div>
                  {row.materialId === 'custom' && (
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <label className="text-sm font-semibold">
                        Custom material name
                        <input type="text" value={row.customName} onChange={(event) => updateRow(row.id, { customName: event.target.value })} placeholder="e.g. plaster" className={`${fieldClass} mt-2`} />
                      </label>
                      {customFactorRequired && (
                        <label className="text-sm font-semibold">
                          Estimated lb per {DEBRIS_UNIT_LABELS[row.unit]}
                          <input type="number" min="0" step="any" value={row.customWeight} onChange={(event) => updateRow(row.id, { customWeight: clampNumericInput(event.target.value) })} className={`${fieldClass} mt-2`} />
                        </label>
                      )}
                    </div>
                  )}
                  <p className="mt-3 text-xs leading-5 text-[var(--muted-foreground)]">{material.notes}</p>
                </fieldset>
              );
            })}
          </div>

          <button type="button" onClick={addRow} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700">
            <Plus className="size-4" /> Add material
          </button>
        </section>
      </div>

      <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start" aria-label="Dumpster weight results">
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"><Scale className="size-6" /></span>
            <div><p className="text-sm text-[var(--muted-foreground)]">Estimated debris weight</p><p className="text-3xl font-black">{result.totalTons.toFixed(2)} tons</p></div>
          </div>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">{Math.round(result.totalPounds).toLocaleString()} pounds</p>

          <dl className="mt-6 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] px-4">
            <div className="flex items-center justify-between gap-4 py-4"><dt className="text-sm text-[var(--muted-foreground)]">Included weight</dt><dd className="font-bold">{result.allowanceTons.toFixed(2)} tons</dd></div>
            <div className="flex items-center justify-between gap-4 py-4"><dt className="text-sm text-[var(--muted-foreground)]">Estimated overage</dt><dd className="font-bold">{result.overageTons.toFixed(2)} tons</dd></div>
            <div className="flex items-center justify-between gap-4 py-4"><dt className="text-sm text-[var(--muted-foreground)]">Potential overage fee</dt><dd className="text-xl font-black">${result.overageFee.toFixed(2)}</dd></div>
          </dl>

          <div className={`mt-5 flex items-center gap-2 rounded-2xl border p-4 text-sm font-bold ${status.className}`}><status.Icon className="size-5" />{status.label}</div>
        </section>

        <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="text-lg font-bold">Volume capacity guidance</h2>
          <p className="mt-3 text-sm text-[var(--muted-foreground)]">Selected dumpster</p>
          <p className="text-2xl font-black">{selectedCapacity.toFixed(1)} cubic yards</p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--muted)]"><div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${Math.min(100, knownVolumePercent)}%` }} /></div>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">Known volume: {result.knownVolumeCubicYards.toFixed(2)} yd³ ({knownVolumePercent.toFixed(0)}%)</p>
          {result.hasUnmeasuredVolume && <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">Some rows use weight or area units, so the volume comparison is incomplete.</p>}
          <p className="mt-4 text-sm leading-6 text-[var(--muted-foreground)]">Heavy materials such as concrete, soil, and roofing shingles may exceed a dumpster&apos;s weight allowance before the container is full.</p>
        </section>
      </aside>
    </div>
  );
}
