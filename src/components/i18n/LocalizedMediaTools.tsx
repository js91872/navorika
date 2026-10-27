'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  Upload,
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
  FileAudio,
  FileVideo,
  Radio,
  Copy,
  Check,
  Info,
  Cpu,
  ArrowRight,
} from 'lucide-react';
import type { AudioOutputFormat, Mp3Bitrate } from '@/lib/media/types';
import { validateMediaFile, formatFileSize } from '@/lib/media/validation';
import { convertMediaFile } from '@/lib/media/converter';
import {
  calculateBitrateFromSize,
  calculateSizeFromBitrate,
  durationToSeconds,
  type FileSizeUnit,
  type BitrateUnit,
} from '@/lib/calculations/audioBitrate';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';
import { fieldClass, buttonClass } from './ToolControls';

export type MediaToolSlug =
  | 'audio-bitrate-calculator'
  | 'audio-video-tools'
  | 'extract-audio-from-video'
  | 'm4a-to-mp3-converter'
  | 'mov-to-mp3-converter'
  | 'mp3-to-wav-converter'
  | 'mp4-to-mp3-converter'
  | 'video-to-audio-converter'
  | 'video-to-mp3-converter'
  | 'wav-to-mp3-converter'
  | 'webm-to-mp3-converter';

interface Props {
  slug: MediaToolSlug;
  locale: Locale;
  dictionary: Dictionary;
}

interface ConverterPreset {
  mode: 'video-to-audio' | 'audio-to-audio';
  acceptedFormats: string[];
  defaultOutputFormat: AudioOutputFormat;
  allowedOutputFormats: AudioOutputFormat[];
}

const CONVERTER_PRESETS: Record<string, ConverterPreset> = {
  'extract-audio-from-video': {
    mode: 'video-to-audio',
    acceptedFormats: ['video/*', 'mp4', 'webm', 'mov', 'mkv', 'avi'],
    defaultOutputFormat: 'mp3',
    allowedOutputFormats: ['mp3', 'wav'],
  },
  'm4a-to-mp3-converter': {
    mode: 'audio-to-audio',
    acceptedFormats: ['m4a', 'aac'],
    defaultOutputFormat: 'mp3',
    allowedOutputFormats: ['mp3'],
  },
  'mov-to-mp3-converter': {
    mode: 'video-to-audio',
    acceptedFormats: ['mov'],
    defaultOutputFormat: 'mp3',
    allowedOutputFormats: ['mp3'],
  },
  'mp3-to-wav-converter': {
    mode: 'audio-to-audio',
    acceptedFormats: ['mp3'],
    defaultOutputFormat: 'wav',
    allowedOutputFormats: ['wav'],
  },
  'mp4-to-mp3-converter': {
    mode: 'video-to-audio',
    acceptedFormats: ['mp4'],
    defaultOutputFormat: 'mp3',
    allowedOutputFormats: ['mp3'],
  },
  'video-to-audio-converter': {
    mode: 'video-to-audio',
    acceptedFormats: ['video/*', 'mp4', 'webm', 'mov', 'mkv', 'avi', 'flv'],
    defaultOutputFormat: 'mp3',
    allowedOutputFormats: ['mp3', 'wav', 'aac', 'ogg', 'flac'],
  },
  'video-to-mp3-converter': {
    mode: 'video-to-audio',
    acceptedFormats: ['video/*', 'mp4', 'webm', 'mov', 'mkv', 'avi'],
    defaultOutputFormat: 'mp3',
    allowedOutputFormats: ['mp3'],
  },
  'wav-to-mp3-converter': {
    mode: 'audio-to-audio',
    acceptedFormats: ['wav'],
    defaultOutputFormat: 'mp3',
    allowedOutputFormats: ['mp3'],
  },
  'webm-to-mp3-converter': {
    mode: 'video-to-audio',
    acceptedFormats: ['webm'],
    defaultOutputFormat: 'mp3',
    allowedOutputFormats: ['mp3'],
  },
};

const BITRATES: { value: Mp3Bitrate; label: string }[] = [
  { value: 96, label: '96 kbps' },
  { value: 128, label: '128 kbps' },
  { value: 192, label: '192 kbps' },
  { value: 256, label: '256 kbps' },
  { value: 320, label: '320 kbps' },
];

