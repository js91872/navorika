'use client';
import { useMemo, useState } from 'react';
type Channel = 'c' | 'm' | 'y' | 'k';
const clamp = (n:number) => Math.min(100,Math.max(0,n));
const hex2 = (n:number) => n.toString(16).padStart(2,'0').toUpperCase();
function rgbToCmyk(r:number,g:number,b:number) {
  const rr=r/255,gg=g/255,bb=b/255;
  const k=1-Math.max(rr,gg,bb);
  if(k>=1) return {c:0,m:0,y:0,k:100};
  return {c:Math.round(100*(1-rr-k)/(1-k)),m:Math.round(100*(1-gg-k)/(1-k)),y:Math.round(100*(1-bb-k)/(1-k)),k:Math.round(k*100)};
}
export default function CmykColorConverter(){
  const [values,setValues]=useState<Record<Channel,number>>({c:75,m:25,y:0,k:10});
  const [hexInput,setHexInput]=useState('#39AC E6'.replace(' ',''));
  const [error,setError]=useState('');
  const rgb=useMemo(()=>[values.c,values.m,values.y].map(v=>Math.round(255*(1-v/100)*(1-values.k/100))),[values]);
  const hex='#'+rgb.map(hex2).join('');
  const update=(ch:Channel,value:number)=>{setValues(prev=>({...prev,[ch]:clamp(value)}));setError('')};
  const applyHex=()=>{
    const match=/^#?([0-9a-f]{6})$/i.exec(hexInput.trim());
    if(!match){setError('Enter a six-digit HEX color, such as #336699.');return;}
    const raw=match[1];const next=rgbToCmyk(parseInt(raw.slice(0,2),16),parseInt(raw.slice(2,4),16),parseInt(raw.slice(4,6),16));
    setValues(next);setError('');
  };
  return <section className="space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-6">
    <div className="h-32 rounded-xl border border-[var(--border)]" style={{backgroundColor:hex}} aria-label={`Approximate screen preview ${hex}`} role="img"/>
    <div className="grid gap-4 sm:grid-cols-2">{(['c','m','y','k'] as Channel[]).map(ch=><label key={ch} className="space-y-2 text-sm font-semibold">
      <span className="flex justify-between"><span>{{c:'Cyan',m:'Magenta',y:'Yellow',k:'Black (Key)'}[ch]}</span><span>{values[ch]}%</span></span>
      <input className="w-full" type="range" min="0" max="100" value={values[ch]} onChange={e=>update(ch,Number(e.target.value))}/>
      <input className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] p-2" aria-label={`${ch.toUpperCase()} percentage`} type="number" min="0" max="100" value={values[ch]} onChange={e=>update(ch,Number(e.target.value))}/>
    </label>)}</div>
    <div className="grid gap-4 sm:grid-cols-2"><div className="rounded-xl border border-[var(--border)] p-4"><p className="text-sm">Calculated HEX</p><p className="text-2xl font-bold">{hex}</p><button type="button" className="mt-2 rounded-lg border px-3 py-2" onClick={()=>navigator.clipboard?.writeText(hex)}>Copy HEX</button></div>
    <div className="rounded-xl border border-[var(--border)] p-4"><p className="text-sm">Calculated RGB</p><p className="text-2xl font-bold">{rgb.join(', ')}</p><button type="button" className="mt-2 rounded-lg border px-3 py-2" onClick={()=>navigator.clipboard?.writeText(`rgb(${rgb.join(', ')})`)}>Copy RGB</button></div></div>
    <div className="space-y-2"><label htmlFor="cmyk-hex" className="font-semibold">Convert HEX to approximate CMYK</label><div className="flex gap-2"><input id="cmyk-hex" value={hexInput} onChange={e=>setHexInput(e.target.value)} className="min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] p-3" placeholder="#336699"/><button type="button" className="rounded-lg bg-[var(--primary)] px-4 py-2 text-white" onClick={applyHex}>Convert</button></div>{error&&<p role="alert" className="text-red-600">{error}</p>}</div>
    <p className="text-sm text-[var(--muted-foreground)]">Approximate device-independent arithmetic only. CMYK-to-RGB and RGB-to-CMYK conversions are not color-managed: ICC profiles, ink, paper, rendering intent and print equipment can change printed colors. This tool does not provide Pantone matches or print-ready ICC conversion. All calculations run in your browser.</p>
  </section>;
}
