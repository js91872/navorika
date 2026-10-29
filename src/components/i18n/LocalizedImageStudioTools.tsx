'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import {
  Upload,
  Download,
  RotateCcw,
  AlertCircle,
  Loader2,
  FileImage,
  Copy,
  Check,
  Code,
  Type,
  Layers,
  Sparkles,
  Sliders,
} from 'lucide-react';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';
import { fieldClass, buttonClass } from './ToolControls';
import { convertHtmlToImage } from '@/lib/image/html-to-image';
import { encodeBytesToBase64, inferImageMimeType } from '@/lib/image/base64/encoder';
import { decodeBase64Image } from '@/lib/image/base64/decoder';

export type ImageStudioToolSlug =
  | 'batch-image-converter'
  | 'resize-image-to-1000x1000'
  | 'change-image-resolution'
  | 'image-to-base64-converter'
  | 'base64-to-image-converter'
  | 'txt-to-image'
  | 'html-to-image'
  | 'html-to-jpg-converter'
  | 'html-to-png-converter';

type FitMode = 'crop' | 'contain' | 'stretch';
type TargetExt = 'png' | 'jpeg' | 'webp';

const RESOLUTION_PRESETS = [
  { label: 'Full HD (1920 × 1080)', width: 1920, height: 1080 },
  { label: 'HD Ready (1280 × 720)', width: 1280, height: 720 },
  { label: '4K Ultra HD (3840 × 2160)', width: 3840, height: 2160 },
  { label: '2K QHD (2560 × 1440)', width: 2560, height: 1440 },
  { label: 'Square Standard (1080 × 1080)', width: 1080, height: 1080 },
  { label: 'SVGA Display (800 × 600)', width: 800, height: 600 },
] as const;

const DEFAULT_HTML_SAMPLE = `<div style="margin: 24px auto; font-family: sans-serif; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff; border-radius: 16px; text-align: center; height: 160px; box-sizing: border-box;">
  <h2 style="margin: 16px 0 8px 0; font-size: 24px; font-weight: 800;">Navorika Studio</h2>
  <p style="margin: 0; font-size: 15px; opacity: 0.9;">Vector graphic engine</p>
</div>`;

