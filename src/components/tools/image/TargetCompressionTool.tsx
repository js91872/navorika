'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Sliders,
  Maximize2,
  Image as ImageIcon,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  compressImageToTarget,
  COMPRESSION_PRESETS,
  CompressionFormat,
  CompressionResult,
  formatBytes,
  parseTargetBytes,
} from '@/lib/image/compression';

export interface TargetCompressionToolProps {
  initialPreset?: '20kb' | '50kb' | '100kb' | '200kb';
  fixedFormat?: CompressionFormat; // For compress-jpg-to-100kb or compress-png-to-100kb
  initialPngMode?: 'preserve-png' | 'format-shift';
}

export default function TargetCompressionTool({
  initialPreset = '100kb',
  fixedFormat,
  initialPngMode = 'preserve-png',
}: TargetCompressionToolProps) {
  const [targetPreset, setTargetPreset] = useState<'20kb' | '50kb' | '100kb' | '200kb'>(initialPreset);
  const [file, setFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [originalDims, setOriginalDims] = useState<{ width: number; height: number } | null>(null);
  const [outputFormat, setOutputFormat] = useState<CompressionFormat>(fixedFormat || 'image/jpeg');
  const [preserveDims, setPreserveDims] = useState<boolean>(false);
  const [pngMode, setPngMode] = useState<'preserve-png' | 'format-shift'>(initialPngMode);
  const [pngShiftFormat, setPngShiftFormat] = useState<'image/webp' | 'image/jpeg'>('image/webp');
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentPresetInfo = COMPRESSION_PRESETS[targetPreset];
  const targetBytes = currentPresetInfo.targetBytes;

  const cleanupUrls = useCallback(() => {
    if (previewSrc) {
      URL.revokeObjectURL(previewSrc);
    }
    if (result?.objectUrl) {
      URL.revokeObjectURL(result.objectUrl);
    }
  }, [previewSrc, result]);

  useEffect(() => {
    return () => {
      cleanupUrls();
    };
  }, [cleanupUrls]);

  const handleReset = () => {
    cleanupUrls();
    setFile(null);
    setPreviewSrc(null);
    setOriginalDims(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    setError(null);
    setResult(null);

    const MAX_INPUT_BYTES = 25 * 1024 * 1024;
    if (selectedFile.size > MAX_INPUT_BYTES) {
      setError('File size exceeds the 25 MB browser safety limit.');
      return;
    }

    setFile(selectedFile);

    // If fixedFormat is set, use it; otherwise auto-detect
    if (fixedFormat) {
      setOutputFormat(fixedFormat);
    } else if (selectedFile.type === 'image/png') {
      setOutputFormat('image/png');
    } else if (selectedFile.type === 'image/webp') {
      setOutputFormat('image/webp');
    } else {
      setOutputFormat('image/jpeg');
    }

    const objUrl = URL.createObjectURL(selectedFile);
    setPreviewSrc(objUrl);

    const img = new Image();
    img.onload = () => {
      setOriginalDims({ width: img.naturalWidth || img.width, height: img.naturalHeight || img.height });
    };
    img.onerror = () => {
      setOriginalDims(null);
    };
    img.src = objUrl;
  };

  const runCompression = async () => {
    if (!file) return;

    setError(null);
    setIsCompressing(true);

    try {
      const isPngInput = file.type === 'image/png';
      const shouldShiftPng = isPngInput && pngMode === 'format-shift';

      const compressed = await compressImageToTarget(file, {
        targetBytes,
        outputFormat: shouldShiftPng ? pngShiftFormat : outputFormat,
        preserveDimensions: preserveDims,
        allowPngFormatShift: shouldShiftPng,
        pngShiftFormat,
      });

      setResult(compressed);
    } catch (err) {
      setError(`Compression error: ${err instanceof Error ? err.message : 'Processing failed'}`);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const a = document.createElement('a');
    a.href = result.objectUrl;
    const ext = result.mimeType.split('/')[1].replace('jpeg', 'jpg');
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    a.download = `${baseName}-compressed-${currentPresetInfo.shortLabel.toLowerCase()}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const reductionPercent =
    result && file
      ? Math.max(0, Math.round(((file.size - result.achievedBytes) / file.size) * 100))
      : 0;

  return (
    <div className="space-y-8">
      {/* Target Preset Banner */}
      <div className="rounded-2xl border border-indigo-500/20 bg-indigo-50/40 dark:bg-indigo-950/20 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-indigo-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                Target: {currentPresetInfo.label}
              </span>
              <span className="text-xs text-[var(--muted-foreground)]">Deterministic Browser-Local Optimization</span>
            </div>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              {currentPresetInfo.description}
            </p>
          </div>

          {!fixedFormat && (
            <div className="flex items-center gap-1.5 self-start sm:self-center">
              {(['20kb', '50kb', '100kb', '200kb'] as const).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setTargetPreset(preset);
                    setResult(null);
                  }}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    targetPreset === preset
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                  }`}
                >
                  {COMPRESSION_PRESETS[preset].shortLabel}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Box */}
      {!file && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) handleFileSelect(f);
          }}
          onClick={() => fileInputRef.current?.click()}
          className="group relative cursor-pointer rounded-2xl border-2 border-dashed border-[var(--border)] p-10 text-center transition-colors hover:border-indigo-500 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFileSelect(f);
            }}
            className="hidden"
            aria-label="Select image file to compress"
          />
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="rounded-full bg-indigo-50 p-4 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Upload className="size-8" />
            </div>
            <div>
              <p className="text-base font-semibold">Click to upload or drag & drop an image</p>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                Supports JPG, PNG, and WebP (up to 25 MB)
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-50/50 p-4 text-sm text-rose-700 dark:bg-rose-950/20 dark:text-rose-400">
          <AlertCircle className="size-5 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Configuration & Execution Panel */}
      {file && (
        <div className="space-y-6">
          {/* File summary header */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                <ImageIcon className="size-5" />
              </div>
              <div>
                <span className="font-semibold block truncate max-w-xs">{file.name}</span>
                <span className="text-xs text-[var(--muted-foreground)]">
                  {formatBytes(file.size)} • {file.type || 'image/jpeg'}{' '}
                  {originalDims ? `• ${originalDims.width} × ${originalDims.height} px` : ''}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--muted-foreground)] hover:text-rose-600 transition-colors"
              >
                <RotateCcw className="size-3.5" />
                Change Image
              </button>
            </div>
          </div>

          {/* Controls & Options */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              Compression Settings
            </h2>

            {/* Special Mode for PNG tools */}
            {(fixedFormat === 'image/png' || file.type === 'image/png') && (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--foreground)]">PNG Optimization Strategy</span>
                  <span className="text-[11px] text-[var(--muted-foreground)]">PNG is lossless</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`cursor-pointer rounded-lg border p-3 text-xs transition-colors ${
                      pngMode === 'preserve-png'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-[var(--foreground)] font-semibold'
                        : 'border-[var(--border)] text-[var(--muted-foreground)]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pngMode"
                      value="preserve-png"
                      checked={pngMode === 'preserve-png'}
                      onChange={() => setPngMode('preserve-png')}
                      className="sr-only"
                    />
                    <div className="font-bold">A. Preserve PNG Format</div>
                    <div className="mt-1 text-[11px] font-normal text-[var(--muted-foreground)]">
                      Lossless re-encoding. Downscales dimensions if needed to stay under target.
                    </div>
                  </label>

                  <label
                    className={`cursor-pointer rounded-lg border p-3 text-xs transition-colors ${
                      pngMode === 'format-shift'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-[var(--foreground)] font-semibold'
                        : 'border-[var(--border)] text-[var(--muted-foreground)]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pngMode"
                      value="format-shift"
                      checked={pngMode === 'format-shift'}
                      onChange={() => setPngMode('format-shift')}
                      className="sr-only"
                    />
                    <div className="font-bold">B. Smaller File (WebP / JPG)</div>
                    <div className="mt-1 text-[11px] font-normal text-[var(--muted-foreground)]">
                      Converts to WebP or JPG for dramatically smaller size with lossy quality search.
                    </div>
                  </label>
                </div>

                {pngMode === 'format-shift' && (
                  <div className="flex items-center gap-3 pt-2 text-xs">
                    <span className="text-[var(--muted-foreground)]">Convert PNG to:</span>
                    <select
                      value={pngShiftFormat}
                      onChange={(e) => setPngShiftFormat(e.target.value as 'image/webp' | 'image/jpeg')}
                      className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 text-xs font-medium"
                    >
                      <option value="image/webp">WebP (Preserves transparency)</option>
                      <option value="image/jpeg">JPG (Replaces transparency with white)</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* General Format Selector (if not fixed and not in PNG format-shift mode) */}
            {!fixedFormat && pngMode !== 'format-shift' && file.type !== 'image/png' && (
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <span className="font-medium text-[var(--muted-foreground)]">Output Format:</span>
                <div className="inline-flex rounded-lg border border-[var(--border)] p-0.5 bg-[var(--background)]">
                  {(['image/jpeg', 'image/webp'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setOutputFormat(fmt)}
                      className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                        outputFormat === fmt
                          ? 'bg-indigo-600 text-white'
                          : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                      }`}
                    >
                      {fmt === 'image/jpeg' ? 'JPG' : 'WebP'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Preserve Dimensions Toggle */}
            <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
              <div>
                <label
                  htmlFor="preserve-dims"
                  className="text-xs font-semibold text-[var(--foreground)] cursor-pointer block"
                >
                  Strictly Preserve Original Dimensions
                </label>
                <p className="text-[11px] text-[var(--muted-foreground)]">
                  {preserveDims
                    ? 'Quality will be reduced to the minimum allowed, but pixel dimensions will never be downscaled.'
                    : 'Permits proportional downscaling if quality alone cannot achieve the target size.'}
                </p>
              </div>
              <input
                id="preserve-dims"
                type="checkbox"
                checked={preserveDims}
                onChange={(e) => setPreserveDims(e.target.checked)}
                className="size-4 rounded border-[var(--border)] text-indigo-600 focus:ring-indigo-500"
              />
            </div>

            {/* Action button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={runCompression}
                disabled={isCompressing}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                <Sparkles className="size-4" />
                {isCompressing ? 'Compressing with binary quality search...' : `Compress Image to ${currentPresetInfo.label}`}
              </button>
            </div>
          </div>

          {/* Results Display */}
          {result && (
            <div className="space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
              {/* Status Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  {result.targetMet ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                      <CheckCircle2 className="size-4" />
                      Target Met: {formatBytes(result.achievedBytes)} (≤ {currentPresetInfo.shortLabel})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                      <AlertCircle className="size-4" />
                      Closest Achieved: {formatBytes(result.achievedBytes)}
                    </span>
                  )}
                  {reductionPercent > 0 && (
                    <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">
                      -{reductionPercent}% smaller
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition-colors"
                >
                  <Download className="size-4" />
                  Download Optimized Image
                </button>
              </div>

              {result.closestNotice && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-50/50 p-4 text-xs text-amber-800 dark:bg-amber-950/20 dark:text-amber-300">
                  {result.closestNotice}
                </div>
              )}

              {/* Comparison Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3">
                  <span className="text-[var(--muted-foreground)] block">Original Size</span>
                  <span className="text-base font-bold">{formatBytes(file.size)}</span>
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3">
                  <span className="text-[var(--muted-foreground)] block">Compressed Size</span>
                  <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                    {formatBytes(result.achievedBytes)}
                  </span>
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3">
                  <span className="text-[var(--muted-foreground)] block">Dimensions</span>
                  <span className="text-sm font-bold">
                    {result.width} × {result.height} px
                  </span>
                  {result.dimensionReduced && (
                    <span className="text-[10px] text-[var(--muted-foreground)] block">
                      (from {result.originalWidth} × {result.originalHeight})
                    </span>
                  )}
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3">
                  <span className="text-[var(--muted-foreground)] block">Optimization Stats</span>
                  <span className="text-sm font-bold">
                    {result.mimeType === 'image/png' ? 'PNG Lossless' : `Quality: ${result.qualityUsed}%`}
                  </span>
                  <span className="text-[10px] text-[var(--muted-foreground)] block">
                    {result.iterations} search passes
                  </span>
                </div>
              </div>

              {/* Visual Preview */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 flex flex-col items-center justify-center min-h-[280px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={result.objectUrl}
                  alt="Compressed output preview"
                  className="max-h-80 max-w-full rounded object-contain shadow-sm"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
