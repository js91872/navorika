'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Activity, Target, Zap, ChevronRight, Calculator } from 'lucide-react';
import { investmentSubTools } from '@/data/financeMeta';

export default function InvestmentProfilerTool() {
  const params = useParams();
  const router = useRouter();
  const suboption = (params?.suboption as string) || 'cagr-calculator';
  const seo = investmentSubTools[suboption] || investmentSubTools['cagr-calculator'];

  const [valA, setValA] = useState<number | ''>(100000);
  const [valB, setValB] = useState<number | ''>(500);
  const [valC, setValC] = useState<number | ''>(8);
  const [valD, setValD] = useState<number | ''>(10);
  const [result, setResult] = useState<any>(null);

  const configs: Record<string, any> = {
    'cagr-calculator': { 
      labelA: 'Initial Investment', labelB: 'Final Value', labelC: 'Duration (Years)', showD: false,
      calc: (a: number, b: number, c: number) => ({ value: a > 0 ? ((Math.pow(b / a, 1 / (c || 1)) - 1) * 100).toFixed(2) : '0.00', unit: '% Annual Growth', subtitle: 'Compound Annual Growth Rate' }) 
    },
    'roi-calculator': { 
      labelA: 'Total Invested', labelB: 'Total Returned', showC: false, showD: false,
      calc: (a: number, b: number) => ({ value: a > 0 ? (((b - a) / a) * 100).toFixed(2) : '0.00', unit: '% Total ROI', subtitle: 'Absolute Return on Investment' }) 
    },
    'swp-calculator': { 
      labelA: 'Starting Corpus', labelB: 'Monthly Withdrawal', labelC: 'Expected Return (% p.a.)', labelD: 'Tenure (Years)', showD: true,
      calc: (a: number, b: number, c: number, d: number) => {
        let balance = a; const r = (c / 100) / 12;
        for(let i=0; i<d*12; i++) { balance = (balance * (1 + r)) - b; if(balance < 0) { balance = 0; break; } }
        return { value: balance.toLocaleString('en-US', {maximumFractionDigits:0}), unit: 'Final Corpus Balance', subtitle: 'Remaining Wealth After Withdrawals' };
      }
    },
    'stock-average-calculator': { 
      labelA: 'First Buy Price', labelB: 'Quantity Bought', labelC: 'Second Buy Price', labelD: 'Quantity Bought', showD: true,
      calc: (a: number, b: number, c: number, d: number) => ({ value: (b + d) > 0 ? (((a * b) + (c * d)) / (b + d)).toLocaleString('en-US', {maximumFractionDigits:2}) : '0.00', unit: 'New Average Price', subtitle: 'Blended Acquisition Cost' }) 
    }
  };

  const config = configs[suboption] || configs['cagr-calculator'];

  useEffect(() => { 
    document.title = seo.title; 
    const numA = valA === '' ? 0 : valA;
    const numB = valB === '' ? 0 : valB;
    const numC = valC === '' ? 0 : valC;
    const numD = valD === '' ? 0 : valD;
    
    const rawResult = config.calc(numA, numB, numC, numD);
    
    // Formatting Rule: Add a space after any leading minus symbol
    const formattedValue = String(rawResult.value).replace(/^-/, '- ');
    
    setResult({ ...rawResult, value: formattedValue });
  }, [suboption, valA, valB, valC, valD]);

  return (
    <main className="h-[calc(100dvh-80px)] w-full relative overflow-hidden font-sans flex flex-col p-4 lg:p-8">
      
      {/* Ambient Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-500/20 rounded-full blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen"></div>
      
      {/* Main Application Window */}
      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col min-h-0 relative z-10 gap-6">
        
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
          <div>
            <a href="/categories/finance-calculators" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-2 uppercase tracking-widest">
              <ArrowLeft className="h-3 w-3" /> Finance Portal
            </a>
            <h1 className="text-2xl lg:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 tracking-tight">
              {seo.heading}
            </h1>
          </div>

          <div className="flex bg-white dark:bg-white/5 backdrop-blur-xl p-1 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm overflow-x-auto no-scrollbar w-full sm:w-auto">
            {Object.keys(investmentSubTools).map((key) => (
              <button 
                key={key} 
                onClick={() => router.push(`/tools/investment-return-profiler/${key}`)} 
                className={`px-4 py-2 rounded-lg text-xs font-bold capitalize whitespace-nowrap transition-all duration-300 ${
                  suboption === key 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {key.replace(/-/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Box Layout */}
        <div className="flex-1 min-h-0 grid lg:grid-cols-12 gap-6">
          
          {/* Left Parameters Panel */}
          <div className="lg:col-span-4 bg-white dark:bg-white/[0.02] backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 shadow-xl flex flex-col gap-5 overflow-y-auto no-scrollbar transition-colors">
            <div className="flex items-center gap-2 mb-2 shrink-0">
              <Calculator className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
              <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest">Parameters</h3>
            </div>

            {[
              { show: true, label: config.labelA, val: valA, set: setValA },
              { show: true, label: config.labelB, val: valB, set: setValB },
              { show: config.showC !== false, label: config.labelC, val: valC, set: setValC },
              { show: config.showD === true, label: config.labelD, val: valD, set: setValD }
            ].map((input, idx) => input.show && (
              <div key={idx} className="relative group shrink-0">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
                  {input.label}
                </label>
                <div className="relative flex items-center bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                  <input 
                    type="number" 
                    value={input.val} 
                    onChange={e => input.set(e.target.value === '' ? '' : Number(e.target.value))} 
                    className="w-full px-4 py-3.5 bg-transparent outline-none font-bold text-base text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-700"
                    placeholder="0"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Right Output Panels */}
          <div className="lg:col-span-8 flex flex-col gap-6 min-h-0">
            
            {/* Primary Output Window */}
            <div className="flex-1 bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-500/10 dark:to-violet-500/10 backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-[2rem] p-8 lg:p-12 shadow-xl flex flex-col justify-center relative overflow-hidden group transition-colors min-h-[250px]">
              <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-20 group-hover:opacity-10 dark:group-hover:opacity-40 transition-opacity duration-700">
                <Target className="w-48 h-48 text-indigo-600 dark:text-indigo-400 -rotate-12 transform scale-150" />
              </div>
              
              <div className="relative z-10">
                <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-pulse"></span>
                  Computed Projection
                </p>
                {/* Result output respects negative space formatting */}
                <h2 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter mb-2 tabular-nums">
                  {result?.value}
                </h2>
                <p className="text-lg font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  {result?.unit}
                </p>
              </div>
            </div>

            {/* Bottom Insight Footer */}
            <div className="h-24 grid grid-cols-2 gap-6 shrink-0">
              <div className="bg-white dark:bg-white/[0.02] backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[1.5rem] p-4 lg:px-6 flex items-center gap-4 shadow-sm transition-colors">
                <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-500/20">
                  <Zap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5 truncate">Metric Focus</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{result?.subtitle}</p>
                </div>
              </div>
              
              <button onClick={() => window.print()} className="bg-white dark:bg-white/[0.02] hover:bg-slate-50 dark:hover:bg-white/[0.05] backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[1.5rem] p-4 lg:px-6 flex items-center justify-between shadow-sm transition-all group">
                <div className="text-left overflow-hidden">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5 truncate">Take Action</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">Export / Print Report</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-white/10 transition-colors shrink-0">
                  <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-indigo-600 dark:text-slate-400 dark:group-hover:text-white" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
