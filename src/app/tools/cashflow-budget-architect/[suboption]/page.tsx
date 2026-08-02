'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { budgetSubTools } from '@/data/financeMeta';

export default function CashflowArchitectTool() {
  const params = useParams();
  const router = useRouter();
  const suboption = (params?.suboption as string) || 'budget-planner';
  const seo = budgetSubTools[suboption] || budgetSubTools['budget-planner'];

  const [valA, setValA] = useState<number | ''>(100000);
  const [valB, setValB] = useState<number | ''>(6);
  const [valC, setValC] = useState<number | ''>(10000);
  const [result, setResult] = useState<any>(null);

  const configs: Record<string, any> = {
    'budget-planner': { labelA: 'Monthly After-Tax Income (₹)', showB: false, showC: false,
      calc: (a: number) => ({ value: (a * 0.5).toLocaleString('en-IN'), unit: `Needs (50%), ₹${(a*0.3).toLocaleString('en-IN')} Wants, ₹${(a*0.2).toLocaleString('en-IN')} Savings` }) },
    'emergency-fund-calculator': { labelA: 'Monthly Living Expenses (₹)', labelB: 'Target Safety Runway (Months)', showC: false,
      calc: (a: number, b: number) => ({ value: (a * b).toLocaleString('en-IN'), unit: `₹ Total Emergency Corpus Needed` }) },
    'credit-card-payoff': { labelA: 'Total Credit Card Debt (₹)', labelB: 'Annual Interest Rate (%)', labelC: 'Monthly Payment (₹)',
      calc: (a: number, b: number, c: number) => {
        let balance = a; const r = (b / 100) / 12; let months = 0;
        if (c <= balance * r) return { value: 'Never', unit: 'Payment too low to cover interest!' };
        while (balance > 0 && months < 600) { balance = (balance * (1 + r)) - c; months++; }
        return { value: months, unit: `Months to become Debt-Free` };
      }}
  };

  const config = configs[suboption] || configs['budget-planner'];
  
  useEffect(() => { 
    document.title = seo.title;
    const numA = valA === '' ? 0 : valA;
    const numB = valB === '' ? 0 : valB;
    const numC = valC === '' ? 0 : valC;
    setResult(config.calc(numA, numB, numC)); 
  }, [suboption, valA, valB, valC]);

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 lg:px-8">
      <a href="/categories/finance-calculators" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition mb-8"><ArrowLeft className="h-4 w-4" /> Back</a>
      <div className="text-center mb-10"><h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{seo.heading}</h1><p className="text-lg text-slate-600 dark:text-slate-400">{seo.description}</p></div>

      <div className="flex flex-wrap gap-2 mb-8 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl w-fit border">
        {Object.keys(budgetSubTools).map((key) => (
          <button key={key} onClick={() => router.push(`/tools/cashflow-budget-architect/${key}`)} className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${suboption === key ? 'bg-white text-blue-600 shadow' : 'text-slate-500'}`}>{key.replace(/-/g, ' ')}</button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-slate-900 border rounded-3xl p-8 space-y-4 shadow-sm">
          <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">{config.labelA}</label><input type="number" value={valA} onChange={e=>setValA(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border font-bold outline-none" /></div>
          {config.showB !== false && <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">{config.labelB}</label><input type="number" value={valB} onChange={e=>setValB(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border font-bold outline-none" /></div>}
          {config.showC !== false && <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">{config.labelC}</label><input type="number" value={valC} onChange={e=>setValC(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border font-bold outline-none" /></div>}
        </div>
        <div className="lg:col-span-2 bg-slate-950 text-white rounded-3xl p-8 flex flex-col justify-center border min-h-[300px]">
           <span className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Calculated Result</span>
           <h2 className="text-5xl font-black text-rose-400 break-all">{result?.value}</h2>
           <p className="text-lg font-bold text-slate-500 mt-2">{result?.unit}</p>
        </div>
      </div>
    </main>
  );
}
