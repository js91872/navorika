'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { tools } from '@/data/registry';

export default function TaxCalculator() {
  const [income, setIncome] = useState(1000000);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    let tax = 0;
    if (income > 1000000) tax += (income - 1000000) * 0.30;
    if (income > 500000) tax += (Math.min(income, 1000000) - 500000) * 0.20;
    if (income > 250000) tax += (Math.min(income, 500000) - 250000) * 0.05;
    setResult({ 
      tax: Math.round(tax), 
      effectiveRate: ((tax / income) * 100).toFixed(1),
    });
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/tools" className="inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Tools
        </Link>
        <h1 className="text-3xl font-bold mb-2">Income Tax Calculator</h1>
        <p className="text-[var(--muted-foreground)] mb-8">Calculate your income tax liability</p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-4">
            <div>
              <label className="text-sm font-medium">Annual Income (₹)</label>
              <input type="number" value={income} onChange={(e) => setIncome(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-[var(--muted)] border border-[var(--border)]" />
            </div>
            <button onClick={calculate} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors">Calculate Tax</button>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center">
            {result ? (
              <div className="text-center">
                <div className="text-4xl font-bold">₹{result.tax.toLocaleString()}</div>
                <p className="text-sm text-[var(--muted-foreground)] mt-2">Tax Liability</p>
                <p className="text-sm text-amber-500">Effective Rate: {result.effectiveRate}%</p>
              </div>
            ) : (
              <div className="text-center text-[var(--muted-foreground)]"><p>Enter income and click Calculate</p></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
