'use client';

import { useState } from 'react';
import { reverseSalesTax, salesTaxRate } from '@/lib/calculations/reverseSalesTax';

export default function ReverseSalesTaxCalculator() {
  const [mode, setMode] = useState<'price' | 'rate'>('price');
  const [total, setTotal] = useState('108');
  const [rate, setRate] = useState('8');
  const [base, setBase] = useState('100');
  const [currency, setCurrency] = useState('USD');
  const [status, setStatus] = useState('');
  const [exporting, setExporting] = useState<'pdf' | 'xlsx' | null>(null);
  let result: ReturnType<typeof reverseSalesTax> | null = null;
  let error = '';
  try {
    if (total.trim() === '' || (mode === 'price' ? rate.trim() === '' : base.trim() === '')) throw new Error('Enter both values to see your result.');
    result = mode === 'price' ? reverseSalesTax(Number(total), Number(rate)) : salesTaxRate(Number(total), Number(base));
  } catch (e) { error = e instanceof Error ? e.message : 'Check your numbers.'; }
  const money = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
  const rateText = result ? Number(result.rate.toFixed(4)).toString() : '';
  const summary = result ? `Navorika reverse sales tax calculator\nTotal including tax: ${money(result.total)}\nPrice before tax: ${money(result.beforeTax)}\nIncluded tax: ${money(result.tax)}\n${mode === 'rate' ? 'Implied' : 'Entered'} tax rate: ${rateText}%\nSingle taxable base; rounded to 2 decimals. https://navorika.com/tools/reverse-sales-tax-calculator` : '';
  async function exportResult(type: 'pdf' | 'xlsx') {
    if (!result || exporting) return;
    setExporting(type);
    setStatus('Preparing your download...');
    try {
      const { createTaxPdf, createTaxExcel, downloadTaxFile } = await import('@/lib/exports/reverseSalesTax');
      const snapshot = { result, mode, currency };
      const bytes = await (type === 'pdf' ? createTaxPdf(snapshot) : createTaxExcel(snapshot));
      downloadTaxFile(bytes, type);
      setStatus(`${type === 'pdf' ? 'PDF' : 'Excel'} download ready.`);
    } catch { setStatus('The export could not be created. Please try again.'); }
    finally { setExporting(null); }
  }
  const inputClass = 'mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 text-lg font-semibold';
  function example(amount: string, percentage: string, original: string) { setTotal(amount); setRate(percentage); setBase(original); setStatus(''); }
  return <div className="space-y-5">
    <div className="flex flex-wrap gap-2" aria-label="Calculation mode">
      {(['price', 'rate'] as const).map(value => <button key={value} type="button" aria-pressed={mode === value} onClick={() => { setMode(value); setStatus(''); }} className={`min-h-12 rounded-xl border px-5 py-3 font-semibold ${mode === value ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-[var(--border)] bg-[var(--card)]'}`}>{value === 'price' ? 'Find price before tax' : 'Find tax rate'}</button>)}
    </div>
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8" aria-labelledby="tax-inputs">
        <h2 id="tax-inputs" className="text-xl font-bold">Work backwards from your total</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">Enter the amount that already includes sales tax. Results update as you type.</p>
        <div className="mt-6 space-y-5">
          <label className="block font-semibold" htmlFor="tax-total">Total including tax<input id="tax-total" type="number" inputMode="decimal" min="0" max="1000000000" step="0.01" value={total} onChange={e => { setTotal(e.target.value); setStatus(''); }} className={inputClass} aria-describedby="tax-scope" /></label>
          {mode === 'price' ? <label className="block font-semibold" htmlFor="tax-rate">Sales tax rate (%)<input id="tax-rate" type="number" inputMode="decimal" min="0" max="100" step="0.0001" value={rate} onChange={e => { setRate(e.target.value); setStatus(''); }} className={inputClass} /><span className="mt-2 block text-xs font-normal text-[var(--muted-foreground)]">Enter 8.25 for 8.25%. Use the combined rate that applies to this purchase.</span></label> : <label className="block font-semibold" htmlFor="tax-base">Price before tax<input id="tax-base" type="number" inputMode="decimal" min="0.01" max="1000000000" step="0.01" value={base} onChange={e => { setBase(e.target.value); setStatus(''); }} className={inputClass} /></label>}
          <label className="block font-semibold" htmlFor="tax-currency">Display currency<select id="tax-currency" value={currency} onChange={e => { setCurrency(e.target.value); setStatus(''); }} className={inputClass}>{['USD', 'CAD', 'AUD', 'NZD', 'GBP', 'EUR', 'INR'].map(code => <option key={code}>{code}</option>)}</select><span className="mt-2 block text-xs font-normal text-[var(--muted-foreground)]">Changes the currency label only. No conversion or automatic tax-rate lookup.</span></label>
        </div>
        <div className="mt-6"><p className="text-sm font-semibold">Try a worked example</p><div className="mt-2 flex flex-wrap gap-2">{[['108','8','100'],['216.50','8.25','200'],['120','20','100']].map(([amount, percentage, original]) => <button type="button" key={amount} className="min-h-11 rounded-lg border border-[var(--border)] px-3 py-2 text-sm hover:border-indigo-500" onClick={() => example(amount, percentage, original)}>{amount} at {percentage}%</button>)}</div></div>
        <button type="button" className="mt-5 min-h-11 text-sm font-semibold text-indigo-600 dark:text-indigo-400" onClick={() => { example('', '', ''); }}>Clear inputs</button>
      </section>
      <section aria-labelledby="tax-results" className="rounded-3xl border border-indigo-500/25 bg-indigo-500/5 p-6 sm:p-8">
        <h2 id="tax-results" className="text-xl font-bold">Your receipt breakdown</h2>
        <div aria-live="polite" aria-atomic="true">{error ? <p className="mt-6 rounded-xl border border-amber-500/30 p-4">{error}</p> : result && <>
          <p className="mt-7 text-sm font-semibold text-[var(--muted-foreground)]">{mode === 'price' ? 'Price before tax' : 'Implied tax rate'}</p>
          <p className="mt-2 break-words text-4xl font-black tracking-tight text-indigo-700 dark:text-indigo-300 sm:text-5xl">{mode === 'price' ? money(result.beforeTax) : `${rateText}%`}</p>
          <dl className="mt-7 space-y-4 text-sm">{[['Price before tax', money(result.beforeTax)], ['Included sales tax', money(result.tax)], ['Total including tax', money(result.total)], [mode === 'rate' ? 'Implied rate' : 'Tax rate', `${rateText}%`]].map(([label, value]) => <div key={label} className="flex flex-wrap justify-between gap-2 border-b border-indigo-500/15 pb-3"><dt>{label}</dt><dd className="font-bold">{value}</dd></div>)}</dl>
          <div className="mt-6 h-3 overflow-hidden rounded-full bg-amber-400" aria-hidden="true"><div className="h-full bg-indigo-500" style={{ width: `${result.total ? result.beforeTax / result.total * 100 : 100}%` }} /></div><p className="mt-2 text-xs text-[var(--muted-foreground)]">Purple: price before tax · Gold: included tax</p>
          <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"><h3 className="text-sm font-bold">Calculation steps</h3><p className="mt-2 break-words text-sm leading-7">{mode === 'price' ? `${money(result.total)} ÷ (1 + ${rateText} ÷ 100) = ${money(result.beforeTax)} before tax.` : `(${money(result.total)} − ${money(result.beforeTax)}) ÷ ${money(result.beforeTax)} × 100 = ${rateText}%.`}</p><p className="mt-2 text-sm">Included tax: {money(result.total)} − {money(result.beforeTax)} = {money(result.tax)}.</p></div>
        </>}</div>
        <button type="button" disabled={!result} className="mt-6 min-h-12 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white disabled:opacity-40" onClick={async () => { try { await navigator.clipboard.writeText(summary); setStatus('Result copied.'); } catch { setStatus('Copy is unavailable. Select and copy the figures above.'); } }}>Copy result</button><div className="mt-3 flex flex-wrap gap-3">{(['pdf', 'xlsx'] as const).map(type => <button type="button" key={type} disabled={!result || exporting !== null} onClick={() => exportResult(type)} className="min-h-12 rounded-xl border border-indigo-500/30 bg-[var(--card)] px-5 py-3 font-semibold disabled:opacity-40">{exporting === type ? 'Preparing...' : type === 'pdf' ? 'Export to PDF' : 'Export to Excel'}</button>)}</div><p className="mt-3 text-xs text-[var(--muted-foreground)]">Download this result as a PDF report or Excel (.xlsx) workbook.</p><p role="status" className="mt-2 text-sm">{status}</p>
      </section>
    </div>
    <p id="tax-scope" className="rounded-2xl border border-[var(--border)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">Use a total with one taxable base and one rate. Exclude tips, exempt items, and fees outside that base. Amounts use two decimal places; receipt rounding can cause a small difference. All calculations run in your browser.</p>
  </div>;
}
