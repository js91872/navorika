'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, ImageIcon, Loader2, ShieldCheck, Upload, X } from 'lucide-react';

type OutputFormat = 'jpeg' | 'png' | 'webp';
type Props = { description: string; inputLabel: string; inputMime: string; outputFormat?: OutputFormat; title: string };
const outputMime: Record<OutputFormat, string> = { jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };
const outputExtension: Record<OutputFormat, string> = { jpeg: 'jpg', png: 'png', webp: 'webp' };

function formatBytes(bytes: number) {
  return bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ImageFormatConverterTool({ description, inputLabel, inputMime, outputFormat, title }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [resultSize, setResultSize] = useState(0);
  const [quality, setQuality] = useState(0.92);
  const [selectedOutput, setSelectedOutput] = useState<OutputFormat>(outputFormat ?? 'webp');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
  }, [sourceUrl, resultUrl]);

  const clearResult = () => {
    setResultUrl(current => { if (current) URL.revokeObjectURL(current); return ''; });
    setResultSize(0);
  };

  const selectFile = (selected: File | undefined) => {
    const acceptedMimes = inputMime.split(',');
    if (!selected || !acceptedMimes.includes(selected.type)) {
      setError(`Please select a valid ${inputLabel} image.`);
      return;
    }
    setSourceUrl(current => { if (current) URL.revokeObjectURL(current); return URL.createObjectURL(selected); });
    setFile(selected);
    clearResult();
    setError('');
  };

  const convert = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError('');
    clearResult();
    try {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas is unavailable.');
      if (selectedOutput === 'jpeg') {
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
      context.drawImage(bitmap, 0, 0);
      bitmap.close();
      const mime = outputMime[selectedOutput];
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, mime, selectedOutput === 'png' ? undefined : quality));
      if (!blob || blob.type !== mime) throw new Error('This browser cannot encode the requested format.');
      setResultSize(blob.size);
      setResultUrl(URL.createObjectURL(blob));
    } catch {
      setError('The image could not be converted. It may be damaged, too large, or unsupported by this browser.');
    } finally {
      setIsProcessing(false);
    }
  };

  const download = () => {
    if (!file || !resultUrl) return;
    const anchor = document.createElement('a');
    anchor.href = resultUrl;
    anchor.download = `${file.name.replace(/\.[^.]+$/, '')}.${outputExtension[selectedOutput]}`;
    anchor.click();
  };

  return <main className="max-w-4xl mx-auto px-6 py-12 lg:px-8">
    <Link href="/categories/image-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition mb-8"><ArrowLeft className="h-4 w-4" /> Back to Image Tools</Link>
    <div className="text-center mb-10"><div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/20"><ShieldCheck className="h-4 w-4" /> Local Processing Only</div><h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{title}</h1><p className="text-lg text-slate-600 dark:text-slate-400">{description}</p></div>
    <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden mb-16"><div className="p-8">
      {!file ? <button type="button" onClick={() => inputRef.current?.click()} className="w-full border-2 border-dashed border-indigo-300 dark:border-indigo-500/30 rounded-2xl p-12 flex flex-col items-center justify-center text-center hover:bg-indigo-50 dark:hover:bg-indigo-500/5"><Upload className="h-10 w-10 text-indigo-500 mb-4" /><span className="text-xl font-bold">Choose {inputLabel}</span></button> : <>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60"><ImageIcon className="h-7 w-7 text-indigo-500" /><div className="flex-1 min-w-0"><p className="font-bold truncate">{file.name}</p><p className="text-xs text-slate-500">{formatBytes(file.size)}</p></div><button type="button" onClick={() => { setFile(null); setSourceUrl(''); clearResult(); }} aria-label="Remove image" className="p-2"><X className="h-5 w-5" /></button></div>
        <div className="mt-5 grid sm:grid-cols-2 gap-4"><div><p className="text-sm font-bold mb-2">Source</p><div className="h-56 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 flex items-center justify-center"><img src={sourceUrl} alt="Source image preview" className="max-h-full max-w-full object-contain" /></div></div><div><p className="text-sm font-bold mb-2">Converted preview</p><div className="h-56 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 flex items-center justify-center">{resultUrl ? <img src={resultUrl} alt={`Converted ${outputExtension[selectedOutput]} preview`} className="max-h-full max-w-full object-contain" /> : <span className="text-sm text-slate-400">Convert to preview output</span>}</div></div></div>
        {!outputFormat && <label className="mt-5 block text-sm font-bold">Output format<select value={selectedOutput} onChange={event => { setSelectedOutput(event.target.value as OutputFormat); clearResult(); }} className="mt-2 w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"><option value="jpeg">JPG</option><option value="png">PNG</option><option value="webp">WebP</option></select></label>}
        {selectedOutput !== 'png' && <label className="mt-5 block text-sm font-bold">Encoder quality: {Math.round(quality * 100)}%<input type="range" min={0.5} max={1} step={0.01} value={quality} onChange={event => { setQuality(Number(event.target.value)); clearResult(); }} className="mt-2 w-full" /></label>}
        <button type="button" onClick={convert} disabled={isProcessing} className="mt-5 w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">{isProcessing ? <><Loader2 className="h-5 w-5 animate-spin" /> Converting...</> : `Convert to ${outputExtension[selectedOutput].toUpperCase()}`}</button>
        {resultUrl && <button type="button" onClick={download} className="mt-3 w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl flex items-center justify-center gap-2"><Download className="h-5 w-5" /> Download {formatBytes(resultSize)} {outputExtension[selectedOutput].toUpperCase()}</button>}
      </>}
      <input ref={inputRef} type="file" accept={inputMime} className="hidden" onChange={event => selectFile(event.target.files?.[0])} />
      {error && <p role="alert" className="mt-4 text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}
    </div></section>
  </main>;
}
