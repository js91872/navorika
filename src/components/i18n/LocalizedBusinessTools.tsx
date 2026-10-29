'use client';

import { useMemo, useState } from 'react';
import { Calculator, Info } from 'lucide-react';
import ResultActions from '@/components/ui/ResultActions';
import { localizeBusinessCalculator } from '@/lib/i18n/businessLocalization';
import { calculateLocalizedValues, calculatorTextFormatters, formatCalculatorNumber, isIntegerCalculatorField } from '@/lib/i18n/sharedCalculators';
import type { LocalizedCalculatorSlug } from '@/lib/i18n/calculatorRegistry';
import { resultActionMessages } from '@/lib/i18n/actionMessages';
import { rowsToCsv } from '@/lib/resultExport';
import { businessCalculatorConfigs, type ValueMap } from '@/lib/calculations/businessConfigs';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';
import { fieldClass, buttonClass } from './ToolControls';

export default function LocalizedBusinessTools({ slug, d, locale }: { slug: LocalizedCalculatorSlug; d: Dictionary; locale: Locale }) {
  const defaults = useMemo(() => Object.fromEntries(businessCalculatorConfigs[slug].fields.map((field) => [field.key, field.defaultValue])) as ValueMap, [slug]);
  const [values, setValues] = useState<ValueMap>(defaults);
  const result = calculateLocalizedValues(slug, values);
  const ui = d.calculatorUi;
  const config = localizeBusinessCalculator(slug, d.calculators[slug], calculatorTextFormatters(slug, values, d, locale));
  const rows = result ? config.results.map(({ label, key, format }) => [label, format === 'text' ? config.formatTextResult(key, Reflect.get(result, key)) : formatCalculatorNumber(Reflect.get(result, key), format, locale, ui.notApplicable)]) : [];
  const summary = [d.tools[slug].title, ...rows.map((row) => row.join(': '))].join('\n');
  return <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,.8fr)]">
    <section className="min-w-0 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7">
      <div className="flex items-center gap-3"><Calculator aria-hidden="true" className="size-6 text-indigo-600" /><h2 className="text-xl font-bold">{ui.inputs}</h2></div>
      <div className="mt-6 grid min-w-0 gap-4 sm:grid-cols-2">
        {config.fields.map((field) => <label key={field.key} className={`min-w-0 text-sm font-semibold ${field.type === 'textarea' ? 'sm:col-span-2' : ''}`}>{field.label}
          {field.options ? (
            <select
              className={fieldClass}
              value={String(values[field.key] ?? field.defaultValue ?? '')}
              onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))}
            >
              {field.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : field.type === 'textarea' ? (
            <textarea
              className={`${fieldClass} min-h-28`}
              rows={field.rows ?? 4}
              placeholder={field.placeholder}
              value={String(values[field.key] ?? field.defaultValue ?? '')}
              onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))}
            />
          ) : field.type === 'text' || typeof field.defaultValue === 'string' ? (
            <input
              type="text"
              dir="ltr"
              className={fieldClass}
              placeholder={field.placeholder}
              value={String(values[field.key] ?? field.defaultValue ?? '')}
              onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))}
            />
          ) : (
            <input type="number" dir="ltr" inputMode="decimal" className={fieldClass} min={field.min} max={field.max} step={isIntegerCalculatorField(field.key) ? 1 : 'any'} value={values[field.key] ?? ''}
              onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value === '' ? '' : Number(event.target.value) }))} />
          )}
          {field.help && <span className="mt-1 block text-xs font-normal leading-5 text-[var(--muted-foreground)]">{field.help}</span>}
        </label>)}
      </div>
      <button type="button" className={`${buttonClass} mt-6`} onClick={() => setValues(defaults)}>{ui.reset}</button>
    </section>
    <aside className="min-w-0 rounded-3xl border border-indigo-500/20 bg-indigo-500/5 p-5 sm:p-7">
      <h2 className="text-xl font-bold">{ui.results}</h2>
      <div aria-live="polite" aria-atomic="true">{result ? <dl className="mt-5 grid gap-3">{rows.map(([label, value]) => <div key={label} className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"><dt className="text-sm text-[var(--muted-foreground)]">{label}</dt><dd suppressHydrationWarning className="mt-1 break-words text-xl font-black whitespace-pre-wrap"><bdi dir="ltr" suppressHydrationWarning>{value}</bdi></dd></div>)}</dl> : <p role="alert" className="mt-5">{ui.invalid}</p>}</div>
      {result && <ResultActions key={summary} className="mt-5" messages={resultActionMessages[locale]} actions={[
        { kind: 'copy', label: ui.copy, getContent: () => summary },
        { kind: 'download', label: ui.csv, filename: `${slug}-${locale}.csv`, mimeType: 'text/csv;charset=utf-8', getContent: () => '\uFEFF' + rowsToCsv([[ui.result, ui.value], ...rows]) },
        { kind: 'print' },
      ]} />}
      <div className="mt-5 flex gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm leading-6"><Info aria-hidden="true" className="mt-0.5 size-5 shrink-0" /><p>{config.note}</p></div>
    </aside>
  </div>;
}
