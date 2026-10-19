'use client';

import dynamic from 'next/dynamic';
import { CopyResult, fieldClass, buttonClass } from './ToolControls';
import { useRef, useState, type CSSProperties } from 'react';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { Locale, TranslatedTool } from '@/lib/i18n/config';
import { aspectRatio, flexCss, printDimensions } from '@/lib/i18n/calculations';
import { inspectImageColorMode, type RgbCmykImageResult } from '@/lib/calculations/rgbCmykImage';


const LocalizedPrintTools = dynamic(() => import('./LocalizedPrintTools'));

function NumericTools({ slug, d, locale }: { slug: TranslatedTool; d: Dictionary; locale: Locale }) {
  const isMega = slug === 'image-megapixel-calculator';
  const isBleed = slug === 'print-bleed-calculator';
  const defaults = isMega ? [6000, 4000, 3] : isBleed ? [210, 297, 3] : [16, 9, 3];
  const [values, setValues] = useState(defaults.map(String));
  const [unit, setUnit] = useState('mm');
  const unitLabel = unit === 'inch' ? d.ui.inch : d.ui.mm;
  const [width, height, bleed] = values.map((value) => value.trim() === '' ? NaN : Number(value));
  const ratio = aspectRatio(width, height);
  const dimensions = printDimensions(width, height, bleed);
  const valid = !!ratio && (!isMega || (Number.isInteger(width) && Number.isInteger(height))) && (!isBleed || !!dimensions);
  const format = (value: number) => new Intl.NumberFormat(locale, { maximumFractionDigits: 4 }).format(value);
  const result = !valid ? '' : isMega
    ? `${d.ui.megapixels}: ${format(ratio!.megapixels)} ${d.ui.mpUnit}\n${d.ui.pixels}: ${format(ratio!.pixels)}`
    : isBleed ? `${d.ui.documentSize}: ${format(dimensions!.width)} × ${format(dimensions!.height)} ${unitLabel}`
    : `${d.ui.padding}: ${format(ratio!.padding)}%\n${d.ui.ratio}: ${format(ratio!.ratio)}`;
  const css = valid && !isMega && !isBleed
    ? `aspect-ratio: ${width} / ${height};\npadding-top: ${Number(ratio!.padding.toFixed(6))}%;` : '';
  return <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-8">
    <h2 className="mb-5 text-xl font-bold">{d.ui.dimensions}</h2>
    {isBleed && <label className="mb-5 block">{d.ui.unit}
      <select value={unit} className={fieldClass} onChange={(event) => {
        const next = event.target.value;
        if (next !== unit) setValues(values.map((value) => {
          const numeric = Number(value);
          return value.trim() && Number.isFinite(numeric) ? String(Number((numeric * (next === 'inch' ? 1 / 25.4 : 25.4)).toFixed(8))) : value;
        }));
        setUnit(next);
      }}><option value="mm">{d.ui.mm}</option><option value="inch">{d.ui.inch}</option></select>
    </label>}
    <div className="grid gap-5 sm:grid-cols-2">
      {[d.ui.width, d.ui.height, ...(isBleed ? [d.ui.bleed] : [])].map((label, index) =>
        <label key={label}>{label}{isMega ? ` (${d.ui.pixels})` : isBleed ? ` (${unitLabel})` : ''}
          <input type="number" dir="ltr" min={index === 2 ? 0 : isMega ? 1 : 0.000001}
            max={index === 2 ? 1e6 : 1e9} step={isMega ? 1 : 'any'} value={values[index]}
            className={fieldClass} aria-invalid={!valid} onChange={(event) => setValues(values.map((value, i) => i === index ? event.target.value : value))} />
        </label>)}
    </div>
    <button type="button" className={`${buttonClass} mt-5`} onClick={() => { setValues(defaults.map(String)); setUnit('mm'); }}>{d.ui.reset}</button>
    <div className="mt-6 rounded-xl bg-[var(--muted)] p-5" aria-live="polite" aria-atomic="true">
      <h3 className="mb-3 font-bold">{d.ui.result}</h3>
      {valid ? <><div className="text-lg font-semibold">{result.split('\n').map((line) =>
        <p key={line}>{line.slice(0, line.indexOf(':'))}: <bdi dir="ltr">{line.slice(line.indexOf(':') + 1).trim()}</bdi></p>)}
        </div>
        {css && <pre dir="ltr" className="mt-4 overflow-x-auto rounded-lg bg-[var(--background)] p-4 text-start text-sm"><code>{css}</code></pre>}
      </> : <p role="alert">{d.ui.invalid}</p>}
    </div>
    <CopyResult key={result} text={css || result} d={d} />
  </section>;
}

