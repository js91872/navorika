'use client';
import { useRef, useState } from 'react';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';
import type { PdfBleedTrimResult } from '@/lib/calculations/pdfBleedTrim';
import { calculateImagePrintSize } from '@/lib/calculations/imagePrintSize';
import { pdfInterpretation, pdfReportRows } from '@/lib/i18n/printReports';
import { rowsToCsv } from '@/lib/resultExport';
import { CopyResult, fieldClass, buttonClass } from './ToolControls';

type Props = { d: Dictionary; locale: Locale };
function PrintSize({ d, locale }: Props) {
  const defaults = ['3000', '2400', '300'];
  const [values, setValues] = useState(defaults);
  const [widthPixels, heightPixels, ppi] = values.map((value) => value.trim() ? Number(value) : NaN);
  const valid = [widthPixels, heightPixels].every((value) => Number.isInteger(value) && value > 0 && value <= 1e9)
    && Number.isFinite(ppi) && ppi > 0 && ppi <= 1e6;
  const result = valid ? calculateImagePrintSize({ widthPixels, heightPixels, ppi }) : null;
  const format = new Intl.NumberFormat(locale, { maximumFractionDigits: 3 }).format;
  const rows = result ? [
    [d.printSize.widthInches, format(result.widthInches!)], [d.printSize.heightInches, format(result.heightInches!)],
    [d.printSize.widthCm, format(result.widthCm!)], [d.printSize.heightCm, format(result.heightCm!)],
  ] : [];
  const text = rows.map((row) => row.join(': ')).join('\n');
  return <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-8">
    <h2 className="mb-5 text-xl font-bold">{d.ui.dimensions}</h2>
    <div className="grid gap-5 sm:grid-cols-3">
      {[`${d.ui.width} (${d.ui.pixels})`, `${d.ui.height} (${d.ui.pixels})`, d.printSize.ppi].map((label, index) =>
        <label key={label}>{label}<input className={fieldClass} type="number" dir="ltr" min={index === 2 ? 0.000001 : 1}
          max={index === 2 ? 1e6 : 1e9} step={index === 2 ? 'any' : 1} value={values[index]} aria-invalid={!valid}
          onChange={(event) => setValues(values.map((value, i) => i === index ? event.target.value : value))} /></label>)}
    </div>
    <button type="button" className={`${buttonClass} mt-5`} onClick={() => setValues(defaults)}>{d.ui.reset}</button>
    <div aria-live="polite" aria-atomic="true" className="mt-6">
      <h3 className="mb-3 font-bold">{d.ui.result}</h3>
      {result ? <dl className="grid gap-4 sm:grid-cols-2">{rows.map(([label, value]) => <div key={label} className="rounded-xl bg-[var(--muted)] p-4">
        <dt>{label}</dt><dd className="mt-2 text-xl font-bold"><bdi dir="ltr">{value}</bdi></dd>
      </div>)}</dl> : <p role="alert">{d.printSize.invalid}</p>}
    </div>
    <CopyResult key={text} text={text} d={d} />
  </section>;
}

