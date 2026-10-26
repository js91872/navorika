'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
  Upload,
  Download,
  RotateCcw,
  AlertCircle,
  Loader2,
  FileImage,
  Sparkles,
} from 'lucide-react';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';
import { fieldClass, buttonClass } from './ToolControls';
import { encodePngToIco } from '@/lib/image/icoEncoder';
import { encodeCanvasToGif } from '@/lib/image/gifEncoder';

export type ConverterToolSlug =
  | 'convert-jpg-to-png'
  | 'convert-jpg-to-webp'
  | 'convert-png-to-jpg'
  | 'convert-png-to-webp'
  | 'convert-webp-to-jpg'
  | 'webp-to-png'
  | 'image-converter'
  | 'svg-to-png'
  | 'svg-to-ico'
  | 'webp-to-ico'
  | 'webp-to-gif'
  | 'jfif-to-png'
  | 'avif-to-png'
  | 'heic-to-jpg'
  | 'heic-to-png'
  | 'black-and-white-image-converter';

type TargetFormat = 'png' | 'jpeg' | 'webp' | 'ico' | 'gif';

function formatSize(bytes: number, locale: string): string {
  if (bytes < 1024) return `${bytes} B`;
  const nf = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
  if (bytes < 1024 * 1024) return `${nf.format(bytes / 1024)} KB`;
  return `${nf.format(bytes / (1024 * 1024))} MB`;
}