function FlexTool({ d }: { d: Dictionary }) {
  const [direction, setDirection] = useState('row');
  const [justify, setJustify] = useState('flex-start');
  const [align, setAlign] = useState('stretch');
  const [wrap, setWrap] = useState('wrap');
  const [gap, setGap] = useState(16);
  const [items, setItems] = useState(5);
  const css = flexCss(direction, justify, align, wrap, gap) ?? '';
  return <section className="grid gap-6 lg:grid-cols-2">
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-8">
      {[
        { label: d.ui.direction, value: direction, set: setDirection, options: ['row', 'column', 'row-reverse', 'column-reverse'] },
        { label: d.ui.justify, value: justify, set: setJustify, options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'] },
        { label: d.ui.align, value: align, set: setAlign, options: ['stretch', 'flex-start', 'center', 'flex-end', 'baseline'] },
        { label: d.ui.wrap, value: wrap, set: setWrap, options: ['nowrap', 'wrap', 'wrap-reverse'] },
      ].map((field) => <label key={field.label} className="mb-5 block">{field.label}
        <select className={fieldClass} value={field.value} onChange={(event) => field.set(event.target.value)}>
          {field.options.map((option) => <option key={option} value={option}>{d.flexOptions[option as keyof Dictionary['flexOptions']]}</option>)}
        </select>
      </label>)}
      <label className="mb-5 block">{d.ui.gap}: {gap}
        <input type="range" min="0" max="100" value={gap} className="mt-2 w-full" onChange={(event) => setGap(Number(event.target.value))} />
      </label>
      <label className="block">{d.ui.items}: {items}
        <input type="range" min="1" max="12" value={items} className="mt-2 w-full" onChange={(event) => setItems(Number(event.target.value))} />
      </label>
    </div>
    <div className="min-w-0 space-y-5">
      <h2 className="text-xl font-bold">{d.ui.preview}</h2>
      <div dir="ltr" className="min-h-64 overflow-auto rounded-2xl border border-dashed border-indigo-400 p-4"
        style={{ display: 'flex', flexDirection: direction as CSSProperties['flexDirection'], justifyContent: justify,
          alignItems: align, flexWrap: wrap as CSSProperties['flexWrap'], gap, height: 320 }}>
        {Array.from({ length: items }, (_, i) => <div key={i} className="flex min-h-16 min-w-20 shrink-0 items-center justify-center rounded-xl bg-indigo-600 p-4 font-bold text-white">{i + 1}</div>)}
      </div>
      <h2 className="font-bold">{d.ui.css}</h2>
      <pre dir="ltr" className="overflow-x-auto rounded-xl bg-[var(--muted)] p-5 text-start text-sm"><code>{css}</code></pre>
      <CopyResult key={css} text={css} d={d} />
    </div>
  </section>;
}

function ColorTool({ d, locale }: { d: Dictionary; locale: Locale }) {
  const [result, setResult] = useState<RgbCmykImageResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [filename, setFilename] = useState('');
  const generation = useRef(0);
  const summary = result ? [
    [d.ui.format, result.detectedFormat], [d.ui.mode, result.colorMode === 'RGB' ? d.ui.rgbLabel : result.colorMode === 'CMYK' ? d.ui.cmykLabel : result.colorMode === 'Grayscale' ? d.ui.grayscale : result.colorMode === 'Indexed (Palette)' ? d.ui.palette : d.ui.unknown],
    [d.ui.channels, result.channels === null ? d.ui.unknown : new Intl.NumberFormat(locale).format(result.channels)],
    [d.ui.alpha, result.hasAlpha ? d.ui.yes : d.ui.no], [d.ui.icc, result.hasEmbeddedIcc ? d.ui.yes : d.ui.no],
  ] : [];
  return <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-8">
    <label className="block cursor-pointer rounded-xl border border-dashed border-indigo-400 bg-[var(--background)] p-6 text-lg font-bold focus-within:ring-2 focus-within:ring-indigo-500">{d.ui.selectFile}
      <span className="mt-3 block break-all text-sm font-normal text-[var(--muted-foreground)]"><bdi>{filename}</bdi></span>
      <input type="file" aria-label={d.ui.selectFile} accept=".jpg,.jpeg,.png,.tif,.tiff,.webp,.gif" className="sr-only" onChange={async (event) => {
        const id = ++generation.current;
        const file = event.target.files?.[0];
        setFilename(file?.name ?? '');
        setResult(null); setError(false);
        if (!file) { setBusy(false); return; }
        setBusy(true);
        try {
          const inspection = inspectImageColorMode(await file.slice(0, 131072).arrayBuffer());
          if (id !== generation.current) return;
          if (inspection.valid) setResult(inspection); else setError(true);
        } catch { if (id === generation.current) setError(true); }
        finally { if (id === generation.current) setBusy(false); }
      }} />
    </label>
    <p role="status" className="mt-4">{busy ? d.ui.processing : ''}</p>
    {error && <p role="alert" className="mt-4">{d.ui.fileError}</p>}
    {result && <>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2" aria-live="polite">
        {summary.map(([key, value]) => <div key={key} className="rounded-xl bg-[var(--muted)] p-4">
          <dt className="text-sm text-[var(--muted-foreground)]">{key}</dt>
          <dd className="mt-2 text-xl font-bold"><bdi>{value}</bdi></dd>
        </div>)}
      </dl>
      <CopyResult text={summary.map((row) => row.join(': ')).join('\n')} d={d} />
    </>}
    <p className="mt-6 text-sm leading-7 text-[var(--muted-foreground)]">{d.ui.colorNote}</p>
  </section>;
}

export default function LocalizedTools({ slug, dictionary, locale }: { slug: TranslatedTool; dictionary: Dictionary; locale: Locale }) {
  if (slug === 'pdf-bleed-trim-checker' || slug === 'image-print-size-calculator') return <LocalizedPrintTools slug={slug} d={dictionary} locale={locale} />;
  if (slug === 'css-flexbox-generator') return <FlexTool d={dictionary} />;
  if (slug === 'rgb-cmyk-image-checker') return <ColorTool d={dictionary} locale={locale} />;
  return <NumericTools slug={slug} d={dictionary} locale={locale} />;
}
