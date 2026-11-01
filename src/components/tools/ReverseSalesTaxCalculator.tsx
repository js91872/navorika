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
  const inputClass = 'mt-2 w-full rounded-lg border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-3 text-base font-semibold focus:border-[#e5322d] focus:ring-2 focus:ring-[#e5322d]/20 outline-none transition-all';
  function example(amount: string, percentage: string, original: string) { setTotal(amount); setRate(percentage); setBase(original); setStatus(''); }
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2" aria-label="Calculation mode">
        {(['price', 'rate'] as const).map(value => (
          <button
            key={value}
            type="button"
            aria-pressed={mode === value}
            onClick={() => { setMode(value); setStatus(''); }}
            className={`min-h-11 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer ${
              mode === value
                ? 'border-[#e5322d] bg-[#e5322d] text-white shadow-xs'
                : 'border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] text-[#5b5b63] dark:text-[#a1a1aa] hover:border-[#e5322d]'
            }`}
          >
            {value === 'price' ? 'Find price before tax' : 'Find tax rate'}
          </button>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-6 sm:p-8 shadow-xs" aria-labelledby="tax-inputs">
          <h2 id="tax-inputs" className="text-lg sm:text-xl font-bold text-[#18181b] dark:text-white">Work backwards from your total</h2>
          <p className="mt-1 text-xs sm:text-sm leading-relaxed text-[#5b5b63] dark:text-[#a1a1aa]">Enter the amount that already includes sales tax. Results update as you type.</p>
          <div className="mt-5 space-y-4">
            <label className="block text-sm font-semibold text-[#18181b] dark:text-white" htmlFor="tax-total">
              Total including tax
              <input id="tax-total" type="number" inputMode="decimal" min="0" max="1000000000" step="0.01" value={total} onChange={e => { setTotal(e.target.value); setStatus(''); }} className={inputClass} aria-describedby="tax-scope" />
            </label>
            {mode === 'price' ? (
              <label className="block text-sm font-semibold text-[#18181b] dark:text-white" htmlFor="tax-rate">
                Sales tax rate (%)
                <input id="tax-rate" type="number" inputMode="decimal" min="0" max="100" step="0.0001" value={rate} onChange={e => { setRate(e.target.value); setStatus(''); }} className={inputClass} />
                <span className="mt-1.5 block text-xs font-normal text-[#5b5b63] dark:text-[#a1a1aa]">Enter 8.25 for 8.25%. Use the combined rate that applies to this purchase.</span>
              </label>
            ) : (
              <label className="block text-sm font-semibold text-[#18181b] dark:text-white" htmlFor="tax-base">
                Price before tax
                <input id="tax-base" type="number" inputMode="decimal" min="0.01" max="1000000000" step="0.01" value={base} onChange={e => { setBase(e.target.value); setStatus(''); }} className={inputClass} />
              </label>
            )}
            <label className="block text-sm font-semibold text-[#18181b] dark:text-white" htmlFor="tax-currency">
              Display currency
              <select id="tax-currency" value={currency} onChange={e => { setCurrency(e.target.value); setStatus(''); }} className={inputClass}>
                {['USD', 'CAD', 'AUD', 'NZD', 'GBP', 'EUR', 'INR'].map(code => <option key={code}>{code}</option>)}
              </select>
              <span className="mt-1.5 block text-xs font-normal text-[#5b5b63] dark:text-[#a1a1aa]">Changes the currency label only. No conversion or automatic tax-rate lookup.</span>
            </label>
          </div>
          <div className="mt-5">
            <p className="text-xs font-semibold text-[#5b5b63] dark:text-[#a1a1aa]">Try a worked example</p>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {[['108','8','100'],['216.50','8.25','200'],['120','20','100']].map(([amount, percentage, original]) => (
                <button type="button" key={amount} className="min-h-9 rounded-lg border border-[#e4e4e8] dark:border-[#27272a] bg-[#f7f7f8] dark:bg-[#202023] px-3 py-1.5 text-xs font-semibold hover:border-[#e5322d] hover:text-[#e5322d] transition-colors" onClick={() => example(amount, percentage, original)}>
                  {amount} at {percentage}%
                </button>
              ))}
            </div>
          </div>
          <button type="button" className="mt-4 text-xs font-semibold text-[#e5322d] hover:underline cursor-pointer" onClick={() => { example('', '', ''); }}>
            Clear inputs
          </button>
        </section>
        <section aria-labelledby="tax-results" className="rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-6 sm:p-8 shadow-xs">
          <h2 id="tax-results" className="text-lg sm:text-xl font-bold text-[#18181b] dark:text-white">Your receipt breakdown</h2>
          <div aria-live="polite" aria-atomic="true">
            {error ? (
              <p className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3.5 text-sm text-amber-800 dark:text-amber-200">{error}</p>
            ) : result && (
              <>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-[#5b5b63] dark:text-[#a1a1aa]">{mode === 'price' ? 'Price before tax' : 'Implied tax rate'}</p>
                <p className="mt-1 break-words text-4xl sm:text-5xl font-black tracking-tight text-[#e5322d]">{mode === 'price' ? money(result.beforeTax) : `${rateText}%`}</p>
                <dl className="mt-6 space-y-3 text-sm">
                  {[['Price before tax', money(result.beforeTax)], ['Included sales tax', money(result.tax)], ['Total including tax', money(result.total)], [mode === 'rate' ? 'Implied rate' : 'Tax rate', `${rateText}%`]].map(([label, value]) => (
                    <div key={label} className="flex flex-wrap justify-between gap-2 border-b border-[#e4e4e8] dark:border-[#27272a] pb-2.5">
                      <dt className="text-[#5b5b63] dark:text-[#a1a1aa]">{label}</dt>
                      <dd className="font-bold text-[#18181b] dark:text-white">{value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-6 h-2.5 overflow-hidden rounded-full bg-amber-400" aria-hidden="true">
                  <div className="h-full bg-[#e5322d]" style={{ width: `${result.total ? result.beforeTax / result.total * 100 : 100}%` }} />
                </div>
                <p className="mt-1.5 text-xs text-[#5b5b63] dark:text-[#a1a1aa]">Red: price before tax · Gold: included tax</p>
                <div className="mt-5 rounded-lg border border-[#e4e4e8] dark:border-[#27272a] bg-[#f7f7f8] dark:bg-[#202023] p-3.5 text-xs">
                  <h3 className="font-bold text-[#18181b] dark:text-white">Calculation steps</h3>
                  <p className="mt-1 leading-relaxed text-[#5b5b63] dark:text-[#a1a1aa]">
                    {mode === 'price' ? `${money(result.total)} ÷ (1 + ${rateText} ÷ 100) = ${money(result.beforeTax)} before tax.` : `(${money(result.total)} − ${money(result.beforeTax)}) ÷ ${money(result.beforeTax)} × 100 = ${rateText}%.`}
                  </p>
                  <p className="mt-1 text-[#5b5b63] dark:text-[#a1a1aa]">Included tax: {money(result.total)} − {money(result.beforeTax)} = {money(result.tax)}.</p>
                </div>
              </>
            )}
          </div>
          <button
            type="button"
            disabled={!result}
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#e5322d] hover:bg-[#c71f1e] px-5 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-40 cursor-pointer"
            onClick={async () => { try { await navigator.clipboard.writeText(summary); setStatus('Result copied.'); } catch { setStatus('Copy is unavailable. Select and copy the figures above.'); } }}
          >
            Copy result
          </button>
          <div className="mt-3 flex flex-wrap gap-2">
            {(['pdf', 'xlsx'] as const).map(type => (
              <button
                type="button"
                key={type}
                disabled={!result || exporting !== null}
                onClick={() => exportResult(type)}
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] px-4 py-2 text-xs font-semibold text-[#18181b] dark:text-white hover:border-[#e5322d] hover:text-[#e5322d] transition-colors disabled:opacity-40 cursor-pointer"
              >
                {exporting === type ? 'Preparing...' : type === 'pdf' ? 'Export to PDF' : 'Export to Excel'}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-[#5b5b63] dark:text-[#a1a1aa]">Download this result as a PDF report or Excel (.xlsx) workbook.</p>
          <p role="status" className="mt-2 text-xs font-semibold text-[#e5322d]">{status}</p>
        </section>
      </div>
      <p id="tax-scope" className="rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-4 text-xs sm:text-sm leading-relaxed text-[#5b5b63] dark:text-[#a1a1aa]">
        Use a total with one taxable base and one rate. Exclude tips, exempt items, and fees outside that base. Amounts use two decimal places; receipt rounding can cause a small difference. All calculations run in your browser.
      </p>
    </div>
  );
}
