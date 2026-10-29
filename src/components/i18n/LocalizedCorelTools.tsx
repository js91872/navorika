'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  FileUp,
  Download,
  RotateCcw,
  LoaderCircle,
  Info,
  LockKeyhole,
  ArrowRight,
  Layers,
} from 'lucide-react';
import type { Locale, TranslatedTool } from '@/lib/i18n/config';
import { localizedPath } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import { getToolIcon } from '@/lib/toolIcons';
import { detectCdrVersion } from '@/lib/converters/coreldraw/validation';
import {
  CORELDRAW_MAX_UPLOAD_BYTES,
  CORELDRAW_MAX_RASTER_PIXELS,
} from '@/lib/converters/coreldraw/formats';
import { vectorizeRgbaToSvg } from '@/lib/converters/coreldraw/raster-vectorizer';
import type {
  CorelCapabilities,
  CorelInputFormat,
  CorelOutputFormat,
  ServerConversionKind,
} from '@/lib/converters/coreldraw/types';

interface OutputChoice {
  value: CorelOutputFormat;
  label: string;
  capability?: keyof CorelCapabilities;
}

interface ServerToolConfig {
  kind: ServerConversionKind;
  inputFormats: CorelInputFormat[];
  outputChoices: OutputChoice[];
  defaultOutput: CorelOutputFormat;
  accept: string;
  showNativeNotice?: boolean;
  requiredCapability?: keyof CorelCapabilities;
  viewer?: boolean;
  rasterControls?: boolean;
}

const SERVER_CONFIGS: Record<string, ServerToolConfig> = {
  'cdr-viewer': {
    kind: 'cdr-viewer',
    inputFormats: ['cdr'],
    defaultOutput: 'pdf',
    accept: '.cdr,application/vnd.corel-draw',
    requiredCapability: 'cdrRead',
    viewer: true,
    outputChoices: [
      { value: 'pdf', label: 'PDF' },
      { value: 'svg', label: 'SVG', capability: 'pdfToSvg' },
      { value: 'png', label: 'PNG' },
    ],
  },
  'cdr-to-pdf-converter': {
    kind: 'cdr-to-pdf',
    inputFormats: ['cdr'],
    defaultOutput: 'pdf',
    accept: '.cdr,application/vnd.corel-draw',
    requiredCapability: 'cdrRead',
    outputChoices: [{ value: 'pdf', label: 'PDF' }],
  },
  'cdr-to-svg-converter': {
    kind: 'cdr-to-svg',
    inputFormats: ['cdr'],
    defaultOutput: 'svg',
    accept: '.cdr,application/vnd.corel-draw',
    requiredCapability: 'cdrRead',
    outputChoices: [{ value: 'svg', label: 'SVG', capability: 'pdfToSvg' }],
  },
  'cdr-to-png-converter': {
    kind: 'cdr-to-png',
    inputFormats: ['cdr'],
    defaultOutput: 'png',
    accept: '.cdr,application/vnd.corel-draw',
    requiredCapability: 'cdrRead',
    rasterControls: true,
    outputChoices: [{ value: 'png', label: 'PNG' }],
  },
  'cdr-to-jpg-converter': {
    kind: 'cdr-to-jpg',
    inputFormats: ['cdr'],
    defaultOutput: 'jpg',
    accept: '.cdr,application/vnd.corel-draw',
    requiredCapability: 'cdrRead',
    rasterControls: true,
    outputChoices: [{ value: 'jpg', label: 'JPG' }],
  },
  'cdr-to-eps-converter': {
    kind: 'cdr-to-eps',
    inputFormats: ['cdr'],
    defaultOutput: 'eps',
    accept: '.cdr,application/vnd.corel-draw',
    requiredCapability: 'cdrRead',
    outputChoices: [{ value: 'eps', label: 'EPS', capability: 'pdfToEps' }],
  },
  'pdf-to-cdr-converter': {
    kind: 'pdf-to-corel',
    inputFormats: ['pdf'],
    defaultOutput: 'svg',
    accept: '.pdf,application/pdf',
    showNativeNotice: true,
    outputChoices: [
      { value: 'pdf', label: 'PDF' },
      { value: 'svg', label: 'SVG', capability: 'pdfToSvg' },
      { value: 'eps', label: 'EPS', capability: 'pdfToEps' },
    ],
  },
  'word-to-cdr-converter': {
    kind: 'word-to-corel',
    inputFormats: ['doc', 'docx'],
    defaultOutput: 'pdf',
    accept: '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    showNativeNotice: true,
    requiredCapability: 'docxToPdf',
    outputChoices: [
      { value: 'pdf', label: 'PDF' },
      { value: 'svg', label: 'SVG', capability: 'pdfToSvg' },
      { value: 'eps', label: 'EPS', capability: 'pdfToEps' },
    ],
  },
  'svg-to-cdr-converter': {
    kind: 'svg-to-corel',
    inputFormats: ['svg'],
    defaultOutput: 'svg',
    accept: '.svg,image/svg+xml',
    showNativeNotice: true,
    outputChoices: [
      { value: 'svg', label: 'SVG' },
      { value: 'pdf', label: 'PDF', capability: 'docxToPdf' },
      { value: 'eps', label: 'EPS', capability: 'pdfToEps' },
    ],
  },
  'ai-to-cdr-converter': {
    kind: 'ai-to-corel',
    inputFormats: ['ai'],
    defaultOutput: 'pdf',
    accept: '.ai,application/postscript,application/pdf',
    showNativeNotice: true,
    requiredCapability: 'postscriptToPdf',
    outputChoices: [
      { value: 'pdf', label: 'PDF' },
      { value: 'svg', label: 'SVG', capability: 'pdfToSvg' },
      { value: 'eps', label: 'EPS', capability: 'pdfToEps' },
    ],
  },
  'eps-to-cdr-converter': {
    kind: 'eps-to-corel',
    inputFormats: ['eps'],
    defaultOutput: 'pdf',
    accept: '.eps,application/postscript',
    showNativeNotice: true,
    requiredCapability: 'postscriptToPdf',
    outputChoices: [
      { value: 'pdf', label: 'PDF' },
      { value: 'svg', label: 'SVG', capability: 'pdfToSvg' },
      { value: 'eps', label: 'EPS' },
    ],
  },
};

