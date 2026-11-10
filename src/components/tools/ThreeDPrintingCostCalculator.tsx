'use client';
import { useMemo, useState } from 'react';
export default function ThreeDPrintingCostCalculator() {
  const [grams,setGrams]=useState(75),[spoolPrice,setSpoolPrice]=useState(22),[spoolGrams,setSpoolGrams]=useState(1000);
  const [hours,setHours]=useState(5),[watts,setWatts]=useState(120),[kwh,setKwh]=useState(.18);
  const [machineHourly,setMachineHourly]=useState(.35),[labor,setLabor]=useState(10),[failure,setFailure]=useState(10),[margin,setMargin]=useState(30);
  const valid=[grams,spoolPrice,spoolGrams,hours,watts,kwh,machineHourly,labor,failure,margin].every(Number.isFinite)&&spoolGrams>0&&grams>=0&&hours>=0&&watts>=0&&spoolPrice>=0&&kwh>=0&&machineHourly>=0&&labor>=0&&failure>=0&&failure<100&&margin>=0&&margin<100;
  const result=useMemo(()=>{if(!valid)return null;const material=grams/spoolGrams*spoolPrice;const energy=hours*watts/1000*kwh;const machine=hours*machineHourly;const base=material+energy+machine+labor;const adjusted=base/(1-failure/100);return {material,energy,machine,base,adjusted,price:adjusted/(1-margin/100)}},[valid,grams,spoolPrice,spoolGrams,hours,watts,kwh,machineHourly,labor,failure,margin]);
  const fields:[string,number,(n:number)=>void,string][]=[['Filament used',grams,setGrams,'g'],['Spool price',spoolPrice,setSpoolPrice,'currency'],['Spool weight',spoolGrams,setSpoolGrams,'g'],['Print duration',hours,setHours,'hours'],['Average power',watts,setWatts,'W'],['Electricity rate',kwh,setKwh,'per kWh'],['Machine cost',machineHourly,setMachineHourly,'per hour'],['Labor and finishing',labor,setLabor,'currency'],['Failed-print allowance',failure,setFailure,'%'],['Target profit margin',margin,setMargin,'%']];
  const money=(n:number)=>n.toFixed(2);
  return <section className="rounded-2xl border border-[var(--border)] p-4 sm:p-6 space-y-5">
    <p className="text-sm text-[var(--muted-foreground)]">Enter costs in your own currency; all monetary results use the same currency. Processing stays in your browser.</p>
    <div className="grid gap-4 sm:grid-cols-2">{fields.map(([label,value,set,unit])=><label key={label} className="block text-sm font-semibold">{label}<div className="mt-1 flex items-center gap-2"><input className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 text-[var(--foreground)]" type="number" min="0" max={unit==='%'?'99.99':undefined} step="any" value={value} onChange={e=>set(e.target.value===''?NaN:Number(e.target.value))}/><span className="text-xs text-[var(--muted-foreground)]">{unit}</span></div></label>)}</div>
    {!valid?<p role="alert" className="text-red-600">Enter valid nonnegative values. Spool weight must exceed zero; failure allowance and margin must be below 100%.</p>:result&&<div aria-live="polite" className="rounded-xl border border-[var(--border)] p-4 space-y-2">
      <h2 className="text-xl font-bold">Estimated price: {money(result.price)}</h2>
      <dl className="grid grid-cols-2 gap-2 text-sm">{[['Filament',result.material],['Electricity',result.energy],['Machine',result.machine],['Labor',labor],['Base cost',result.base],['Cost including failures',result.adjusted],['Suggested selling price',result.price]].map(([name,val])=><div key={String(name)}><dt className="text-[var(--muted-foreground)]">{name}</dt><dd className="font-semibold">{money(Number(val))}</dd></div>)}</dl>
      <button type="button" className="rounded-lg bg-[var(--primary)] px-4 py-2 font-semibold text-white" onClick={()=>{const lines=['3D printing estimate',...Object.entries(result).map(([k,v])=>k+': '+money(v))];void navigator.clipboard?.writeText(lines.join('\n'))}}>Copy estimate</button>
    </div>}
  </section>;
}