'use client';

import { useState } from 'react';
import { FileUp, ShieldCheck, AlertCircle, CheckCircle2, Copy, Download, Printer } from 'lucide-react';
import { parsePdfBleedTrim, type PageBoxInspection } from '@/lib/calculations/pdfBleedTrim';
import { rowsToCsv } from '@/lib/resultExport';

export default function PdfBleedTrimTool() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [inspections, setInspections] = useState<PageBoxInspection[]>([]);
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleFileChange = async (selectedFile?: File) => {
    if (!selectedFile) return;
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a valid PDF file.');
      return;
    }

    setIsProcessing(true);
    setError('');
    setFile(selectedFile);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const result = await parsePdfBleedTrim(buffer);

      if (!result.valid || !result.pages.length) {
        setError(result.error || 'Failed to inspect PDF page boxes.');
        setInspections([]);
      } else {
        setInspections(result.pages);
        setSelectedPageIndex(0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error reading PDF.');
      setInspections([]);
    } finally {
      setIsProcessing(false);
    }
  };

  const activePage = inspections[selectedPageIndex];

  const summary = inspections.length
    ? `PDF Bleed & Trim Box Inspection\nFile: ${file?.name}\nPages: ${inspections.length}\n${inspections
        .map(
          (p) =>
            `Page ${p.pageNumber}: TrimBox=${p.trimWidthMm}×${p.trimHeightMm} mm (${
              p.hasExplicitTrimBox ? 'Explicit' : 'Default'
            }), BleedMargin=[Top:${p.bleedMarginMm.top}mm, Bottom:${p.bleedMarginMm.bottom}mm, Left:${p.bleedMarginMm.left}mm, Right:${p.bleedMarginMm.right}mm] (${
              p.hasExplicitBleedBox ? 'Explicit' : 'Default'
            })`
        )
        .join('\n')}`
    : '';

  const copySummary = async () => {
    if (!summary) return;
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCsv = () => {
    if (!inspections.length) return;
    const rows = [
      [
        'Page',
        'MediaBox (pt)',
        'CropBox (pt)',
        'TrimBox (pt)',
        'BleedBox (pt)',
        'Trim Width (mm)',
        'Trim Height (mm)',
        'Top Bleed (mm)',
        'Bottom Bleed (mm)',
        'Left Bleed (mm)',
        'Right Bleed (mm)',
        'Explicit TrimBox',
        'Explicit BleedBox',
      ],
      ...inspections.map((p) => [
        p.pageNumber,
        `${p.mediaBox.width}x${p.mediaBox.height}`,
        `${p.cropBox.width}x${p.cropBox.height}`,
        `${p.trimWidthPt}x${p.trimHeightPt}`,
        `${p.bleedBox.width}x${p.bleedBox.height}`,
        p.trimWidthMm,
        p.trimHeightMm,
        p.bleedMarginMm.top,
        p.bleedMarginMm.bottom,
        p.bleedMarginMm.left,
        p.bleedMarginMm.right,
        p.hasExplicitTrimBox ? 'Yes' : 'No',
        p.hasExplicitBleedBox ? 'Yes' : 'No',
      ]),
    ];
    const csvContent = rowsToCsv(rows);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${file?.name.replace(/\.pdf$/i, '') || 'pdf'}-bleed-trim-inspection.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)]">Select PDF to Inspect</h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Client-side ISO 32000-1 page box inspection. Your document is processed locally in your browser.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="size-4" /> Local Browser Inspection
          </div>
        </div>

        <div className="mt-6">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--background)] p-8 text-center transition hover:border-indigo-500 hover:bg-indigo-50/20 dark:hover:border-indigo-400">
            <FileUp className="size-10 text-indigo-600 dark:text-indigo-400" />
            <span className="mt-3 text-sm font-semibold text-[var(--foreground)]">
              {file ? file.name : 'Click to choose or drop a PDF file'}
            </span>
            <span className="mt-1 text-xs text-[var(--muted-foreground)]">
              Accepts .pdf files · Never uploaded to remote servers
            </span>
            <input
              type="file"
              accept=".pdf,application/pdf"
              className="sr-only"
              onChange={(e) => void handleFileChange(e.target.files?.[0])}
            />
          </label>
        </div>

        {isProcessing && (
          <p className="mt-4 text-center text-sm font-semibold text-indigo-600 animate-pulse">
            Reading PDF page dictionary boxes...
          </p>
        )}

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
            <AlertCircle className="size-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {inspections.length > 0 && activePage && (
          <div className="mt-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[var(--muted-foreground)]">
                  Total Pages: {inspections.length}
                </span>
                {inspections.length > 1 && (
                  <select
                    className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-sm font-semibold"
                    value={selectedPageIndex}
                    onChange={(e) => setSelectedPageIndex(Number(e.target.value))}
                  >
                    {inspections.map((p, idx) => (
                      <option key={p.pageNumber} value={idx}>
                        Page {p.pageNumber}
                      </option>
                    ))}
                  </select>
                )}
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
                  MediaBox (Physical Sheet)
                </span>
                <p className="mt-1 text-base font-extrabold text-[var(--foreground)]">
                  {activePage.mediaBox.width} × {activePage.mediaBox.height} pt
                </p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  {((activePage.mediaBox.width / 72) * 25.4).toFixed(1)} ×{' '}
                  {((activePage.mediaBox.height / 72) * 25.4).toFixed(1)} mm
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  CropBox (Visible Display)
                </span>
                <p className="mt-1 text-base font-extrabold text-[var(--foreground)]">
                  {activePage.cropBox.width} × {activePage.cropBox.height} pt
                </p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  {activePage.hasExplicitCropBox ? 'Explicitly defined' : 'Defaults to MediaBox'}
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  TrimBox (Finished Cut)
                </span>
                <p className="mt-1 text-base font-extrabold text-[var(--foreground)]">
                  {activePage.trimWidthMm} × {activePage.trimHeightMm} mm
                </p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  {activePage.hasExplicitTrimBox ? 'Explicitly declared' : 'Inherited from Media/Crop'}
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  BleedBox (Bleed Margin)
                </span>
                <p className="mt-1 text-base font-extrabold text-[var(--foreground)]">
                  {activePage.hasExtraBleedBoxArea
                    ? `+${activePage.bleedMarginMm.top} mm / edge`
                    : '0 mm extra margin'}
                </p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  {activePage.hasExplicitBleedBox ? 'Explicitly declared' : 'Inherited from Media/Crop'}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5 dark:border-indigo-900/50 dark:bg-indigo-950/20">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="size-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                <div className="text-sm leading-6 text-[var(--foreground)]">
                  <strong>Page {activePage.pageNumber} Interpretation:</strong>
                  <p className="mt-1 text-[var(--muted-foreground)]">{activePage.interpretation}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                Page {activePage.pageNumber} Bleed Margins Beyond TrimBox
              </h3>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-[var(--border)] p-3 text-center">
                  <span className="block text-xs text-[var(--muted-foreground)]">Top Bleed</span>
                  <span className="font-bold text-[var(--foreground)]">{activePage.bleedMarginMm.top} mm</span>
                  <span className="block text-[11px] text-[var(--muted-foreground)]">({activePage.bleedMarginPt.top} pt)</span>
                </div>
                <div className="rounded-xl border border-[var(--border)] p-3 text-center">
                  <span className="block text-xs text-[var(--muted-foreground)]">Bottom Bleed</span>
                  <span className="font-bold text-[var(--foreground)]">{activePage.bleedMarginMm.bottom} mm</span>
                  <span className="block text-[11px] text-[var(--muted-foreground)]">({activePage.bleedMarginPt.bottom} pt)</span>
                </div>
                <div className="rounded-xl border border-[var(--border)] p-3 text-center">
                  <span className="block text-xs text-[var(--muted-foreground)]">Left Bleed</span>
                  <span className="font-bold text-[var(--foreground)]">{activePage.bleedMarginMm.left} mm</span>
                  <span className="block text-[11px] text-[var(--muted-foreground)]">({activePage.bleedMarginPt.left} pt)</span>
                </div>
                <div className="rounded-xl border border-[var(--border)] p-3 text-center">
                  <span className="block text-xs text-[var(--muted-foreground)]">Right Bleed</span>
                  <span className="font-bold text-[var(--foreground)]">{activePage.bleedMarginMm.right} mm</span>
                  <span className="block text-[11px] text-[var(--muted-foreground)]">({activePage.bleedMarginPt.right} pt)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
