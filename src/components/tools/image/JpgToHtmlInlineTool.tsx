'use client';

import { useRef, useState } from 'react';
import {
  AlertCircle,
  Check,
  Copy,
  Download,
  FileCode2,
  ImageIcon,
  RotateCcw,
  ShieldCheck,
  Upload,
} from 'lucide-react';

import { encodeBytesToBase64 } from '@/lib/image/base64';

const MAX_FILE_SIZE = 25 * 1024 * 1024;

function safeName(filename: string): string {
  return (
    filename
      .replace(/\.[^.]+$/, '')
      .replace(/[^a-zA-Z0-9-_]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'image'
  );
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

export default function JpgToHtmlInlineTool() {
  const fileRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [altText, setAltText] = useState('');
  const [responsive, setResponsive] = useState(true);
  const [fullDocument, setFullDocument] = useState(true);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [processing, setProcessing] = useState(false);

  async function buildHtml(
    selectedFile: File,
    alt: string,
    responsiveMode: boolean,
    documentMode: boolean,
  ) {
    setProcessing(true);
    setError(null);

    try {
      const filename = selectedFile.name.toLowerCase();

      if (
        selectedFile.type !== 'image/jpeg' &&
        !filename.endsWith('.jpg') &&
        !filename.endsWith('.jpeg')
      ) {
        throw new Error('Please upload a JPG or JPEG image.');
      }

      if (selectedFile.size > MAX_FILE_SIZE) {
        throw new Error('Maximum supported JPG size is 25 MB.');
      }

      const buffer = await selectedFile.arrayBuffer();

      const { dataUrl } = encodeBytesToBase64(
        new Uint8Array(buffer),
        'image/jpeg',
      );

      const safeAlt = escapeHtml(
        alt.trim() || safeName(selectedFile.name),
      );

      const style = responsiveMode
        ? ' style="max-width:100%;height:auto;display:block;"'
        : '';

      const imageTag =
        `<img src="${dataUrl}" alt="${safeAlt}"${style}>`;

      if (!documentMode) {
        setOutput(imageTag);
        return;
      }

      setOutput(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${safeAlt}</title>
  <style>
    html, body {
      margin: 0;
      padding: 0;
    }

    body {
      padding: 24px;
      background: #ffffff;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    img {
      margin-left: auto;
      margin-right: auto;
    }
  </style>
</head>
<body>
  ${imageTag}
</body>
</html>`);
    } catch (err) {
      setOutput('');
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to generate HTML.',
      );
    } finally {
      setProcessing(false);
    }
  }

  async function selectFile(selectedFile: File) {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const url = URL.createObjectURL(selectedFile);
    const generatedAlt = safeName(selectedFile.name);

    setFile(selectedFile);
    setPreviewUrl(url);
    setAltText(generatedAlt);

    await buildHtml(
      selectedFile,
      generatedAlt,
      responsive,
      fullDocument,
    );
  }

  function reset() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setFile(null);
    setPreviewUrl(null);
    setOutput('');
    setAltText('');
    setError(null);
    setCopied(false);

    if (fileRef.current) {
      fileRef.current.value = '';
    }
  }

  async function copyOutput() {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setError('Clipboard access is unavailable.');
    }
  }

  function downloadHtml() {
    if (!output || !file) return;

    const blob = new Blob(
      [output],
      { type: 'text/html;charset=utf-8' },
    );

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = `${safeName(file.name)}.html`;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/50 p-4 dark:bg-emerald-950/20">
        <div className="flex gap-3">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-600" />

          <div>
            <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
              Browser-local JPG to HTML conversion
            </p>

            <p className="mt-1 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
              Your JPG is encoded directly in your browser and embedded
              into the generated HTML. It is not uploaded to Navorika servers.
            </p>
          </div>
        </div>
      </div>

      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          const selected = event.dataTransfer.files?.[0];
          if (selected) void selectFile(selected);
        }}
        className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center transition hover:border-indigo-500 dark:border-slate-700"
      >
        <input
          ref={fileRef}
          type="file"
          accept=".jpg,.jpeg,image/jpeg"
          className="hidden"
          aria-label="Upload JPG image"
          onChange={(event) => {
            const selected = event.target.files?.[0];
            if (selected) void selectFile(selected);
          }}
        />

        <div className="flex flex-col items-center gap-3">
          <div className="rounded-2xl bg-indigo-50 p-4 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            <Upload className="size-8" />
          </div>

          <div>
            <p className="font-bold">Upload JPG or JPEG</p>
            <p className="mt-1 text-xs text-slate-500">
              Drag and drop or click to browse · maximum 25 MB
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/20 dark:text-rose-300">
          <AlertCircle className="size-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {file && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="mb-3 flex items-center gap-2">
                <ImageIcon className="size-4 text-indigo-600" />
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  JPG Preview
                </span>
              </div>

              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Uploaded JPG preview"
                  className="max-h-[420px] w-full rounded-xl object-contain"
                />
              )}
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <div>
                <label
                  htmlFor="jpg-html-alt"
                  className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500"
                >
                  Image alt text
                </label>

                <input
                  id="jpg-html-alt"
                  value={altText}
                  onChange={(event) => setAltText(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                />
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={responsive}
                  onChange={(event) => setResponsive(event.target.checked)}
                />
                Responsive image
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={fullDocument}
                  onChange={(event) => setFullDocument(event.target.checked)}
                />
                Complete HTML document
              </label>

              <button
                type="button"
                disabled={processing}
                onClick={() =>
                  void buildHtml(
                    file,
                    altText,
                    responsive,
                    fullDocument,
                  )
                }
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {processing ? 'Generating…' : 'Generate HTML'}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold">Generated HTML</p>
                <p className="text-xs text-slate-500">
                  Self-contained HTML with embedded Base64 JPG
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={!output}
                  onClick={() => void copyOutput()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold dark:border-slate-700"
                >
                  {copied ? (
                    <Check className="size-4" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                  {copied ? 'Copied' : 'Copy'}
                </button>

                <button
                  type="button"
                  disabled={!output}
                  onClick={downloadHtml}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white"
                >
                  <Download className="size-4" />
                  Download HTML
                </button>

                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold dark:border-slate-700"
                >
                  <RotateCcw className="size-4" />
                  Reset
                </button>
              </div>
            </div>

            <textarea
              value={output}
              readOnly
              rows={24}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs dark:border-slate-800 dark:bg-slate-950"
            />

            <div className="flex gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-xs leading-relaxed text-blue-800 dark:border-blue-900 dark:bg-blue-950/20 dark:text-blue-300">
              <FileCode2 className="size-5 shrink-0" />

              <p>
                This mode embeds the JPG inside HTML. It does not use OCR
                or AI to recreate editable text, buttons, CSS, forms, or
                webpage structure from screenshot pixels.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
