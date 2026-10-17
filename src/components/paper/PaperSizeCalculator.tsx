'use client';
import { useMemo, useState } from 'react';
import { inch,pixels,paperSizes } from '@/lib/paperSizes';
export default function PaperSizeCalculator(){
 const [name,setName]=useState('A4');const [unit,setUnit]=useState('mm');const [dpi,setDpi]=useState(300);const [landscape,setLandscape]=useState(false);
 const paper=useMemo(()=>paperSizes.find(p=>p.name===name)??paperSizes[4],[name]);
 const width=landscape?paper.height:paper.width,height=landscape?paper.width:paper.height;
 function format(mm:number){switch(unit){case 'cm':return (mm/10).toFixed(2);case 'in':return inch(mm).toFixed(3);case 'px':return String(pixels(mm,dpi));default:return String(Number(mm.toFixed(2)));}}
 return <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-8" aria-labelledby="calculator-title">
 <h2 id="calculator-title" className="text-2xl font-bold">Paper size converter</h2>
 <p className="mt-2 text-sm text-[var(--muted-foreground)]">Choose a standard paper size, measurement unit and print resolution. Conversions update instantly in your browser.</p>
 <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
 <label className="text-sm font-semibold">Paper format<select className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] p-3" value={name} onChange={e=>setName(e.target.value)}>{paperSizes.map(p=><option key={p.slug} value={p.name}>{p.name}</option>)}</select></label>
 <label className="text-sm font-semibold">Units<select className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] p-3" value={unit} onChange={e=>setUnit(e.target.value)}><option value="mm">Millimetres (mm)</option><option value="cm">Centimetres (cm)</option><option value="in">Inches</option><option value="px">Pixels</option></select></label>
 <label className="text-sm font-semibold">DPI for pixels<select className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] p-3" value={dpi} onChange={e=>setDpi(Number(e.target.value))} disabled={unit!=='px'}>{[72,96,150,300,600].map(n=><option key={n} value={n}>{n} DPI</option>)}</select></label>
 <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={landscape} onChange={e=>setLandscape(e.target.checked)}/> Landscape orientation</label>
 </div><div className="mt-6 rounded-xl bg-[var(--muted)] p-5">
 <p className="text-sm">Dimensions ({unit==='px'?dpi+' DPI':unit})</p><p aria-live="polite" className="mt-2 text-3xl font-bold">{format(width)} × {format(height)} {unit}</p>
 <p className="mt-2 text-sm">{paper.note} · {paper.group}</p>
 <button type="button" className="mt-4 rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800" onClick={()=>navigator.clipboard?.writeText(`${format(width)} × ${format(height)} ${unit}`)}>Copy dimensions</button>
 </div></section>
}
