'use client';
import { useMemo, useState } from 'react';

type Generation = { name: string; short: string; years: string; description: string; note?: string };
function classify(year: number): Generation {
  if (year >= 2025) return { name: 'Generation Beta', short: 'GEN BETA', years: '2025 onward (provisional)', description: 'A new generation growing up alongside increasingly capable digital technology.', note: 'Generation Beta dates are proposed, not universally accepted.' };
  if (year >= 2013) return { name: 'Generation Alpha', short: 'GEN ALPHA', years: '2013–2024 (illustrative)', description: 'A generation growing up with touchscreens, connected classrooms and AI tools.', note: 'Some researchers begin Gen Alpha in 2010; boundaries vary.' };
  if (year >= 1997) return { name: 'Generation Z', short: 'GEN Z', years: '1997–2012', description: 'A generation shaped by mobile internet, social media and rapid technological change.' };
  if (year >= 1981) return { name: 'Millennials (Generation Y)', short: 'MILLENNIAL', years: '1981–1996', description: 'A generation that experienced the transition from analog childhoods to digital adulthood.' };
  if (year >= 1965) return { name: 'Generation X', short: 'GEN X', years: '1965–1980', description: 'A generation that witnessed personal computers and major shifts in media and work.' };
  if (year >= 1946) return { name: 'Baby Boomers', short: 'BOOMER', years: '1946–1964', description: 'A generation born during the postwar baby boom.' };
  if (year >= 1928) return { name: 'Silent Generation', short: 'SILENT GEN', years: '1928–1945', description: 'A generation shaped by the Depression era and World War II.' };
  return { name: 'Greatest Generation', short: 'GREATEST GEN', years: 'Before 1928', description: 'A historical cohort associated with the Great Depression and World War II.' };
}
const GOLD = '#f4d58c';
function drawCard(canvas: HTMLCanvasElement, year: number, gen: Generation, name: string) {
  const c = canvas.getContext('2d'); if (!c) return;
  canvas.width = 1200; canvas.height = 750;
  const gradient = c.createLinearGradient(0,0,1200,750);
  gradient.addColorStop(0,'#251044'); gradient.addColorStop(.55,'#4c247a'); gradient.addColorStop(1,'#180b35');
  c.fillStyle = gradient; c.fillRect(0,0,1200,750);
  c.strokeStyle = '#d9b76c'; c.lineWidth = 5; c.strokeRect(32,32,1136,686);
  c.strokeStyle = 'rgba(244,213,140,.20)'; c.lineWidth = 2;
  for(let i=0;i<7;i++){c.beginPath();c.arc(1060,120,100+i*58,0,Math.PI*2);c.stroke();}
  c.fillStyle=GOLD; c.font='bold 36px Arial, sans-serif'; c.fillText('NAV O R I K A'.replace(/ /g,''),78,112);
  c.font='25px Arial, sans-serif'; c.fillText('GENERATION IDENTITY PASS',78,168);
  c.fillStyle='#ffffff'; c.font='bold 85px Arial, sans-serif'; c.fillText(gen.short,78,332);
  c.font='33px Arial, sans-serif'; c.fillText(gen.name,78,395);
  c.fillStyle=GOLD; c.font='26px Arial, sans-serif'; c.fillText('BORN',80,488);
  c.fillStyle='#ffffff'; c.font='bold 52px Arial, sans-serif'; c.fillText(String(year),80,550);
  c.fillStyle=GOLD; c.font='26px Arial, sans-serif'; c.fillText('GENERATION YEARS',430,488);
  c.fillStyle='#ffffff'; c.font='bold 31px Arial, sans-serif'; c.fillText(gen.years,430,543);
  if(name.trim()){c.fillStyle='#ffffff';c.font='bold 28px Arial, sans-serif';c.fillText(name.trim().slice(0,32),80,632);}
  c.fillStyle='#d9c8ed'; c.font='23px Arial, sans-serif'; c.fillText('navorika.com/tools/what-generation-am-i',80,682);
}
export default function GenerationCalculator() {
  const [year,setYear]=useState('1998'); const [name,setName]=useState(''); const [status,setStatus]=useState('');
  const n=Number(year); const valid=/^\d{4}$/.test(year)&&n>=1900&&n<=new Date().getFullYear();
  const gen=useMemo(()=>valid?classify(n):null,[n,valid]);
  function makeCanvas(){if(!gen)return null;const c=document.createElement('canvas');drawCard(c,n,gen,name);return c;}
  function downloadJpg(){const c=makeCanvas();if(!c)return;c.toBlob(blob=>{if(!blob)return;const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='my-generation-pass.jpg';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);},'image/jpeg',.94);}
  async function share(){const c=makeCanvas();if(!c)return;const blob=await new Promise<Blob|null>(resolve=>c.toBlob(resolve,'image/png'));if(!blob)return;const file=new File([blob],'generation-pass.png',{type:'image/png'});try{if(navigator.canShare?.({files:[file]})){await navigator.share({files:[file],title:'My Generation Pass'});}else{downloadJpg();setStatus('Image downloaded. You can share it from your device.');}}catch(e){if((e as Error).name!=='AbortError')setStatus('Sharing unavailable. Please download the image instead.');}}
  function printPdf(){const c=makeCanvas();if(!c)return;const w=window.open('','_blank');if(!w){setStatus('Allow pop-ups to save as PDF, or download the JPG.');return;}const src=c.toDataURL('image/png');w.document.write('<!doctype html><html><head><title>Generation Pass</title><style>@page{size:landscape;margin:10mm}body{margin:0;display:grid;place-items:center;min-height:95vh}img{width:100%;max-width:1000px}@media print{img{max-width:100%}}</style></head><body><img alt="Generation pass" src="'+src+'"><script>window.onload=function(){window.print()}<\/script></body></html>');w.document.close();}
  return <div className="space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-6">
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block text-sm font-semibold">Birth year<input type="number" min="1900" max={new Date().getFullYear()} value={year} onChange={e=>setYear(e.target.value)} className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 text-base" /></label>
      <label className="block text-sm font-semibold">Name on pass (optional)<input maxLength={32} value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 text-base" /></label>
    </div>
    {!gen?<p role="alert">Enter a valid four-digit birth year between 1900 and the current year.</p>:<>
      <div className="overflow-hidden rounded-2xl border-2 border-[#d9b76c] bg-gradient-to-br from-[#251044] via-[#4c247a] to-[#180b35] p-6 text-white shadow-xl sm:p-9" aria-label={'Generation pass: '+gen.name}>
        <div className="flex justify-between gap-3 text-[#f4d58c]"><span className="font-bold tracking-[.18em]">NAVORIKA</span><span className="text-xs tracking-wider">GENERATION PASS</span></div>
        <div className="py-10"><p className="text-4xl font-black tracking-wide sm:text-6xl">{gen.short}</p><p className="mt-3 text-lg">{gen.name}</p></div>
        <div className="grid grid-cols-2 gap-4 border-t border-[#f4d58c]/40 pt-5"><div><p className="text-xs text-[#f4d58c]">BORN</p><p className="text-2xl font-bold">{n}</p></div><div><p className="text-xs text-[#f4d58c]">GENERATION YEARS</p><p className="font-semibold">{gen.years}</p></div></div>
        {name.trim()&&<p className="mt-5 font-semibold">{name.trim()}</p>}
        <p className="mt-5 text-xs text-[#e6d4f6]">navorika.com/tools/what-generation-am-i</p>
      </div>
      <div><h3 className="text-xl font-bold">You belong to {gen.name}</h3><p className="mt-2">{gen.description}</p><p className="mt-2 text-sm">You turn {new Date().getFullYear()-n} in {new Date().getFullYear()} (your exact age depends on your birthday).</p>{gen.note&&<p className="mt-2 text-sm text-[var(--muted-foreground)]">{gen.note}</p>}</div>
      <div className="flex flex-wrap gap-3"><button type="button" onClick={downloadJpg} className="rounded-lg bg-[#542384] px-5 py-3 font-semibold text-white">Download JPG</button><button type="button" onClick={printPdf} className="rounded-lg border border-[var(--border)] px-5 py-3 font-semibold">Save as PDF</button><button type="button" onClick={share} className="rounded-lg border border-[var(--border)] px-5 py-3 font-semibold">Share pass</button></div>
      {status&&<p role="status" className="text-sm">{status}</p>}
      <p className="text-xs text-[var(--muted-foreground)]">Your birth year and optional name stay in your browser. This is a fun, shareable informational card, not an official identity document. Generation dates are approximate.</p>
    </>}
  </div>;
}
