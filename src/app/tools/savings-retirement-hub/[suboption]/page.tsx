'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck, Calculator, RefreshCw } from 'lucide-react';
import { savingsSubTools } from '@/data/financeMeta';

export default function DynamicSubOptionTool() {
  const params = useParams();
  const router = useRouter();
  const suboption = (params?.suboption as string) || 'ppf-calculator';
  
  const seo = savingsSubTools[suboption] || savingsSubTools['ppf-calculator'];

  // Universal Inputs for structural rendering
  const [valA, setValA] = useState(100000);
  const [valB, setValB] = useState(10);
  const [valC, setValC] = useState(5);
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    document.title = seo.title;
    runMath();
  }, [suboption, seo, valA, valB, valC]);

  const runMath = () => {
    // Basic dynamic math execution based on sub-route active state
    if (suboption.includes('cagr')) setResult(Math.pow(valB/valA, 1/valC) - 1);
    else if (suboption.includes('ppf') || suboption.includes('compound')) setResult(valA * Math.pow(1 + (valB/100), valC));
    else if (suboption.includes('gst')) setResult(valA + (valA * (valB/100)));
    else if (suboption.includes('budget')) setResult(valA * 0.5); // 50% needs
    else setResult(valA * (valB/100) * valC); // generic fallback
  };

  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialCalculator",
    "name": seo.title,
    "description": seo.description,
    "url": `https://navorika.com/tools/savings-retirement-hub/${suboption}`,
    "category": "Financial Application"
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }} />

      <a href="/categories/finance-calculators" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Finance Suite
      </a>

      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-500/20">
          <ShieldCheck className="h-4 w-4" /> Verified High-Precision Sandbox
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{seo.heading}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">{seo.description}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl w-fit border">
        {Object.keys(savingsSubTools).map((key) => (
          <button 
            key={key} 
            onClick={() => router.push(`/tools/savings-retirement-hub/${key}`)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${suboption === key ? 'bg-white dark:bg-slate-900 text-blue-600 shadow' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {key.replace(/-/g, ' ')}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-white dark:bg-slate-900 border rounded-3xl p-8 space-y-6 shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 flex items-center gap-2"><Calculator className="h-4 w-4"/> Calculator Parameters</h3>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Primary Capital Value</label>
            <input type="number" value={valA} onChange={e => setValA(Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border outline-none font-bold text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Rate / Percentage / Target Value</label>
            <input type="number" step="0.5" value={valB} onChange={e => setValB(Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border outline-none font-bold text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Time Horizon (Periods)</label>
            <input type="number" value={valC} onChange={e => setValC(Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border outline-none font-bold text-sm" />
          </div>
          <button onClick={runMath} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow"><RefreshCw className="h-4 w-4"/> Calculate Matrix</button>
        </div>

        <div className="lg:col-span-2 bg-slate-950 text-white rounded-3xl p-8 flex flex-col justify-center border min-h-[300px]">
           <span className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Calculated Output Projection</span>
           <h2 className="text-5xl font-black text-emerald-400 break-all">
             {suboption.includes('cagr') || suboption.includes('roi') ? `${result !== null ? (result * 100).toFixed(2) : 0}%` : `₹ ${result !== null ? Math.round(result).toLocaleString('en-IN') : 0}`}
           </h2>
           <p className="text-sm text-slate-500 mt-4">Computed natively on your device via standard algorithmic models.</p>
        </div>
      </div>
    </main>
  );
}