function LocalizedDropzone({
  accept,
  file,
  label,
  buttonText,
  onFile,
}: {
  accept: string;
  file: File | null;
  label: string;
  buttonText: string;
  onFile: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <div
      onDragEnter={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={(e) => {
        if (e.target === e.currentTarget) setDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const next = e.dataTransfer.files[0];
        if (next) onFile(next);
      }}
      className={`rounded-2xl border-2 border-dashed p-6 text-center transition ${
        dragging
          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
          : 'border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-950/40'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => {
          const next = e.target.files?.[0];
          if (next) onFile(next);
          e.target.value = '';
        }}
      />
      <FileUp className="mx-auto size-9 text-indigo-600" aria-hidden="true" />
      <p className="mt-3 break-words font-bold text-[var(--foreground)]">
        {file?.name ?? label}
      </p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-4 min-h-11 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-slate-900 shadow-sm ring-1 ring-slate-300 hover:ring-indigo-500 dark:bg-slate-900 dark:text-white dark:ring-slate-700 transition"
      >
        {buttonText}
      </button>
    </div>
  );
}

function LocalizedCorelDrawHub({
  locale,
  d,
}: {
  locale: Locale;
  d: Dictionary;
}) {
  const ui = d.corelDraw;
  const sections = [
    {
      title: ui.hubSection1Title,
      description: ui.hubSection1Desc,
      slugs: [
        'pdf-to-cdr-converter',
        'word-to-cdr-converter',
        'png-to-cdr-converter',
        'jpg-to-cdr-converter',
        'svg-to-cdr-converter',
        'ai-to-cdr-converter',
        'eps-to-cdr-converter',
      ] as TranslatedTool[],
    },
    {
      title: ui.hubSection2Title,
      description: ui.hubSection2Desc,
      slugs: [
        'cdr-to-pdf-converter',
        'cdr-to-svg-converter',
        'cdr-to-png-converter',
        'cdr-to-jpg-converter',
        'cdr-to-eps-converter',
      ] as TranslatedTool[],
    },
    {
      title: ui.hubSection3Title,
      description: ui.hubSection3Desc,
      slugs: [
        'cdr-viewer',
        'cdr-version-converter',
        'cdr-print-readiness-checker',
      ] as TranslatedTool[],
    },
  ];

  return (
    <div className="min-w-0 space-y-12">
      {/* Overview Banner */}
      <div className="min-w-0 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-6 md:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <Layers className="size-6 text-indigo-600" />
          <h2 className="text-xl md:text-2xl font-black text-[var(--foreground)]">
            {d.tools['coreldraw-tools']?.title ?? 'CorelDRAW Tools & CDR Converters'}
          </h2>
        </div>
        <p className="text-sm md:text-base text-[var(--muted-foreground)] leading-relaxed max-w-4xl">
          {d.tools['coreldraw-tools']?.description ?? ui.hubSubtitle}
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-10">
        {sections.map((section) => (
          <div key={section.title} className="space-y-4">
            <div className="border-b border-[var(--border)] pb-3">
              <h3 className="text-lg md:text-xl font-bold text-[var(--foreground)]">
                {section.title}
              </h3>
              <p className="text-xs md:text-sm text-[var(--muted-foreground)] mt-1">
                {section.description}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {section.slugs.map((slug) => {
                const toolMeta = d.tools[slug];
                const title = toolMeta?.title ?? slug;
                const desc = toolMeta?.description ?? '';
                const icon = getToolIcon(slug);
                const path = localizedPath(locale, slug);

                return (
                  <Link
                    key={slug}
                    href={path}
                    className="group relative flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 hover:border-indigo-500/60 hover:shadow-md transition"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl" aria-hidden="true">
                          {icon}
                        </span>
                        <h4 className="font-bold text-sm md:text-base text-[var(--foreground)] group-hover:text-indigo-600 transition">
                          {title}
                        </h4>
                      </div>
                      <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 leading-relaxed">
                        {desc}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-indigo-600">
                      <span>
                        {locale === 'fr'
                          ? "Ouvrir l'outil"
                          : locale === 'es'
                          ? 'Abrir herramienta'
                          : locale === 'it'
                          ? 'Apri strumento'
                          : locale === 'pt'
                          ? 'Abrir ferramenta'
                          : locale === 'de'
                          ? 'Tool öffnen'
                          : locale === 'ru'
                          ? 'Открыть инструмент'
                          : locale === 'ar'
                          ? 'فتح الأداة'
                          : 'Open tool'}
                      </span>
                      <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Educational Notice */}
      <div className="min-w-0 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-6 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100 space-y-2">
        <div className="flex items-center gap-2 font-black text-base">
          <Info className="size-5 shrink-0 text-amber-600" />
          <span>{ui.nativeNoticeTitle}</span>
        </div>
        <p className="leading-relaxed">
          {ui.nativeNoticeDesc}
        </p>
      </div>
    </div>
  );
}

function LocalizedCdrVersionChecker({
  d,
}: {
  d: Dictionary;
}) {
  const ui = d.corelDraw;
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [info, setInfo] = useState<{
    container: string;
    code: string;
    version: string;
    size: number;
  } | null>(null);

  const choose = async (next: File) => {
    setError('');
    setInfo(null);
    if (!/\.cdr$/i.test(next.name) || !next.size || next.size > CORELDRAW_MAX_UPLOAD_BYTES) {
      setFile(null);
      setError(!/\.cdr$/i.test(next.name) ? ui.errorUnsupported : ui.errorTooLarge);
      return;
    }
    try {
      const bytes = new Uint8Array(await next.slice(0, 64).arrayBuffer());
      const detected = detectCdrVersion(bytes);
      setFile(next);
      setInfo({ ...detected, size: next.size });
    } catch {
      setFile(null);
      setError(ui.errorHeader);
    }
  };

  return (
    <section className="mx-auto max-w-4xl min-w-0 space-y-5 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-5 md:p-8 shadow-sm">
      <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 p-3.5 text-xs md:text-sm text-emerald-800 dark:text-emerald-300">
        <LockKeyhole className="size-4 shrink-0" />
        <span>{ui.localPrivacyNotice}</span>
      </div>

      <LocalizedDropzone
        accept=".cdr,application/vnd.corel-draw"
        file={file}
        label={ui.dropPrompt}
        buttonText={ui.chooseFile}
        onFile={choose}
      />

      {error && (
        <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs md:text-sm font-semibold text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {info && (
        <div aria-live="polite" className="grid gap-3 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-5 sm:grid-cols-2">
          <div className="space-y-0.5">
            <span className="block text-xs font-semibold text-[var(--muted-foreground)]">
              {ui.detectedContainer}
            </span>
            <strong className="text-base text-[var(--foreground)]">{info.container}</strong>
          </div>
          <div className="space-y-0.5">
            <span className="block text-xs font-semibold text-[var(--muted-foreground)]">
              {ui.headerCode}
            </span>
            <strong className="text-base font-mono text-[var(--foreground)]">{info.code}</strong>
          </div>
          <div className="space-y-0.5">
            <span className="block text-xs font-semibold text-[var(--muted-foreground)]">
              {ui.likelyVersion}
            </span>
            <strong className="text-base text-indigo-600 dark:text-indigo-400">{info.version}</strong>
          </div>
          <div className="space-y-0.5">
            <span className="block text-xs font-semibold text-[var(--muted-foreground)]">
              {ui.fileSize}
            </span>
            <strong className="text-base text-[var(--foreground)]">{(info.size / 1024).toFixed(1)} KB</strong>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs md:text-sm leading-relaxed text-amber-900 dark:text-amber-200">
        {ui.versionNotice}
      </div>
    </section>
  );
}

function LocalizedRasterToCorelTool({
  format,
  d,
}: {
  format: 'png' | 'jpg';
  d: Dictionary;
}) {
  const ui = d.corelDraw;
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<'preserve' | 'vectorize'>('preserve');
  const [output, setOutput] = useState<'svg' | 'pdf'>('svg');
  const [detail, setDetail] = useState(2);
  const [colors, setColors] = useState(4);
  const [removeWhite, setRemoveWhite] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ url: string; name: string } | null>(null);

  useEffect(() => () => {
    if (result?.url) URL.revokeObjectURL(result.url);
  }, [result]);

  const choose = (next: File) => {
    setError('');
    setResult(null);
    const expected = format === 'jpg' ? /\.jpe?g$/i : /\.png$/i;
    if (!expected.test(next.name) || !next.type.startsWith('image/')) {
      setFile(null);
      setError(ui.errorUnsupported);
      return;
    }
    if (!next.size || next.size > CORELDRAW_MAX_UPLOAD_BYTES) {
      setFile(null);
      setError(ui.errorTooLarge);
      return;
    }
    setFile(next);
  };

  const convert = async () => {
    if (!file) return;
    setBusy(true);
    setError('');
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);

    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
      if (bitmap.width * bitmap.height > CORELDRAW_MAX_RASTER_PIXELS) {
        bitmap.close();
        throw new Error('TOO_LARGE');
      }

      let blob: Blob;
      if (output === 'pdf') {
        const { PDFDocument } = await import('pdf-lib');
        const pdf = await PDFDocument.create();
        const bytes = await file.arrayBuffer();
        const embedded = format === 'png' ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
        const page = pdf.addPage([bitmap.width, bitmap.height]);
        page.drawImage(embedded, { x: 0, y: 0, width: bitmap.width, height: bitmap.height });
        blob = new Blob([await pdf.save() as BlobPart], { type: 'application/pdf' });
      } else {
        if (mode === 'vectorize') {
          const maxSide = [96, 160, 240][detail - 1];
          const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
          const width = Math.max(1, Math.round(bitmap.width * scale));
          const height = Math.max(1, Math.round(bitmap.height * scale));
          const canvas = new OffscreenCanvas(width, height);
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (!ctx) throw new Error('CANVAS_UNAVAILABLE');
          ctx.drawImage(bitmap, 0, 0, width, height);
          const pixels = ctx.getImageData(0, 0, width, height).data;
          const svg = vectorizeRgbaToSvg(pixels, width, height, {
            colors: colors as 2 | 4 | 8,
            removeWhite,
            outputWidth: bitmap.width,
            outputHeight: bitmap.height,
          });
          blob = new Blob([svg], { type: 'image/svg+xml' });
        } else {
          const reader = new FileReader();
          const dataUrl = await new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = () => reject(new Error('READ_FAILED'));
            reader.readAsDataURL(file);
          });
          const escaped = dataUrl.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
          const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${bitmap.width}" height="${bitmap.height}" viewBox="0 0 ${bitmap.width} ${bitmap.height}"><image width="100%" height="100%" href="${escaped}"/></svg>`;
          blob = new Blob([svg], { type: 'image/svg+xml' });
        }
      }
      bitmap.close();
      setResult({
        url: URL.createObjectURL(blob),
        name: `${file.name.replace(/\.[^.]+$/, '')}-coreldraw-ready.${output}`,
      });
    } catch (cause) {
      setError(cause instanceof Error && cause.message === 'TOO_LARGE' ? ui.errorRasterLarge : ui.errorConversion);
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    if (result?.url) URL.revokeObjectURL(result.url);
    setFile(null);
    setResult(null);
    setError('');
  };

  return (
    <section className="mx-auto max-w-4xl min-w-0 space-y-6 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-5 md:p-8 shadow-sm">
      <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 p-3.5 text-xs md:text-sm text-emerald-800 dark:text-emerald-300">
        <LockKeyhole className="size-4 shrink-0" />
        <span>{ui.localPrivacyNotice}</span>
      </div>

      <LocalizedDropzone
        accept={format === 'jpg' ? '.jpg,.jpeg,image/jpeg' : '.png,image/png'}
        file={file}
        label={ui.dropPrompt}
        buttonText={ui.chooseFile}
        onFile={choose}
      />

      {/* Mode Selection */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-bold text-[var(--foreground)]">
          {ui.conversionMode}
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <label
            className={`rounded-2xl border p-4 cursor-pointer transition ${
              mode === 'preserve'
                ? 'border-indigo-600 bg-indigo-500/5'
                : 'border-[var(--border)] bg-[var(--background)] hover:border-indigo-500/40'
            }`}
          >
            <input
              type="radio"
              checked={mode === 'preserve'}
              onChange={() => setMode('preserve')}
              className="mr-2"
            />
            <span className="font-bold text-sm text-[var(--foreground)]">{ui.preserveRaster}</span>
            <span className="mt-1 block text-xs text-[var(--muted-foreground)] leading-relaxed">
              {ui.preserveHelp}
            </span>
          </label>

          <label
            className={`rounded-2xl border p-4 cursor-pointer transition ${
              mode === 'vectorize'
                ? 'border-indigo-600 bg-indigo-500/5'
                : 'border-[var(--border)] bg-[var(--background)] hover:border-indigo-500/40'
            }`}
          >
            <input
              type="radio"
              checked={mode === 'vectorize'}
              onChange={() => {
                setMode('vectorize');
                setOutput('svg');
              }}
              className="mr-2"
            />
            <span className="font-bold text-sm text-[var(--foreground)]">{ui.vectorize}</span>
            <span className="mt-1 block text-xs text-[var(--muted-foreground)] leading-relaxed">
              {ui.vectorizeHelp}
            </span>
          </label>
        </div>
      </fieldset>

      {/* Controls */}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-xs font-semibold text-[var(--muted-foreground)]">
          {ui.outputFormat}
          <select
            value={output}
            onChange={(e) => setOutput(e.target.value as 'svg' | 'pdf')}
            className="mt-1.5 min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 text-sm font-bold text-[var(--foreground)] focus:border-indigo-500 focus:outline-none"
          >
            <option value="svg">SVG</option>
            {mode === 'preserve' && <option value="pdf">PDF</option>}
          </select>
        </label>

        {mode === 'vectorize' && (
          <>
            <label className="text-xs font-semibold text-[var(--muted-foreground)]">
              {ui.tracingDetail}
              <select
                value={detail}
                onChange={(e) => setDetail(Number(e.target.value))}
                className="mt-1.5 min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 text-sm font-bold text-[var(--foreground)] focus:border-indigo-500 focus:outline-none"
              >
                <option value="1">{ui.detailLow}</option>
                <option value="2">{ui.detailMedium}</option>
                <option value="3">{ui.detailHigh}</option>
              </select>
            </label>

            <label className="text-xs font-semibold text-[var(--muted-foreground)]">
              {ui.colorCount}
              <select
                value={colors}
                onChange={(e) => setColors(Number(e.target.value))}
                className="mt-1.5 min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 text-sm font-bold text-[var(--foreground)] focus:border-indigo-500 focus:outline-none"
              >
                <option value="2">2</option>
                <option value="4">4</option>
                <option value="8">8</option>
              </select>
            </label>

            <label className="flex items-center gap-2 pt-6 text-xs font-bold text-[var(--foreground)] cursor-pointer">
              <input
                type="checkbox"
                checked={removeWhite}
                onChange={(e) => setRemoveWhite(e.target.checked)}
                className="size-4 rounded border-[var(--border)] text-indigo-600 focus:ring-indigo-500"
              />
              <span>{ui.removeBackground}</span>
            </label>
          </>
        )}
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs md:text-sm font-semibold text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {result ? (
        <div aria-live="polite" className="space-y-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
          <p className="font-bold text-sm text-[var(--foreground)]">
            {ui.ready}: <span className="font-mono text-emerald-600 dark:text-emerald-400">{result.name}</span>
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={result.url}
              download={result.name}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 transition"
            >
              <Download className="size-4" />
              <span>{ui.download} {output.toUpperCase()}</span>
            </a>
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm font-bold hover:border-indigo-500 transition"
            >
              <RotateCcw className="size-4" />
              <span>{ui.reset}</span>
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={!file || busy}
          onClick={convert}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {busy && <LoaderCircle className="size-4 animate-spin" />}
          <span>{busy ? ui.converting : ui.convertBtn}</span>
        </button>
      )}
    </section>
  );
}

function LocalizedCorelServerTool({
  slug,
  d,
}: {
  slug: string;
  d: Dictionary;
}) {
  const ui = d.corelDraw;
  const config = SERVER_CONFIGS[slug];
  const [file, setFile] = useState<File | null>(null);
  const [output, setOutput] = useState<CorelOutputFormat>(config?.defaultOutput ?? 'pdf');
  const [quality, setQuality] = useState(90);
  const [resolution, setResolution] = useState(150);
  const [capabilities, setCapabilities] = useState<CorelCapabilities | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ url: string; name: string; noticeCode?: string } | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/coreldraw/capabilities', { signal: controller.signal, cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then(setCapabilities)
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  useEffect(() => () => {
    if (result?.url) URL.revokeObjectURL(result.url);
  }, [result]);

  if (!config) return null;

  const choose = (next: File) => {
    setError('');
    setResult(null);
    const extension = next.name.toLowerCase().split('.').pop() as CorelInputFormat;
    if (!config.inputFormats.includes(extension)) {
      setFile(null);
      setError(ui.errorUnsupported);
      return;
    }
    if (!next.size || next.size > CORELDRAW_MAX_UPLOAD_BYTES) {
      setFile(null);
      setError(ui.errorTooLarge);
      return;
    }
    setFile(next);
  };

  const convert = async () => {
    if (!file) return;
    setBusy(true);
    setError('');
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);

    try {
      const inputFormat = file.name.toLowerCase().split('.').pop() as CorelInputFormat;
      const form = new FormData();
      form.set('file', file);
      form.set('kind', config.kind);
      form.set('inputFormat', inputFormat);
      form.set('output', output);
      form.set('quality', String(quality));
      form.set('resolution', String(resolution));

      const response = await fetch('/api/coreldraw/convert', { method: 'POST', body: form });
      if (!response.ok) {
        if (response.status === 429) throw new Error('RATE_LIMIT');
        if (response.status === 413) throw new Error('TOO_LARGE');
        if (response.status === 503 || response.status === 502) throw new Error('SERVER_UNAVAILABLE');
        throw new Error('CONVERSION_FAILED');
      }

      const blob = await response.blob();
      const disposition = response.headers.get('content-disposition') ?? '';
      const name = disposition.match(/filename="([^"]+)"/)?.[1] ?? `coreldraw-ready.${output}`;
      const noticeCodeHeader = response.headers.get('x-conversion-notice-code') ?? '';
      const legacyNote = response.headers.get('x-conversion-note') ?? '';
      let noticeCode = noticeCodeHeader;
      if (!noticeCode && legacyNote) {
        if (legacyNote.includes('first page only')) noticeCode = 'VECTOR_FIRST_PAGE_ONLY';
        else if (legacyNote.includes('available CDR import backend')) noticeCode = 'PREVIEW_BACKEND_GENERATED';
      }
      setResult({
        url: URL.createObjectURL(blob),
        name,
        noticeCode,
      });
    } catch (cause) {
      const code = cause instanceof Error ? cause.message : '';
      if (code === 'RATE_LIMIT') setError(ui.errorRateLimit);
      else if (code === 'TOO_LARGE') setError(ui.errorTooLarge);
      else if (code === 'SERVER_UNAVAILABLE') setError(ui.errorServer);
      else setError(ui.errorConversion);
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    if (result?.url) URL.revokeObjectURL(result.url);
    setFile(null);
    setResult(null);
    setError('');
  };

  const backendUnavailable = Boolean(
    config.requiredCapability && capabilities?.[config.requiredCapability] === false
  );

  return (
    <section className="mx-auto max-w-4xl min-w-0 space-y-6 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-5 md:p-8 shadow-sm">
      <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 p-3.5 text-xs md:text-sm text-emerald-800 dark:text-emerald-300">
        <LockKeyhole className="size-4 shrink-0" />
        <span>{ui.privacyNotice}</span>
      </div>

      {config.showNativeNotice && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs md:text-sm text-amber-900 dark:text-amber-200 space-y-1">
          <div className="flex items-center gap-2 font-bold">
            <Info className="size-4 text-amber-600" />
            <span>{ui.nativeNoticeTitle}</span>
          </div>
          <p className="leading-relaxed">{ui.nativeNoticeDesc}</p>
        </div>
      )}

      <LocalizedDropzone
        accept={config.accept}
        file={file}
        label={ui.dropPrompt}
        buttonText={ui.chooseFile}
        onFile={choose}
      />

      {/* Output Format and Controls */}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-xs font-semibold text-[var(--muted-foreground)]">
          {ui.outputFormat}
          <select
            value={output}
            onChange={(e) => setOutput(e.target.value as CorelOutputFormat)}
            className="mt-1.5 min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 text-sm font-bold text-[var(--foreground)] focus:border-indigo-500 focus:outline-none"
          >
            {config.outputChoices.map((choice) => (
              <option
                key={choice.value}
                value={choice.value}
                disabled={choice.capability ? capabilities?.[choice.capability] === false : false}
              >
                {choice.label}
              </option>
            ))}
          </select>
        </label>

        {config.rasterControls && (
          <>
            <label className="text-xs font-semibold text-[var(--muted-foreground)]">
              {ui.resolution}: {resolution} DPI
              <input
                type="range"
                min="72"
                max="600"
                step="1"
                value={resolution}
                onChange={(e) => setResolution(Number(e.target.value))}
                className="mt-3 w-full"
              />
            </label>

            {output === 'jpg' && (
              <label className="text-xs font-semibold text-[var(--muted-foreground)]">
                {ui.quality}: {quality}%
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="mt-3 w-full"
                />
              </label>
            )}
          </>
        )}
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs md:text-sm font-semibold text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {result ? (
        <div aria-live="polite" className="space-y-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
          <p className="font-bold text-sm text-[var(--foreground)]">
            {ui.ready}: <span className="font-mono text-emerald-600 dark:text-emerald-400">{result.name}</span>
          </p>
          {result.noticeCode === 'VECTOR_FIRST_PAGE_ONLY' && (
            <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">{ui.noticeVectorFirstPage}</p>
          )}
          {result.noticeCode === 'PREVIEW_BACKEND_GENERATED' && (
            <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">{ui.noticePreviewBackend}</p>
          )}
          {config.viewer && output === 'pdf' && (
            <iframe
              src={result.url}
              title="CDR preview"
              className="h-80 w-full rounded-xl border border-[var(--border)] bg-white"
            />
          )}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={result.url}
              download={result.name}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 transition"
            >
              <Download className="size-4" />
              <span>{ui.download} {output.toUpperCase()}</span>
            </a>
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm font-bold hover:border-indigo-500 transition"
            >
              <RotateCcw className="size-4" />
              <span>{ui.reset}</span>
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={!file || busy || backendUnavailable}
          onClick={convert}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {busy && <LoaderCircle className="size-4 animate-spin" />}
          <span>{busy ? ui.converting : ui.convertBtn}</span>
        </button>
      )}
    </section>
  );
}

export default function LocalizedCorelTools({
  slug,
  dictionary,
  locale,
}: {
  slug: TranslatedTool;
  dictionary: Dictionary;
  locale: Locale;
}) {
  if (slug === 'coreldraw-tools') {
    return <LocalizedCorelDrawHub locale={locale} d={dictionary} />;
  }

  if (slug === 'cdr-version-converter') {
    return <LocalizedCdrVersionChecker d={dictionary} />;
  }

  if (slug === 'png-to-cdr-converter') {
    return <LocalizedRasterToCorelTool format="png" d={dictionary} />;
  }

  if (slug === 'jpg-to-cdr-converter') {
    return <LocalizedRasterToCorelTool format="jpg" d={dictionary} />;
  }

  return <LocalizedCorelServerTool slug={slug} d={dictionary} />;
}
