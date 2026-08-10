'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, PiggyBank, TrendingUp } from 'lucide-react';
import { tools } from '@/data/registry';

export default function PPFCalculator() {
  const meta = tools.find(t => t.slug === 'ppf-calculator');
  const [annual, setAnnual] = useState(150000);
  const [rate, setRate] = useState(7.1);
  const [tenure, setTenure] = useState(15);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    let balance = 0;
    const r = rate / 100;
    for (let i = 0; i < tenure; i++) {
      balance += annual;
      balance *= (1 + r);
    }
    const invested = annual * tenure;
    const interest = balance - invested;
    setResult({ maturity: Math.round(balance), invested: Math.round(invested), interest: Math.round(interest) });
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/tools" className="inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Tools
        </Link>
        <h1 className="text-3xl font-bold mb-2">PPF Calculator</h1>
        <p className="text-[var(--muted-foreground)] mb-8">Calculate Public Provident Fund returns</p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-4">
            <div>
              <label className="text-sm font-medium">Annual Investment (₹)</label>
              <input type="number" value={annual} onChange={(e) => setAnnual(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-[var(--muted)] border border-[var(--border)]" />
            </div>
            <div>
              <label className="text-sm font-medium">Rate (% p.a.)</label>
              <input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-[var(--muted)] border border-[var(--border)]" />
            </div>
            <div>
              <label className="text-sm font-medium">Tenure (years)</label>
              <input type="number" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-[var(--muted)] border border-[var(--border)]" />
            </div>
            <button onClick={calculate} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors">Calculate</button>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center">
            {result ? (
              <div className="text-center">
                <PiggyBank className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                <div className="text-4xl font-bold">₹{result.maturity.toLocaleString()}</div>
                <p className="text-sm text-[var(--muted-foreground)] mt-2">Maturity Amount</p>
                <p className="text-sm text-emerald-500">Invested: ₹{result.invested.toLocaleString()}</p>
                <p className="text-sm text-amber-500">Interest: ₹{result.interest.toLocaleString()}</p>
              </div>
            ) : (
              <div className="text-center text-[var(--muted-foreground)]">
                <TrendingUp className="h-12 w-12 mx-auto mb-3" />
                <p>Enter details and click Calculate</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
