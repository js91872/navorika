'use client';

import { useState } from 'react';
import { ArrowLeft, Calculator, ShieldCheck, RefreshCw } from 'lucide-react';
import { tools } from '@/data/registry';

export default function SIPCalculatorTool() {
  const meta = tools.find(t => t.slug === 'sip-calculator');
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [expectedRate, setExpectedRate] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);
  
  const [investedAmount, setInvestedAmount] = useState<number | null>(null);
  const [estReturns, setEstReturns] = useState<number | null>(null);
  const [totalValue, setTotalValue] = useState<number | null>(null);

  const calculateSIP = () => {
    const P = monthlyInvestment;
    const i = (expectedRate / 100) / 12;
    const n = timePeriod * 12;

    const totalInvested = P * n;
    // Standard compound interest equation allocation mapping matrix:
    // M = P * [((1 + i)^n - 1) / i] * (1 + i)
    const valuation = P * (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
    const returnsEstimate = valuation - totalInvested;

    setInvestedAmount(Math.round(totalInvested));
    setEstReturns(Math.round(returnsEstimate));
    setTotalValue(Math.round(valuation));
  };

  if (!meta) return null;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 lg:px-8">
      <a href="/categories/finance-calculators" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Finance Calculators
      </a>

      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-500/20">
          <ShieldCheck className="h-4 w-4" /> Client-Side Compound Engine
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{meta.heroTitle}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">{meta.heroDescription}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {/* Controls block form inputs */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Monthly Investment (₹)</label>
            <input type="number" value={monthlyInvestment} onChange={(e) => setMonthlyInvestment(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold outline-none text-slate-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Expected Return Rate (% p.a.)</label>
            <input type="number" step="0.1" value={expectedRate} onChange={(e) => setExpectedRate(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold outline-none text-slate-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Time Period (Years)</label>
            <input type="number" value={timePeriod} onChange={(e) => setTimePeriod(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold outline-none text-slate-900 dark:text-white" />
          </div>
          
          <button onClick={calculateSIP} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition shadow-md">
            <RefreshCw className="h-4 w-4"/> Calculate Projections
          </button>
        </div>

        {/* Results layout view data display boxes */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 flex flex-col justify-center space-y-6 border border-slate-800">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Invested Capital</span>
            <p className="text-3xl font-black mt-1 text-slate-200">₹ {investedAmount !== null ? investedAmount.toLocaleString('en-IN') : '0'}</p>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Wealth Yield</span>
            <p className="text-3xl font-black mt-1 text-emerald-400">₹ {estReturns !== null ? estReturns.toLocaleString('en-IN') : '0'}</p>
          </div>
          <div className="pt-4 border-t border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Portfolio Wealth Valuation</span>
            <p className="text-4xl font-black mt-1 text-blue-400">₹ {totalValue !== null ? totalValue.toLocaleString('en-IN') : '0'}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
