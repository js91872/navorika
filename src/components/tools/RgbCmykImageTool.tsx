'use client';

import { useState } from 'react';
import { FileUp, ShieldCheck, AlertCircle, CheckCircle2, Copy, Download, Printer, Info } from 'lucide-react';
import { inspectImageColorMode, type RgbCmykImageResult } from '@/lib/calculations/rgbCmykImage';
import { rowsToCsv } from '@/lib/resultExport';

export default function RgbCmykImageTool() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<RgbCmykImageResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFileChange = async (selectedFile?: File) => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setError('');
    setFile(selectedFile);

    try {
      // Read initial 128 KB chunk (sufficient for all standard JPEG, PNG, TIFF, WebP headers)
      const buffer = await selectedFile.slice(0, 131072).arrayBuffer();
      const res = inspectImageColorMode(buffer);

      if (!res.valid) {
        setError(res.error || 'Failed to determine image color mode.');
        setResult(res);
      } else {
        setResult(res);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error reading image header.');
      setResult(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const summary = result
    ? `RGB / CMYK Image Color Space Inspection\nFile: ${file?.name}\nDetected Format: ${result.detectedFormat}\nColor Mode: ${result.colorMode}\nChannels: ${result.channels ?? 'Unknown'}\nAlpha: ${result.hasAlpha ? 'Yes' : 'No'}\nEmbedded ICC: ${result.hasEmbeddedIcc ? 'Yes' : 'No'}\nDetails: ${result.sourceEncodingDetails}`
    : '';

  const copySummary = async () => {
    if (!summary) return;
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCsv = () => {
    if (!result) return;
    const rows = [
      ['Property', 'Value'],
      ['File Name', file?.name || ''],
      ['Detected Format', result.detectedFormat],
      ['Color Mode', result.colorMode],
      ['Channels', result.channels ?? 'Unknown'],
      ['Alpha Channel', result.hasAlpha ? 'Present' : 'None'],
      ['Embedded ICC Profile', result.hasEmbeddedIcc ? 'Detected' : 'None'],
      ['Source Encoding Details', result.sourceEncodingDetails],
      ['Format Limitations', result.limitations],
    ];
    const csvContent = rowsToCsv(rows);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${file?.name.replace(/\.[^.]+$/i, '') || 'image'}-color-inspection.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)]">Select Image to Check Color Space</h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Direct container header analysis (JPEG SOF, PNG IHDR, TIFF IFD, WebP VP8X). No canvas color distortion.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="size-4" /> Local Header Inspection
          </div>
        </div>

        <div className="mt-6">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--background)] p-8 text-center transition hover:border-indigo-500 hover:bg-indigo-50/20 dark:hover:border-indigo-400">
            <FileUp className="size-10 text-indigo-600 dark:text-indigo-400" />
            <span className="mt-3 text-sm font-semibold text-[var(--foreground)]">
              {file ? file.name : 'Click to choose or drop an image file'}
            </span>
            <span className="mt-1 text-xs text-[var(--muted-foreground)]">
              Accepts JPEG, PNG, TIFF, WebP, GIF · Audited entirely in your browser without uploading
            </span>
            <input
              type="file"
              accept="image/*,.tif,.tiff,.jpg,.jpeg,.png,.webp,.gif"
              className="sr-only"
              onChange={(e) => void handleFileChange(e.target.files?.[0])}
            />
          </label>
        </div>

        {isProcessing && (
          <p className="mt-4 text-center text-sm font-semibold text-indigo-600 animate-pulse">
            Auditing image container markers and color components...
          </p>
        )}

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
            <AlertCircle className="size-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="mt-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Primary Color Space
                </span>
                <p className="text-2xl font-black text-[var(--foreground)]">
                  {result.colorMode}
                  <span className="ml-3 text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    ({result.detectedFormat})
                  </span>
                </p>
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
                  Color Mode
                </span>
                <p className="mt-1 text-xl font-extrabold text-[var(--foreground)]">{result.colorMode}</p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">Native container encoding</p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Channels
                </span>
                <p className="mt-1 text-xl font-extrabold text-[var(--foreground)]">
                  {result.channels !== null ? `${result.channels} Channels` : 'Indeterminate'}
                </p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  {result.channels === 4 ? '4 components (e.g. CMYK or RGBA)' : result.channels === 3 ? '3 components (RGB / YCbCr)' : 'Single channel luma or palette'}
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Alpha Transparency
                </span>
                <p className="mt-1 text-xl font-extrabold text-[var(--foreground)]">
                  {result.hasAlpha ? 'Present' : 'None'}
                </p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  {result.hasAlpha ? 'Alpha channel detected' : 'Fully opaque color data'}
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Embedded ICC Profile
                </span>
                <p className="mt-1 text-xl font-extrabold text-[var(--foreground)]">
                  {result.hasEmbeddedIcc ? 'Detected' : 'None'}
                </p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  {result.hasEmbeddedIcc ? 'Custom color profile tagged' : 'Untagged / device standard'}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5 dark:border-indigo-900/50 dark:bg-indigo-950/20">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="size-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                <div className="text-sm leading-6 text-[var(--foreground)]">
                  <strong>Header Decoding Details:</strong>
                  <p className="mt-1 text-[var(--muted-foreground)]">{result.sourceEncodingDetails}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 dark:border-amber-900/50 dark:bg-amber-950/20">
              <div className="flex items-start gap-3">
                <Info className="size-5 shrink-0 text-amber-600 dark:text-amber-400" />
                <div className="text-sm leading-6 text-[var(--foreground)]">
                  <strong>Format Limitations & Technical Honesty:</strong>
                  <p className="mt-1 text-[var(--muted-foreground)]">{result.limitations}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
