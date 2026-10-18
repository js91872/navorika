'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Loader2, ShieldCheck, Upload, X } from 'lucide-react';

type Item = { file: File; url: string };
const supportedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const maximumImages = 12;

export default function Page() {
  const [items, setItems] = useState<Item[]>([]);
  const [columns, setColumns] = useState(3);
  const [gap, setGap] = useState(12);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const itemsRef = useRef<Item[]>([]);

  useEffect(() => { itemsRef.current = items; }, [items]);
  useEffect(() => () => itemsRef.current.forEach(item => URL.revokeObjectURL(item.url)), []);

  const add = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    const files = Array.from(list);
    if (files.some(file => !supportedTypes.has(file.type))) {
      setError('Only JPG, PNG, and WebP images are accepted.');
      if (input.current) input.current.value = '';
      return;
    }

    setItems(current => {
      const available = Math.max(0, maximumImages - current.length);
      const accepted = files.slice(0, available).map(file => ({ file, url: URL.createObjectURL(file) }));
      return [...current, ...accepted];
    });
    setError(items.length + files.length > maximumImages ? `A collage can contain up to ${maximumImages} images.` : '');
    if (input.current) input.current.value = '';
  };

  const remove = (index: number) => {
    setItems(current => {
      const removed = current[index];
      if (removed) URL.revokeObjectURL(removed.url);
      return current.filter((_, itemIndex) => itemIndex !== index);
    });
    setError('');
  };

  const create = async () => {
    if (items.length === 0) return;
    setIsProcessing(true);
    setError('');
    const bitmaps: ImageBitmap[] = [];
    try {
      if (typeof createImageBitmap !== 'function') throw new Error('Image decoding is unavailable.');
      for (const item of items) {
        const bitmap = await createImageBitmap(item.file, { imageOrientation: 'from-image' });
        if (bitmap.width < 1 || bitmap.height < 1) {
          bitmap.close();
          throw new Error('An image has invalid dimensions.');
        }
        bitmaps.push(bitmap);
      }

      const size = 1200;
      const rows = Math.ceil(bitmaps.length / columns);
      const cellWidth = (size - gap * (columns + 1)) / columns;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = Math.ceil(cellWidth * rows + gap * (rows + 1));
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas is unavailable.');
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);

      bitmaps.forEach((bitmap, index) => {
        const column = index % columns;
        const row = Math.floor(index / columns);
        const x = gap + column * (cellWidth + gap);
        const y = gap + row * (cellWidth + gap);
        const scale = Math.max(cellWidth / bitmap.width, cellWidth / bitmap.height);
        const width = bitmap.width * scale;
        const height = bitmap.height * scale;
        context.save();
        context.beginPath();
        context.rect(x, y, cellWidth, cellWidth);
        context.clip();
        context.drawImage(bitmap, x + (cellWidth - width) / 2, y + (cellWidth - height) / 2, width, height);
        context.restore();
      });

      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
      if (!blob || blob.type !== 'image/png') throw new Error('PNG encoding failed.');
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'photo-collage.png';
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 0);
    } catch {
      setError('The collage could not be created. An image may be damaged, unsupported, or too large for this browser.');
    } finally {
      bitmaps.forEach(bitmap => bitmap.close());
      setIsProcessing(false);
    }
  };

  return <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
    <Link href="/categories/image-tools" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 mb-8"><ArrowLeft className="h-4 w-4" /> Back to Image Tools</Link>
    <div className="text-center mb-8"><div className="inline-flex gap-2 text-xs font-bold text-emerald-600"><ShieldCheck className="h-4 w-4" /> LOCAL PROCESSING</div><h1 className="text-4xl font-black mt-4">Photo Collage Maker</h1><p className="mt-3 text-slate-500">Create a square-cell PNG collage from up to 12 images.</p></div>
    <section className="bg-white dark:bg-slate-900 rounded-3xl border shadow-xl p-5 sm:p-8">
      <button type="button" onClick={() => input.current?.click()} disabled={items.length >= maximumImages || isProcessing} className="w-full p-8 border-2 border-dashed rounded-2xl flex flex-col items-center disabled:opacity-50"><Upload className="h-8 w-8 text-indigo-500" /><span className="mt-2 font-bold">Choose JPG, PNG, or WebP images</span></button>
      <input ref={input} type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden" onChange={event => add(event.target.files)} />
      {items.length > 0 && <>
        <div className="mt-5 grid grid-cols-3 sm:grid-cols-4 gap-3">{items.map((item, index) => <div key={`${item.file.name}-${item.file.lastModified}-${index}`} className="relative aspect-square"><img src={item.url} alt={`Collage source ${index + 1}`} className="w-full h-full object-cover rounded-xl" /><button type="button" onClick={() => remove(index)} disabled={isProcessing} aria-label={`Remove image ${index + 1}`} className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-full"><X className="h-4 w-4" /></button></div>)}</div>
        <div className="mt-5 grid sm:grid-cols-2 gap-4"><label className="font-bold text-sm">Columns<select value={columns} onChange={event => setColumns(Number(event.target.value))} disabled={isProcessing} className="mt-2 w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-800"><option value={2}>2</option><option value={3}>3</option><option value={4}>4</option></select></label><label className="font-bold text-sm">Gap: {gap}px<input type="range" min={0} max={40} value={gap} onChange={event => setGap(Number(event.target.value))} disabled={isProcessing} className="mt-4 w-full" /></label></div>
        <button type="button" onClick={() => void create()} disabled={isProcessing} className="mt-5 w-full py-4 rounded-xl bg-indigo-600 text-white font-bold flex justify-center gap-2 disabled:opacity-50">{isProcessing ? <><Loader2 className="h-5 w-5 animate-spin" /> Creating collage...</> : <><Download className="h-5 w-5" /> Create PNG Collage</>}</button>
      </>}
      {error && <p role="alert" className="mt-4 text-red-600">{error}</p>}
    </section>
  </main>;
}