export default function LocalizedImageStudioTools({
  slug,
  locale,
  dictionary,
}: {
  slug: ImageStudioToolSlug;
  locale: Locale;
  dictionary: Dictionary;
}) {
  const d = dictionary;
  const toolContent = d.tools[slug];
  const imgUi = d.imageTools;
  const c = imgUi.common;
  const studio = imgUi.studio;

  // 1. Batch Image Converter State
  const [batchFiles, setBatchFiles] = useState<File[]>([]);
  const [batchTargetExt, setBatchTargetExt] = useState<TargetExt>('jpeg');
  const [batchConverting, setBatchConverting] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);

  // 2. 1000x1000 & Change Resolution State
  const [singleFile, setSingleFile] = useState<File | null>(null);
  const [singleSourceUrl, setSingleSourceUrl] = useState<string | null>(null);
  const [singleResultUrl, setSingleResultUrl] = useState<string | null>(null);
  const [fitMode, setFitMode] = useState<FitMode>('contain');
  const [selectedPresetIdx, setSelectedPresetIdx] = useState(0);
  const [resTargetExt, setResTargetExt] = useState<TargetExt>('png');

  // 3. Image to Base64 State
  const [b64Raw, setB64Raw] = useState('');
  const [b64DataUrl, setB64DataUrl] = useState('');
  const [b64Copied, setB64Copied] = useState(false);

  // 4. Base64 to Image State
  const [b64InputText, setB64InputText] = useState('');
  const [b64DecodedUrl, setB64DecodedUrl] = useState<string | null>(null);

  // 5. Text to Image State
  const [textContent, setTextContent] = useState('Navorika Tools');
  const [fontSize, setFontSize] = useState(32);
  const [darkTheme, setDarkTheme] = useState(false);
  const [txtResultUrl, setTxtResultUrl] = useState<string | null>(null);

  // 6. HTML to Image State
  const [htmlMarkup, setHtmlMarkup] = useState(DEFAULT_HTML_SAMPLE);
  const [htmlResultUrl, setHtmlResultUrl] = useState<string | null>(null);
  const [htmlResultWidth, setHtmlResultWidth] = useState(0);
  const [htmlResultHeight, setHtmlResultHeight] = useState(0);

  // Shared state
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cleanup ref tracking
  const prevUrlsRef = useRef<string[]>([]);
  const activeOpRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const registerUrlForCleanup = useCallback((url: string) => {
    prevUrlsRef.current.push(url);
  }, []);

  useEffect(() => {
    return () => {
      prevUrlsRef.current.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // ignore cleanup errors
        }
      });
      prevUrlsRef.current = [];
    };
  }, []);

  const handleReset = () => {
    activeOpRef.current++;
    setError(null);
    setBusy(false);
    setBatchFiles([]);
    setBatchProgress(0);
    setSingleFile(null);
    setSingleSourceUrl(null);
    setSingleResultUrl(null);
    setB64Raw('');
    setB64DataUrl('');
    setB64Copied(false);
    setB64InputText('');
    setB64DecodedUrl(null);
    setTxtResultUrl(null);
    setHtmlResultUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ----------------------------------------------------
  // Operation 1: Batch Image Converter
  // ----------------------------------------------------
  const handleBatchFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    const newFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (f.size > 25 * 1024 * 1024) continue;
      newFiles.push(f);
    }
    setBatchFiles((prev) => [...prev, ...newFiles]);
  };

  const processBatch = async () => {
    if (batchFiles.length === 0) return;
    const op = ++activeOpRef.current;
    setBatchConverting(true);
    setError(null);
    setBatchProgress(0);

    const mime = batchTargetExt === 'jpeg' ? 'image/jpeg' : batchTargetExt === 'webp' ? 'image/webp' : 'image/png';
    const ext = batchTargetExt === 'jpeg' ? 'jpg' : batchTargetExt;

    try {
      for (let i = 0; i < batchFiles.length; i++) {
        if (op !== activeOpRef.current) return;
        const file = batchFiles[i];
        const srcUrl = URL.createObjectURL(file);
        registerUrlForCleanup(srcUrl);

        const img = new window.Image();
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error(c.errorUnsupported));
          img.src = srcUrl;
        });

        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        if (batchTargetExt === 'jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);

        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, mime, 0.92));
        if (blob) {
          const downloadUrl = URL.createObjectURL(blob);
          registerUrlForCleanup(downloadUrl);
          const a = document.createElement('a');
          a.href = downloadUrl;
          const cleanName = file.name.replace(/\.[^.]+$/, '');
          a.download = `${cleanName}_converted.${ext}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
        setBatchProgress(Math.round(((i + 1) / batchFiles.length) * 100));
      }
    } catch {
      setError(c.errorUnsupported);
    } finally {
      if (op === activeOpRef.current) {
        setBatchConverting(false);
      }
    }
  };

  // ----------------------------------------------------
  // Operation 2: 1000x1000 & Change Resolution
  // ----------------------------------------------------
  const handleSingleFileSelect = (f: File) => {
    setError(null);
    setSingleResultUrl(null);
    if (f.size > 25 * 1024 * 1024) {
      setError(c.errorTooLarge);
      return;
    }
    setSingleFile(f);
    const url = URL.createObjectURL(f);
    registerUrlForCleanup(url);
    setSingleSourceUrl(url);
  };

  const processResizeOrResolution = async () => {
    if (!singleFile || !singleSourceUrl) return;
    const op = ++activeOpRef.current;
    setBusy(true);
    setError(null);

    const is1000 = slug === 'resize-image-to-1000x1000';
    const targetW = is1000 ? 1000 : RESOLUTION_PRESETS[selectedPresetIdx].width;
    const targetH = is1000 ? 1000 : RESOLUTION_PRESETS[selectedPresetIdx].height;
    const mime = resTargetExt === 'jpeg' ? 'image/jpeg' : resTargetExt === 'webp' ? 'image/webp' : 'image/png';

    try {
      const img = new window.Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(c.errorUnsupported));
        img.src = singleSourceUrl;
      });

      if (op !== activeOpRef.current) return;

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error(c.errorUnsupported);

      if (resTargetExt === 'jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetW, targetH);
      }

      const sw = img.naturalWidth || img.width;
      const sh = img.naturalHeight || img.height;

      if (is1000) {
        if (fitMode === 'crop') {
          const scale = Math.max(targetW / sw, targetH / sh);
          const dw = sw * scale;
          const dh = sh * scale;
          ctx.drawImage(img, (targetW - dw) / 2, (targetH - dh) / 2, dw, dh);
        } else if (fitMode === 'contain') {
          const scale = Math.min(targetW / sw, targetH / sh);
          const dw = sw * scale;
          const dh = sh * scale;
          ctx.drawImage(img, (targetW - dw) / 2, (targetH - dh) / 2, dw, dh);
        } else {
          ctx.drawImage(img, 0, 0, targetW, targetH);
        }
      } else {
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(img, 0, 0, targetW, targetH);
      }

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, mime, 0.92));
      if (!blob) throw new Error(c.errorUnsupported);

      if (op !== activeOpRef.current) return;
      const outUrl = URL.createObjectURL(blob);
      registerUrlForCleanup(outUrl);
      setSingleResultUrl(outUrl);
    } catch {
      setError(c.errorUnsupported);
    } finally {
      if (op === activeOpRef.current) setBusy(false);
    }
  };

  // ----------------------------------------------------
  // Operation 3: Image to Base64
  // ----------------------------------------------------
  const handleImageToBase64 = async (f: File) => {
    setError(null);
    setBusy(true);
    try {
      const buffer = await f.arrayBuffer();
      const mime = inferImageMimeType(f.name, f.type);
      const res = encodeBytesToBase64(buffer, mime);
      setB64Raw(res.base64);
      setB64DataUrl(res.dataUrl);
      setSingleFile(f);
      const url = URL.createObjectURL(f);
      registerUrlForCleanup(url);
      setSingleSourceUrl(url);
    } catch {
      setError(c.errorUnsupported);
    } finally {
      setBusy(false);
    }
  };

  // ----------------------------------------------------
  // Operation 4: Base64 to Image
  // ----------------------------------------------------
  const handleBase64ToImage = async () => {
    const trimmed = b64InputText.trim();
    if (!trimmed) return;
    setError(null);
    setBusy(true);
    try {
      const res = decodeBase64Image(trimmed);
      if (!res.success || !res.dataUrl) {
        throw new Error(res.error || studio.invalidBase64);
      }
      setB64DecodedUrl(res.dataUrl);
    } catch {
      setError(studio.invalidBase64);
    } finally {
      setBusy(false);
    }
  };

  // ----------------------------------------------------
  // Operation 5: Text to Image
  // ----------------------------------------------------
  const processTextToImage = () => {
    if (!textContent.trim()) return;
    setError(null);
    setBusy(true);

    try {
      const lines = textContent.replace(/\r\n/g, '\n').split('\n');
      if (lines.length > 100 || textContent.length > 8000) {
        throw new Error(c.errorTooLarge);
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error(c.errorUnsupported);

      ctx.font = `${fontSize}px Arial, sans-serif`;
      const maxLine = Math.max(1, ...lines.map((l) => ctx.measureText(l).width));
      const width = Math.min(4096, Math.max(400, Math.ceil(maxLine + 80)));
      const height = Math.ceil(lines.length * fontSize * 1.5 + 80);

      canvas.width = width;
      canvas.height = height;
      ctx.fillStyle = darkTheme ? '#101827' : '#ffffff';
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px Arial, sans-serif`;
      ctx.textBaseline = 'top';
      ctx.fillStyle = darkTheme ? '#ffffff' : '#111827';

      lines.forEach((line, i) => {
        ctx.fillText(line, 40, 40 + i * fontSize * 1.5, width - 80);
      });

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        registerUrlForCleanup(url);
        setTxtResultUrl(url);
        setBusy(false);
      }, 'image/png');
    } catch (err: unknown) {
      setError(err instanceof Error && err.message === c.errorTooLarge ? c.errorTooLarge : c.errorUnsupported);
      setBusy(false);
    }
  };

  // ----------------------------------------------------
  // Operation 6: HTML to Image
  // ----------------------------------------------------
  const processHtmlToImage = async () => {
    if (!htmlMarkup.trim()) return;
    const op = ++activeOpRef.current;
    setError(null);
    setBusy(true);

    const fmt = slug === 'html-to-jpg-converter' ? 'jpeg' : 'png';
    try {
      const res = await convertHtmlToImage(htmlMarkup, {
        width: 800,
        format: fmt,
        quality: 0.92,
        scale: 2,
      });

      if (op !== activeOpRef.current) return;
      registerUrlForCleanup(res.url);
      setHtmlResultUrl(res.url);
      setHtmlResultWidth(res.width);
      setHtmlResultHeight(res.height);
    } catch {
      setError(c.errorUnsupported);
    } finally {
      if (op === activeOpRef.current) setBusy(false);
    }
  };

  // Copy helper
  const copyText = (text: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setB64Copied(true);
      setTimeout(() => setB64Copied(false), 2000);
    }
  };

  // Summary definition list rows for verification and testing
  const dlRows = useMemo(() => {
    const rows: [string, string][] = [];
    if (slug === 'batch-image-converter') {
      rows.push([studio.batchCount, `${batchFiles.length}`]);
      rows.push([d.ui.format, batchTargetExt.toUpperCase()]);
      rows.push([c.quality, batchConverting ? `${batchProgress}%` : c.success]);
    } else if (slug === 'resize-image-to-1000x1000') {
      rows.push([d.ui.dimensions, '1000 × 1000 px']);
      rows.push([studio.fitMode, fitMode === 'contain' ? studio.fitContain : fitMode === 'crop' ? studio.fitCrop : studio.fitStretch]);
      rows.push([d.ui.format, resTargetExt.toUpperCase()]);
    } else if (slug === 'change-image-resolution') {
      const preset = RESOLUTION_PRESETS[selectedPresetIdx];
      rows.push([studio.targetResolution, preset.label]);
      rows.push([d.ui.dimensions, `${preset.width} × ${preset.height} px`]);
      rows.push([d.ui.format, resTargetExt.toUpperCase()]);
    } else if (slug === 'image-to-base64-converter') {
      rows.push([d.ui.selectFile, singleFile ? singleFile.name : '-']);
      rows.push([studio.base64Output, `${b64Raw.length}`]);
    } else if (slug === 'base64-to-image-converter') {
      rows.push([studio.base64Input, b64DecodedUrl ? c.success : '-']);
    } else if (slug === 'txt-to-image') {
      rows.push([studio.fontSize, `${fontSize} px`]);
      rows.push([d.ui.mode, darkTheme ? studio.darkTheme : c.chooseImage]);
    } else if (slug === 'html-to-image' || slug === 'html-to-jpg-converter' || slug === 'html-to-png-converter') {
      rows.push([d.ui.format, slug === 'html-to-jpg-converter' ? 'JPG' : 'PNG']);
      rows.push([d.ui.dimensions, htmlResultWidth ? `${htmlResultWidth} × ${htmlResultHeight} px` : '-']);
    }
    return rows;
  }, [
    slug,
    studio,
    d.ui,
    batchFiles.length,
    batchTargetExt,
    batchConverting,
    batchProgress,
    c.success,
    c.chooseImage,
    c.quality,
    fitMode,
    resTargetExt,
    selectedPresetIdx,
    singleFile,
    b64Raw.length,
    b64DecodedUrl,
    fontSize,
    darkTheme,
    htmlResultWidth,
    htmlResultHeight,
  ]);

  return (
    <div className="space-y-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      {/* Header Info */}
      <div className="border-b border-[var(--border)] pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">{toolContent?.title || slug}</h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">{toolContent?.description}</p>
      </div>

      {error && (
        <div role="alert" className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-600 dark:text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Batch Image Converter */}
      {slug === 'batch-image-converter' && (
        <div className="space-y-6">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--border)] p-8 text-center transition hover:border-indigo-500"
          >
            <Layers className="h-10 w-10 text-indigo-500" />
            <p className="mt-3 text-sm font-semibold">{studio.batchPrompt}</p>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">{c.uploadFormats}</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={(e) => handleBatchFileSelect(e.target.files)}
          />

          {batchFiles.length > 0 && (
            <div className="space-y-4 rounded-xl bg-[var(--muted)]/40 p-4">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>{batchFiles.length} {studio.batchCount}</span>
                <button type="button" onClick={handleReset} className="text-xs text-red-500 hover:underline">
                  {studio.reset}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <label className="text-xs font-semibold uppercase">{imgUi.converters.outputFormat}:</label>
                {(['jpeg', 'png', 'webp'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setBatchTargetExt(fmt)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase transition ${
                      batchTargetExt === fmt ? 'bg-indigo-600 text-white' : 'bg-[var(--card)] hover:bg-[var(--muted)]'
                    }`}
                  >
                    {fmt === 'jpeg' ? 'JPG' : fmt}
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={batchConverting}
                onClick={processBatch}
                className={`${buttonClass} w-full`}
              >
                {batchConverting ? `${studio.batchDownloading} (${batchProgress}%)` : studio.batchProcess}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 2. 1000x1000 & Change Resolution */}
      {(slug === 'resize-image-to-1000x1000' || slug === 'change-image-resolution') && (
        <div className="space-y-6">
          {!singleFile ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--border)] p-8 text-center transition hover:border-indigo-500"
            >
              <Upload className="h-10 w-10 text-indigo-500" />
              <p className="mt-3 text-sm font-semibold">{c.uploadPrompt}</p>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">{c.uploadFormats}</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center justify-between rounded-xl bg-[var(--muted)]/40 p-4">
                <span className="truncate text-sm font-semibold">{singleFile.name}</span>
                <button type="button" onClick={handleReset} className="text-xs text-red-500 hover:underline">
                  {c.removeImage}
                </button>
              </div>

              {slug === 'resize-image-to-1000x1000' ? (
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                    {studio.fitMode}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['contain', 'crop', 'stretch'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setFitMode(m)}
                        className={`rounded-xl p-3 text-xs font-semibold transition ${
                          fitMode === m ? 'bg-indigo-600 text-white shadow-sm' : 'bg-[var(--muted)]/40 hover:bg-[var(--muted)]'
                        }`}
                      >
                        {m === 'contain' ? studio.fitContain : m === 'crop' ? studio.fitCrop : studio.fitStretch}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                    {studio.targetResolution}
                  </label>
                  <select
                    className={fieldClass}
                    value={selectedPresetIdx}
                    onChange={(e) => setSelectedPresetIdx(Number(e.target.value))}
                  >
                    {RESOLUTION_PRESETS.map((p, i) => (
                      <option key={p.label} value={i}>{p.label}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold uppercase">{imgUi.converters.outputFormat}:</label>
                {(['png', 'jpeg', 'webp'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setResTargetExt(fmt)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase transition ${
                      resTargetExt === fmt ? 'bg-indigo-600 text-white' : 'bg-[var(--muted)]/40 hover:bg-[var(--muted)]'
                    }`}
                  >
                    {fmt === 'jpeg' ? 'JPG' : fmt}
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={busy}
                onClick={processResizeOrResolution}
                className={`${buttonClass} w-full`}
              >
                {busy ? c.processing : imgUi.converters.convertBtn}
              </button>

              {singleResultUrl && (
                <div className="space-y-4 border-t border-[var(--border)] pt-5 text-center">
                  <div className="relative mx-auto aspect-square max-h-72 w-full max-w-xs overflow-hidden rounded-xl border border-[var(--border)] bg-slate-900">
                    <Image
                      src={singleResultUrl}
                      alt="Processed Result"
                      fill
                      unoptimized
                      className="object-contain"
                    />
                  </div>
                  <a
                    href={singleResultUrl}
                    download={`resized_${slug}_${Date.now()}.${resTargetExt === 'jpeg' ? 'jpg' : resTargetExt}`}
                    className={`${buttonClass} inline-flex items-center gap-2`}
                  >
                    <Download className="h-4 w-4" />
                    <span>{studio.downloadImage}</span>
                  </a>
                </div>
              )}
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleSingleFileSelect(e.target.files[0])}
          />
        </div>
      )}

      {/* 3. Image to Base64 */}
      {slug === 'image-to-base64-converter' && (
        <div className="space-y-6">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--border)] p-8 text-center transition hover:border-indigo-500"
          >
            <Code className="h-10 w-10 text-indigo-500" />
            <p className="mt-3 text-sm font-semibold">{c.uploadPrompt}</p>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">JPG, PNG, WebP, SVG, GIF (up to 25 MB)</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleImageToBase64(e.target.files[0])}
          />

          {b64Raw && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">{studio.base64Output}</span>
                <button
                  type="button"
                  onClick={() => copyText(b64DataUrl)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  {b64Copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{b64Copied ? studio.copied : studio.copyDataUrl}</span>
                </button>
              </div>
              <textarea
                rows={6}
                readOnly
                value={b64DataUrl}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 p-3 font-mono text-xs"
              />
            </div>
          )}
        </div>
      )}

      {/* 4. Base64 to Image */}
      {slug === 'base64-to-image-converter' && (
        <div className="space-y-5">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
            {studio.base64Input}
          </label>
          <textarea
            rows={5}
            value={b64InputText}
            onChange={(e) => setB64InputText(e.target.value)}
            placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 font-mono text-xs"
          />
          <button
            type="button"
            disabled={busy || !b64InputText.trim()}
            onClick={handleBase64ToImage}
            className={`${buttonClass} w-full`}
          >
            {busy ? c.processing : imgUi.converters.convertBtn}
          </button>

          {b64DecodedUrl && (
            <div className="space-y-4 text-center">
              <div className="relative mx-auto max-h-72 w-full max-w-sm overflow-hidden rounded-xl border border-[var(--border)] bg-slate-900">
                <Image
                  src={b64DecodedUrl}
                  alt="Decoded Base64 Preview"
                  width={300}
                  height={200}
                  unoptimized
                  className="mx-auto max-h-72 w-auto object-contain"
                />
              </div>
              <a
                href={b64DecodedUrl}
                download="decoded_image.png"
                className={`${buttonClass} inline-flex items-center gap-2`}
              >
                <Download className="h-4 w-4" />
                <span>{studio.downloadImage}</span>
              </a>
            </div>
          )}
        </div>
      )}

      {/* 5. Text to Image */}
      {slug === 'txt-to-image' && (
        <div className="space-y-5">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
            {studio.textInput}
          </label>
          <textarea
            rows={4}
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 text-sm"
          />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold">{studio.fontSize}: {fontSize}px</span>
              <input
                type="range"
                min={16}
                max={60}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="cursor-pointer"
              />
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold">
              <input
                type="checkbox"
                checked={darkTheme}
                onChange={(e) => setDarkTheme(e.target.checked)}
                className="rounded border-[var(--border)]"
              />
              <span>{studio.darkTheme}</span>
            </label>
          </div>

          <button
            type="button"
            disabled={busy || !textContent.trim()}
            onClick={processTextToImage}
            className={`${buttonClass} w-full`}
          >
            {busy ? c.processing : imgUi.converters.convertBtn}
          </button>

          {txtResultUrl && (
            <div className="space-y-4 text-center">
              <div className="relative mx-auto max-h-72 w-full max-w-sm overflow-hidden rounded-xl border border-[var(--border)] bg-slate-900">
                <Image
                  src={txtResultUrl}
                  alt="Text to image output"
                  width={300}
                  height={200}
                  unoptimized
                  className="mx-auto max-h-72 w-auto object-contain"
                />
              </div>
              <a
                href={txtResultUrl}
                download="text_image.png"
                className={`${buttonClass} inline-flex items-center gap-2`}
              >
                <Download className="h-4 w-4" />
                <span>{studio.downloadImage}</span>
              </a>
            </div>
          )}
        </div>
      )}

      {/* 6. HTML to Image Tools */}
      {(slug === 'html-to-image' || slug === 'html-to-jpg-converter' || slug === 'html-to-png-converter') && (
        <div className="space-y-5">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
            {studio.htmlInput}
          </label>
          <textarea
            rows={6}
            value={htmlMarkup}
            onChange={(e) => setHtmlMarkup(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 font-mono text-xs"
          />
          <p className="text-xs text-[var(--muted-foreground)]">{studio.htmlSandboxNote}</p>

          <button
            type="button"
            disabled={busy || !htmlMarkup.trim()}
            onClick={processHtmlToImage}
            className={`${buttonClass} w-full`}
          >
            {busy ? c.processing : studio.renderHtml}
          </button>

          {htmlResultUrl && (
            <div className="space-y-4 border-t border-[var(--border)] pt-5 text-center">
              <div className="relative mx-auto max-h-80 w-full max-w-md overflow-hidden rounded-xl border border-[var(--border)] bg-slate-900">
                <Image
                  src={htmlResultUrl}
                  alt="Rendered HTML preview"
                  width={400}
                  height={250}
                  unoptimized
                  className="mx-auto max-h-80 w-auto object-contain"
                />
              </div>
              <a
                href={htmlResultUrl}
                download={`html_render.${slug === 'html-to-jpg-converter' ? 'jpg' : 'png'}`}
                className={`${buttonClass} inline-flex items-center gap-2`}
              >
                <Download className="h-4 w-4" />
                <span>{studio.downloadImage}</span>
              </a>
            </div>
          )}
        </div>
      )}

      {/* Structured Status Table for Verification */}
      <dl className="grid grid-cols-2 gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-xs sm:grid-cols-3">
        {dlRows.map(([label, val]) => (
          <div key={label}>
            <dt className="text-[var(--muted-foreground)]">{label}</dt>
            <dd className="mt-1 font-semibold text-[var(--foreground)]">{val}</dd>
          </div>
        ))}
      </dl>

      {/* FAQ Accordion Section */}
      <div className="border-t border-[var(--border)] pt-6">
        <h2 className="text-lg font-bold text-[var(--foreground)]">{d.ui.faq}</h2>
        <div className="mt-4 space-y-4">
          <div className="rounded-xl border border-[var(--border)] p-4">
            <h3 className="font-semibold text-[var(--foreground)]">{toolContent?.question}</h3>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">{toolContent?.answer}</p>
          </div>
          <div className="rounded-xl border border-[var(--border)] p-4">
            <h3 className="font-semibold text-[var(--foreground)]">{d.ui.how}</h3>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">{toolContent?.how}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
