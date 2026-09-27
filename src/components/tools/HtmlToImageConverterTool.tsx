'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Code2,
  Copy,
  Download,
  FileCode,
  ImageIcon,
  Info,
  Loader2,
  Maximize2,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Sliders,
  Sparkles,
  Upload,
  X,
} from 'lucide-react';
import {
  convertHtmlToImage,
  HTML_SAMPLES,
  type HtmlImageFormat,
  type HtmlSample,
  sanitizeHtml,
  validateHtmlInput,
} from '@/lib/image/html-to-image';

interface Props {
  title: string;
  description: string;
  defaultFormat?: HtmlImageFormat;
  fixedFormat?: HtmlImageFormat;
  currentSlug: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function HtmlToImageConverterTool({
  title,
  description,
  defaultFormat = 'png',
  fixedFormat,
  currentSlug,
}: Props) {
  const [activeTab, setActiveTab] = useState<'editor' | 'upload'>('editor');
  const [htmlInput, setHtmlInput] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Settings
  const [selectedFormat, setSelectedFormat] = useState<HtmlImageFormat>(fixedFormat ?? defaultFormat);
  const [widthPreset, setWidthPreset] = useState<'800' | '1200' | 'custom'>('800');
  const [customWidth, setCustomWidth] = useState<number>(800);
  const [scale, setScale] = useState<1 | 2>(1);
  const [jpgQuality, setJpgQuality] = useState<number>(0.92);

  // Conversion state
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultMetadata, setResultMetadata] = useState<{
    width: number;
    height: number;
    sizeBytes: number;
    format: HtmlImageFormat;
  } | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewIframeRef = useRef<HTMLIFrameElement>(null);
  const textareaId = useId();

  // Effective render width
  const renderWidth = useMemo(() => {
    if (widthPreset === '800') return 800;
    if (widthPreset === '1200') return 1200;
    return Math.max(200, Math.min(customWidth || 800, 3840));
  }, [widthPreset, customWidth]);

  // Clean and sanitize input
  const { cleanHtml, warnings, hasScripts, hasEventHandlers, hasExternalImages } = useMemo(() => {
    if (!htmlInput.trim()) {
      return { cleanHtml: '', warnings: [], hasScripts: false, hasEventHandlers: false, hasExternalImages: false };
    }
    return sanitizeHtml(htmlInput);
  }, [htmlInput]);

