'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Upload,
  Download,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileImage,
  ImageIcon,
  Maximize2,
  Sliders,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Scissors,
  Layers,
  Sparkles,
} from 'lucide-react';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';
import { fieldClass, buttonClass } from './ToolControls';
import {
  compressImageToTarget,
  COMPRESSION_PRESETS,
  type CompressionFormat,
  type CompressionResult,
} from '@/lib/image/compression';

export type ImageToolSlug =
  | 'compress-image'
  | 'compress-image-to-20kb'
  | 'compress-image-to-50kb'
  | 'compress-image-to-100kb'
  | 'compress-image-to-200kb'
  | 'compress-jpg'
  | 'compress-jpg-to-100kb'
  | 'compress-png'
  | 'compress-png-to-100kb'
  | 'compress-webp'
  | 'resize-image'
  | 'rotate-image';

function formatSize(bytes: number, locale: string): string {
  if (bytes < 1024) return `${bytes} B`;
  const nf = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
  if (bytes < 1024 * 1024) return `${nf.format(bytes / 1024)} KB`;
  return `${nf.format(bytes / (1024 * 1024))} MB`;
}

export default function LocalizedImageTools({
  slug,
  locale,
  dictionary,
}: {
  slug: ImageToolSlug;
  locale: Locale;
  dictionary: Dictionary;
}) {
  const d = dictionary;
  const toolContent = d.tools[slug];
  const imgUi = d.imageTools;
  const c = imgUi.common;
  const comp = imgUi.compression;
  const res = imgUi.resize;
  const rot = imgUi.rotate;

  const isTargetPreset =
    slug === 'compress-image-to-20kb' ||
    slug === 'compress-image-to-50kb' ||
    slug === 'compress-image-to-100kb' ||
    slug === 'compress-image-to-200kb' ||
    slug === 'compress-jpg-to-100kb' ||
    slug === 'compress-png-to-100kb';

  const defaultPreset = useMemo<'20kb' | '50kb' | '100kb' | '200kb'>(() => {
    if (slug === 'compress-image-to-20kb') return '20kb';
    if (slug === 'compress-image-to-50kb') return '50kb';
    if (slug === 'compress-image-to-200kb') return '200kb';
    return '100kb';
  }, [slug]);

  const fixedFormat = useMemo<CompressionFormat | undefined>(() => {
    if (slug === 'compress-jpg-to-100kb' || slug === 'compress-jpg') return 'image/jpeg';
    if (slug === 'compress-png-to-100kb' || slug === 'compress-png') return 'image/png';
    if (slug === 'compress-webp') return 'image/webp';
    return undefined;
  }, [slug]);

  // Common State
  const [file, setFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [originalDims, setOriginalDims] = useState<{ width: number; height: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Target Compression State
  const [targetPreset, setTargetPreset] = useState<'20kb' | '50kb' | '100kb' | '200kb'>(defaultPreset);
  const [targetResult, setTargetResult] = useState<CompressionResult | null>(null);
  const [preserveDims, setPreserveDims] = useState(false);
  const [pngMode, setPngMode] = useState<'preserve-png' | 'format-shift'>(
    slug === 'compress-png-to-100kb' ? 'preserve-png' : 'preserve-png'
  );
  const [pngShiftFormat, setPngShiftFormat] = useState<'image/webp' | 'image/jpeg'>('image/webp');
  const [outputFormat, setOutputFormat] = useState<CompressionFormat>(fixedFormat || 'image/jpeg');

  // General Compression State
  const [quality, setQuality] = useState(0.7);
  const [genCompressedBlob, setGenCompressedBlob] = useState<Blob | null>(null);
  const [genCompressedUrl, setGenCompressedUrl] = useState<string | null>(null);

  // Resize State
  const [resizeWidth, setResizeWidth] = useState<number>(0);
  const [resizeHeight, setResizeHeight] = useState<number>(0);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [maintainRatio, setMaintainRatio] = useState(true);
  const [resizedBlob, setResizedBlob] = useState<Blob | null>(null);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);

  // Rotate State
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [rotatedBlob, setRotatedBlob] = useState<Blob | null>(null);
  const [rotatedUrl, setRotatedUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const rotateCanvasRef = useRef<HTMLCanvasElement>(null);

  const cleanupUrls = useCallback(() => {
    if (previewSrc) URL.revokeObjectURL(previewSrc);
    if (targetResult?.objectUrl) URL.revokeObjectURL(targetResult.objectUrl);
    if (genCompressedUrl) URL.revokeObjectURL(genCompressedUrl);
    if (resizedUrl) URL.revokeObjectURL(resizedUrl);
    if (rotatedUrl) URL.revokeObjectURL(rotatedUrl);
  }, [previewSrc, targetResult, genCompressedUrl, resizedUrl, rotatedUrl]);

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
    setTargetResult(null);
    setGenCompressedBlob(null);
    setGenCompressedUrl(null);
    setResizedBlob(null);
    setResizedUrl(null);
    setRotatedBlob(null);
    setRotatedUrl(null);
    setError(null);
    setSuccess(null);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileSelect = (selectedFile: File) => {
    setError(null);
    setSuccess(null);
    setTargetResult(null);
    setGenCompressedBlob(null);
    setGenCompressedUrl(null);
    setResizedBlob(null);
    setResizedUrl(null);
    setRotatedBlob(null);
    setRotatedUrl(null);

    const MAX_INPUT_BYTES = 25 * 1024 * 1024;
    if (selectedFile.size > MAX_INPUT_BYTES) {
      setError(c.errorTooLarge);
      return;
    }

    // MIME verification
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (selectedFile.type && !validMimes.includes(selectedFile.type)) {
      setError(c.errorUnsupported);
      return;
    }

    setFile(selectedFile);

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
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      setOriginalDims({ width: w, height: h });
      setResizeWidth(w);
      setResizeHeight(h);
      setAspectRatio(w / (h || 1));
    };
    img.onerror = () => {
      setOriginalDims(null);
    };
    img.src = objUrl;
  };

  // Run Target Compression
  const runTargetCompression = async () => {
    if (!file) return;
    setError(null);
    setBusy(true);

    try {
      const currentPresetInfo = COMPRESSION_PRESETS[targetPreset];
      const targetBytes = currentPresetInfo.targetBytes;
      const isPngInput = file.type === 'image/png';
      const shouldShiftPng = isPngInput && pngMode === 'format-shift';

      const compressed = await compressImageToTarget(file, {
        targetBytes,
        outputFormat: shouldShiftPng ? pngShiftFormat : outputFormat,
        preserveDimensions: preserveDims,
        allowPngFormatShift: shouldShiftPng,
        pngShiftFormat,
      });

      setTargetResult(compressed);
      setSuccess(c.success);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Compression error');
    } finally {
      setBusy(false);
    }
  };

  // Run General Compression (compress-image, compress-jpg, compress-png, compress-webp)
  const runGeneralCompression = async () => {
    if (!file) return;
    setError(null);
    setBusy(true);

    try {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setError(c.errorUnsupported);
          setBusy(false);
          return;
        }

        let mimeType = file.type || 'image/jpeg';
        if (slug === 'compress-jpg') mimeType = 'image/jpeg';
        else if (slug === 'compress-webp') mimeType = 'image/webp';
        else if (slug === 'compress-png') {
          mimeType = quality < 0.9 ? 'image/webp' : 'image/png';
        } else {
          if (mimeType === 'image/png' && quality < 0.9) mimeType = 'image/webp';
          if (!['image/jpeg', 'image/webp', 'image/png'].includes(mimeType)) mimeType = 'image/jpeg';
        }

        if (mimeType === 'image/jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              setGenCompressedBlob(blob);
              if (genCompressedUrl) URL.revokeObjectURL(genCompressedUrl);
              setGenCompressedUrl(URL.createObjectURL(blob));
              setSuccess(c.success);
            } else {
              setError(c.errorUnsupported);
            }
            setBusy(false);
          },
          mimeType,
          mimeType === 'image/png' ? undefined : quality
        );
      };
      img.onerror = () => {
        setError(c.errorUnsupported);
        setBusy(false);
      };
      img.src = previewSrc || URL.createObjectURL(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Processing error');
      setBusy(false);
    }
  };

  // Run Resize Image
  const runResize = async () => {
    if (!file || resizeWidth <= 0 || resizeHeight <= 0) return;
    setError(null);
    setBusy(true);

    try {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = resizeWidth;
        canvas.height = resizeHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setError(c.errorUnsupported);
          setBusy(false);
          return;
        }
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, resizeWidth, resizeHeight);

        canvas.toBlob((blob) => {
          if (blob) {
            setResizedBlob(blob);
            if (resizedUrl) URL.revokeObjectURL(resizedUrl);
            setResizedUrl(URL.createObjectURL(blob));
            setSuccess(c.success);
          } else {
            setError(c.errorUnsupported);
          }
          setBusy(false);
        }, file.type || 'image/png');
      };
      img.onerror = () => {
        setError(c.errorUnsupported);
        setBusy(false);
      };
      img.src = previewSrc || URL.createObjectURL(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Processing error');
      setBusy(false);
    }
  };

  // Update rotate preview
  const updateRotateCanvas = useCallback((img: HTMLImageElement) => {
    const canvas = rotateCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isRotated = (rotation / 90) % 2 !== 0;
    canvas.width = isRotated ? img.naturalHeight || img.height : img.naturalWidth || img.width;
    canvas.height = isRotated ? img.naturalWidth || img.width : img.naturalHeight || img.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    const origW = img.naturalWidth || img.width;
    const origH = img.naturalHeight || img.height;
    ctx.drawImage(img, -origW / 2, -origH / 2);
    ctx.restore();
  }, [rotation, flipH, flipV]);

  useEffect(() => {
    if (slug === 'rotate-image' && previewSrc) {
      const img = new Image();
      img.onload = () => updateRotateCanvas(img);
      img.src = previewSrc;
    }
  }, [slug, previewSrc, updateRotateCanvas]);

  const runRotateDownload = () => {
    const canvas = rotateCanvasRef.current;
    if (!canvas || !file) return;
    setBusy(true);

    canvas.toBlob((blob) => {
      if (blob) {
        setRotatedBlob(blob);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const baseName = file.name.replace(/\.[^/.]+$/, '');
        a.download = `${baseName}-transformed.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setSuccess(c.success);
      }
      setBusy(false);
    }, 'image/png');
  };

  const handleDownloadTarget = () => {
    if (!targetResult || !file) return;
    const a = document.createElement('a');
    a.href = targetResult.objectUrl;
    const ext = targetResult.mimeType.split('/')[1].replace('jpeg', 'jpg');
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    a.download = `${baseName}-compressed-${targetPreset}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadGeneral = () => {
    if (!genCompressedUrl || !genCompressedBlob || !file) return;
    const a = document.createElement('a');
    a.href = genCompressedUrl;
    const ext = genCompressedBlob.type.split('/')[1].replace('jpeg', 'jpg');
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    a.download = `${baseName}-optimized.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadResized = () => {
    if (!resizedUrl || !resizedBlob || !file) return;
    const a = document.createElement('a');
    a.href = resizedUrl;
    const ext = (file.type || 'image/png').split('/')[1].replace('jpeg', 'jpg');
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    a.download = `${baseName}-resized-${resizeWidth}x${resizeHeight}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8">
      {/* Upload Zone */}
      {!file ? (
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
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFileSelect(f);
            }}
            className="hidden"
            aria-label={c.chooseImage}
          />
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="rounded-full bg-indigo-50 p-4 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Upload className="size-8" />
            </div>
            <div>
              <p className="text-base font-semibold">{c.uploadPrompt}</p>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">{c.uploadFormats}</p>
            </div>
          </div>
        </div>
      ) : (
        /* File Summary Bar */
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <FileImage className="size-5" />
            </div>
            <div>
              <span className="font-semibold block truncate max-w-xs">{file.name}</span>
              <span className="text-xs text-[var(--muted-foreground)]">
                {formatSize(file.size, locale)} • {file.type || 'image/jpeg'}{' '}
                {originalDims ? `• ${originalDims.width} × ${originalDims.height} px` : ''}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--muted-foreground)] hover:text-rose-600 transition-colors"
          >
            <RotateCcw className="size-3.5" />
            {c.changeImage}
          </button>
        </div>
      )}

      {/* Target Compression Preset Selector (for target tools) */}
      {isTargetPreset && (
        <div className="rounded-2xl border border-indigo-500/20 bg-indigo-50/40 dark:bg-indigo-950/20 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-indigo-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                  {c.targetSize}: {COMPRESSION_PRESETS[targetPreset].label}
                </span>
                <span className="text-xs text-[var(--muted-foreground)]">{comp.targetPresetBanner}</span>
              </div>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                {targetPreset === '20kb'
                  ? comp.preset20kbDesc
                  : targetPreset === '50kb'
                  ? comp.preset50kbDesc
                  : targetPreset === '200kb'
                  ? comp.preset200kbDesc
                  : comp.preset100kbDesc}
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
                      setTargetResult(null);
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
      )}

      {/* Action Controls for Loaded File */}
      {file && (
        <div className="space-y-6">
          {/* Target Compression Controls */}
          {isTargetPreset && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-5">
              {/* Special PNG Mode */}
              {(fixedFormat === 'image/png' || file.type === 'image/png') && (
                <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--foreground)]">{comp.pngStrategyTitle}</span>
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
                      <div className="font-bold">{comp.pngPreserveTitle}</div>
                      <div className="mt-1 text-[11px] font-normal text-[var(--muted-foreground)]">
                        {comp.pngPreserveDesc}
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
                      <div className="font-bold">{comp.pngShiftTitle}</div>
                      <div className="mt-1 text-[11px] font-normal text-[var(--muted-foreground)]">
                        {comp.pngShiftDesc}
                      </div>
                    </label>
                  </div>

                  {pngMode === 'format-shift' && (
                    <div className="flex items-center gap-3 pt-2 text-xs">
                      <span className="text-[var(--muted-foreground)]">{comp.pngConvertTo}</span>
                      <select
                        value={pngShiftFormat}
                        onChange={(e) => setPngShiftFormat(e.target.value as 'image/webp' | 'image/jpeg')}
                        className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 text-xs font-medium"
                      >
                        <option value="image/webp">{comp.webpPreserveAlpha}</option>
                        <option value="image/jpeg">{comp.jpgWhiteAlpha}</option>
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* Dimension preservation option */}
              <label className="flex items-start gap-2.5 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={preserveDims}
                  onChange={(e) => setPreserveDims(e.target.checked)}
                  className="rounded border-[var(--border)] text-indigo-600 mt-0.5"
                />
                <div>
                  <span className="font-semibold text-[var(--foreground)]">{comp.preserveDims}</span>
                  <span className="block text-[11px] text-[var(--muted-foreground)]">{comp.preserveDimsNote}</span>
                </div>
              </label>

              <button
                type="button"
                onClick={runTargetCompression}
                disabled={busy}
                className={`${buttonClass} w-full flex items-center justify-center gap-2`}
              >
                {busy ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {comp.reencoding}
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    {comp.compressToTarget} {COMPRESSION_PRESETS[targetPreset].label}
                  </>
                )}
              </button>

              {/* Target Result Comparison */}
              {targetResult && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-950/20 p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/20 pb-3">
                    <span className="font-bold text-sm text-emerald-700 dark:text-emerald-400">
                      ✓ {c.success}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-600 text-white">
                      {comp.compressToTarget} {formatSize(targetResult.achievedBytes, locale)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-[var(--muted-foreground)] block">{c.originalSize}</span>
                      <span className="font-semibold">{formatSize(file.size, locale)}</span>
                    </div>
                    <div>
                      <span className="text-[var(--muted-foreground)] block">{c.outputSize}</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {formatSize(targetResult.achievedBytes, locale)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--muted-foreground)] block">{c.reduction}</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {Math.max(0, Math.round(((file.size - targetResult.achievedBytes) / file.size) * 100))}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--muted-foreground)] block">{c.dimensions}</span>
                      <span className="font-semibold">
                        {targetResult.width} × {targetResult.height} px
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadTarget}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <Download className="size-4" />
                    {c.downloadImage} ({formatSize(targetResult.achievedBytes, locale)})
                  </button>
                </div>
              )}
            </div>
          )}

          {/* General Compression Controls */}
          {!isTargetPreset &&
            (slug === 'compress-image' ||
              slug === 'compress-jpg' ||
              slug === 'compress-png' ||
              slug === 'compress-webp') && (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                      {c.quality}
                    </label>
                    <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                      {Math.round(quality * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                <button
                  type="button"
                  onClick={runGeneralCompression}
                  disabled={busy}
                  className={`${buttonClass} w-full flex items-center justify-center gap-2`}
                >
                  {busy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                  {comp.compressBtn}
                </button>

                {genCompressedBlob && (
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-950/20 p-5 space-y-4">
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-[var(--muted-foreground)] block">{c.originalSize}</span>
                        <span className="font-semibold">{formatSize(file.size, locale)}</span>
                      </div>
                      <div>
                        <span className="text-[var(--muted-foreground)] block">{c.outputSize}</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {formatSize(genCompressedBlob.size, locale)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[var(--muted-foreground)] block">{c.reduction}</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                          {Math.max(0, Math.round(((file.size - genCompressedBlob.size) / file.size) * 100))}%
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleDownloadGeneral}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                      <Download className="size-4" />
                      {c.downloadImage} ({formatSize(genCompressedBlob.size, locale)})
                    </button>
                  </div>
                )}
              </div>
            )}

          {/* Resize Controls */}
          {slug === 'resize-image' && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <label className="block text-xs font-semibold">
                  {res.width} (px)
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={resizeWidth || ''}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setResizeWidth(val);
                      if (maintainRatio && aspectRatio > 0) {
                        setResizeHeight(Math.round(val / aspectRatio));
                      }
                    }}
                    className={fieldClass}
                  />
                </label>
                <label className="block text-xs font-semibold">
                  {res.height} (px)
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={resizeHeight || ''}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setResizeHeight(val);
                      if (maintainRatio && aspectRatio > 0) {
                        setResizeWidth(Math.round(val * aspectRatio));
                      }
                    }}
                    className={fieldClass}
                  />
                </label>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={maintainRatio}
                    onChange={(e) => setMaintainRatio(e.target.checked)}
                    className="rounded border-[var(--border)] text-indigo-600"
                  />
                  <span>{res.maintainRatio}</span>
                </label>

                {originalDims && (
                  <div className="flex items-center gap-1.5 text-xs">
                    {[0.25, 0.5, 0.75, 1.0, 1.5, 2.0].map((scale) => (
                      <button
                        key={scale}
                        type="button"
                        onClick={() => {
                          const w = Math.round(originalDims.width * scale);
                          const h = Math.round(originalDims.height * scale);
                          setResizeWidth(w);
                          setResizeHeight(h);
                        }}
                        className="px-2 py-1 rounded border border-[var(--border)] hover:bg-[var(--muted)] text-[11px]"
                      >
                        {scale * 100}%
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={runResize}
                disabled={busy}
                className={`${buttonClass} w-full flex items-center justify-center gap-2`}
              >
                {busy ? <Loader2 className="size-4 animate-spin" /> : <Maximize2 className="size-4" />}
                {res.resizeBtn}
              </button>

              {resizedBlob && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-950/20 p-5 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span>
                      {c.dimensions}: {resizeWidth} × {resizeHeight} px
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {formatSize(resizedBlob.size, locale)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadResized}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <Download className="size-4" />
                    {c.downloadImage} ({formatSize(resizedBlob.size, locale)})
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Rotate Controls */}
          {slug === 'rotate-image' && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-5">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setRotation((prev) => (prev - 90 + 360) % 360)}
                  className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="size-4" />
                  {rot.rotateCcw}
                </button>
                <button
                  type="button"
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RotateCw className="size-4" />
                  {rot.rotateCw}
                </button>
                <button
                  type="button"
                  onClick={() => setRotation((prev) => (prev + 180) % 360)}
                  className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {rot.rotate180}
                </button>
                <button
                  type="button"
                  onClick={() => setFlipH((prev) => !prev)}
                  className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    flipH
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                      : 'border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)]'
                  }`}
                >
                  <FlipHorizontal className="size-4" />
                  {rot.flipH}
                </button>
                <button
                  type="button"
                  onClick={() => setFlipV((prev) => !prev)}
                  className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    flipV
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                      : 'border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)]'
                  }`}
                >
                  <FlipVertical className="size-4" />
                  {rot.flipV}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRotation(0);
                    setFlipH(false);
                    setFlipV(false);
                  }}
                  className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] hover:text-rose-600 text-xs font-semibold transition-colors"
                >
                  {rot.reset}
                </button>
              </div>

              {/* Real-time Canvas Display */}
              <div className="h-64 rounded-xl bg-slate-100 dark:bg-slate-950 border border-[var(--border)] p-3 flex items-center justify-center overflow-hidden">
                <canvas ref={rotateCanvasRef} className="max-h-full max-w-full object-contain shadow-sm" />
              </div>

              <button
                type="button"
                onClick={runRotateDownload}
                disabled={busy}
                className={`${buttonClass} w-full flex items-center justify-center gap-2`}
              >
                {busy ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
                {rot.downloadTransformed}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Error & Feedback messages */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-50/50 p-4 text-sm text-rose-700 dark:bg-rose-950/20 dark:text-rose-400">
          <AlertCircle className="size-5 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Editorial Content & Guide Sections */}
      {toolContent && (
        <div className="mt-12 space-y-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
          <div>
            <h2 className="text-xl font-bold">{toolContent.title}</h2>
            <p className="mt-2 text-sm text-[var(--muted-foreground)] leading-relaxed">
              {toolContent.description}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
              <h3 className="text-sm font-bold">{d.ui.how}</h3>
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{toolContent.how}</p>
            </div>
            <div className="space-y-2 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
              <h3 className="text-sm font-bold">{d.ui.limits}</h3>
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{toolContent.limits}</p>
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
            <h3 className="text-sm font-bold">{toolContent.question}</h3>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{toolContent.answer}</p>
          </div>
        </div>
      )}
    </div>
  );
}
