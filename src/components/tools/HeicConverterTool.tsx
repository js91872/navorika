'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft, Download, FileImage, Loader2, ShieldCheck, Upload, X } from 'lucide-react';

type OutputFormat = 'jpeg' | 'png';
type Props = { outputFormat: OutputFormat; title: string; description: string };

function formatBytes(bytes: number) {
  return bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function HeicConverterTool({ outputFormat, title, description }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState('');
  const [resultSize, setResultSize] = useState(0);
  const [quality, setQuality] = useState(0.92);
  const [multipleImages, setMultipleImages] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => { if (resultUrl) URL.revokeObjectURL(resultUrl); }, [resultUrl]);

  const clearResult = () => {
    setResultUrl(current => { if (current) URL.revokeObjectURL(current); return ''; });
    setResultSize(0);
    setMultipleImages(false);
  };

  const selectFile = (selected: File | undefined) => {
    if (!selected || !/\.(heic|heif)$/i.test(selected.name)) {
      setError('Please select a HEIC or HEIF file.');
      return;
    }
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
      const { default: heic2any } = await import('heic2any');
      const converted = await heic2any({ blob: file, toType: `image/${outputFormat}`, quality: outputFormat === 'jpeg' ? quality : undefined, multiple: true });
      const images = Array.isArray(converted) ? converted : [converted];
      if (!images.length) throw new Error('No image decoded.');
      const expectedMime = `image/${outputFormat}`;
      const first = images[0];
      if (first.type !== expectedMime) throw new Error('The decoder returned an unexpected image format.');
      setMultipleImages(images.length > 1);
      setResultSize(first.size);
      setResultUrl(URL.createObjectURL(first));
    } catch {
      setError('The HEIC file could not be decoded. It may be damaged, unsupported, or too large for this browser.');
    } finally {
      setIsProcessing(false);
    }
  };

  const download = () => {
    if (!file || !resultUrl) return;
    const extension = outputFormat === 'jpeg' ? 'jpg' : 'png';
    const anchor = document.createElement('a');
    anchor.href = resultUrl;
    anchor.download = `${file.name.replace(/\.(heic|heif)$/i, '')}.${extension}`;
    anchor.click();
  };

  return <main className="max-w-4xl mx-auto px-6 py-12 lg:px-8">
    <Link href="/categories/image-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition mb-8"><ArrowLeft className="h-4 w-4" /> Back to Image Tools</Link>
    <div className="text-center mb-10"><div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/20"><ShieldCheck className="h-4 w-4" /> Local Processing Only</div><h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{title}</h1><p className="text-lg text-slate-600 dark:text-slate-400">{description}</p></div>
    <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden mb-16"><div className="p-8">
      {!file ? <button type="button" onClick={() => inputRef.current?.click()} className="w-full border-2 border-dashed border-indigo-300 dark:border-indigo-500/30 rounded-2xl p-12 flex flex-col items-center justify-center text-center hover:bg-indigo-50 dark:hover:bg-indigo-500/5"><Upload className="h-10 w-10 text-indigo-500 mb-4" /><span className="text-xl font-bold">Choose HEIC or HEIF</span></button> : <>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60"><FileImage className="h-7 w-7 text-indigo-500" /><div className="flex-1 min-w-0"><p className="font-bold truncate">{file.name}</p><p className="text-xs text-slate-500">{formatBytes(file.size)}</p></div><button type="button" onClick={() => { setFile(null); clearResult(); }} aria-label="Remove HEIC file" className="p-2"><X className="h-5 w-5" /></button></div>
        {outputFormat === 'jpeg' && <label className="mt-5 block text-sm font-bold">JPG quality: {Math.round(quality * 100)}%<input type="range" min={0.5} max={1} step={0.01} value={quality} onChange={event => { setQuality(Number(event.target.value)); clearResult(); }} className="mt-2 w-full" /></label>}
        <button type="button" onClick={convert} disabled={isProcessing} className="mt-5 w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">{isProcessing ? <><Loader2 className="h-5 w-5 animate-spin" /> Decoding...</> : `Convert to ${outputFormat === 'jpeg' ? 'JPG' : 'PNG'}`}</button>
        {resultUrl && <div className="mt-6"><p className="text-sm font-bold mb-2">Converted preview</p><div className="h-80 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-3 flex items-center justify-center"><img src={resultUrl} alt={`Converted ${outputFormat} preview`} className="max-h-full max-w-full object-contain" /></div>{multipleImages && <p className="mt-3 text-sm text-amber-700 dark:text-amber-400 flex items-start gap-2"><AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" /> This container includes multiple images. Only the first decoded image is included in this download.</p>}<button type="button" onClick={download} className="mt-4 w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl flex items-center justify-center gap-2"><Download className="h-5 w-5" /> Download {formatBytes(resultSize)} {outputFormat === 'jpeg' ? 'JPG' : 'PNG'}</button></div>}
      </>}
      <input ref={inputRef} type="file" accept=".heic,.heif,image/heic,image/heif" className="hidden" onChange={event => selectFile(event.target.files?.[0])} />
      {error && <p role="alert" className="mt-4 text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}
    </div></section>
  </main>;
}
