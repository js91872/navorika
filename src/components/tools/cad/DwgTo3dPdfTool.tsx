'use client';
import { useEffect, useState } from 'react';

export default function DwgTo3dPdfTool() {
  const [file,setFile] = useState<File|null>(null);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState('');
  const [available,setAvailable] = useState<boolean|null>(null);
  useEffect(() => { fetch('/api/dwg-to-3d-pdf', {cache:'no-store'}).then(r=>r.json()).then(d=>setAvailable(Boolean(d.available))).catch(()=>setAvailable(false)); }, []);
  async function convert() {
    if (!file || busy) return;
    setBusy(true);setError('');
    try {
      const body=new FormData();body.set('file',file);
      const r=await fetch('/api/dwg-to-3d-pdf',{method:'POST',body});
      if (!r.ok) {const j=await r.json().catch(()=>({}));throw new Error(j.error||'Conversion failed');}
      const blob=await r.blob();const url=URL.createObjectURL(blob);
      const a=document.createElement('a');a.href=url;a.download=file.name.replace(/\.[^.]+$/,'')+'-3d.pdf';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
    } catch(e) {setError(e instanceof Error?e.message:'Conversion failed');}
    finally {setBusy(false);}
  }
  return <section className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
    <label htmlFor="dwg-file" className="block text-lg font-semibold">Upload your DWG or DXF 3D mesh</label>
    <p className="my-3 text-sm text-slate-600 dark:text-slate-300">Choose a file up to 20 MB. Works with triangulated 3D faces and mesh geometry. Does not convert a 2D plan into a 3D model or support native ACIS solids.</p>
    <input id="dwg-file" type="file" accept=".dwg,.dxf" className="block w-full rounded-lg border p-3" onChange={e=>{setError('');setFile(e.target.files?.[0]??null);}} />
    {available===false && <p role="status" className="mt-3 text-amber-700">Server conversion components are not fully configured yet. Conversions may be unavailable.</p>}
    <button type="button" onClick={convert} disabled={!file||busy||available===false} className="mt-4 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{busy?'Converting 3D model…':'Convert to 3D PDF'}</button>
    {error && <p role="alert" className="mt-3 text-red-600">{error}</p>}
    <p className="mt-4 text-xs text-slate-500">Uploaded files are processed in temporary server storage and removed after conversion. For interactive 3D viewing, use a PDF reader with PRC/U3D support; browser PDF previews may not display 3D content.</p>
  </section>;
}
