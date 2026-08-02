'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { savingsSubTools } from '@/data/financeMeta';

export default function SavingsHubTool() {
  const params = useParams();
  const router = useRouter();
  const suboption = (params?.suboption as string) || 'ppf-calculator';
  const seo = savingsSubTools[suboption] || savingsSubTools['ppf-calculator'];

  const [valA, setValA] = useState(150000);
  const [valB, setValB] = useState(7.1);
  const [valC, setValC] = useState(15);
  const [result, setResult] = useState<any>(null);

  const configs: Record<string, any> = {
    'ppf-calculator': { labelA: 'Yearly Investment (₹)', labelB: 'Interest Rate (% p.a.)', labelC: 'Duration (Years)',
      calc: () => {
        let corpus = 0; const r = valB / 100;
        for(let i=0; i<valC; i++) { corpus = (corpus + valA) * (1 + r); }
        return { value: corpus.toLocaleString('en-IN', {maximumFractionDigits:0}), unit: '₹ Tax-Free Maturity Amount' };
      }},
    'epf-calculator': { labelA: 'Basic Salary + DA (Monthly ₹)', labelB: 'Employee Contribution (%)', labelC: 'Expected Interest (%)',
      calc: () => {
        // Simple approximation: Employee (e.g. 12%) + Employer (3.67%) to PF
        const monthlyTotal = valA * ((valB + 3.67) / 100);
        return { value: monthlyTotal.toLocaleString('en-IN', {maximumFractionDigits:0}), unit: '₹ Monthly EPF Addition' };
      }},
    'nps-calculator': { labelA: 'Monthly Contribution (₹)', labelB: 'Expected Return (% p.a.)', labelC: 'Years to Retirement',
      calc: () => {
        const r = (valB / 100) / 12; const n = valC * 12;
        const corpus = (valA * (Math.pow(1 + r, n) - 1) / r) * (1 + r);
        return { value: corpus.toLocaleString('en-IN', {maximumFractionDigits:0}), unit: '₹ Total Retirement Corpus' };
      }},
    'fd-calculator': { labelA: 'Fixed Deposit Amount (₹)', labelB: 'Interest Rate (% p.a.)', labelC: 'Tenure (Years)',
      calc: () => {
        const maturity = valA * Math.pow(1 + (valB/100)/4, 4 * valC); // Quarterly compounding assumption
        return { value: maturity.toLocaleString('en-IN', {maximumFractionDigits:0}), unit: '₹ Total Maturity Value' };
      }},
    'gratuity-calculator': { labelA: 'Last Drawn Basic Salary + DA (₹)', labelB: 'Years of Service', showC: false,
      calc: () => {
        if(valB < 5) return { value: '0', unit: 'Minimum 5 years required for Gratuity' };
        const gratuity = (15 * valA * valB) / 26;
        return { value: gratuity.toLocaleString('en-IN', {maximumFractionDigits:0}), unit: '₹ Gratuity Payout' };
      }}
  };

  const config = configs[suboption] || configs['ppf-calculator'];
  useEffect(() => { document.title = seo.title; setResult(config.calc()); }, [suboption, valA, valB, valC]);

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 lg:px-8">
      <a href="/categories/finance-calculators" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition mb-8"><ArrowLeft className="h-4 w-4" /> Back to Finance</a>
      <div className="text-center mb-10"><h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{seo.heading}</h1><p className="text-lg text-slate-600 dark:text-slate-400">{seo.description}</p></div>

      <div className="flex flex-wrap gap-2 mb-8 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl w-fit border">
        {Object.keys(savingsSubTools).map((key) => (
          <button key={key} onClick={() => router.push(`/tools/savings-retirement-hub/${key}`)} className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${suboption === key ? 'bg-white text-blue-600 shadow' : 'text-slate-500'}`}>{key.replace(/-/g, ' ')}</button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-slate-900 border rounded-3xl p-8 space-y-4 shadow-sm">
          <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">{config.labelA}</label><input type="number" value={valA} onChange={e=>setValA(Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border font-bold" /></div>
          <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">{config.labelB}</label><input type="number" step="0.1" value={valB} onChange={e=>setValB(Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border font-bold" /></div>
          {config.showC !== false && <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">{config.labelC}</label><input type="number" value={valC} onChange={e=>setValC(Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border font-bold" /></div>}
        </div>
        <div className="lg:col-span-2 bg-slate-950 text-white rounded-3xl p-8 flex flex-col justify-center border min-h-[300px]">
           <span className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Calculated Result</span>
           <h2 className="text-5xl font-black text-cyan-400 break-all">{result?.value}</h2>
           <p className="text-lg font-bold text-slate-500 mt-2">{result?.unit}</p>
        </div>
      </div>
    </main>
  );
}
