'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRightLeft, Globe, LoaderCircle } from 'lucide-react';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'SGD', 'HKD', 'KRW', 'BRL', 'ZAR'] as const;

type RateResponse = {
  date: string;
  base: string;
  quote: string;
  rate: number;
};

type Conversion = RateResponse & {
  amount: number;
  convertedAmount: number;
};

const formatNumber = (value: number, maximumFractionDigits = 2) =>
  new Intl.NumberFormat(undefined, { maximumFractionDigits }).format(value);

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('INR');
  const [conversion, setConversion] = useState<Conversion | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const convert = async () => {
    if (!Number.isFinite(amount) || amount < 0) {
      setError('Enter an amount of zero or more.');
      setConversion(null);
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      if (from === to) {
        setConversion({ amount, convertedAmount: amount, base: from, quote: to, rate: 1, date: '' });
        return;
      }

      const response = await fetch(`https://api.frankfurter.dev/v2/rate/${from}/${to}?providers=ECB`);
      if (!response.ok) throw new Error('The reference-rate service is unavailable.');

      const data = (await response.json()) as RateResponse;
      if (!Number.isFinite(data.rate) || !data.date) throw new Error('The rate response was incomplete.');

      setConversion({ ...data, amount, convertedAmount: amount * data.rate });
    } catch (caught) {
      setConversion(null);
      setError(caught instanceof Error ? caught.message : 'Unable to retrieve a reference rate.');
    } finally {
      setIsLoading(false);
    }
  };

  const swapCurrencies = () => {
    setFrom(to);
    setTo(from);
    setConversion(null);
    setError('');
  };

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 pt-24 text-[var(--foreground)]">
      <div className="mx-auto max-w-4xl">
        <Link href="/tools" className="mb-6 inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
          <ArrowLeft className="size-4" /> Back to Tools
        </Link>
        <h1 className="text-3xl font-bold">Currency Converter</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">Convert using the latest available European Central Bank reference rate.</p>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <section className="space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
            <div>
              <label htmlFor="currency-amount" className="text-sm font-medium">Amount</label>
              <input id="currency-amount" type="number" min="0" step="any" value={amount} onChange={(event) => setAmount(Number(event.target.value))} className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2" />
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
              <div>
                <label htmlFor="currency-from" className="text-sm font-medium">From</label>
                <select id="currency-from" value={from} onChange={(event) => { setFrom(event.target.value); setConversion(null); }} className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2">
                  {CURRENCIES.map((currency) => <option key={currency}>{currency}</option>)}
                </select>
              </div>
              <button type="button" onClick={swapCurrencies} aria-label="Swap currencies" className="mb-0.5 grid size-10 place-items-center rounded-lg border border-[var(--border)] hover:border-indigo-500/50">
                <ArrowRightLeft className="size-4" />
              </button>
              <div>
                <label htmlFor="currency-to" className="text-sm font-medium">To</label>
                <select id="currency-to" value={to} onChange={(event) => { setTo(event.target.value); setConversion(null); }} className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2">
                  {CURRENCIES.map((currency) => <option key={currency}>{currency}</option>)}
                </select>
              </div>
            </div>

            <button type="button" onClick={convert} disabled={isLoading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-70">
              {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : <Globe className="size-4" />}
              {isLoading ? 'Getting rate…' : 'Convert'}
            </button>
            {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error} Try again shortly.</p>}
          </section>

          <section aria-live="polite" className="flex min-h-72 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
            {conversion ? (
              <div className="w-full text-center">
                <Globe className="mx-auto mb-4 size-11 text-indigo-500" />
                <p className="text-sm text-[var(--muted-foreground)]">{formatNumber(conversion.amount, 6)} {conversion.base} equals</p>
                <p className="mt-2 text-4xl font-bold">{formatNumber(conversion.convertedAmount, 6)} <span className="text-lg font-normal text-[var(--muted-foreground)]">{conversion.quote}</span></p>
                <div className="mt-5 border-t border-[var(--border)] pt-4 text-sm text-[var(--muted-foreground)]">
                  <p>1 {conversion.base} = {formatNumber(conversion.rate, 6)} {conversion.quote}</p>
                  <p className="mt-1">{conversion.date ? `Reference date: ${conversion.date}` : 'Same-currency conversion'}</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-[var(--muted-foreground)]"><Globe className="mx-auto mb-3 size-12 opacity-30" /><p>Enter an amount and convert</p></div>
            )}
          </section>
        </div>

        <p className="mt-5 text-center text-xs leading-5 text-[var(--muted-foreground)]">ECB reference rates are supplied via Frankfurter. They are typically updated on working days and are not live trading or card-settlement rates. Only the selected currency pair is requested; the amount is calculated in your browser.</p>
      </div>
    </main>
  );
}