function PdfChecker({ d, locale }: Props) {
  const [result, setResult] = useState<PdfBleedTrimResult | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [filename, setFilename] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const generation = useRef(0);
  const page = result?.pages[pageIndex];
  const f = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format;
  const rows = result ? pdfReportRows(result.pages, d, locale) : [];
  const report = rows.slice(1).map((row) => row.map((value, index) => `${rows[0][index]}: ${value}`).join('\n')).join('\n\n');
  const summary = result ? `${d.tools['pdf-bleed-trim-checker'].title}\n${d.pdf.pages}: ${f(result.pageCount)}\n\n${report}` : '';
  return <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-8">
    <label className="block cursor-pointer rounded-xl border border-dashed border-indigo-400 p-6 text-lg font-bold focus-within:ring-2 focus-within:ring-indigo-500">
      {d.pdf.choose}<span className="mt-3 block break-all text-sm font-normal"><bdi>{filename}</bdi></span>
      <input type="file" className="sr-only" aria-label={d.pdf.choose} accept=".pdf,application/pdf" onChange={async (event) => {
        const id = ++generation.current;
        const file = event.target.files?.[0];
        setResult(null); setError(''); setBusy(false); setPageIndex(0); setFilename(file?.name ?? '');
        if (!file) return;
        if (file.size > 20 * 1024 * 1024) { setError(d.pdf.tooLarge); return; }
        if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') { setError(d.pdf.error); return; }
        setBusy(true);
        try {
          const { parsePdfBleedTrim } = await import('@/lib/calculations/pdfBleedTrim');
          const inspection = await parsePdfBleedTrim(await file.arrayBuffer(), { rejectEncrypted: true });
          if (id !== generation.current) return;
          if (inspection.valid && inspection.pages.length) setResult(inspection); else setError(d.pdf.error);
        } catch { if (id === generation.current) setError(d.pdf.error); }
        finally { if (id === generation.current) setBusy(false); }
      }} />
    </label>
    <p role="status" className="mt-4">{busy ? d.pdf.processing : ''}</p>
    {error && <p role="alert" className="mt-4">{error}</p>}
    {result && page && <div className="mt-6 space-y-5" aria-live="polite">
      <p className="font-bold">{d.pdf.pages}: <bdi>{f(result.pageCount)}</bdi></p>
      <label className="block">{d.pdf.page}<select className={fieldClass} value={pageIndex} onChange={(event) => setPageIndex(Number(event.target.value))}>
        {result.pages.map((p, index) => <option key={p.pageNumber} value={index}>{d.pdf.page} {f(p.pageNumber)}</option>)}
      </select></label>
      <dl className="grid gap-4 sm:grid-cols-2">
        {[[d.pdf.media, page.mediaBox], [d.pdf.crop, page.cropBox], [d.pdf.trim, page.trimBox], [d.pdf.bleed, page.bleedBox]].map(([label, box]) => {
          const rect = box as typeof page.mediaBox;
          return <div key={label as string} className="rounded-xl bg-[var(--muted)] p-4"><dt>{label as string} ({d.ui.mm})</dt>
            <dd className="mt-2 text-xl font-bold"><bdi dir="ltr">{f(rect.width / 72 * 25.4)} × {f(rect.height / 72 * 25.4)}</bdi></dd></div>;
        })}
        {[[d.pdf.explicitTrim, page.hasExplicitTrimBox], [d.pdf.explicitBleed, page.hasExplicitBleedBox], [d.pdf.explicitCrop, page.hasExplicitCropBox]].map(([label, present]) =>
          <div key={label as string}><dt>{label as string}</dt><dd className="font-bold">{present ? d.ui.yes : d.ui.no}</dd></div>)}
      </dl>
      <h3 className="font-bold">{d.ui.bleed} ({d.ui.mm})</h3>
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">{(['top', 'bottom', 'left', 'right'] as const).map((edge) =>
        <div key={edge} className="rounded-xl border border-[var(--border)] p-3"><dt>{d.pdf[edge]}</dt><dd className="mt-2 font-bold"><bdi>{f(page.bleedMarginMm[edge])}</bdi></dd></div>)}</dl>
      <p className="rounded-xl bg-indigo-500/10 p-5 leading-7" data-pdf-interpretation>{pdfInterpretation(page, d)}</p>
      <CopyResult key={summary} text={summary} d={d} />
      <div className="flex flex-wrap gap-3">
        <button type="button" className={buttonClass} onClick={() => {
          const blob = new Blob(['\uFEFF', rowsToCsv(rows)], { type: 'text/csv;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a'); link.href = url; link.download = `navorika-${locale}.csv`; link.click();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        }}>{d.pdf.download}</button>
        <button type="button" className={buttonClass} onClick={() => window.print()}>{d.pdf.print}</button>
      </div>
    </div>}
    <p className="mt-6 text-sm leading-7 text-[var(--muted-foreground)]">{d.pdf.note}</p>
  </section>;
}

export default function LocalizedPrintTools({ slug, ...props }: Props & { slug: 'pdf-bleed-trim-checker' | 'image-print-size-calculator' }) {
  return slug === 'pdf-bleed-trim-checker' ? <PdfChecker {...props} /> : <PrintSize {...props} />;
}