export default function LocalizedImageConverterTools({
  slug,
  locale,
  dictionary,
}: {
  slug: ConverterToolSlug;
  locale: Locale;
  dictionary: Dictionary;
}) {
  const d = dictionary;
  const toolContent = d.tools[slug];
  const imgUi = d.imageTools;
  const c = imgUi.common;
  const conv = imgUi.converters;

  // Determine accepted input MIME types based on slug
  const acceptTypes = useMemo(() => {
    switch (slug) {
      case 'convert-jpg-to-png':
      case 'convert-jpg-to-webp':
        return 'image/jpeg,image/jpg';
      case 'convert-png-to-jpg':
      case 'convert-png-to-webp':
        return 'image/png';
      case 'convert-webp-to-jpg':
      case 'webp-to-png':
      case 'webp-to-ico':
      case 'webp-to-gif':
        return 'image/webp';
      case 'svg-to-png':
      case 'svg-to-ico':
        return 'image/svg+xml,.svg';
      case 'jfif-to-png':
        return 'image/jpeg,image/jfif,.jfif,.jpeg,.jpg';
      case 'avif-to-png':
        return 'image/avif,.avif';
      case 'heic-to-jpg':
      case 'heic-to-png':
        return '.heic,.heif,image/heic,image/heif';
      case 'black-and-white-image-converter':
        return 'image/jpeg,image/png,image/webp,image/jpg';
      case 'image-converter':
      default:
        return 'image/jpeg,image/png,image/webp,image/jpg';
    }
  }, [slug]);

  // Default target format
  const initialTargetFormat = useMemo<TargetFormat>(() => {
    switch (slug) {
      case 'convert-jpg-to-png':
      case 'webp-to-png':
      case 'svg-to-png':
      case 'jfif-to-png':
      case 'avif-to-png':
      case 'heic-to-png':
      case 'black-and-white-image-converter':
        return 'png';
      case 'convert-jpg-to-webp':
      case 'convert-png-to-webp':
        return 'webp';
      case 'convert-png-to-jpg':
      case 'convert-webp-to-jpg':
      case 'heic-to-jpg':
        return 'jpeg';
      case 'svg-to-ico':
      case 'webp-to-ico':
        return 'ico';
      case 'webp-to-gif':
        return 'gif';
      case 'image-converter':
      default:
        return 'webp';
    }
  }, [slug]);

  const [file, setFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<TargetFormat>(initialTargetFormat);
  const [quality, setQuality] = useState(0.92);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevSourceUrlRef = useRef<string | null>(null);
  const prevResultUrlRef = useRef<string | null>(null);
  const activeOpIdRef = useRef(0);

  useEffect(() => {
    if (prevSourceUrlRef.current && prevSourceUrlRef.current !== sourceUrl) {
      URL.revokeObjectURL(prevSourceUrlRef.current);
    }
    prevSourceUrlRef.current = sourceUrl;
  }, [sourceUrl]);

  useEffect(() => {
    if (prevResultUrlRef.current && prevResultUrlRef.current !== resultUrl) {
      URL.revokeObjectURL(prevResultUrlRef.current);
    }
    prevResultUrlRef.current = resultUrl;
  }, [resultUrl]);

  useEffect(() => {
    return () => {
      if (prevSourceUrlRef.current) URL.revokeObjectURL(prevSourceUrlRef.current);
      if (prevResultUrlRef.current) URL.revokeObjectURL(prevResultUrlRef.current);
    };
  }, []);

  const handleReset = () => {
    activeOpIdRef.current++;
    setFile(null);
    setSourceUrl(null);
    setResultUrl(null);
    setResultBlob(null);
    setError(null);
    setSelectedFormat(initialTargetFormat);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileSelect = (selectedFile: File) => {
    setError(null);
    setResultUrl(null);
    setResultBlob(null);

    const MAX_INPUT_BYTES = 25 * 1024 * 1024;
    if (selectedFile.size > MAX_INPUT_BYTES) {
      setError(c.errorTooLarge);
      return;
    }

    setFile(selectedFile);
    const objUrl = URL.createObjectURL(selectedFile);
    setSourceUrl(objUrl);
  };

  // Execute Conversion
  const convertImage = async () => {
    if (!file || !sourceUrl) return;
    const opId = ++activeOpIdRef.current;
    setError(null);
    setBusy(true);

    let effectiveSourceUrl = sourceUrl;
    let tempHeicBlobUrl: string | null = null;

    try {
      if (slug === 'heic-to-jpg' || slug === 'heic-to-png') {
        const { default: heic2any } = await import('heic2any');
        const converted = await heic2any({ blob: file, toType: 'image/png' });
        const blob: Blob = Array.isArray(converted) ? converted[0] : converted;
        tempHeicBlobUrl = URL.createObjectURL(blob);
        effectiveSourceUrl = tempHeicBlobUrl;
      }

      const img = new window.Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(c.errorUnsupported));
        img.src = effectiveSourceUrl;
      });

      if (tempHeicBlobUrl) {
        URL.revokeObjectURL(tempHeicBlobUrl);
      }

      if (opId !== activeOpIdRef.current) return;

      const isIcon = selectedFormat === 'ico';
      const width = isIcon ? 64 : img.naturalWidth || img.width;
      const height = isIcon ? 64 : img.naturalHeight || img.height;

      if (!width || !height || width * height > 25000000) {
        throw new Error(conv.dimensionsExceeded || c.errorTooLarge);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error(conv.canvasUnavailable || c.errorUnsupported);

      if (selectedFormat === 'jpeg') {
        // Fill transparent background with white
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
      }

      if (isIcon) {
        // Center icon proportionally in 64x64 box
        const scale = Math.min(64 / (img.naturalWidth || 64), 64 / (img.naturalHeight || 64));
        const w = (img.naturalWidth || 64) * scale;
        const h = (img.naturalHeight || 64) * scale;
        ctx.clearRect(0, 0, 64, 64);
        ctx.drawImage(img, (64 - w) / 2, (64 - h) / 2, w, h);
      } else {
        ctx.drawImage(img, 0, 0, width, height);
      }

      if (slug === 'black-and-white-image-converter') {
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          const gray = Math.round(0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]);
          data[i] = gray;
          data[i + 1] = gray;
          data[i + 2] = gray;
        }
        ctx.putImageData(imgData, 0, 0);
      }

      let outputBlob: Blob;

      if (isIcon) {
        // Produce 64x64 PNG and package into ICO binary structure
        const pngBlob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((b) => (b ? resolve(b) : reject(new Error(conv.pngFailed || c.errorUnsupported))), 'image/png');
        });
        const pngBytes = new Uint8Array(await pngBlob.arrayBuffer());
        const icoBytes = encodePngToIco(pngBytes, { width: 64, height: 64 });
        outputBlob = new Blob([icoBytes.buffer as ArrayBuffer], { type: 'image/x-icon' });
      } else if (selectedFormat === 'gif') {
        outputBlob = encodeCanvasToGif(canvas);
      } else {
        const mime = selectedFormat === 'jpeg' ? 'image/jpeg' : selectedFormat === 'webp' ? 'image/webp' : 'image/png';
        const qualityParam = selectedFormat === 'png' ? undefined : quality;
        outputBlob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((b) => (b ? resolve(b) : reject(new Error(conv.imageFailed || c.errorUnsupported))), mime, qualityParam);
        });
      }

      if (opId !== activeOpIdRef.current) return;
      setResultBlob(outputBlob);
      setResultUrl(URL.createObjectURL(outputBlob));
    } catch (err) {
      if (opId === activeOpIdRef.current) {
        setError(err instanceof Error ? err.message : c.errorUnsupported);
      }
    } finally {
      if (opId === activeOpIdRef.current) {
        setBusy(false);
      }
    }
  };

  const handleDownload = () => {
    if (!resultUrl || !file) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    const ext = selectedFormat === 'jpeg' ? 'jpg' : selectedFormat;
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    a.download = `${baseName}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8">
      {/* File Upload Area */}
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
            accept={acceptTypes}
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
                {formatSize(file.size, locale)} • {file.type || 'image'}
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

      {/* Conversion Options & Workspace */}
      {file && (
        <div className="space-y-6">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-6">
            {/* Visual Previews Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">
                  {conv.sourceImage}
                </p>
                <div className="relative h-56 rounded-xl bg-slate-100 dark:bg-slate-950 border border-[var(--border)] p-3 flex items-center justify-center overflow-hidden">
                  {sourceUrl ? (
                    <Image
                      src={sourceUrl}
                      alt={conv.sourceImage}
                      unoptimized
                      fill
                      className="object-contain p-2"
                    />
                  ) : null}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">
                  {conv.convertedPreview}
                </p>
                <div className="relative h-56 rounded-xl bg-slate-100 dark:bg-slate-950 border border-[var(--border)] p-3 flex items-center justify-center overflow-hidden">
                  {resultUrl ? (
                    <Image
                      src={resultUrl}
                      alt={conv.convertedPreview}
                      unoptimized
                      fill
                      className="object-contain p-2"
                    />
                  ) : (
                    <span className="text-xs text-[var(--muted-foreground)]">{conv.previewPlaceholder}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Target format dropdown (if image-converter or black-and-white-image-converter) */}
            {(slug === 'image-converter' || slug === 'black-and-white-image-converter') && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">
                  {conv.outputFormat}
                </label>
                <select
                  value={selectedFormat}
                  onChange={(e) => {
                    setSelectedFormat(e.target.value as TargetFormat);
                    setResultUrl(null);
                    setResultBlob(null);
                  }}
                  className={fieldClass}
                >
                  {slug === 'black-and-white-image-converter' ? (
                    <>
                      <option value="png">PNG</option>
                      <option value="jpeg">JPG / JPEG</option>
                    </>
                  ) : (
                    <>
                      <option value="webp">WebP</option>
                      <option value="jpeg">JPG / JPEG</option>
                      <option value="png">PNG</option>
                    </>
                  )}
                </select>
              </div>
            )}

            {/* Quality Slider (for lossy formats) */}
            {(selectedFormat === 'jpeg' || selectedFormat === 'webp') && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                    {conv.encoderQuality}
                  </label>
                  <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                    {Math.round(quality * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.0"
                  step="0.01"
                  value={quality}
                  onChange={(e) => {
                    setQuality(parseFloat(e.target.value));
                    setResultUrl(null);
                    setResultBlob(null);
                  }}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            )}

            {/* Format specific notices */}
            {selectedFormat === 'jpeg' && (
              <p className="text-xs text-[var(--muted-foreground)] italic">{conv.whiteBgNote}</p>
            )}
            {selectedFormat === 'ico' && (
              <p className="text-xs text-[var(--muted-foreground)] italic">{conv.icoNotice}</p>
            )}

            {/* Convert action button */}
            <button
              type="button"
              onClick={convertImage}
              disabled={busy}
              className={`${buttonClass} w-full flex items-center justify-center gap-2`}
            >
              {busy ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {conv.converting}
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  {conv.convertBtn} {selectedFormat.toUpperCase()}
                </>
              )}
            </button>

            {/* Converted result & Download */}
            {resultBlob && resultUrl && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-950/20 p-5 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    ✓ {c.success}
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {formatSize(resultBlob.size, locale)} • {selectedFormat.toUpperCase()}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Download className="size-4" />
                  {c.downloadImage} ({formatSize(resultBlob.size, locale)})
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Feedback */}
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