function getLocalizedBitrateTier(kbps: number, locale: Locale): string {
  if (locale === 'fr') {
    if (kbps < 80) return 'Qualité vocale / Compacte';
    if (kbps < 120) return 'Voix et podcasts';
    if (kbps < 160) return 'Standard / Radio FM';
    if (kbps < 224) return 'Haute fidélité (Recommandé)';
    if (kbps < 300) return 'Très haute qualité';
    return 'Master studio (320 kbps)';
  }
  if (locale === 'es') {
    if (kbps < 80) return 'Calidad de voz / Compacta';
    if (kbps < 120) return 'Voz y podcasts';
    if (kbps < 160) return 'Estándar / Radio FM';
    if (kbps < 224) return 'Alta fidelidad (Recomendado)';
    if (kbps < 300) return 'Muy alta calidad';
    return 'Master de estudio (320 kbps)';
  }
  if (locale === 'pt') {
    if (kbps < 80) return 'Qualidade de voz / Compacta';
    if (kbps < 120) return 'Voz e podcasts';
    if (kbps < 160) return 'Padrão / Rádio FM';
    if (kbps < 224) return 'Alta fidelidade (Recomendado)';
    if (kbps < 300) return 'Qualidade muito alta';
    return 'Master de estúdio (320 kbps)';
  }
  if (locale === 'it') {
    if (kbps < 80) return 'Qualità vocale / Compatta';
    if (kbps < 120) return 'Voce e podcast';
    if (kbps < 160) return 'Standard / Radio FM';
    if (kbps < 224) return 'Alta fedeltà (Consigliato)';
    if (kbps < 300) return 'Altissima qualità';
    return 'Master da studio (320 kbps)';
  }
  if (locale === 'de') {
    if (kbps < 80) return 'Sprachqualität / Kompakt';
    if (kbps < 120) return 'Sprache und Podcasts';
    if (kbps < 160) return 'Standard / UKW-Radio';
    if (kbps < 224) return 'Hohe Wiedergabetreue (Empfohlen)';
    if (kbps < 300) return 'Sehr hohe Audioqualität';
    return 'Studio-Masterstufe (320 kbit/s)';
  }
  if (locale === 'ru') {
    if (kbps < 80) return 'Голосовое качество / Компактный';
    if (kbps < 120) return 'Речь и подкасты';
    if (kbps < 160) return 'Стандарт / FM-радио';
    if (kbps < 224) return 'Высокая четкость (Рекомендуется)';
    if (kbps < 300) return 'Очень высокое качество';
    return 'Студийный мастер (320 кбит/с)';
  }
  if (locale === 'ar') {
    if (kbps < 80) return 'جودة صوتية منخفضة / مضغوط';
    if (kbps < 120) return 'تسجيلات صوتية وبودكاست';
    if (kbps < 160) return 'جودة قياسية / راديو';
    if (kbps < 224) return 'دقة صوتية عالية (موصى بها)';
    if (kbps < 300) return 'جودة فائقة الوضوح';
    return 'جودة استوديو احترافية (320 كيلوبت)';
  }
  return 'High Quality Streaming';
}

/**
 * Localized Media Converter Component
 */