  // Update preview iframe content whenever clean HTML or render width changes
  useEffect(() => {
    const iframe = previewIframeRef.current;
    if (!iframe) return;

    if (!cleanHtml.trim()) {
      iframe.srcdoc = `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>body{margin:0;padding:40px;font-family:system-ui,sans-serif;color:#94a3b8;text-align:center;font-size:14px;background:#f8fafc;}</style></head><body><p>Enter HTML markup or load a sample to preview here.</p></body></html>`;
      return;
    }

    const docContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=${renderWidth}"/>
  <meta http-equiv="Content-Security-Policy" content="default-src 'self' data: blob:; script-src 'none'; style-src 'unsafe-inline' 'self';">
  <style>
    html, body {
      margin: 0;
      padding: 0;
      width: ${renderWidth}px;
      box-sizing: border-box;
      background: transparent;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
  </style>
</head>
<body>
  ${cleanHtml}
</body>
</html>`;

    iframe.srcdoc = docContent;
  }, [cleanHtml, renderWidth]);

  // Revoke previous result object URL on unmount or new conversion
  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

  const handleClear = () => {
    setHtmlInput('');
    setUploadedFile(null);
    setErrorMessage(null);
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
      setResultUrl(null);
      setResultMetadata(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLoadSample = (sample: HtmlSample) => {
    setHtmlInput(sample.html);
    setActiveTab('editor');
    setErrorMessage(null);
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
      setResultUrl(null);
      setResultMetadata(null);
    }
  };

  const handleFileUpload = (file: File) => {
    setErrorMessage(null);
    const validExtensions = ['.html', '.htm'];
    const lowerName = file.name.toLowerCase();
    const hasValidExt = validExtensions.some((ext) => lowerName.endsWith(ext));

    if (!hasValidExt && file.type !== 'text/html' && file.type !== 'text/plain') {
      setErrorMessage('Please select a valid HTML file (.html or .htm).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage('The file is larger than 2 MB. Please upload a smaller HTML file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (typeof content === 'string') {
        setUploadedFile(file);
        setHtmlInput(content);
        if (resultUrl) {
          URL.revokeObjectURL(resultUrl);
          setResultUrl(null);
          setResultMetadata(null);
        }
      }
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read the selected file. Please try again.');
    };
    reader.readAsText(file);
  };

  const handleConvert = async () => {
    const validation = validateHtmlInput(htmlInput);
    if (!validation.isValid) {
      setErrorMessage(validation.error || 'Please provide valid HTML markup to convert.');
      return;
    }

    setIsConverting(true);
    setErrorMessage(null);

    try {
      const activeFormat = fixedFormat ?? selectedFormat;
      const res = await convertHtmlToImage(htmlInput, {
        format: activeFormat,
        width: renderWidth,
        scale,
        quality: jpgQuality,
        backgroundColor: activeFormat === 'jpeg' ? '#ffffff' : undefined,
      });

      if (resultUrl) {
        URL.revokeObjectURL(resultUrl);
      }

      setResultUrl(res.url);
      setResultMetadata({
        width: res.width,
        height: res.height,
        sizeBytes: res.sizeBytes,
        format: res.format,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred during conversion.';
      setErrorMessage(msg);
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl || !resultMetadata) return;
    const ext = resultMetadata.format === 'jpeg' ? 'jpg' : 'png';
    const baseName = uploadedFile ? uploadedFile.name.replace(/\.[^.]+$/, '') : 'html-render';
    const downloadName = `${baseName}.${ext}`;

    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyCode = async () => {
    if (!htmlInput) return;
    try {
      await navigator.clipboard.writeText(htmlInput);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Navigation & Header */}
      <Link
        href="/categories/image-tools"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Image Tools
      </Link>

      <div className="text-center mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
          <ShieldCheck className="h-4 w-4" /> 100% Browser-Local Processing
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white sm:text-4xl md:text-5xl tracking-tight">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-400">
          {description}
        </p>
      </div>

      {/* Cluster Navigation Pill Selector */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
        <Link
          href="/tools/html-to-image"
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition ${
            currentSlug === 'html-to-image'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          HTML to Image (Pillar)
        </Link>
        <Link
          href="/tools/html-to-jpg-converter"
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition ${
            currentSlug === 'html-to-jpg-converter'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          HTML to JPG Converter
        </Link>
        <Link
          href="/tools/html-to-png-converter"
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition ${
            currentSlug === 'html-to-png-converter'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          HTML to PNG Converter
        </Link>
      </div>

      {/* Main Studio Card */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden mb-12">
        {/* Top Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'editor'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs border border-slate-200 dark:border-slate-700'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Code2 className="h-3.5 w-3.5" /> Paste / Edit HTML
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'upload'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs border border-slate-200 dark:border-slate-700'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Upload className="h-3.5 w-3.5" /> Upload File (.html)
            </button>
          </div>

          {/* Quick Samples */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-amber-500" /> Samples:
            </span>
            {HTML_SAMPLES.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleLoadSample(sample)}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-200/70 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
              >
                {sample.name}
              </button>
            ))}
            {htmlInput && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear HTML input"
                className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition ml-1"
                title="Clear input"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6">
          {activeTab === 'editor' ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor={textareaId} className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  HTML Markup
                </label>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>{htmlInput.length.toLocaleString()} characters</span>
                  {htmlInput && (
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition"
                    >
                      {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedCode ? 'Copied' : 'Copy'}
                    </button>
                  )}
                </div>
              </div>
              <textarea
                id={textareaId}
                rows={9}
                value={htmlInput}
                onChange={(e) => {
                  setHtmlInput(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Paste or write raw HTML markup here... (e.g. <div style='padding:20px;background:#f0f4f8;'><h1>Hello World</h1></div>)"
                className="w-full font-mono text-xs sm:text-sm p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition leading-relaxed resize-y"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".html,.htm,text/html"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                className="hidden"
              />
              {!uploadedFile ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  className="w-full border-2 border-dashed border-indigo-200 dark:border-indigo-900/50 hover:border-indigo-400 dark:hover:border-indigo-700 rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition group"
                >
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 rounded-2xl mb-3 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                    <FileCode className="h-8 w-8" />
                  </div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Click to browse or drop an HTML file
                  </p>
                  <p className="text-xs text-slate-500">Supports .html and .htm files up to 2 MB</p>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                      <FileCode className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">{uploadedFile.name}</p>
                      <p className="text-xs text-slate-500">{formatBytes(uploadedFile.size)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={handleClear}
                      aria-label="Remove uploaded HTML file"
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sanitization / Security Warnings */}
          {(hasScripts || hasEventHandlers || hasExternalImages) && (
            <div className="mt-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Security Notice: Dynamic features sanitized</span>
              </div>
              <ul className="list-disc pl-5 space-y-1">
                {warnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2">
              <X className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Conversion Configuration Settings */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Format Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Output Format
              </label>
              {fixedFormat ? (
                <div className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold text-xs uppercase flex items-center justify-between">
                  <span>{fixedFormat.toUpperCase()}</span>
                  <span className="text-[10px] font-semibold text-slate-400">Fixed</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setSelectedFormat('png')}
                    className={`py-1.5 text-xs font-bold rounded-lg transition ${
                      selectedFormat === 'png'
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    PNG
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedFormat('jpeg')}
                    className={`py-1.5 text-xs font-bold rounded-lg transition ${
                      selectedFormat === 'jpeg'
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    JPG
                  </button>
                </div>
              )}
            </div>

            {/* Width Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Viewport Width
              </label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setWidthPreset('800')}
                  className={`py-1.5 text-xs font-bold rounded-lg transition ${
                    widthPreset === '800'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  800 px
                </button>
                <button
                  type="button"
                  onClick={() => setWidthPreset('1200')}
                  className={`py-1.5 text-xs font-bold rounded-lg transition ${
                    widthPreset === '1200'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  1200 px
                </button>
                <button
                  type="button"
                  onClick={() => setWidthPreset('custom')}
                  className={`py-1.5 text-xs font-bold rounded-lg transition ${
                    widthPreset === 'custom'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Custom
                </button>
              </div>
              {widthPreset === 'custom' && (
                <input
                  type="number"
                  min={200}
                  max={3840}
                  step={10}
                  value={customWidth}
                  onChange={(e) => setCustomWidth(Number(e.target.value))}
                  placeholder="Width (px)"
                  className="mt-2 w-full px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                />
              )}
            </div>

            {/* Resolution Scale */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Scale / Resolution
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setScale(1)}
                  className={`py-1.5 text-xs font-bold rounded-lg transition ${
                    scale === 1
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  1× Standard
                </button>
                <button
                  type="button"
                  onClick={() => setScale(2)}
                  className={`py-1.5 text-xs font-bold rounded-lg transition ${
                    scale === 2
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  2× Retina
                </button>
              </div>
            </div>

            {/* JPEG Quality Slider (Visible when format is JPEG) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                {(fixedFormat ?? selectedFormat) === 'jpeg'
                  ? `JPG Quality: ${Math.round(jpgQuality * 100)}%`
                  : 'PNG Alpha'}
              </label>
              {(fixedFormat ?? selectedFormat) === 'jpeg' ? (
                <div className="space-y-1">
                  <input
                    type="range"
                    min={0.5}
                    max={1.0}
                    step={0.01}
                    value={jpgQuality}
                    onChange={(e) => setJpgQuality(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>50%</span>
                    <span>92% (Default)</span>
                    <span>100%</span>
                  </div>
                </div>
              ) : (
                <div className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>Preserves alpha transparency</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6">
            <button
              type="button"
              onClick={handleConvert}
              disabled={isConverting || !htmlInput.trim()}
              className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 disabled:pointer-events-none text-white font-extrabold text-base shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2.5 transition transform active:scale-[0.99]"
            >
              {isConverting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Rendering HTML to {(fixedFormat ?? selectedFormat).toUpperCase()}...</span>
                </>
              ) : (
                <>
                  <ImageIcon className="h-5 w-5" />
                  <span>Convert to {(fixedFormat ?? selectedFormat).toUpperCase()}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Sandboxed Preview Section */}
        <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Sandboxed HTML Preview</span>
              <span className="text-[11px] font-semibold text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                Width: {renderWidth}px
              </span>
            </div>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-500" /> Isolated sandbox
            </span>
          </div>

          <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-inner flex justify-center p-4">
            <iframe
              ref={previewIframeRef}
              title="Sandboxed HTML Preview"
              sandbox="allow-same-origin"
              style={{ width: `${renderWidth}px`, minHeight: '260px' }}
              className="border-none rounded-xl bg-white shadow-xs max-w-full transition-all"
            />
          </div>
        </div>
      </div>

      {/* Result Section (Displays when image is converted) */}
      {resultUrl && resultMetadata && (
        <section
          aria-labelledby="conversion-result-heading"
          className="rounded-3xl border-2 border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 p-6 sm:p-8 mb-12 shadow-xl animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-black uppercase tracking-wider mb-2">
                <Check className="h-3.5 w-3.5" /> Conversion Complete
              </span>
              <h2 id="conversion-result-heading" className="text-2xl font-black text-slate-900 dark:text-white">
                Rendered Image Result
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition"
              >
                <Download className="h-4 w-4" /> Download {resultMetadata.format.toUpperCase()}
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-3 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm transition"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Result Metadata Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Dimensions</span>
              <p className="text-lg font-black text-slate-900 dark:text-slate-100">
                {resultMetadata.width} × {resultMetadata.height} <span className="text-xs font-normal text-slate-400">px</span>
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">File Size</span>
              <p className="text-lg font-black text-slate-900 dark:text-slate-100">
                {formatBytes(resultMetadata.sizeBytes)}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Format</span>
              <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 uppercase">
                {resultMetadata.format}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Scale Factor</span>
              <p className="text-lg font-black text-slate-900 dark:text-slate-100">
                {scale}× {scale === 2 ? '(HiDPI)' : ''}
              </p>
            </div>
          </div>

          {/* Converted Image Preview */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 flex items-center justify-center overflow-x-auto">
            <img
              src={resultUrl}
              alt={`Rendered HTML output in ${resultMetadata.format.toUpperCase()} format`}
              className="max-h-[600px] w-auto max-w-full object-contain rounded-lg shadow-sm"
            />
          </div>
        </section>
      )}

      {/* Technical Honesty & Limitations Section */}
      <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-3">
          <Info className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Technical Boundaries & Privacy Guarantee</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          <div className="space-y-2">
            <p>
              <strong className="text-slate-900 dark:text-slate-200">100% Browser-Local:</strong> Your HTML markup, text, and uploaded documents are parsed and rasterized exclusively in your browser’s local memory using SVG ForeignObject and HTML5 Canvas. No content is uploaded to Navorika servers.
            </p>
            <p>
              <strong className="text-slate-900 dark:text-slate-200">JavaScript Execution Disabled:</strong> For safety and determinism, &lt;script&gt; tags and inline event handlers (such as onclick, onerror) are stripped and blocked. Client-side frameworks requiring runtime hydration (e.g. React/Vue apps) will only render their initial static HTML state.
            </p>
          </div>
          <div className="space-y-2">
            <p>
              <strong className="text-slate-900 dark:text-slate-200">Cross-Origin & Webfont Restrictions:</strong> Canvas security policies block cross-origin subresources unless permissive CORS headers are served. For best results, use embedded Base64 data URLs (&lt;img src="data:image/..."&gt;) and system font stacks.
            </p>
            <p>
              <strong className="text-slate-900 dark:text-slate-200">Format Selection:</strong> PNG preserves alpha channel transparency and offers pixel-crisp vector typography; JPG flattens transparent areas onto a clean white background with adjustable lossy compression.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
