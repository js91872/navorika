'use client';

import { Calculator, Info } from 'lucide-react';
import { useMemo, useState } from 'react';
import ResultActions, { type ResultAction } from '@/components/ui/ResultActions';
import { toolUx } from '@/data/toolUx';
import { rowsToCsv } from '@/lib/resultExport';

import { businessCalculatorConfigs as configs, calculatorStringValue as s, type Format, type ValueMap } from '@/lib/calculations/businessConfigs';

const inputClass = 'mt-2 w-full min-w-0 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20';

function display(value: unknown, format: Format) {
  if (value === null || value === undefined || typeof value === 'boolean') return 'Not applicable';
  if (format === 'text') return String(value);
  if (typeof value !== 'number' || !Number.isFinite(value)) return 'Not applicable';
  if (format === 'currency') return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value);
  if (format === 'percent') return `${value.toLocaleString(undefined, { maximumFractionDigits: 3 })}%`;
  if (format === 'months') return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })} months`;
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export default function BusinessCalculatorTool({ slug }: { slug: string }) {
  const config = configs[slug];
  if (!config) throw new Error(`Unknown business calculator: ${slug}`);
  const defaults = useMemo(() => Object.fromEntries(config.fields.map((item) => [item.key, item.defaultValue])) as ValueMap, [config]);
  const [values, setValues] = useState<ValueMap>(defaults);
  const [scenarioLabel, setScenarioLabel] = useState('Custom model or provider');
  const result = useMemo(() => config.calculate(values), [config, values]);
  const resultRows = config.results.map((item) => [item.label, display(Reflect.get(result, item.key), item.format)] as const);
  const summary = `${slug === 'brrrr-calculator' ? 'BRRRR estimate' : 'Estimated results'}\n${resultRows.map(([label, value]) => `${label}: ${value}`).join('\n')}`;
  const actions = (toolUx[slug]?.resultActions ?? []).reduce<ResultAction[]>((items, kind) => {
    if (kind === 'copy-summary') items.push({ kind: 'copy', label: 'Copy summary', getContent: () => summary });
    if (kind === 'download-csv') items.push({ kind: 'download', label: 'Download CSV', filename: `${slug}-results.csv`, mimeType: 'text/csv;charset=utf-8', getContent: () => rowsToCsv([['Result', 'Value'], ...resultRows]) });
    if (kind === 'print') items.push({ kind: 'print', label: 'Print / Save PDF' });
    return items;
  }, []);
  return <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,.8fr)]">
    <section className="min-w-0 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7">
      <div className="flex items-center gap-3"><Calculator className="size-6 text-indigo-600"/><h2 className="text-xl font-bold">Planning inputs</h2></div>
      {slug === 'llm-api-cost-calculator' && <label className="mt-6 block text-sm font-semibold">Model or provider label<input className={inputClass} type="text" value={scenarioLabel} onChange={(event) => setScenarioLabel(event.target.value)} /></label>}
      <div className="mt-6 grid min-w-0 gap-4 sm:grid-cols-2">
        {config.fields.map((item) => (
          <label key={item.key} className={`min-w-0 text-sm font-semibold ${item.type === 'textarea' ? 'sm:col-span-2' : ''}`}>
            {item.label}
            {item.type === 'select' ? (
              <select
                className={inputClass}
                value={s(values, item.key, String(item.defaultValue))}
                onChange={(event) => setValues((current) => ({ ...current, [item.key]: event.target.value }))}
              >
                {item.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : item.type === 'textarea' ? (
              <textarea
                className={`${inputClass} font-mono`}
                rows={item.rows ?? 4}
                placeholder={item.placeholder}
                value={s(values, item.key, String(item.defaultValue))}
                onChange={(event) => setValues((current) => ({ ...current, [item.key]: event.target.value }))}
              />
            ) : item.type === 'text' ? (
              <input
                className={`${inputClass} font-mono`}
                type="text"
                placeholder={item.placeholder}
                value={s(values, item.key, String(item.defaultValue))}
                onChange={(event) => setValues((current) => ({ ...current, [item.key]: event.target.value }))}
              />
            ) : (
              <input
                className={inputClass}
                type="number"
                inputMode="decimal"
                min={item.min}
                max={item.max}
                step={item.step ?? 'any'}
                value={values[item.key] ?? ''}
                onChange={(event) => setValues((current) => ({ ...current, [item.key]: event.target.value === '' ? '' : Number(event.target.value) }))}
              />
            )}
            {item.help && <span className="mt-1 block text-xs font-normal leading-5 text-[var(--muted-foreground)]">{item.help}</span>}
          </label>
        ))}
      </div>
      <button type="button" className="mt-6 rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold hover:bg-[var(--muted)]" onClick={() => { setValues(defaults); setScenarioLabel('Custom model or provider'); }}>Reset example</button>
    </section>
    <aside className="min-w-0 rounded-3xl border border-indigo-500/20 bg-indigo-500/5 p-5 sm:p-7">
      <h2 className="break-words text-xl font-bold">{slug === 'llm-api-cost-calculator' ? `${scenarioLabel || 'Custom scenario'} estimate` : 'Estimated results'}</h2>
      <dl className="mt-5 grid gap-3">{config.results.map((item) => <div key={item.key} className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"><dt className="text-sm text-[var(--muted-foreground)]">{item.label}</dt><dd className="mt-1 break-words text-xl font-black whitespace-pre-wrap">{display(Reflect.get(result, item.key), item.format)}</dd></div>)}</dl>
      <ResultActions actions={actions} className="mt-5" />
      <div className="mt-5 flex gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm leading-6"><Info className="mt-0.5 size-5 shrink-0"/><p>{config.note}</p></div>
    </aside>
  </div>;
}
