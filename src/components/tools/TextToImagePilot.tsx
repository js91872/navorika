'use client';
import { useState } from 'react';
export default function TextToImage() {
 const [value,setValue]=useState('Your text goes here');
 const [fontSize,setFontSize]=useState(32);
 const [dark,setDark]=useState(false);
 const [error,setError]=useState('');
 const download=()=>{
  setError('');
  const lines=value.replace(/\r\n/g,'\n').split('\n');
  if(lines.length>100 || value.length>8000){setError('Use up to 100 lines and 8,000 characters.');return;}
  const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');
  if(!ctx){setError('Canvas is unavailable.');return;}
  ctx.font=fontSize+'px Arial, sans-serif';
  const maxLine=Math.max(1,...lines.map(l=>ctx.measureText(l).width));
  const width=Math.min(4096,Math.max(400,Math.ceil(maxLine+80)));
  const height=Math.ceil(lines.length*fontSize*1.5+80);
  if(height>8192){setError('Image height is too large. Reduce the font size or line count.');return;}
  canvas.width=width;canvas.height=height;
  ctx.fillStyle=dark?'#101827':'#ffffff';ctx.fillRect(0,0,width,height);
  ctx.font=fontSize+'px Arial, sans-serif';ctx.textBaseline='top';ctx.fillStyle=dark?'#ffffff':'#111827';
  lines.forEach((line,i)=>ctx.fillText(line,40,40+i*fontSize*1.5,width-80));
  canvas.toBlob(blob=>{if(!blob){setError('PNG export failed.');return;}const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='text-image.png';a.click();window.setTimeout(()=>URL.revokeObjectURL(url),1000);},'image/png');
 };
 return <section className="space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
  <label htmlFor="image-text" className="block font-semibold">Text to turn into an image</label>
  <textarea id="image-text" rows={7} value={value} onChange={e=>setValue(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] p-3"/>
  <label className="block text-sm font-medium" htmlFor="font-size">Font size: {fontSize}px</label>
  <input id="font-size" type="range" min={16} max={60} value={fontSize} onChange={e=>setFontSize(Number(e.target.value))}/>
  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={dark} onChange={e=>setDark(e.target.checked)}/> Dark background</label>
  {error&&<p role="alert" className="text-red-600">{error}</p>}
  <button type="button" onClick={download} className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white">Download text as PNG</button>
  <p className="text-sm text-[var(--muted-foreground)]">Creates a PNG image in your browser. No account or upload required. For very long lines, text may be clipped: add manual line breaks before exporting.</p>
 </section>;
}