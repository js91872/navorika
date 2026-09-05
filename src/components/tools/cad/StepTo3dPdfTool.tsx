'use client';

import { useState, useEffect, useRef } from 'react';
import { UploadCloud, FileText, Download, RotateCcw, LoaderCircle, CheckCircle2, Box } from 'lucide-react';
import {
  CadPrivacyNotice,
  CadViewerNotice,
  CadBackendUnavailableNotice,
  CadErrorNotice,
} from './CadNotices';
import type { StepCapabilities } from '@/lib/converters/step-3dpdf/types';

interface ConversionResult {
  url: string;
  name: string;
  sizeBytes: number;
  solids?: string;
  faces?: string;
  triangles?: string;
}

export default function StepTo3dPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [capabilities, setCapabilities] = useState<StepCapabilities | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'generating' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState<ConversionResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/step-to-3d-pdf/capabilities', {
      signal: controller.signal,
      cache: 'no-store',
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: StepCapabilities | null) => setCapabilities(data))
      .catch(() => undefined);

    return () => controller.abort();
  }, []);

  useEffect(() => {
    return () => {
      if (result?.url) {
        URL.revokeObjectURL(result.url);
      }
    };
  }, [result]);

  const validateAndSelectFile = (candidate: File) => {
    setErrorMsg('');
    setResult(null);

    const ext = candidate.name.toLowerCase().split('.').pop();
    if (ext !== 'step' && ext !== 'stp') {
      setErrorMsg('Please select a valid CAD file with a .step or .stp extension.');
      return;
    }

    if (candidate.size === 0) {
      setErrorMsg('The selected file is empty.');
      return;
    }

    const maxBytes = capabilities?.maxUploadBytes ?? 25 * 1024 * 1024;
    if (candidate.size > maxBytes) {
      setErrorMsg(`File exceeds the 25 MB limit (${(candidate.size / (1024 * 1024)).toFixed(1)} MB).`);
      return;
    }

    setFile(candidate);
    setStatus('idle');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleConvert = async () => {
    if (!file) return;

    setStatus('uploading');
    setErrorMsg('');
    if (result?.url) {
      URL.revokeObjectURL(result.url);
      setResult(null);
    }

    try {
      const formData = new FormData();
      formData.set('file', file);

      // Transition to processing state after small delay to represent upload completed
      setTimeout(() => {
        setStatus((curr) => (curr === 'uploading' ? 'processing' : curr));
      }, 800);

      // Transition to generating state
      setTimeout(() => {
        setStatus((curr) => (curr === 'processing' ? 'generating' : curr));
      }, 3000);

      const response = await fetch('/api/step-to-3d-pdf/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? 'Conversion failed safely.');
      }

      const blob = await response.blob();
      const disposition = response.headers.get('content-disposition') ?? '';
      const filenameMatch = disposition.match(/filename="([^"]+)"/);
      const name = filenameMatch ? filenameMatch[1] : `${file.name.replace(/\.[^.]+$/, '')}-3d.pdf`;

      const solids = response.headers.get('x-cad-solids') ?? undefined;
      const faces = response.headers.get('x-cad-faces') ?? undefined;
      const triangles = response.headers.get('x-cad-triangles') ?? undefined;

      setResult({
        url: URL.createObjectURL(blob),
        name,
        sizeBytes: blob.size,
        solids,
        faces,
        triangles,
      });
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Conversion failed safely.');
    }
  };

  const handleReset = () => {
    if (result?.url) {
      URL.revokeObjectURL(result.url);
    }
    setFile(null);
    setResult(null);
    setErrorMsg('');
    setStatus('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const isBackendDisabled = capabilities ? !capabilities.available : false;
  const isBusy = status === 'uploading' || status === 'processing' || status === 'generating';

  return (
    <section className="mx-auto max-w-4xl space-y-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <CadPrivacyNotice />
      <CadViewerNotice />

      {isBackendDisabled && <CadBackendUnavailableNotice />}

      {/* Upload Dropzone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isBusy && fileInputRef.current?.click()}
        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
          dragOver
            ? 'border-indigo-500 bg-indigo-50/50 dark:border-indigo-400 dark:bg-indigo-950/20'
            : 'border-slate-300 bg-slate-50/60 hover:border-indigo-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950/50 dark:hover:border-slate-600'
        } ${isBusy ? 'pointer-events-none opacity-60' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".step,.stp,.STEP,.STP"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              validateAndSelectFile(e.target.files[0]);
            }
          }}
          className="hidden"
        />

        <div className="flex size-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
          <UploadCloud className="size-7" />
        </div>

        <p className="mt-4 text-base font-bold text-slate-800 dark:text-slate-100">
          Drop your STEP or STP file here, or{' '}
          <span className="text-indigo-600 underline dark:text-indigo-400">browse</span>
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Supports ISO-10303-21 CAD models (.step, .stp) up to 25 MB
        </p>

        {file && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-indigo-200 bg-indigo-50/80 px-4 py-2 text-sm text-indigo-950 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-200">
            <Box className="size-4 text-indigo-600 dark:text-indigo-400" />
            <span className="font-semibold">{file.name}</span>
            <span className="text-xs text-indigo-700 dark:text-indigo-300">
              ({formatBytes(file.size)})
            </span>
          </div>
        )}
      </div>

      {errorMsg && <CadErrorNotice message={errorMsg} />}

      {/* Action / State Area */}
      {status === 'success' && result ? (
        <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/30">
          <div className="flex items-center gap-3 text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="size-6 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <div>
              <p className="font-black text-slate-900 dark:text-white">
                3D PDF Ready for Download
              </p>
              <p className="text-xs text-emerald-800 dark:text-emerald-300">
                {result.name} ({formatBytes(result.sizeBytes)})
              </p>
            </div>
          </div>

          {result.faces && result.triangles && (
            <div className="grid grid-cols-3 gap-2 rounded-xl border border-emerald-200/60 bg-white/60 p-3 text-center text-xs dark:border-emerald-900/40 dark:bg-slate-900/40">
              <div>
                <span className="block font-bold text-slate-700 dark:text-slate-300">Solids</span>
                <span className="font-mono text-emerald-700 dark:text-emerald-400">{result.solids ?? '1'}</span>
              </div>
              <div>
                <span className="block font-bold text-slate-700 dark:text-slate-300">Faces</span>
                <span className="font-mono text-emerald-700 dark:text-emerald-400">{result.faces}</span>
              </div>
              <div>
                <span className="block font-bold text-slate-700 dark:text-slate-300">Triangles</span>
                <span className="font-mono text-emerald-700 dark:text-emerald-400">{result.triangles}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={result.url}
              download={result.name}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white shadow-md hover:bg-emerald-700 transition"
            >
              <Download className="size-5" /> Download 3D PDF
            </a>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-750 transition"
            >
              <RotateCcw className="size-4" /> Convert Another File
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleConvert}
          disabled={!file || isBusy || isBackendDisabled}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-black text-white shadow-md hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 transition"
        >
          {isBusy && <LoaderCircle className="size-5 animate-spin" />}
          {status === 'uploading'
            ? 'Uploading CAD file…'
            : status === 'processing'
            ? 'Parsing B-Rep topology & tessellating mesh…'
            : status === 'generating'
            ? 'Embedding 3D PRC structures into PDF…'
            : 'Convert STEP to 3D PDF'}
        </button>
      )}
    </section>
  );
}
