'use client';

import { useState } from 'react';
import { FileUp, ShieldCheck, AlertCircle, Copy, Download, Printer } from 'lucide-react';
import { parsePdfPageSizes, type PdfPageSizeAnalysis } from '@/lib/calculations/pdfPageSize';
import { rowsToCsv } from '@/lib/resultExport';

export default function PdfPageSizeTool() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState<PdfPageSizeAnalysis | null>(null);
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
      const result = await parsePdfPageSizes(buffer);

      if (!result.valid || !result.pages.length) {
        setError(result.error || 'Failed to inspect PDF page dimensions.');
        setAnalysis(null);
      } else {
        setAnalysis(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error reading PDF.');
      setAnalysis(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const copySummary = async () => {
    if (!analysis) return;
    await navigator.clipboard.writeText(analysis.summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCsv = () => {
    if (!analysis || !analysis.pages.length) return;
    const rows = [
      ['Page', 'Width (mm)', 'Height (mm)', 'Width (in)', 'Height (in)', 'Width (pt)', 'Height (pt)', 'Orientation', 'Matched Size'],
      ...analysis.pages.map((p) => [
        p.pageNumber,
        p.widthMm,
        p.heightMm,
        p.widthIn,
        p.heightIn,
        p.widthPt,
        p.heightPt,
        p.orientation,
        p.matchedStandardSize,
      ]),
    ];
    const csvContent = rowsToCsv(rows);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${file?.name.replace(/\.pdf$/i, '') || 'pdf'}-page-sizes.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)]">Select PDF to Check Page Size</h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Accurate dimension inspection with 72 pt = 1 in and 25.4 mm = 1 in conversion. Evaluated entirely in your browser.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="size-4" /> Local Browser Processing
          </div>
        </div>

        <div className="mt-6">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--background)] p-8 text-center transition hover:border-indigo-500 hover:bg-indigo-50/20 dark:hover:border-indigo-400">
            <FileUp className="size-10 text-indigo-600 dark:text-indigo-400" />
            <span className="mt-3 text-sm font-semibold text-[var(--foreground)]">
              {file ? file.name : 'Click to choose or drop a PDF file'}
            </span>
            <span className="mt-1 text-xs text-[var(--muted-foreground)]">
              Inspects dimensions, orientations, and paper sizes · Never uploaded to remote servers
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
            Inspecting PDF page dimensions...
          </p>
        )}

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
            <AlertCircle className="size-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {analysis && (
          <div className="mt-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Document Overview
                </span>
                <p className="text-lg font-bold text-[var(--foreground)]">{analysis.summary}</p>
                {analysis.differingPagesNote && (
                  <p className="mt-1 text-sm font-semibold text-amber-600 dark:text-amber-400">
                    {analysis.differingPagesNote}
                  </p>
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

            <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
              <table className="w-full text-left text-sm">
                <thead className="bg-[var(--muted)]/50 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  <tr>
                    <th className="px-4 py-3">Page</th>
                    <th className="px-4 py-3">Matched Size</th>
                    <th className="px-4 py-3">Millimeters</th>
                    <th className="px-4 py-3">Inches</th>
                    <th className="px-4 py-3">Points</th>
                    <th className="px-4 py-3">Orientation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] bg-[var(--background)]">
                  {analysis.pages.map((p) => (
                    <tr key={p.pageNumber} className="hover:bg-[var(--muted)]/30">
                      <td className="px-4 py-3 font-bold text-[var(--foreground)]">{p.pageNumber}</td>
                      <td className="px-4 py-3 font-semibold text-indigo-600 dark:text-indigo-400">
                        {p.matchedStandardSize}
                      </td>
                      <td className="px-4 py-3">{p.widthMm} × {p.heightMm} mm</td>
                      <td className="px-4 py-3">{p.widthIn} × {p.heightIn} in</td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)]">{p.widthPt} × {p.heightPt} pt</td>
                      <td className="px-4 py-3 font-medium">{p.orientation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
