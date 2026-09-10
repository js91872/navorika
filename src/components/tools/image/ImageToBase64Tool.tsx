'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, Copy, Check, Download, RotateCcw, AlertCircle, FileText, Image as ImageIcon } from 'lucide-react';
import {
  encodeBytesToBase64,
  inferImageMimeType,
  isSvgContent,
  inspectSvgSecurity,
  wrapBase64,
} from '@/lib/image/base64';

export default function ImageToBase64Tool() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [mode, setMode] = useState<'data-url' | 'base64-only'>('data-url');
  const [lineWrap, setLineWrap] = useState<boolean>(false);
  const [rawBase64, setRawBase64] = useState<string>('');
  const [dataUrl, setDataUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [securityNotice, setSecurityNotice] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const cleanup = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  }, [previewUrl]);

  const handleReset = () => {
    cleanup();
    setFile(null);
    setPreviewUrl(null);
    setDimensions(null);
    setRawBase64('');
    setDataUrl('');
    setError(null);
    setSecurityNotice(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processFile = async (selectedFile: File) => {
    setError(null);
    setSecurityNotice(null);
    setIsProcessing(true);

    // 25 MB size safeguard
    const MAX_SIZE = 25 * 1024 * 1024;
    if (selectedFile.size > MAX_SIZE) {
      setError('File is too large. Please select an image under 25 MB.');
      setIsProcessing(false);
      return;
    }

    try {
      const mime = inferImageMimeType(selectedFile.name, selectedFile.type);
      const buffer = await selectedFile.arrayBuffer();
      const u8 = new Uint8Array(buffer);

      // SVG safety check if applicable
      if (mime === 'image/svg+xml' || isSvgContent(u8)) {
        const text = new TextDecoder().decode(u8);
        const security = inspectSvgSecurity(text);
        if (!security.isSafe) {
          setSecurityNotice(`Notice: SVG contains active scripts or external tags (${security.reasons[0]}). Direct preview is restricted.`);
        }
      }

      const { base64, dataUrl: fullDataUrl } = encodeBytesToBase64(u8, mime);
      setRawBase64(base64);
      setDataUrl(fullDataUrl);
      setFile(selectedFile);

      // Create preview object URL and read intrinsic dimensions
      const objUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objUrl);

      const img = new Image();
      img.onload = () => {
        setDimensions({ width: img.naturalWidth || img.width, height: img.naturalHeight || img.height });
      };
      img.onerror = () => {
        setDimensions(null);
      };
      img.src = objUrl;
    } catch (err) {
      setError(`Failed to encode image: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) processFile(f);
  };

  const activeOutput = mode === 'data-url' ? dataUrl : rawBase64;
  const displayedOutput = lineWrap ? wrapBase64(activeOutput, 76) : activeOutput;

  const handleCopy = async () => {
    if (!displayedOutput) return;
    try {
      await navigator.clipboard.writeText(displayedOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Unable to copy to clipboard directly.');
    }
  };

  const handleDownloadTxt = () => {
    if (!displayedOutput || !file) return;
    const blob = new Blob([displayedOutput], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name.replace(/\.[^/.]+$/, '')}-base64.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-8">
      {/* Upload Box */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className="group relative cursor-pointer rounded-2xl border-2 border-dashed border-[var(--border)] p-8 text-center transition-colors hover:border-indigo-500 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
          onChange={onFileInputChange}
          className="hidden"
          aria-label="Upload image to convert to Base64"
        />
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="rounded-full bg-indigo-50 p-4 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <Upload className="size-8" />
          </div>
          <div>
            <p className="text-base font-semibold">
              {file ? 'Click or drag another image to replace' : 'Click to select or drag & drop an image'}
            </p>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              Supports JPG, PNG, WebP, GIF, and SVG (up to 25 MB)
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-50/50 p-4 text-sm text-rose-700 dark:bg-rose-950/20 dark:text-rose-400">
          <AlertCircle className="size-5 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {securityNotice && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-50/50 p-4 text-sm text-amber-700 dark:bg-amber-950/20 dark:text-amber-400">
          <AlertCircle className="size-5 shrink-0 mt-0.5" />
          <p>{securityNotice}</p>
        </div>
      )}

      {/* Processed Metadata & Output */}
      {file && displayedOutput && (
        <div className="space-y-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm">
            <div>
              <span className="text-xs text-[var(--muted-foreground)] block">File Name</span>
              <span className="font-medium truncate block" title={file.name}>{file.name}</span>
            </div>
            <div>
              <span className="text-xs text-[var(--muted-foreground)] block">MIME Type</span>
              <span className="font-mono text-xs font-medium">{file.type || 'image/jpeg'}</span>
            </div>
            <div>
              <span className="text-xs text-[var(--muted-foreground)] block">Original Size</span>
              <span className="font-medium">{formatFileSize(file.size)}</span>
            </div>
            <div>
              <span className="text-xs text-[var(--muted-foreground)] block">Dimensions</span>
              <span className="font-medium">{dimensions ? `${dimensions.width} × ${dimensions.height} px` : 'Vector / N/A'}</span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Format</span>
              <div className="inline-flex rounded-lg border border-[var(--border)] p-0.5 bg-[var(--card)]">
                <button
                  type="button"
                  onClick={() => setMode('data-url')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    mode === 'data-url'
                      ? 'bg-indigo-600 text-white'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                  }`}
                >
                  Data URL
                </button>
                <button
                  type="button"
                  onClick={() => setMode('base64-only')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    mode === 'base64-only'
                      ? 'bg-indigo-600 text-white'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                  }`}
                >
                  Base64 Only
                </button>
              </div>

              <label className="flex items-center gap-2 text-xs font-medium text-[var(--muted-foreground)] cursor-pointer ml-2">
                <input
                  type="checkbox"
                  checked={lineWrap}
                  onChange={(e) => setLineWrap(e.target.checked)}
                  className="rounded border-[var(--border)] text-indigo-600 focus:ring-indigo-500"
                />
                Line-wrap (76 chars)
              </label>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
              >
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>

              <button
                type="button"
                onClick={handleDownloadTxt}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors"
              >
                <Download className="size-3.5" />
                Download .txt
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-semibold text-[var(--muted-foreground)] hover:text-rose-600 transition-colors"
                title="Reset"
              >
                <RotateCcw className="size-3.5" />
                Clear
              </button>
            </div>
          </div>

          {/* Output Display & Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-2">
              <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                <span>Base64 String ({displayedOutput.length.toLocaleString()} characters)</span>
              </div>
              <textarea
                value={displayedOutput}
                readOnly
                rows={12}
                className="w-full font-mono text-xs p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Thumbnail Preview */}
            <div className="space-y-2">
              <span className="text-xs text-[var(--muted-foreground)] block">Source Preview</span>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 flex flex-col items-center justify-center min-h-[220px]">
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt="Uploaded source preview"
                    className="max-h-48 max-w-full rounded object-contain"
                  />
                ) : (
                  <ImageIcon className="size-10 text-[var(--muted-foreground)] opacity-40" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
