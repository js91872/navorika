'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  FileAudio,
  FileVideo,
  Download,
  RotateCcw,
  ShieldCheck,
  AlertCircle,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  X,
  Sliders,
  Sparkles,
} from 'lucide-react';
import type { AudioOutputFormat, Mp3Bitrate } from '@/lib/media/types';
import { validateMediaFile, formatFileSize } from '@/lib/media/validation';
import { convertMediaFile } from '@/lib/media/converter';

export interface MediaConverterProps {
  slug: string;
  toolTitle?: string;
  toolDescription?: string;
  inputLabel: string;
  acceptedFormats: string[]; // e.g. ['mp4'], ['mov'], ['video/*'], ['m4a'], ['wav'], ['mp3']
  defaultOutputFormat: AudioOutputFormat;
  allowedOutputFormats?: AudioOutputFormat[];
  mode?: 'video-to-audio' | 'audio-to-audio';
}

const BITRATE_OPTIONS: { value: Mp3Bitrate; label: string; desc: string }[] = [
  { value: 96, label: '96 kbps', desc: 'Voice / Compact' },
  { value: 128, label: '128 kbps', desc: 'Standard / Radio' },
  { value: 192, label: '192 kbps', desc: 'High (Recommended)' },
  { value: 256, label: '256 kbps', desc: 'Very High' },
  { value: 320, label: '320 kbps', desc: 'Studio Master' },
];