function LocalizedMediaConverter({
  slug,
  locale,
  dictionary,
  preset,
}: {
  slug: string;
  locale: Locale;
  dictionary: Dictionary;
  preset: ConverterPreset;
}) {
  const d = dictionary;
  const mc = d.mediaTools.converter;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileWarning, setFileWarning] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [outputFormat, setOutputFormat] = useState<AudioOutputFormat>(preset.defaultOutputFormat);
  const [bitrate, setBitrate] = useState<Mp3Bitrate>(192);

  const [status, setStatus] = useState<'idle' | 'converting' | 'completed' | 'error'>('idle');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [progressStage, setProgressStage] = useState<string>('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultFilename, setResultFilename] = useState<string>('');
  const [resultSizeBytes, setResultSizeBytes] = useState<number>(0);
  const [engineUsed, setEngineUsed] = useState<'ffmpeg' | 'web-audio' | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

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

      const validation = validateMediaFile(file, preset.acceptedFormats);
      if (!validation.valid) {
        setError(validation.error || mc.unsupportedFile);
        setSelectedFile(null);
        return;
      }

      if (validation.warning) {
        setFileWarning(mc.largeFileNotice);
      }

      setSelectedFile(file);
    },
    [preset.acceptedFormats, resultUrl, mc.unsupportedFile, mc.largeFileNotice]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      const droppedFile = e.dataTransfer.files?.[0];
      handleFile(droppedFile);
    },
    [handleFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const chosen = e.target.files?.[0];
      handleFile(chosen);
    },
    [handleFile]
  );

  const resetAll = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
      setResultUrl(null);
    }
    setSelectedFile(null);
    setError(null);
    setFileWarning(null);
    setStatus('idle');
    setProgressPercent(0);
    setProgressStage('');
    setResultFilename('');
    setResultSizeBytes(0);
    setEngineUsed(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [resultUrl]);

  const handleConvert = async () => {
    if (!selectedFile) return;

    setError(null);
    setStatus('converting');
    setProgressPercent(5);
    setProgressStage(mc.processing);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const result = await convertMediaFile(selectedFile, {
        outputFormat,
        bitrate,
        onProgress: (percent) => {
          setProgressPercent(Math.max(5, Math.min(100, Math.round(percent))));
        },
        signal: controller.signal,
      });

      const url = URL.createObjectURL(result.blob);
      setResultUrl(url);
      setResultFilename(result.filename);
      setResultSizeBytes(result.sizeBytes);
      setEngineUsed(result.engine);
      setProgressPercent(100);
      setStatus('completed');
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        setStatus('idle');
        setProgressPercent(0);
        return;
      }
      setError(mc.unsupportedFile);
      setStatus('error');
    } finally {
      abortControllerRef.current = null;
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = resultFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const isVideoMode = preset.mode === 'video-to-audio';

  return (
    <div className="mx-auto max-w-4xl space-y-6" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Privacy Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-3 text-sm text-emerald-800 dark:text-emerald-300">
        <div className="flex items-center gap-2 font-medium">
          <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{mc.localEngineNotice}</span>
        </div>
        <span className="rounded-full bg-emerald-600/20 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
          {d.ui.local}
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
              {isVideoMode ? <FileVideo className="h-8 w-8" /> : <FileAudio className="h-8 w-8" />}
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {mc.dropPrompt}
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {preset.acceptedFormats.map((f) => f.toUpperCase()).join(', ')} • 500 MB max
            </p>
            <button
              type="button"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700"
            >
              <Upload className="h-4 w-4" />
              {mc.selectFile}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              accept={preset.acceptedFormats
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
                  {isVideoMode ? <FileVideo className="h-6 w-6" /> : <FileAudio className="h-6 w-6" />}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-base font-bold text-slate-900 dark:text-white">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Media'}
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
                  {d.ui.reset}
                </button>
              )}
            </div>

            {/* Warnings */}
            {fileWarning && (
              <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-800 dark:text-amber-300">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                <span>{fileWarning}</span>
              </div>
            )}

            {/* Options Panel */}
            {status !== 'converting' && status !== 'completed' && (
              <div className="grid gap-6 rounded-2xl border border-slate-100 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-800/30 sm:grid-cols-2">
                {preset.allowedOutputFormats.length > 1 && (
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {mc.targetAudioFormat}
                    </label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {preset.allowedOutputFormats.map((fmt) => (
                        <button
                          key={fmt}
                          type="button"
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

                {outputFormat === 'mp3' && (
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {mc.audioQualityBitrate}
                    </label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {BITRATES.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setBitrate(opt.value)}
                          className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                            bitrate === opt.value
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Progress Bar */}
            {status === 'converting' && (
              <div className="space-y-3 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-6 text-center dark:border-indigo-900/40 dark:bg-indigo-950/20">
                <div className="flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="font-semibold">{mc.processing}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-indigo-200 dark:bg-indigo-900/60">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  {progressPercent}%
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-400">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Completed Result Card */}
            {status === 'completed' && resultUrl && (
              <div className="space-y-4 rounded-2xl border border-emerald-500/20 bg-emerald-50/50 p-6 dark:border-emerald-500/20 dark:bg-emerald-950/20">
                <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="h-7 w-7 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <h4 className="font-bold">{d.ui.result}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {resultFilename} • {formatFileSize(resultSizeBytes)}
                      {engineUsed && ` • ${engineUsed === 'ffmpeg' ? 'FFmpeg WASM' : 'Web Audio API'}`}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-emerald-700"
                  >
                    <Download className="h-4 w-4" />
                    {mc.downloadAudio}
                  </button>
                  <button
                    type="button"
                    onClick={resetAll}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <RotateCcw className="h-4 w-4" />
                    {d.ui.reset}
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {status === 'idle' && (
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleConvert}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700"
                >
                  <Sparkles className="h-4 w-4" />
                  {isVideoMode ? mc.extractAction : mc.convertAction}
                </button>
                <button
                  type="button"
                  onClick={resetAll}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  <RotateCcw className="h-4 w-4" />
                  {d.ui.reset}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Localized Audio Bitrate Calculator Component
 */
function LocalizedAudioBitrateCalculator({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const d = dictionary;
  const calc = d.mediaTools.calculator;
  const [mode, setMode] = useState<'bitrate-from-size' | 'size-from-bitrate'>('bitrate-from-size');

  // Mode A state (Bitrate from File Size)
  const [fileSizeValue, setFileSizeValue] = useState<string>('15');
  const [fileSizeUnit, setFileSizeUnit] = useState<FileSizeUnit>('MB');
  const [hoursA, setHoursA] = useState<string>('0');
  const [minutesA, setMinutesA] = useState<string>('10');
  const [secondsA, setSecondsA] = useState<string>('25');
  const [channelsA, setChannelsA] = useState<string>('2');

  // Mode B state (File Size from Bitrate)
  const [bitrateValue, setBitrateValue] = useState<string>('192');
  const [bitrateUnit, setBitrateUnit] = useState<BitrateUnit>('kbps');
  const [hoursB, setHoursB] = useState<string>('0');
  const [minutesB, setMinutesB] = useState<string>('45');
  const [secondsB, setSecondsB] = useState<string>('0');

  const [copied, setCopied] = useState(false);

  const resultA = useMemo(() => {
    const size = parseFloat(fileSizeValue);
    const h = parseFloat(hoursA) || 0;
    const m = parseFloat(minutesA) || 0;
    const s = parseFloat(secondsA) || 0;
    const totalSec = durationToSeconds(h, m, s);
    const ch = parseFloat(channelsA) || 2;

    if (isNaN(size) || size <= 0 || totalSec <= 0) return null;

    return calculateBitrateFromSize({
      fileSizeValue: size,
      fileSizeUnit,
      durationSeconds: totalSec,
      channels: ch,
    });
  }, [fileSizeValue, fileSizeUnit, hoursA, minutesA, secondsA, channelsA]);

  const resultB = useMemo(() => {
    const br = parseFloat(bitrateValue);
    const h = parseFloat(hoursB) || 0;
    const m = parseFloat(minutesB) || 0;
    const s = parseFloat(secondsB) || 0;
    const totalSec = durationToSeconds(h, m, s);

    if (isNaN(br) || br <= 0 || totalSec <= 0) return null;

    return calculateSizeFromBitrate({
      bitrateValue: br,
      bitrateUnit,
      durationSeconds: totalSec,
    });
  }, [bitrateValue, bitrateUnit, hoursB, minutesB, secondsB]);

  const copySummary = () => {
    let summary = '';
    if (mode === 'bitrate-from-size' && resultA) {
      const tier = getLocalizedBitrateTier(resultA.bitrateKbps, locale);
      summary = `${calc.estimatedBitrate}: ${resultA.bitrateKbps} kbps (${resultA.bitrateMbps} Mbps)\n${calc.fileSize}: ${fileSizeValue} ${fileSizeUnit}\n${calc.duration}: ${hoursA}h ${minutesA}m ${secondsA}s\n${calc.streamingTier}: ${tier}`;
    } else if (mode === 'size-from-bitrate' && resultB) {
      summary = `${calc.estimatedSize}: ${resultB.bytesDecimal.mb} MB (${resultB.bytesBinary.mib} MiB)\n${calc.targetBitrate}: ${bitrateValue} ${bitrateUnit}\n${calc.duration}: ${hoursB}h ${minutesB}m ${secondsB}s\nMB / Hour: ${resultB.sizePerHourMb} MB`;
    }

    if (summary) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetValues = () => {
    if (mode === 'bitrate-from-size') {
      setFileSizeValue('15');
      setFileSizeUnit('MB');
      setHoursA('0');
      setMinutesA('10');
      setSecondsA('25');
      setChannelsA('2');
    } else {
      setBitrateValue('192');
      setBitrateUnit('kbps');
      setHoursB('0');
      setMinutesB('45');
      setSecondsB('0');
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Mode Switcher Tabs */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-slate-100 p-1.5 dark:border-slate-800 dark:bg-slate-800/60">
        <button
          type="button"
          onClick={() => setMode('bitrate-from-size')}
          className={`min-w-0 flex-1 rounded-xl px-3 py-2.5 text-xs font-semibold transition sm:px-4 sm:py-3 sm:text-sm ${
            mode === 'bitrate-from-size'
              ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          {calc.modeBitrateFromSize}
        </button>
        <button
          type="button"
          onClick={() => setMode('size-from-bitrate')}
          className={`min-w-0 flex-1 rounded-xl px-3 py-2.5 text-xs font-semibold transition sm:px-4 sm:py-3 sm:text-sm ${
            mode === 'size-from-bitrate'
              ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          {calc.modeSizeFromBitrate}
        </button>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        {mode === 'bitrate-from-size' ? (
          <div className="space-y-6">
            <div className="grid min-w-0 gap-4 sm:grid-cols-2">
              <div className="min-w-0">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {calc.fileSize}
                </label>
                <div className="mt-1.5 flex min-w-0 gap-2">
                  <input
                    type="number"
                    min="0.01"
                    step="any"
                    value={fileSizeValue}
                    onChange={(e) => setFileSizeValue(e.target.value)}
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                  />
                  <select
                    value={fileSizeUnit}
                    onChange={(e) => setFileSizeUnit(e.target.value as FileSizeUnit)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="KB">KB</option>
                    <option value="MB">MB</option>
                    <option value="GB">GB</option>
                    <option value="KiB">KiB</option>
                    <option value="MiB">MiB</option>
                  </select>
                </div>
              </div>

              <div className="min-w-0">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {calc.channels}
                </label>
                <select
                  value={channelsA}
                  onChange={(e) => setChannelsA(e.target.value)}
                  className="mt-1.5 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                >
                  <option value="1">{calc.mono}</option>
                  <option value="2">{calc.stereo}</option>
                </select>
              </div>
            </div>

            {/* Duration Fields */}
            <div className="min-w-0">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {calc.duration}
              </label>
              <div className="mt-1.5 grid min-w-0 grid-cols-3 gap-2 sm:gap-3">
                <div className="min-w-0">
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={hoursA}
                    onChange={(e) => setHoursA(e.target.value)}
                    className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-2 py-2.5 text-center text-sm dark:border-slate-700 dark:bg-slate-800 sm:px-3"
                  />
                  <span className="mt-1 block text-center text-xs text-slate-400">{calc.hours}</span>
                </div>
                <div className="min-w-0">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    placeholder="0"
                    value={minutesA}
                    onChange={(e) => setMinutesA(e.target.value)}
                    className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-2 py-2.5 text-center text-sm dark:border-slate-700 dark:bg-slate-800 sm:px-3"
                  />
                  <span className="mt-1 block text-center text-xs text-slate-400">{calc.minutes}</span>
                </div>
                <div className="min-w-0">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    placeholder="0"
                    value={secondsA}
                    onChange={(e) => setSecondsA(e.target.value)}
                    className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-2 py-2.5 text-center text-sm dark:border-slate-700 dark:bg-slate-800 sm:px-3"
                  />
                  <span className="mt-1 block text-center text-xs text-slate-400">{calc.seconds}</span>
                </div>
              </div>
            </div>

            {/* Calculated Result */}
            {resultA && (
              <div className="min-w-0 space-y-4 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 sm:p-6 dark:border-indigo-950/40 dark:bg-indigo-950/20">
                <div className="min-w-0">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {calc.estimatedBitrate}
                  </span>
                  <div className="mt-1 flex flex-wrap items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900 dark:text-white sm:text-4xl">
                      {resultA.bitrateKbps.toLocaleString(locale)}
                    </span>
                    <span className="text-base font-semibold text-slate-600 dark:text-slate-300 sm:text-lg">kbps</span>
                    <span className="text-xs text-slate-400">
                      ({resultA.bitrateMbps} Mbps)
                    </span>
                  </div>
                </div>

                <div className="grid min-w-0 gap-3 pt-2 sm:grid-cols-2">
                  <div className="min-w-0 rounded-xl border border-indigo-200/50 bg-white/80 p-3.5 dark:border-indigo-900/40 dark:bg-slate-900/80">
                    <span className="text-xs text-slate-500 dark:text-slate-400">{calc.streamingTier}</span>
                    <p className="mt-0.5 text-sm font-bold text-slate-800 dark:text-slate-200">
                      {getLocalizedBitrateTier(resultA.bitrateKbps, locale)}
                    </p>
                  </div>
                  {resultA.perChannelKbps !== null && (
                    <div className="min-w-0 rounded-xl border border-indigo-200/50 bg-white/80 p-3.5 dark:border-indigo-900/40 dark:bg-slate-900/80">
                      <span className="text-xs text-slate-500 dark:text-slate-400">{calc.channels}</span>
                      <p className="mt-0.5 text-sm font-bold text-slate-800 dark:text-slate-200">
                        {resultA.perChannelKbps.toLocaleString(locale)} kbps / ch
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid min-w-0 gap-4 sm:grid-cols-2">
              <div className="min-w-0">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {calc.targetBitrate}
                </label>
                <div className="mt-1.5 flex min-w-0 gap-2">
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={bitrateValue}
                    onChange={(e) => setBitrateValue(e.target.value)}
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                  />
                  <select
                    value={bitrateUnit}
                    onChange={(e) => setBitrateUnit(e.target.value as BitrateUnit)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="kbps">kbps</option>
                    <option value="Mbps">Mbps</option>
                    <option value="bps">bps</option>
                  </select>
                </div>
              </div>

              <div className="min-w-0">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {calc.streamingTier}
                </label>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {BITRATES.map((b) => (
                    <button
                      key={b.value}
                      type="button"
                      onClick={() => {
                        setBitrateValue(b.value.toString());
                        setBitrateUnit('kbps');
                      }}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Duration Fields */}
            <div className="min-w-0">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {calc.duration}
              </label>
              <div className="mt-1.5 grid min-w-0 grid-cols-3 gap-2 sm:gap-3">
                <div className="min-w-0">
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={hoursB}
                    onChange={(e) => setHoursB(e.target.value)}
                    className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-2 py-2.5 text-center text-sm dark:border-slate-700 dark:bg-slate-800 sm:px-3"
                  />
                  <span className="mt-1 block text-center text-xs text-slate-400">{calc.hours}</span>
                </div>
                <div className="min-w-0">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    placeholder="0"
                    value={minutesB}
                    onChange={(e) => setMinutesB(e.target.value)}
                    className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-2 py-2.5 text-center text-sm dark:border-slate-700 dark:bg-slate-800 sm:px-3"
                  />
                  <span className="mt-1 block text-center text-xs text-slate-400">{calc.minutes}</span>
                </div>
                <div className="min-w-0">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    placeholder="0"
                    value={secondsB}
                    onChange={(e) => setSecondsB(e.target.value)}
                    className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-2 py-2.5 text-center text-sm dark:border-slate-700 dark:bg-slate-800 sm:px-3"
                  />
                  <span className="mt-1 block text-center text-xs text-slate-400">{calc.seconds}</span>
                </div>
              </div>
            </div>

            {/* Calculated Result */}
            {resultB && (
              <div className="min-w-0 space-y-4 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 sm:p-6 dark:border-indigo-950/40 dark:bg-indigo-950/20">
                <div className="min-w-0">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {calc.estimatedSize}
                  </span>
                  <div className="mt-1 flex flex-wrap items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900 dark:text-white sm:text-4xl">
                      {resultB.bytesDecimal.mb.toLocaleString(locale)}
                    </span>
                    <span className="text-base font-semibold text-slate-600 dark:text-slate-300 sm:text-lg">MB</span>
                    <span className="text-xs text-slate-400">
                      ({resultB.bytesBinary.mib.toLocaleString(locale)} MiB)
                    </span>
                  </div>
                </div>

                <div className="grid min-w-0 gap-3 pt-2 sm:grid-cols-2">
                  <div className="min-w-0 rounded-xl border border-indigo-200/50 bg-white/80 p-3.5 dark:border-indigo-900/40 dark:bg-slate-900/80">
                    <span className="text-xs text-slate-500 dark:text-slate-400">1 Hour Storage</span>
                    <p className="mt-0.5 text-sm font-bold text-slate-800 dark:text-slate-200">
                      {resultB.sizePerHourMb.toLocaleString(locale)} MB / hr
                    </p>
                  </div>
                  <div className="min-w-0 rounded-xl border border-indigo-200/50 bg-white/80 p-3.5 dark:border-indigo-900/40 dark:bg-slate-900/80">
                    <span className="text-xs text-slate-500 dark:text-slate-400">1 Minute Storage</span>
                    <p className="mt-0.5 text-sm font-bold text-slate-800 dark:text-slate-200">
                      {resultB.sizePerMinuteMb.toLocaleString(locale)} MB / min
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={copySummary}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? d.ui.copied : calc.copySummary}
          </button>
          <button
            type="button"
            onClick={resetValues}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <RotateCcw className="h-4 w-4" />
            {d.ui.reset}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Localized Audio & Video Tools Hub
 */
function LocalizedAudioVideoHub({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const d = dictionary;
  const hub = d.mediaTools.hub;

  const sections = [
    {
      title: hub.sectionExtraction,
      description: hub.sectionExtractionDesc,
      slugs: [
        'video-to-mp3-converter',
        'mp4-to-mp3-converter',
        'webm-to-mp3-converter',
        'mov-to-mp3-converter',
        'video-to-audio-converter',
        'extract-audio-from-video',
      ],
    },
    {
      title: hub.sectionTranscoding,
      description: hub.sectionTranscodingDesc,
      slugs: [
        'm4a-to-mp3-converter',
        'wav-to-mp3-converter',
        'mp3-to-wav-converter',
      ],
    },
    {
      title: hub.sectionPlanning,
      description: hub.sectionPlanningDesc,
      slugs: ['audio-bitrate-calculator'],
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-12" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Privacy Callout */}
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-emerald-950 dark:border-emerald-500/20 dark:text-emerald-100">
        <div className="flex items-center gap-2.5 font-bold text-emerald-800 dark:text-emerald-300">
          <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{hub.privacyTitle}</span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-emerald-900/90 dark:text-emerald-200/90">
          {hub.privacyDesc}
        </p>
      </div>

      {/* Sections & Tool Cards */}
      {sections.map((section) => (
        <section key={section.title} className="space-y-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {section.title}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {section.description}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {section.slugs.map((toolSlug) => {
              const toolData = (d.tools as Record<string, { title: string; description: string }>)[toolSlug];
              const title = toolData?.title || toolSlug;
              const desc = toolData?.description || '';

              return (
                <Link
                  key={toolSlug}
                  href={`/${locale}/tools/${toolSlug}`}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-400"
                >
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                      {title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-2 dark:text-slate-400">
                      {desc}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    <span>{d.ui.preview || d.ui.tools}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

/**
 * Main Exported LocalizedMediaTools Component
 */
export default function LocalizedMediaTools({ slug, locale, dictionary }: Props) {
  if (slug === 'audio-bitrate-calculator') {
    return <LocalizedAudioBitrateCalculator locale={locale} dictionary={dictionary} />;
  }

  if (slug === 'audio-video-tools') {
    return <LocalizedAudioVideoHub locale={locale} dictionary={dictionary} />;
  }

  const preset = CONVERTER_PRESETS[slug];
  if (preset) {
    return (
      <LocalizedMediaConverter
        slug={slug}
        locale={locale}
        dictionary={dictionary}
        preset={preset}
      />
    );
  }

  return null;
}
