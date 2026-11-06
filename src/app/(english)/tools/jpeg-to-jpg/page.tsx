'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function JpegToJpgPage() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(92);
  const [mode, setMode] = useState<'rename' | 'reencode'>('rename');
  const [result, setResult] = useState<{url:string; size:number; name:string}|null>(null);
  const [error, setError] = useState('');
  const [working, setWorking] = useState(false);
  useEffect(() => () => { if (result) URL.revokeObjectURL(result.url); }, [result]);
  const clear = () => setResult(prev => { if (prev) URL.revokeObjectURL(prev.url); return null; });
  async function convert() {
    if (!file) return;
    setWorking(true); setError(''); clear();
    try {
      const name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
      if (mode === 'rename') {
        setResult({url:URL.createObjectURL(file),size:file.size,name});
      } else {
        const bitmap = await createImageBitmap(file, { imageOrientation:'from-image' });
        try {
          const canvas = document.createElement('canvas');
          canvas.width=bitmap.width;canvas.height=bitmap.height;
          const ctx=canvas.getContext('2d');
          if (!ctx) throw new Error('Canvas is unavailable');
          ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(bitmap,0,0);
          const output = await new Promise<Blob|null>(resolve => canvas.toBlob(resolve,'image/jpeg',quality/100));
          if (!output || output.type !== 'image/jpeg') throw new Error('JPEG encoding is unsupported');
          setResult({url:URL.createObjectURL(output),size:output.size,name});
        } finally { bitmap.close(); }
      }
    } catch { setError('Could not read this JPEG. Try another image or use the extension-only option.'); }
    finally { setWorking(false); }
  }
  return <main className="mx-auto max-w-3xl px-5 py-12">
    <Link href="/categories/image-tools" className="text-sm text-red-600 hover:underline">Image Tools</Link>
    <h1 className="mt-4 text-3xl font-bold">JPEG to JPG Converter</h1>
    <p className="mt-3 text-slate-600 dark:text-slate-300">JPEG and JPG are the same image format. Rename without changing image data, or optionally re-encode at a new quality. Everything stays in your browser.</p>
    <section className="mt-8 space-y-5 rounded-2xl border border-slate-200 p-6 dark:border-slate-700">
      <label className="block font-semibold">Choose a JPEG photo
        <input className="mt-2 block w-full rounded-lg border p-3 dark:bg-slate-900" type="file" accept=".jpeg,.jpg,image/jpeg" onChange={e=>{const f=e.target.files?.[0]??null;clear();setError('');if(f && !/\.jpe?g$/i.test(f.name) && f.type !== 'image/jpeg'){setError('Select a JPEG or JPG file.');setFile(null)}else setFile(f);}}/>
      </label>
      <fieldset className="space-y-3"><legend className="font-semibold">Conversion method</legend>
        <label className="flex items-start gap-2"><input type="radio" name="mode" checked={mode==='rename'} onChange={()=>{setMode('rename');clear();}}/> <span><strong>Change extension only (recommended).</strong> Original image bytes and quality stay exactly the same.</span></label>
        <label className="flex items-start gap-2"><input type="radio" name="mode" checked={mode==='reencode'} onChange={()=>{setMode('reencode');clear();}}/> <span><strong>Re-encode JPEG.</strong> Creates a new JPEG and may reduce quality or remove metadata.</span></label>
      </fieldset>
      {mode==='reencode' && <label className="block">JPEG quality: {quality}%<input className="mt-2 block w-full" type="range" min="40" max="100" value={quality} onChange={e=>{setQuality(Number(e.target.value));clear();}}/></label>}
      {file && <p className="text-sm">Original file: {file.name} ({(file.size/1024).toFixed(1)} KB)</p>}
      <button className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white disabled:opacity-40" disabled={!file||working} onClick={convert}>{working?'Processing…':'Prepare JPG'}</button>
      {error && <p role="alert" className="text-red-600">{error}</p>}
      {result && <div className="space-y-3"><p>Ready: {result.name} ({(result.size/1024).toFixed(1)} KB)</p><a href={result.url} download={result.name} className="inline-block rounded-lg border border-red-600 px-5 py-3 font-semibold text-red-600">Download JPG</a></div>}
    </section>
    <p className="mt-6 text-sm text-slate-600 dark:text-slate-300">Changing .jpeg to .jpg never improves resolution or reduces the image size. Re-encoding can be lossy and can strip EXIF/ICC metadata, so keep the original for important photos.</p>
  </main>;
}