export default function MediaConverterTool({
  inputLabel,
  acceptedFormats,
  defaultOutputFormat,
  allowedOutputFormats = [defaultOutputFormat],
  mode = 'video-to-audio',
}: MediaConverterProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileWarning, setFileWarning] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Conversion Settings
  const [outputFormat, setOutputFormat] = useState<AudioOutputFormat>(defaultOutputFormat);
  const [bitrate, setBitrate] = useState<Mp3Bitrate>(192);

  // Conversion Status
  const [status, setStatus] = useState<'idle' | 'converting' | 'completed' | 'error'>('idle');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [progressStage, setProgressStage] = useState<string>('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultFilename, setResultFilename] = useState<string>('');
  const [resultSizeBytes, setResultSizeBytes] = useState<number>(0);
  const [engineUsed, setEngineUsed] = useState<'ffmpeg' | 'web-audio' | null>(null);

  // Drag state
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup object URLs on unmount or reset
  useEffect(() => {
    return () => {
      if (resultUrl) {
        URL.revokeObjectURL(resultUrl);
      }
    };
  }, [resultUrl]);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;

      setError(null);
      setFileWarning(null);
      setStatus('idle');
      setProgressPercent(0);
      setProgressStage('');
      if (resultUrl) {
        URL.revokeObjectURL(resultUrl);
        setResultUrl(null);
      }

      const validation = validateMediaFile(file, acceptedFormats);
      if (!validation.valid) {
        setError(validation.error || 'The chosen file could not be accepted.');
        setSelectedFile(null);
        return;
      }

      if (validation.warning) {
        setFileWarning(validation.warning);
      }

      setSelectedFile(file);
    },
    [acceptedFormats, resultUrl]
  );

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFile(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const startConversion = async () => {
    if (!selectedFile) return;

    setError(null);
    setStatus('converting');
    setProgressPercent(5);
    setProgressStage('Initializing local converter engine...');

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const result = await convertMediaFile(selectedFile, {
        outputFormat,
        bitrate,
        signal: abortController.signal,
        onProgress: (percent, stage) => {
          setProgressPercent(percent);
          setProgressStage(stage);
        },
      });

      const url = URL.createObjectURL(result.blob);
      setResultUrl(url);
      setResultFilename(result.filename);
      setResultSizeBytes(result.sizeBytes);
      setEngineUsed(result.engine);
      setStatus('completed');
    } catch (err: unknown) {
      if (abortController.signal.aborted) {
        setStatus('idle');
        setProgressPercent(0);
        setProgressStage('');
        return;
      }
      console.error('Media conversion error:', err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : typeof err === 'string'
            ? err
            : (err && typeof err === 'object' && 'message' in err && typeof (err as { message: unknown }).message === 'string')
              ? (err as { message: string }).message
              : 'An unexpected error occurred during local conversion. The file may use an unsupported codec or exceeded browser memory.';
      setError(errorMessage);
      setStatus('error');
    } finally {
      abortControllerRef.current = null;
    }
  };

  const cancelConversion = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setStatus('idle');
    setProgressPercent(0);
    setProgressStage('');
  };

  const resetAll = () => {
    cancelConversion();
    setSelectedFile(null);
    setFileWarning(null);
    setError(null);
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
      setResultUrl(null);
    }
    setStatus('idle');
  };

  const downloadResult = () => {
    if (!resultUrl || !resultFilename) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = resultFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Local Privacy Badge */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-3 text-sm text-emerald-800 dark:text-emerald-300">
        <div className="flex items-center gap-2 font-medium">
          <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <span>
            Your file is processed locally in your browser and is not uploaded to Navorika.
          </span>
        </div>
        <span className="rounded-full bg-emerald-600/20 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
          Client-Side
        </span>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        {/* Upload Zone */}
        {!selectedFile && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition sm:p-14 ${
              isDragOver
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20'
                : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/40'
            }`}
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
              {mode === 'video-to-audio' ? (
                <FileVideo className="h-8 w-8" />
              ) : (
                <FileAudio className="h-8 w-8" />
              )}
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Choose or drop {inputLabel}
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Accepted formats: {acceptedFormats.map((f) => f.toUpperCase()).join(', ')} • Up to 500 MB
            </p>
            <button
              type="button"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700"
            >
              <Upload className="h-4 w-4" />
              Browse Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              accept={acceptedFormats
                .map((f) => (f.includes('/') ? f : `.${f}`))
                .join(',')}
              className="hidden"
            />
          </div>
        )}

        {/* Selected File Card */}
        {selectedFile && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50 sm:p-5">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  {mode === 'video-to-audio' ? (
                    <FileVideo className="h-6 w-6" />
                  ) : (
                    <FileAudio className="h-6 w-6" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-base font-bold text-slate-900 dark:text-white">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Media File'}
                  </p>
                </div>
              </div>

              {status !== 'converting' && (
                <button
                  type="button"
                  onClick={resetAll}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  <X className="h-3.5 w-3.5" />
                  Change file
                </button>
              )}
            </div>

            {/* Large File Warning */}
            {fileWarning && (
              <div className="flex items-start gap-3 rounded-xl border border-amber-300/40 bg-amber-50 p-4 text-xs text-amber-800 dark:border-amber-500/20 dark:bg-amber-950/20 dark:text-amber-300">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <p>{fileWarning}</p>
              </div>
            )}

            {/* Conversion Controls */}
            {status !== 'completed' && (
              <div className="space-y-5 rounded-2xl border border-slate-200 p-5 dark:border-slate-800 sm:p-6">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-sm font-bold text-slate-900 dark:border-slate-800 dark:text-white">
                  <Sliders className="h-4 w-4 text-indigo-500" />
                  Conversion Settings
                </div>

                {/* Format selection if multiple formats allowed */}
                {allowedOutputFormats.length > 1 && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Output Audio Format
                    </label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {allowedOutputFormats.map((fmt) => (
                        <button
                          key={fmt}
                          type="button"
                          disabled={status === 'converting'}
                          onClick={() => setOutputFormat(fmt)}
                          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                            outputFormat === fmt
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {fmt.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bitrate Selector (shown when outputting MP3, AAC, or M4A) */}
                {['mp3', 'aac', 'm4a', 'ogg'].includes(outputFormat) && (
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        MP3 Audio Bitrate
                      </label>
                      <span className="text-xs font-medium text-slate-400">
                        Higher bitrate = clearer sound, larger file
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
                      {BITRATE_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          disabled={status === 'converting'}
                          onClick={() => setBitrate(opt.value)}
                          className={`flex flex-col items-center justify-center rounded-xl p-2.5 text-center transition ${
                            bitrate === opt.value
                              ? 'border-2 border-indigo-600 bg-indigo-50/70 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                              : 'border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300'
                          }`}
                        >
                          <span className="text-sm font-bold">{opt.label}</span>
                          <span className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                            {opt.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* WAV format informational notice */}
                {outputFormat === 'wav' && (
                  <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-800/40 dark:text-slate-400">
                    <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                    <span>
                      WAV output preserves uncompressed 16-bit PCM audio quality without lossy compression.
                    </span>
                  </div>
                )}

                {/* Conversion Action / Progress */}
                {status === 'converting' ? (
                  <div className="space-y-4 rounded-xl border border-indigo-200 bg-indigo-50/50 p-5 dark:border-indigo-900/30 dark:bg-indigo-950/20">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 font-semibold text-indigo-900 dark:text-indigo-200">
                        <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                        <span>{progressStage || 'Processing audio...'}</span>
                      </div>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {progressPercent}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-indigo-100 dark:bg-indigo-950">
                      <div
                        className="h-full rounded-full bg-indigo-600 transition-all duration-300 ease-out"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Do not close or refresh this tab while local conversion is in progress.
                      </span>
                      <button
                        type="button"
                        onClick={cancelConversion}
                        className="text-xs font-semibold text-red-600 hover:text-red-700 dark:text-red-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={startConversion}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-4 text-base font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700"
                  >
                    Convert to {outputFormat.toUpperCase()}
                  </button>
                )}
              </div>
            )}

            {/* Completed State */}
            {status === 'completed' && (
              <div className="space-y-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 dark:border-emerald-500/20">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                      Conversion Complete!
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Processed locally via {engineUsed === 'web-audio' ? 'Web Audio API Engine' : 'FFmpeg WebAssembly'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="min-w-0">
                    <p className="truncate font-bold text-slate-900 dark:text-white">
                      {resultFilename}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {formatFileSize(resultSizeBytes)} • {outputFormat.toUpperCase()} Audio
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={downloadResult}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-indigo-700"
                  >
                    <Download className="h-4 w-4" />
                    Download {outputFormat.toUpperCase()}
                  </button>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={resetAll}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Convert another file
                  </button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800/40 dark:bg-red-950/20 dark:text-red-300">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
                <div className="flex-1">
                  <p className="font-bold">Conversion Failed</p>
                  <p className="mt-1 text-xs">{error}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
