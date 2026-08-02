'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { investmentSubTools } from '@/data/financeMeta';

export default function InvestmentProfilerTool() {
  const params = useParams();
  const router = useRouter();
  const suboption = (params?.suboption as string) || 'cagr-calculator';
  const seo = investmentSubTools[suboption] || investmentSubTools['cagr-calculator'];

  // State handles numbers or empty strings flawlessly to prevent sticky zeros
  const [valA, setValA] = useState<number | ''>(10000);
  const [valB, setValB] = useState<number | ''>(25000);
  const [valC, setValC] = useState<number | ''>(5);
  const [valD, setValD] = useState<number | ''>(10);
  const [result, setResult] = useState<any>(null);

  const configs: Record<string, any> = {
    'cagr-calculator': { labelA: 'Initial Investment Value (₹)', labelB: 'Final Ending Value (₹)', labelC: 'Duration (Years)', showD: false,
      calc: (a: number, b: number, c: number) => ({ value: a > 0 ? ((Math.pow(b / a, 1 / (c || 1)) - 1) * 100).toFixed(2) : '0.00', unit: '% Annual Growth' }) },
    'roi-calculator': { labelA: 'Total Amount Invested (₹)', labelB: 'Total Amount Returned (₹)', showC: false, showD: false,
      calc: (a: number, b: number) => ({ value: a > 0 ? (((b - a) / a) * 100).toFixed(2) : '0.00', unit: '% Total ROI' }) },
    'swp-calculator': { labelA: 'Total Corpus Amount (₹)', labelB: 'Monthly Withdrawal (₹)', labelC: 'Expected Return (% p.a.)', labelD: 'Tenure (Years)', showD: true,
      calc: (a: number, b: number, c: number, d: number) => {
        let balance = a; const r = (c / 100) / 12;
        for(let i=0; i<d*12; i++) { balance = (balance * (1 + r)) - b; if(balance < 0) { balance = 0; break; } }
        return { value: balance.toLocaleString('en-IN', {maximumFractionDigits:0}), unit: '₹ Final Corpus Balance' };
      }},
    'stock-average-calculator': { labelA: 'First Buy Price (₹)', labelB: 'Quantity Bought', labelC: 'Second Buy Price (₹)', labelD: 'Quantity Bought', showD: true,
      calc: (a: number, b: number, c: number, d: number) => ({ value: (b + d) > 0 ? (((a * b) + (c * d)) / (b + d)).toFixed(2) : '0.00', unit: '₹ New Average Price' }) }
  };

  const config = configs[suboption] || configs['cagr-calculator'];

  useEffect(() => { 
    document.title = seo.title; 
    // Normalize empty strings safely to 0 inside the formula math loops
    const numA = valA === '' ? 0 : valA;
    const numB = valB === '' ? 0 : valB;
    const numC = valC === '' ? 0 : valC;
    const numD = valD === '' ? 0 : valD;
    setResult(config.calc(numA, numB, numC, numD)); 
  }, [suboption, valA, valB, valC, valD]);

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 lg:px-8">
      <a href="/categories/finance-calculators" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition mb-8"><ArrowLeft className="h-4 w-4" /> Back to Finance</a>
      <div className="text-center mb-10"><h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{seo.heading}</h1><p className="text-lg text-slate-600 dark:text-slate-400">{seo.description}</p></div>

      <div className="flex flex-wrap gap-2 mb-8 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl w-fit border">
        {Object.keys(investmentSubTools).map((key) => (
          <button key={key} onClick={() => router.push(`/tools/investment-return-profiler/${key}`)} className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${suboption === key ? 'bg-white text-blue-600 shadow' : 'text-slate-500'}`}>{key.replace(/-/g, ' ')}</button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-slate-900 border rounded-3xl p-8 space-y-4 shadow-sm">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{config.labelA}</label>
            <input type="number" value={valA} onChange={e=>setValA(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border font-bold outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{config.labelB}</label>
            <input type="number" value={valB} onChange={e=>setValB(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border font-bold outline-none focus:border-indigo-500" />
          </div>
          {config.showC !== false && <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{config.labelC}</label>
            <input type="number" value={valC} onChange={e=>setValC(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border font-bold outline-none focus:border-indigo-500" />
          </div>}
          {config.showD && <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{config.labelD}</label>
            <input type="number" value={valD} onChange={e=>setValD(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border font-bold outline-none focus:border-indigo-500" />
          </div>}
        </div>
        <div className="lg:col-span-2 bg-slate-950 text-white rounded-3xl p-8 flex flex-col justify-center border min-h-[300px]">
           <span className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Calculated Result</span>
           <h2 className="text-5xl font-black text-emerald-400 break-all">{result?.value}</h2>
           <p className="text-lg font-bold text-slate-500 mt-2">{result?.unit}</p>
        </div>
      </div>
    </main>
  );
}
