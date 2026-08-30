'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { tools } from '@/data/registry';
import { calculateEMI, type EMIResult } from '@/lib/calculations/emi';

export default function LoanEMICalculator() {
  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [result, setResult] = useState<EMIResult | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    try {
      setResult(calculateEMI({ principal, rate, tenure, tenureUnit: 'years' }));
      setError('');
    } catch (cause) {
      setResult(null);
      setError(cause instanceof Error ? cause.message : 'Enter valid loan details.');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/tools" className="inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Tools
        </Link>
        <h1 className="text-3xl font-bold mb-2">Loan EMI Calculator</h1>
        <p className="text-[var(--muted-foreground)] mb-8">Calculate your loan EMI instantly</p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-4">
            <div>
              <label className="text-sm font-medium">Loan Amount (₹)</label>
              <input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-[var(--muted)] border border-[var(--border)]" />
            </div>
            <div>
              <label className="text-sm font-medium">Interest Rate (% p.a.)</label>
              <input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-[var(--muted)] border border-[var(--border)]" />
            </div>
            <div>
              <label className="text-sm font-medium">Tenure (years)</label>
              <input type="number" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-[var(--muted)] border border-[var(--border)]" />
            </div>
            <button onClick={calculate} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors">Calculate EMI</button>
            {error && <p role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}
          </div>

          <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center">
            {result ? (
              <div className="text-center w-full">
                <div className="text-4xl font-bold">₹{result.monthlyPayment.toLocaleString()}</div>
                <p className="text-sm text-[var(--muted-foreground)] mt-2">Monthly EMI</p>
                <div className="mt-4 pt-4 border-t border-[var(--border)] grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-[var(--muted-foreground)]">Total Payment</p><p className="font-semibold">₹{result.totalPayment.toLocaleString()}</p></div>
                  <div><p className="text-[var(--muted-foreground)]">Total Interest</p><p className="font-semibold text-amber-500">₹{result.totalInterest.toLocaleString()}</p></div>
                </div>
              </div>
            ) : (
              <div className="text-center text-[var(--muted-foreground)]"><p>Enter details and click Calculate</p></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
