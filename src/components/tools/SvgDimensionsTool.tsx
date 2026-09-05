'use client';

import { useMemo, useState } from 'react';
import { FileUp, ShieldCheck, Copy, Download, Printer, CheckCircle2, AlertCircle, Code2 } from 'lucide-react';
import { parseSvgDimensions } from '@/lib/calculations/svgDimensions';
import { rowsToCsv } from '@/lib/resultExport';

const SAMPLE_SVGS: Record<string, { label: string; markup: string }> = {
  metric: {
    label: 'Millimeter Units (100×50 mm)',
    markup: `<svg width="100mm" height="50mm" viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="50" fill="#6366f1" rx="5"/>
  <circle cx="50" cy="25" r="15" fill="#ffffff"/>
</svg>`,
  },
  viewBoxOnly: {
    label: 'Responsive ViewBox Only (800×400)',
    markup: `<svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
  <path d="M 100,200 L 400,50 L 700,200 Z" fill="#10b981"/>
</svg>`,
  },
  imperial: {
    label: 'Imperial Inches (4×3 in)',
    markup: `<svg width="4in" height="3in" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#f59e0b"/>
</svg>`,
  },
};

export default function SvgDimensionsTool() {
  const [markup, setMarkup] = useState(SAMPLE_SVGS.metric.markup);
  const [copied, setCopied] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');

  const result = useMemo(() => parseSvgDimensions(markup), [markup]);

  const handleFileUpload = async (file?: File) => {
    if (!file) return;
    try {
      const text = await file.text();
      setMarkup(text);
      setUploadedFileName(file.name);
    } catch {
      // ignore
    }
  };

  const summary = result.valid
    ? `SVG Dimensions Inspection\nSource: ${uploadedFileName || 'Pasted Markup'}\nDeclared Width: ${
        result.declaredWidth !== null ? `${result.declaredWidth} ${result.declaredWidthUnit}` : 'Omitted'
      }\nDeclared Height: ${
        result.declaredHeight !== null ? `${result.declaredHeight} ${result.declaredHeightUnit}` : 'Omitted'
      }\nPixel Equivalent: ${result.widthInPixels !== null ? `${result.widthInPixels} × ${result.heightInPixels} px` : 'Scalable'}\nViewBox: ${
        result.viewBox || 'None'
      }\nAspect Ratio: ${result.aspectRatioString}\nSecurity: ${result.securityNotice}`
    : 'Invalid SVG input';

  const copySummary = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCsv = () => {
    if (!result.valid) return;
    const rows = [
      ['Property', 'Value'],
      ['Declared Width', result.declaredWidth !== null ? `${result.declaredWidth} ${result.declaredWidthUnit}` : 'None'],
      ['Declared Height', result.declaredHeight !== null ? `${result.declaredHeight} ${result.declaredHeightUnit}` : 'None'],
      ['Calculated Width (px)', result.widthInPixels ?? 'Scalable'],
      ['Calculated Height (px)', result.heightInPixels ?? 'Scalable'],
      ['ViewBox', result.viewBox ?? 'None'],
      ['ViewBox Width', result.viewBoxWidth ?? 'None'],
      ['ViewBox Height', result.viewBoxHeight ?? 'None'],
      ['Aspect Ratio', result.aspectRatioString],
      ['Preserve Aspect Ratio', result.preserveAspectRatio ?? 'Default'],
      ['Script Execution Suppressed', result.hasScriptElements ? 'Yes' : 'No'],
    ];
    const csvContent = rowsToCsv(rows);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${uploadedFileName.replace(/\.svg$/i, '') || 'svg'}-dimensions.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)]">Inspect SVG Dimensions & ViewBox</h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Drop an SVG file or paste markup below. Evaluates intrinsic units and viewBox geometry without script execution.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="size-4" /> Sandboxed Declarative Parsing
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-xs font-bold text-[var(--foreground)] hover:border-indigo-500">
            <FileUp className="size-4 text-indigo-600 dark:text-indigo-400" />
            <span>Upload SVG file</span>
            <input
              type="file"
              accept=".svg,image/svg+xml"
              className="sr-only"
              onChange={(e) => void handleFileUpload(e.target.files?.[0])}
            />
          </label>

          {Object.entries(SAMPLE_SVGS).map(([key, sample]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setMarkup(sample.markup);
                setUploadedFileName('');
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs font-medium text-[var(--muted-foreground)] hover:text-indigo-600"
            >
              <Code2 className="size-3.5" />
              {sample.label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
            SVG Markup Input
          </label>
          <textarea
            className="mt-2 w-full font-mono text-xs leading-5 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 text-[var(--foreground)] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            rows={6}
            value={markup}
            onChange={(e) => setMarkup(e.target.value)}
            placeholder="Paste <svg ...> markup here..."
          />
        </div>

        {!result.valid && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
            <AlertCircle className="size-5 shrink-0" />
            <span>{result.error}</span>
          </div>
        )}

        {result.valid && (
          <div className="mt-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Coordinate Geometry
                </span>
                <p className="text-lg font-bold text-[var(--foreground)]">{result.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copySummary}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-semibold hover:bg-[var(--muted)]"
                >
                  <Copy className="size-3.5" />
                  {copied ? 'Copied' : 'Copy summary'}
                </button>
                <button
                  type="button"
                  onClick={downloadCsv}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-semibold hover:bg-[var(--muted)]"
                >
                  <Download className="size-3.5" /> Download CSV
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-semibold hover:bg-[var(--muted)]"
                >
                  <Printer className="size-3.5" /> Print
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Declared Width
                </span>
                <p className="mt-1 text-xl font-extrabold text-[var(--foreground)]">
                  {result.declaredWidth !== null ? `${result.declaredWidth} ${result.declaredWidthUnit}` : 'None (Fluid)'}
                </p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  {result.widthInPixels !== null ? `≈ ${result.widthInPixels} CSS pixels` : 'Adapts to container'}
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Declared Height
                </span>
                <p className="mt-1 text-xl font-extrabold text-[var(--foreground)]">
                  {result.declaredHeight !== null ? `${result.declaredHeight} ${result.declaredHeightUnit}` : 'None (Fluid)'}
                </p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  {result.heightInPixels !== null ? `≈ ${result.heightInPixels} CSS pixels` : 'Adapts to container'}
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  viewBox Coordinate Box
                </span>
                <p className="mt-1 text-base font-extrabold text-[var(--foreground)]">
                  {result.viewBox ?? 'Not specified'}
                </p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  {result.viewBoxWidth !== null ? `${result.viewBoxWidth} × ${result.viewBoxHeight} internal units` : 'User units match viewport'}
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Aspect Ratio
                </span>
                <p className="mt-1 text-xl font-extrabold text-[var(--foreground)]">{result.aspectRatioString}</p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  {result.preserveAspectRatio ? `preserveAspectRatio: ${result.preserveAspectRatio}` : 'Standard uniform scaling'}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5 dark:border-indigo-900/50 dark:bg-indigo-950/20">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="size-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                <div className="text-sm leading-6 text-[var(--foreground)]">
                  <strong>Security & Prepress Note:</strong>
                  <p className="mt-1 text-[var(--muted-foreground)]">{result.securityNotice}</p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    Vector artwork in SVG does not have an intrinsic raster DPI. For print export, SVG coordinates are rendered at whatever target device DPI is chosen during RIP or PDF conversion.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
