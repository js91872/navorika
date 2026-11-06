'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function PdfToJpgAllPages() {
  const [file,setFile]=useState<File|null>(null);
  const [quality,setQuality]=useState(85);
  const [scale,setScale]=useState(1.5);
  const [progress,setProgress]=useState('');
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);
  async function processPdf() {
    if (!file) return;
    setBusy(true);setError('');setProgress('Reading PDF…');
    let task: import('pdfjs-dist').PDFDocumentLoadingTask | undefined;
    try {
      const [pdfjs,{default:JSZip}] = await Promise.all([import('pdfjs-dist'),import('jszip')]);
      pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs',import.meta.url).toString();
      task=pdfjs.getDocument({data:new Uint8Array(await file.arrayBuffer())});
      const pdf=await task.promise;
      if(pdf.numPages>40) throw new Error('For browser safety, use a PDF with 40 pages or fewer.');
      const zip=new JSZip();
      for(let pageNo=1;pageNo<=pdf.numPages;pageNo++) {
        setProgress('Converting page '+pageNo+' of '+pdf.numPages);
        const page=await pdf.getPage(pageNo);
        const viewport=page.getViewport({scale});
        if(viewport.width*viewport.height>20_000_000) throw new Error('A page exceeds the safe image size. Choose a lower resolution.');
        const canvas=document.createElement('canvas');
        canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);
        const ctx=canvas.getContext('2d',{alpha:false});
        if(!ctx) throw new Error('Canvas unavailable.');
        await page.render({canvas,canvasContext:ctx,viewport,background:'#ffffff'}).promise;
        const blob=await new Promise<Blob|null>(r=>canvas.toBlob(r,'image/jpeg',quality/100));
        if(!blob||blob.type!=='image/jpeg') throw new Error('JPEG export failed.');
        zip.file('page-'+String(pageNo).padStart(3,'0')+'.jpg',blob);
        canvas.width=0;canvas.height=0;
        page.cleanup();
      }
      setProgress('Creating ZIP…');
      const archive=await zip.generateAsync({type:'blob',compression:'STORE'});
      const url=URL.createObjectURL(archive);
      const a=document.createElement('a');a.href=url;a.download=file.name.replace(/\.pdf$/i,'')+'-jpg-pages.zip';a.click();
      setTimeout(()=>URL.revokeObjectURL(url),30000);
      setProgress('ZIP downloaded ('+pdf.numPages+' JPG images).');
    } catch(e) { setError(e instanceof Error?e.message:'Conversion failed.');setProgress(''); }
    finally { if(task) await task.destroy().catch(()=>{});setBusy(false); }
  }
  return <main className="mx-auto max-w-3xl px-5 py-12">
    <Link href="/categories/pdf-tools" className="text-sm text-red-600 hover:underline">PDF Tools</Link>
    <h1 className="mt-4 text-3xl font-bold">PDF to JPG – All Pages</h1>
    <p className="mt-3 text-slate-600 dark:text-slate-300">Convert every page of a PDF into a separate JPG and download the images together as a ZIP. Your PDF is processed locally in your browser.</p>
    <section className="mt-8 space-y-5 rounded-2xl border border-slate-200 p-6 dark:border-slate-700">
      <label className="block font-semibold">Choose a PDF (up to 40 pages and 40 MB)<input type="file" accept=".pdf,application/pdf" className="mt-2 block w-full rounded-lg border p-3 dark:bg-slate-900" onChange={e=>{const f=e.target.files?.[0]??null;setError('');setProgress('');if(f&&f.size>40*1024*1024){setFile(null);setError('Choose a PDF smaller than 40 MB.')}else setFile(f);}}/></label>
      <label className="block">Resolution<select className="mt-2 block w-full rounded-lg border p-3 dark:bg-slate-900" value={scale} onChange={e=>setScale(Number(e.target.value))}><option value={1}>Standard (1x)</option><option value={1.5}>High (1.5x)</option><option value={2}>Very high (2x)</option></select></label>
      <label className="block">JPG quality: {quality}%<input type="range" min="50" max="100" value={quality} className="mt-2 block w-full" onChange={e=>setQuality(Number(e.target.value))}/></label>
      <button disabled={!file||busy} onClick={processPdf} className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white disabled:opacity-40">{busy?'Converting…':'Download All JPG Pages as ZIP'}</button>
      <p role="status" aria-live="polite">{progress}</p>{error&&<p role="alert" className="text-red-600">{error}</p>}
    </section>
    <p className="mt-6 text-sm text-slate-600 dark:text-slate-300">JPG has no transparency and is lossy; PDF text becomes pixels rather than selectable text. Large or protected PDFs may not work. For a single page, use <Link href="/tools/pdf-to-jpg" className="text-red-600 underline">PDF to JPG</Link>.</p>
  </main>;
}
