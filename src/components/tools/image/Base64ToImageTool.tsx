'use client';

import React, { useState, useEffect } from 'react';
import { Download, Copy, Check, RotateCcw, AlertCircle, Image as ImageIcon, ShieldAlert, Sparkles } from 'lucide-react';
import { decodeBase64Image, SupportedImageMime } from '@/lib/image/base64';

const SAMPLE_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAAbElEQVR42u3PMQ2AQBAEwUdICChCCIpQC2pQSZ4dkg1/wswke21NkvQ6r52rP3zXf973+q8EBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQE7B6wB/2v9Y/8Q/sCAAAAAElFTkSuQmCC';

const SAMPLE_SVG =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDUiIGZpbGw9IiM0ZjQ2ZTUiIC8+PHBhdGggZD0iTTMwIDUwbDE1IDE1IDMwLTMwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iOCIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC9zdmc+';

export default function Base64ToImageTool() {
  const [input, setInput] = useState<string>('');
  const [fallbackMime, setFallbackMime] = useState<SupportedImageMime>('image/png');
  const [copied, setCopied] = useState<boolean>(false);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  const decoded = React.useMemo(() => {
    if (!input.trim()) return null;
    return decodeBase64Image(input, { fallbackMime });
  }, [input, fallbackMime]);

  useEffect(() => {
    if (decoded && decoded.success && decoded.dataUrl && decoded.svgIsSafe !== false) {
      const img = new Image();
      img.onload = () => {
        setDimensions({ width: img.naturalWidth || img.width, height: img.naturalHeight || img.height });
      };
      img.onerror = () => {
        setDimensions(null);
      };
      img.src = decoded.dataUrl;
    } else {
      setDimensions(null);
    }
  }, [decoded]);

  const handleCopyDataUrl = async () => {
    if (!decoded?.dataUrl) return;
    try {
      await navigator.clipboard.writeText(decoded.dataUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleDownload = () => {
    if (!decoded || !decoded.success || !decoded.dataUrl) return;
    const a = document.createElement('a');
    a.href = decoded.dataUrl;
    const ext = decoded.mimeType ? decoded.mimeType.split('/')[1].replace('+xml', '') : 'png';
    a.download = `decoded-image.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    setInput('');
    setDimensions(null);
  };

  const formatByteSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label htmlFor="base64-input" className="text-sm font-bold text-[var(--foreground)]">
            Base64 String or Data URL
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--muted-foreground)]">Load Sample:</span>
            <button
              type="button"
              onClick={() => setInput(SAMPLE_PNG)}
              className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 text-xs font-semibold hover:bg-[var(--accent)] transition-colors"
            >
              <Sparkles className="size-3 text-indigo-500" />
              PNG
            </button>
            <button
              type="button"
              onClick={() => setInput(SAMPLE_SVG)}
              className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 text-xs font-semibold hover:bg-[var(--accent)] transition-colors"
            >
              <Sparkles className="size-3 text-indigo-500" />
              SVG
            </button>
          </div>
        </div>

        <textarea
          id="base64-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste raw Base64 string or Data URL (e.g. data:image/png;base64,iVBORw...)"
          rows={6}
          className="w-full font-mono text-xs p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-[var(--muted-foreground)]"
        />

        {/* Fallback MIME Selector if raw Base64 without data: prefix */}
        {input.trim() && !input.trim().startsWith('data:') && (
          <div className="flex items-center gap-3 text-xs">
            <span className="text-[var(--muted-foreground)]">MIME Format (if auto-sniff fails):</span>
            <select
              value={fallbackMime}
              onChange={(e) => setFallbackMime(e.target.value as SupportedImageMime)}
              className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-2 py-1 text-xs font-medium focus:ring-2 focus:ring-indigo-500"
            >
              <option value="image/png">image/png</option>
              <option value="image/jpeg">image/jpeg</option>
              <option value="image/webp">image/webp</option>
              <option value="image/gif">image/gif</option>
              <option value="image/svg+xml">image/svg+xml</option>
            </select>
          </div>
        )}
      </div>

      {/* Error state */}
      {decoded && !decoded.success && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-50/50 p-4 text-sm text-rose-700 dark:bg-rose-950/20 dark:text-rose-400">
          <AlertCircle className="size-5 shrink-0 mt-0.5" />
          <p>{decoded.error}</p>
        </div>
      )}

      {/* Security Warning */}
      {decoded && decoded.success && decoded.securityNotice && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-50/50 p-4 text-sm text-amber-700 dark:bg-amber-950/20 dark:text-amber-400">
          <ShieldAlert className="size-5 shrink-0 mt-0.5" />
          <p>{decoded.securityNotice}</p>
        </div>
      )}

      {/* Decoded Result */}
      {decoded && decoded.success && (
        <div className="space-y-6">
          {/* Metadata Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm">
            <div>
              <span className="text-xs text-[var(--muted-foreground)] block">Detected Format</span>
              <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                {decoded.mimeType}
              </span>
            </div>
            <div>
              <span className="text-xs text-[var(--muted-foreground)] block">Decoded File Size</span>
              <span className="font-medium">{formatByteSize(decoded.byteSize || 0)}</span>
            </div>
            <div>
              <span className="text-xs text-[var(--muted-foreground)] block">Dimensions</span>
              <span className="font-medium">
                {dimensions ? `${dimensions.width} × ${dimensions.height} px` : 'Vector / Loading'}
              </span>
            </div>
            <div>
              <span className="text-xs text-[var(--muted-foreground)] block">Payload Length</span>
              <span className="font-medium">{decoded.rawBase64?.length.toLocaleString()} chars</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
              >
                <Download className="size-3.5" />
                Download Decoded Image
              </button>

              <button
                type="button"
                onClick={handleCopyDataUrl}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--accent)] transition-colors"
              >
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                {copied ? 'Copied Data URL' : 'Copy Data URL'}
              </button>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-semibold text-[var(--muted-foreground)] hover:text-rose-600 transition-colors"
            >
              <RotateCcw className="size-3.5" />
              Clear
            </button>
          </div>

          {/* Preview Panel */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
            <h2 className="text-sm font-bold text-[var(--foreground)] mb-4">Decoded Image Preview</h2>
            <div className="flex items-center justify-center p-6 rounded-xl border border-dashed border-[var(--border)] bg-[var(--background)] min-h-[260px]">
              {decoded.svgIsSafe === false ? (
                <div className="text-center text-sm text-[var(--muted-foreground)] max-w-md">
                  <ShieldAlert className="size-12 text-amber-500 mx-auto mb-2" />
                  <p className="font-semibold text-[var(--foreground)]">Direct Rendering Restricted</p>
                  <p className="mt-1 text-xs">
                    This SVG file contains active scripts or entity definitions. To prevent script execution, interactive display is disabled. You may still safely download the file using the button above.
                  </p>
                </div>
              ) : decoded.dataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={decoded.dataUrl}
                  alt="Decoded Base64 image preview"
                  className="max-h-96 max-w-full rounded object-contain shadow-sm"
                />
              ) : (
                <ImageIcon className="size-12 text-[var(--muted-foreground)] opacity-40" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
