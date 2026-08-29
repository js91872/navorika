'use client';

import { Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { simulateDebtPayoff, type Debt } from '@/lib/calculations/financialDecisions';

const field = 'mt-1 w-full min-w-0 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20';
const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value);

const initialDebts: Debt[] = [
  { id: 'card', name: 'Credit card', balance: 6000, aprPercent: 22, minimumPayment: 180 },
  { id: 'loan', name: 'Personal loan', balance: 12000, aprPercent: 10, minimumPayment: 300 },
  { id: 'car', name: 'Car loan', balance: 18000, aprPercent: 6, minimumPayment: 400 },
];

export default function DebtStrategyCalculator() {
  const [debts, setDebts] = useState<Debt[]>(initialDebts);
  const [extra, setExtra] = useState(300);
  const snowball = useMemo(() => simulateDebtPayoff(debts, extra, 'snowball'), [debts, extra]);
  const avalanche = useMemo(() => simulateDebtPayoff(debts, extra, 'avalanche'), [debts, extra]);
  const update = (id: string, key: keyof Omit<Debt, 'id'>, value: string) => setDebts((items) => items.map((debt) => debt.id === id ? { ...debt, [key]: key === 'name' ? value : Number(value) } : debt));
  const addDebt = () => setDebts((items) => [...items, { id: crypto.randomUUID(), name: `Debt ${items.length + 1}`, balance: 1000, aprPercent: 10, minimumPayment: 50 }]);
  return <div className="space-y-8">
    <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-bold">Debts and monthly budget</h2><button type="button" onClick={addDebt} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white"><Plus className="size-4"/>Add debt</button></div>
      <div className="mt-5 space-y-4">{debts.map((debt) => <fieldset key={debt.id} className="min-w-0 rounded-2xl border border-[var(--border)] p-4"><legend className="sr-only">{debt.name}</legend><div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_auto]">
        <label className="min-w-0 text-sm font-semibold">Debt name<input className={field} value={debt.name} onChange={(event) => update(debt.id, 'name', event.target.value)}/></label>
        <label className="min-w-0 text-sm font-semibold">Balance ($)<input className={field} type="number" min="0" value={debt.balance} onChange={(event) => update(debt.id, 'balance', event.target.value)}/></label>
        <label className="min-w-0 text-sm font-semibold">APR (%)<input className={field} type="number" min="0" step="0.01" value={debt.aprPercent} onChange={(event) => update(debt.id, 'aprPercent', event.target.value)}/></label>
        <label className="min-w-0 text-sm font-semibold">Minimum ($)<input className={field} type="number" min="0" value={debt.minimumPayment} onChange={(event) => update(debt.id, 'minimumPayment', event.target.value)}/></label>
        <button type="button" aria-label={`Remove ${debt.name}`} disabled={debts.length === 1} onClick={() => setDebts((items) => items.filter((item) => item.id !== debt.id))} className="mt-6 self-center rounded-xl border border-red-500/30 p-2 text-red-600 disabled:opacity-40"><Trash2 className="size-5"/></button>
      </div></fieldset>)}</div>
      <label className="mt-5 block max-w-sm text-sm font-semibold">Extra monthly payment ($)<input className={field} type="number" min="0" value={extra} onChange={(event) => setExtra(Number(event.target.value))}/></label>
    </section>
    <section className="grid min-w-0 gap-6 lg:grid-cols-2">{([['Debt snowball', snowball], ['Debt avalanche', avalanche]] as const).map(([name, result]) => <article key={name} className="min-w-0 rounded-3xl border border-indigo-500/20 bg-indigo-500/5 p-5 sm:p-7"><h2 className="text-xl font-black">{name}</h2>{result.error ? <p role="alert" className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm leading-6 text-red-700 dark:text-red-300">{result.error}</p> : <dl className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-[var(--card)] p-4"><dt className="text-sm text-[var(--muted-foreground)]">Payoff time</dt><dd className="mt-1 text-xl font-black">{result.payoffMonths} months</dd></div><div className="rounded-xl bg-[var(--card)] p-4"><dt className="text-sm text-[var(--muted-foreground)]">Total interest</dt><dd className="mt-1 text-xl font-black">{money(result.totalInterest)}</dd></div><div className="rounded-xl bg-[var(--card)] p-4"><dt className="text-sm text-[var(--muted-foreground)]">Total paid</dt><dd className="mt-1 text-xl font-black">{money(result.totalPaid)}</dd></div><div className="rounded-xl bg-[var(--card)] p-4"><dt className="text-sm text-[var(--muted-foreground)]">Payoff order</dt><dd className="mt-1 break-words font-bold">{result.payoffOrder.join(' → ')}</dd></div></dl>}</article>)}</section>
    {!snowball.error && !avalanche.error && <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-sm leading-6"><h2 className="font-bold">Comparison</h2><p className="mt-2">Avalanche interest difference: <strong>{money(snowball.totalInterest - avalanche.totalInterest)}</strong>. Payoff-time difference: <strong>{Math.abs((snowball.payoffMonths ?? 0) - (avalanche.payoffMonths ?? 0))} months</strong>.</p><p className="mt-2 text-[var(--muted-foreground)]">Interest accrues monthly at APR ÷ 12. Required minimums are paid first, then the fixed total monthly budget targets the smallest balance (snowball) or highest APR (avalanche). Freed minimum payments remain in that budget. The simulation stops at 1,200 months and rejects a minimum that cannot cover first-month interest.</p></section>}
  </div>;
}
