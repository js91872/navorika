'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator } from 'lucide-react';

const REBATE_LIMIT = 1_200_000;
const REBATE_MAXIMUM = 60_000;
const CESS_RATE = 0.04;
const SLABS = [
  { ceiling: 400_000, rate: 0 },
  { ceiling: 800_000, rate: 0.05 },
  { ceiling: 1_200_000, rate: 0.1 },
  { ceiling: 1_600_000, rate: 0.15 },
  { ceiling: 2_000_000, rate: 0.2 },
  { ceiling: 2_400_000, rate: 0.25 },
  { ceiling: Number.POSITIVE_INFINITY, rate: 0.3 },
] as const;

type TaxResult = {
  slabTax: number;
  rebate: number;
  marginalRelief: number;
  cess: number;
  totalTax: number;
  effectiveRate: number;
};

function calculateSlabTax(income: number) {
  let tax = 0;
  let lowerBound = 0;

  for (const slab of SLABS) {
    const taxableInSlab = Math.max(0, Math.min(income, slab.ceiling) - lowerBound);
    tax += taxableInSlab * slab.rate;
    if (income <= slab.ceiling) break;
    lowerBound = slab.ceiling;
  }

  return tax;
}

function calculateTax(income: number): TaxResult {
  const slabTax = calculateSlabTax(income);
  const rebate = income <= REBATE_LIMIT ? Math.min(slabTax, REBATE_MAXIMUM) : 0;
  const taxAfterRebate = slabTax - rebate;
  const maximumTaxWithMarginalRelief = Math.max(0, income - REBATE_LIMIT);
  const marginalRelief = income > REBATE_LIMIT ? Math.max(0, taxAfterRebate - maximumTaxWithMarginalRelief) : 0;
  const taxBeforeCess = taxAfterRebate - marginalRelief;
  const cess = taxBeforeCess * CESS_RATE;
  const totalTax = taxBeforeCess + cess;

  return { slabTax, rebate, marginalRelief, cess, totalTax, effectiveRate: income > 0 ? (totalTax / income) * 100 : 0 };
}

const formatRupees = (value: number) => `₹${Math.round(value).toLocaleString('en-IN')}`;

export default function TaxCalculator() {
  const [income, setIncome] = useState(1_200_000);
  const [result, setResult] = useState<TaxResult | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    if (!Number.isFinite(income) || income < 0) {
      setError('Enter taxable income of zero or more.');
      setResult(null);
      return;
    }
    setError('');
    setResult(calculateTax(income));
  };

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 pt-24 text-[var(--foreground)]">
      <div className="mx-auto max-w-4xl">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"><ArrowLeft className="size-4" /> Back to Tools</Link>
        <p className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">India · New tax regime</p>
        <h1 className="mt-2 text-3xl font-bold">Income Tax Calculator for AY 2026–27</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">Estimate tax on normal-rate taxable income for FY 2025–26, including Section 87A rebate, marginal relief, and 4% cess.</p>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <section className="space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
            <div>
              <label htmlFor="taxable-income" className="text-sm font-medium">Taxable income after eligible deductions (₹)</label>
              <input id="taxable-income" type="number" min="0" step="1000" value={income} onChange={(event) => setIncome(Number(event.target.value))} className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2" />
              <p className="mt-2 text-xs leading-5 text-[var(--muted-foreground)]">Enter taxable income, not gross salary. This tool does not calculate deductions or the standard deduction.</p>
            </div>
            <button type="button" onClick={handleCalculate} className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 font-semibold text-white transition-colors hover:bg-indigo-700"><Calculator className="size-4" /> Calculate tax</button>
            {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          </section>

          <section aria-live="polite" className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
            {result ? (
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">Estimated tax payable</p>
                <p className="mt-2 text-4xl font-bold">{formatRupees(result.totalTax)}</p>
                <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">Effective rate: {result.effectiveRate.toFixed(2)}%</p>
                <dl className="mt-6 space-y-3 border-t border-[var(--border)] pt-5 text-sm">
                  <div className="flex justify-between gap-4"><dt>Tax from slabs</dt><dd className="font-medium">{formatRupees(result.slabTax)}</dd></div>
                  <div className="flex justify-between gap-4"><dt>Section 87A rebate</dt><dd className="font-medium">− {formatRupees(result.rebate)}</dd></div>
                  <div className="flex justify-between gap-4"><dt>Marginal relief</dt><dd className="font-medium">− {formatRupees(result.marginalRelief)}</dd></div>
                  <div className="flex justify-between gap-4"><dt>Health &amp; education cess (4%)</dt><dd className="font-medium">{formatRupees(result.cess)}</dd></div>
                </dl>
              </div>
            ) : <div className="grid min-h-60 place-items-center text-center text-[var(--muted-foreground)]"><p>Enter taxable income and calculate</p></div>}
          </section>
        </div>

        <p className="mt-5 text-center text-xs leading-5 text-[var(--muted-foreground)]">Estimate for resident individuals with normal-rate income under the new regime only. It excludes surcharge, special-rate income such as many capital gains, and case-specific tax rules. Verify filing decisions with official guidance or a qualified tax professional.</p>
      </div>
    </main>
  );
}
