'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { taxSubTools } from '@/data/financeMeta';

export default function TaxationDeckTool() {
  const params = useParams();
  const router = useRouter();
  const suboption = (params?.suboption as string) || 'gst-calculator';
  const seo = taxSubTools[suboption] || taxSubTools['gst-calculator'];

  const [valA, setValA] = useState(50000);
  const [valB, setValB] = useState(18);
  const [valC, setValC] = useState(20000);
  const [result, setResult] = useState<any>(null);

  const configs: Record<string, any> = {
    'gst-calculator': { labelA: 'Base Amount (₹)', labelB: 'GST Rate (%)', showC: false,
      calc: () => {
        const gstAmount = valA * (valB / 100);
        return { value: (valA + gstAmount).toLocaleString('en-IN'), unit: `₹ Total (Includes ₹${gstAmount} GST)` };
      }},
    'hra-calculator': { labelA: 'Basic Salary (Yearly ₹)', labelB: 'HRA Received (Yearly ₹)', labelC: 'Actual Rent Paid (Yearly ₹)',
      calc: () => {
        const rentMinus10 = valC - (0.10 * valA);
        const halfBasic = valA * 0.50; // Metro assumption
        const exemption = Math.max(0, Math.min(valB, rentMinus10, halfBasic));
        return { value: exemption.toLocaleString('en-IN'), unit: `₹ Exempted HRA Amount` };
      }},
    'income-tax-calculator': { labelA: 'Total Annual Income (₹)', labelB: 'Section 80C/Deductions (₹)', showC: false,
      calc: () => {
        let taxable = Math.max(0, valA - valB - 50000); // Standard ded.
        let tax = 0;
        if(taxable > 1500000) tax += (taxable - 1500000)*0.30 + 150000;
        else if(taxable > 1200000) tax += (taxable - 1200000)*0.20 + 90000;
        else if(taxable > 900000) tax += (taxable - 900000)*0.15 + 45000;
        else if(taxable > 600000) tax += (taxable - 600000)*0.10 + 15000;
        else if(taxable > 300000) tax += (taxable - 300000)*0.05;
        // Rebate 87A simple fallback
        if (taxable <= 700000) tax = 0;
        return { value: tax.toLocaleString('en-IN'), unit: `₹ Estimated Tax (New Regime Approx)` };
      }}
  };

  const config = configs[suboption] || configs['gst-calculator'];
  useEffect(() => { document.title = seo.title; setResult(config.calc()); }, [suboption, valA, valB, valC]);

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 lg:px-8">
      <a href="/categories/finance-calculators" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition mb-8"><ArrowLeft className="h-4 w-4" /> Back</a>
      <div className="text-center mb-10"><h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{seo.heading}</h1><p className="text-lg text-slate-600 dark:text-slate-400">{seo.description}</p></div>

      <div className="flex flex-wrap gap-2 mb-8 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl w-fit border">
        {Object.keys(taxSubTools).map((key) => (
          <button key={key} onClick={() => router.push(`/tools/taxation-compliance-deck/${key}`)} className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${suboption === key ? 'bg-white text-blue-600 shadow' : 'text-slate-500'}`}>{key.replace(/-/g, ' ')}</button>
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
           <h2 className="text-5xl font-black text-blue-400 break-all">{result?.value}</h2>
           <p className="text-lg font-bold text-slate-500 mt-2">{result?.unit}</p>
        </div>
      </div>
    </main>
  );
}
