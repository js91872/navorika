'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Receipt, Percent } from 'lucide-react';
import { tools } from '@/data/registry';

export default function GSTCalculator() {
  const meta = tools.find(t => t.slug === 'gst-calculator');
  const [amount, setAmount] = useState(1000);
  const [rate, setRate] = useState(18);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const gst = (amount * rate) / 100;
    const total = amount + gst;
    setResult({ gst: Math.round(gst), total: Math.round(total) });
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/tools" className="inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Tools
        </Link>
        <h1 className="text-3xl font-bold mb-2">GST Calculator</h1>
        <p className="text-[var(--muted-foreground)] mb-8">Calculate Goods and Services Tax</p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-4">
            <div>
              <label className="text-sm font-medium">Amount (₹)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-[var(--muted)] border border-[var(--border)]" />
            </div>
            <div>
              <label className="text-sm font-medium">GST Rate (%)</label>
              <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-[var(--muted)] border border-[var(--border)]" />
            </div>
            <button onClick={calculate} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors">Calculate</button>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center">
            {result ? (
              <div className="text-center">
                <Receipt className="h-12 w-12 text-indigo-500 mx-auto mb-3" />
                <div className="text-4xl font-bold">₹{result.total.toLocaleString()}</div>
                <p className="text-sm text-[var(--muted-foreground)] mt-2">Total Amount</p>
                <p className="text-sm text-indigo-500">GST: ₹{result.gst.toLocaleString()}</p>
              </div>
            ) : (
              <div className="text-center text-[var(--muted-foreground)]">
                <Percent className="h-12 w-12 mx-auto mb-3" />
                <p>Enter amount and click Calculate</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
