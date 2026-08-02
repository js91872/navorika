'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { wealthSubTools } from '@/data/financeMeta';

export default function WealthMatrixTool() {
  const params = useParams();
  const router = useRouter();
  const suboption = (params?.suboption as string) || 'compound-interest-calculator';
  const seo = wealthSubTools[suboption] || wealthSubTools['compound-interest-calculator'];

  const [valA, setValA] = useState(1000000);
  const [valB, setValB] = useState(6);
  const [valC, setValC] = useState(10);
  const [result, setResult] = useState<any>(null);

  const configs: Record<string, any> = {
    'compound-interest-calculator': { labelA: 'Principal Amount (₹)', labelB: 'Annual Interest Rate (%)', labelC: 'Time Period (Years)',
      calc: () => ({ value: (valA * Math.pow(1 + (valB/100), valC)).toLocaleString('en-IN', {maximumFractionDigits:0}), unit: '₹ Total Future Value' }) },
    'inflation-calculator': { labelA: 'Current Cost / Value (₹)', labelB: 'Expected Inflation Rate (%)', labelC: 'Years in Future',
      calc: () => ({ value: (valA * Math.pow(1 + (valB/100), valC)).toLocaleString('en-IN', {maximumFractionDigits:0}), unit: '₹ Adjusted Future Cost' }) },
    'net-worth-calculator': { labelA: 'Total Assets (Real Estate, Stocks, Cash ₹)', labelB: 'Total Liabilities (Loans, Debt ₹)', showC: false,
      calc: () => ({ value: (valA - valB).toLocaleString('en-IN'), unit: '₹ Total Net Worth' }) },
    'salary-calculator': { labelA: 'Total CTC Package (Yearly ₹)', labelB: 'Yearly Bonus/Variable (₹)', labelC: 'Monthly Deductions (PF/Tax ₹)',
      calc: () => {
        const inHand = ((valA - valB) / 12) - valC;
        return { value: inHand.toLocaleString('en-IN', {maximumFractionDigits:0}), unit: '₹ Estimated Monthly In-Hand Salary' };
      }}
  };

  const config = configs[suboption] || configs['compound-interest-calculator'];
  useEffect(() => { document.title = seo.title; setResult(config.calc()); }, [suboption, valA, valB, valC]);

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 lg:px-8">
      <a href="/categories/finance-calculators" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition mb-8"><ArrowLeft className="h-4 w-4" /> Back to Finance</a>
      <div className="text-center mb-10"><h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{seo.heading}</h1><p className="text-lg text-slate-600 dark:text-slate-400">{seo.description}</p></div>

      <div className="flex flex-wrap gap-2 mb-8 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl w-fit border">
        {Object.keys(wealthSubTools).map((key) => (
          <button key={key} onClick={() => router.push(`/tools/wealth-inflation-matrix/${key}`)} className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${suboption === key ? 'bg-white text-blue-600 shadow' : 'text-slate-500'}`}>{key.replace(/-/g, ' ')}</button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-slate-900 border rounded-3xl p-8 space-y-4 shadow-sm">
          <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">{config.labelA}</label><input type="number" value={valA} onChange={e=>setValA(Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border font-bold" /></div>
          <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">{config.labelB}</label><input type="number" value={valB} onChange={e=>setValB(Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border font-bold" /></div>
          {config.showC !== false && <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">{config.labelC}</label><input type="number" value={valC} onChange={e=>setValC(Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border font-bold" /></div>}
        </div>
        <div className="lg:col-span-2 bg-slate-950 text-white rounded-3xl p-8 flex flex-col justify-center border min-h-[300px]">
           <span className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Calculated Result</span>
           <h2 className="text-5xl font-black text-amber-400 break-all">{result?.value}</h2>
           <p className="text-lg font-bold text-slate-500 mt-2">{result?.unit}</p>
        </div>
      </div>
    </main>
  );
}
