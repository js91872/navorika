'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  ArrowRightLeft,
  Banknote,
  Calculator,
  CircleDollarSign,
  Globe,
  Percent,
  PiggyBank,
  Receipt,
  RotateCcw,
  TrendingUp,
} from 'lucide-react';
import ResultActions from '@/components/ui/ResultActions';
import { resultActionMessages } from '@/lib/i18n/actionMessages';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';
import { fieldClass, buttonClass } from './ToolControls';
import { calculateEMI } from '@/lib/calculations/emi';
import { calculateSIP } from '@/lib/calculations/sip';

export type FinanceToolSlug =
  | 'currency-converter'
  | 'uk-vat-calculator'
  | 'sip-calculator'
  | 'ppf-calculator'
  | 'fd-calculator'
  | 'gst-calculator'
  | 'loan-emi-calculator'
  | 'tax-calculator';

// Reference rates relative to USD (baseline fallback if live ECB endpoint is unreachable)
const BASELINE_USD_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.5,
  JPY: 154.5,
  CAD: 1.38,
  AUD: 1.52,
  CHF: 0.91,
  CNY: 7.24,
  SGD: 1.35,
  HKD: 7.82,
  KRW: 1375.0,
  BRL: 5.15,
  ZAR: 18.6,
};

const SUPPORTED_CURRENCIES = [
  'USD',
  'EUR',
  'GBP',
  'INR',
  'JPY',
  'CAD',
  'AUD',
  'CHF',
  'CNY',
  'SGD',
  'HKD',
  'KRW',
  'BRL',
  'ZAR',
] as const;

// Indian Tax Slab configuration
const TAX_REBATE_LIMIT = 1_200_000;
const TAX_REBATE_MAX = 60_000;
const TAX_CESS_RATE = 0.04;
const TAX_SLABS = [
  { ceiling: 400_000, rate: 0 },
  { ceiling: 800_000, rate: 0.05 },
  { ceiling: 1_200_000, rate: 0.1 },
  { ceiling: 1_600_000, rate: 0.15 },
  { ceiling: 2_000_000, rate: 0.2 },
  { ceiling: 2_400_000, rate: 0.25 },
  { ceiling: Number.POSITIVE_INFINITY, rate: 0.3 },
] as const;

function calculateIndianTax(income: number) {
  let slabTax = 0;
  let lowerBound = 0;
  for (const slab of TAX_SLABS) {
    const taxableInSlab = Math.max(0, Math.min(income, slab.ceiling) - lowerBound);
    slabTax += taxableInSlab * slab.rate;
    if (income <= slab.ceiling) break;
    lowerBound = slab.ceiling;
  }
  const rebate = income <= TAX_REBATE_LIMIT ? Math.min(slabTax, TAX_REBATE_MAX) : 0;
  const taxAfterRebate = slabTax - rebate;
  const maxTaxWithRelief = Math.max(0, income - TAX_REBATE_LIMIT);
  const marginalRelief =
    income > TAX_REBATE_LIMIT ? Math.max(0, taxAfterRebate - maxTaxWithRelief) : 0;
  const taxBeforeCess = taxAfterRebate - marginalRelief;
  const cess = taxBeforeCess * TAX_CESS_RATE;
  const totalTax = taxBeforeCess + cess;
  const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0;
  return { slabTax, rebate, marginalRelief, cess, totalTax, effectiveRate };
}

export default function LocalizedFinanceTools({
  slug,
  locale,
  dictionary,
}: {
  slug: FinanceToolSlug;
  locale: Locale;
  dictionary: Dictionary;
}) {
  const d = dictionary;
  const ui = d.ui;
  const fin = (d as unknown as { finance: Record<string, Record<string, string>> }).finance;

  const format = useCallback(
    (n: number, maxDigits = 2) =>
      new Intl.NumberFormat(locale, { maximumFractionDigits: maxDigits }).format(n),
    [locale]
  );

  const formatRupees = useCallback((n: number) => `₹${format(Math.round(n), 0)}`, [format]);
  const formatPounds = useCallback((n: number) => `£${format(n, 2)}`, [format]);

  // 1. Currency Converter State
  const [ccAmount, setCcAmount] = useState<number>(100);
  const [ccFrom, setCcFrom] = useState<string>('USD');
  const [ccTo, setCcTo] = useState<string>('EUR');
  const [ccRate, setCcRate] = useState<number>(BASELINE_USD_RATES.EUR / BASELINE_USD_RATES.USD);
  const [ccDate, setCcDate] = useState<string>('');
  const [ccIsFallback, setCcIsFallback] = useState<boolean>(false);

  useEffect(() => {
    if (slug !== 'currency-converter' || ccFrom === ccTo) return;

    let ignore = false;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    fetch(`https://api.frankfurter.dev/v2/rate/${ccFrom}/${ccTo}?providers=ECB`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error('ECB API unavailable');
        return res.json();
      })
      .then((data) => {
        if (ignore) return;
        if (!data || !Number.isFinite(data.rate)) throw new Error('Invalid rate response');
        setCcRate(data.rate);
        setCcDate(data.date || '');
        setCcIsFallback(false);
      })
      .catch(() => {
        if (ignore) return;
        const fromRate = BASELINE_USD_RATES[ccFrom] || 1.0;
        const toRate = BASELINE_USD_RATES[ccTo] || 1.0;
        setCcRate(toRate / fromRate);
        setCcDate('');
        setCcIsFallback(true);
      })
      .finally(() => {
        clearTimeout(timeoutId);
      });

    return () => {
      ignore = true;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [slug, ccFrom, ccTo]);

  // 2. UK VAT State (HMRC 20% Standard, 5% Reduced, 0% Zero)
  const [vatAmount, setVatAmount] = useState<number>(100);
  const [vatRate, setVatRate] = useState<number>(20);
  const [vatMode, setVatMode] = useState<'add' | 'remove'>('add');

  // 3. SIP State
  const [sipMonthly, setSipMonthly] = useState<number>(5000);
  const [sipRate, setSipRate] = useState<number>(12);
  const [sipYears, setSipYears] = useState<number>(10);

  // 4. PPF State
  const [ppfAnnual, setPpfAnnual] = useState<number>(150000);
  const [ppfRate, setPpfRate] = useState<number>(7.1);
  const [ppfTenure, setPpfTenure] = useState<number>(15);

  // 5. FD State
  const [fdPrincipal, setFdPrincipal] = useState<number>(100000);
  const [fdRate, setFdRate] = useState<number>(7.5);
  const [fdTenure, setFdTenure] = useState<number>(5);
  const [fdCompound, setFdCompound] = useState<'quarterly' | 'monthly' | 'yearly'>('quarterly');

  // 6. GST State
  const [gstAmount, setGstAmount] = useState<number>(10000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [gstType, setGstType] = useState<'exclusive' | 'inclusive'>('exclusive');

  // 7. Loan EMI State
  const [emiPrincipal, setEmiPrincipal] = useState<number>(500000);
  const [emiRate, setEmiRate] = useState<number>(8.5);
  const [emiTenure, setEmiTenure] = useState<number>(20);

  // 8. Tax Calculator State
  const [taxIncome, setTaxIncome] = useState<number>(1200000);

  // Calculation Results
  const effectiveRate = ccFrom === ccTo ? 1.0 : ccRate;

  const currentResults = useMemo(() => {
    const results: Array<[string, string]> = [];

    if (slug === 'currency-converter') {
      const converted = ccAmount * effectiveRate;
      results.push([fin.currencyConverter.convertedAmount, `${format(converted, 2)} ${ccTo}`]);
      results.push([fin.currencyConverter.exchangeRate, `1 ${ccFrom} = ${format(effectiveRate, 4)} ${ccTo}`]);
      results.push([
        fin.currencyConverter.dataSource,
        ccIsFallback
          ? fin.currencyConverter.offlineFallback
          : ccDate
          ? `${fin.currencyConverter.ecbLive} (${ccDate})`
          : fin.currencyConverter.sameCurrency,
      ]);
    } else if (slug === 'uk-vat-calculator') {
      const r = vatRate / 100;
      const net = vatMode === 'add' ? vatAmount : vatAmount / (1 + r);
      const gross = vatMode === 'add' ? vatAmount * (1 + r) : vatAmount;
      const vat = gross - net;
      results.push([fin.ukVat.priceNet, formatPounds(net)]);
      results.push([fin.ukVat.vatAmount, formatPounds(vat)]);
      results.push([fin.ukVat.priceGross, formatPounds(gross)]);
      results.push([fin.ukVat.effectiveRate, `${format(vatRate, 1)}%`]);
    } else if (slug === 'sip-calculator') {
      const sip = calculateSIP({
        monthlyInvestment: sipMonthly,
        expectedRate: sipRate,
        timePeriod: sipYears,
      });
      results.push([fin.sip.totalValue, formatRupees(sip.totalValue)]);
      results.push([fin.sip.investedAmount, formatRupees(sip.totalInvested)]);
      results.push([fin.sip.estimatedReturns, formatRupees(sip.estimatedReturns)]);
    } else if (slug === 'ppf-calculator') {
      let balance = 0;
      const r = ppfRate / 100;
      for (let i = 0; i < ppfTenure; i++) {
        balance += ppfAnnual;
        balance *= 1 + r;
      }
      const invested = ppfAnnual * ppfTenure;
      const interest = balance - invested;
      results.push([fin.ppf.maturityAmount, formatRupees(balance)]);
      results.push([fin.ppf.totalInvested, formatRupees(invested)]);
      results.push([fin.ppf.totalInterest, formatRupees(interest)]);
    } else if (slug === 'fd-calculator') {
      const n = fdCompound === 'monthly' ? 12 : fdCompound === 'quarterly' ? 4 : 1;
      const maturity = fdPrincipal * Math.pow(1 + fdRate / 100 / n, n * fdTenure);
      const interest = maturity - fdPrincipal;
      results.push([fin.fd.maturityAmount, formatRupees(maturity)]);
      results.push([fin.fd.totalInterest, formatRupees(interest)]);
      results.push([fin.fd.effectiveYield, `${format(((maturity - fdPrincipal) / fdPrincipal / fdTenure) * 100, 2)}%`]);
    } else if (slug === 'gst-calculator') {
      const isExcl = gstType === 'exclusive';
      const r = gstRate / 100;
      const net = isExcl ? gstAmount : gstAmount / (1 + r);
      const gross = isExcl ? gstAmount * (1 + r) : gstAmount;
      const gst = gross - net;
      const halfGst = gst / 2;
      results.push([fin.gst.totalGross, formatRupees(gross)]);
      results.push([fin.gst.netAmount, formatRupees(net)]);
      results.push([fin.gst.totalGst, formatRupees(gst)]);
      results.push([fin.gst.cgst, formatRupees(halfGst)]);
      results.push([fin.gst.sgst, formatRupees(halfGst)]);
    } else if (slug === 'loan-emi-calculator') {
      const emi = calculateEMI({
        principal: emiPrincipal,
        rate: emiRate,
        tenure: emiTenure,
        tenureUnit: 'years',
      });
      results.push([fin.loanEmi.monthlyPayment, formatRupees(emi.monthlyPayment)]);
      results.push([fin.loanEmi.totalPayment, formatRupees(emi.totalPayment)]);
      results.push([fin.loanEmi.totalInterest, formatRupees(emi.totalInterest)]);
    } else if (slug === 'tax-calculator') {
      const tax = calculateIndianTax(taxIncome);
      results.push([fin.tax.totalTax, formatRupees(tax.totalTax)]);
      results.push([fin.tax.slabTax, formatRupees(tax.slabTax)]);
      results.push([fin.tax.rebate, formatRupees(tax.rebate)]);
      results.push([fin.tax.marginalRelief, formatRupees(tax.marginalRelief)]);
      results.push([fin.tax.cess, formatRupees(tax.cess)]);
      results.push([fin.tax.effectiveRate, `${format(tax.effectiveRate, 2)}%`]);
    }

    return results;
  }, [
    slug,
    ccAmount,
    effectiveRate,
    ccFrom,
    ccTo,
    ccIsFallback,
    ccDate,
    vatAmount,
    vatRate,
    vatMode,
    sipMonthly,
    sipRate,
    sipYears,
    ppfAnnual,
    ppfRate,
    ppfTenure,
    fdPrincipal,
    fdRate,
    fdTenure,
    fdCompound,
    gstAmount,
    gstRate,
    gstType,
    emiPrincipal,
    emiRate,
    emiTenure,
    taxIncome,
    fin,
    format,
    formatPounds,
    formatRupees,
  ]);

  const handleReset = () => {
    if (slug === 'currency-converter') {
      setCcAmount(100);
      setCcFrom('USD');
      setCcTo('EUR');
    } else if (slug === 'uk-vat-calculator') {
      setVatAmount(100);
      setVatRate(20);
      setVatMode('add');
    } else if (slug === 'sip-calculator') {
      setSipMonthly(5000);
      setSipRate(12);
      setSipYears(10);
    } else if (slug === 'ppf-calculator') {
      setPpfAnnual(150000);
      setPpfRate(7.1);
      setPpfTenure(15);
    } else if (slug === 'fd-calculator') {
      setFdPrincipal(100000);
      setFdRate(7.5);
      setFdTenure(5);
      setFdCompound('quarterly');
    } else if (slug === 'gst-calculator') {
      setGstAmount(10000);
      setGstRate(18);
      setGstType('exclusive');
    } else if (slug === 'loan-emi-calculator') {
      setEmiPrincipal(500000);
      setEmiRate(8.5);
      setEmiTenure(20);
    } else if (slug === 'tax-calculator') {
      setTaxIncome(1200000);
    }
  };

  const toolTitle = (d.tools as Record<string, { title?: string }>)[slug]?.title || slug;
  const activeSummary = `${toolTitle}\n${currentResults
    .map(([lbl, val]) => `${lbl}: ${val}`)
    .join('\n')}`;

  const csvRows = `\uFEFF${toolTitle}\nMetric,Value\n${currentResults
    .map(([lbl, val]) => `"${lbl.replace(/"/g, '""')}","${val.replace(/"/g, '""')}"`)
    .join('\n')}\n`;

  const csvName = `${slug}-report.csv`;

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-2">
      {/* Controls Card */}
      <section className="min-w-0 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
        <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
          {slug === 'currency-converter' && <Globe className="size-5 shrink-0 text-indigo-500" />}
          {slug === 'uk-vat-calculator' && <Receipt className="size-5 shrink-0 text-emerald-500" />}
          {slug === 'sip-calculator' && <TrendingUp className="size-5 shrink-0 text-blue-500" />}
          {slug === 'ppf-calculator' && <PiggyBank className="size-5 shrink-0 text-teal-500" />}
          {slug === 'fd-calculator' && <Banknote className="size-5 shrink-0 text-cyan-500" />}
          {slug === 'gst-calculator' && <Percent className="size-5 shrink-0 text-purple-500" />}
          {slug === 'loan-emi-calculator' && <Calculator className="size-5 shrink-0 text-amber-500" />}
          {slug === 'tax-calculator' && <CircleDollarSign className="size-5 shrink-0 text-rose-500" />}
          <h2 className="text-xl font-bold">
            {slug === 'currency-converter' && fin.currencyConverter.heading}
            {slug === 'uk-vat-calculator' && fin.ukVat.heading}
            {slug === 'sip-calculator' && fin.sip.heading}
            {slug === 'ppf-calculator' && fin.ppf.heading}
            {slug === 'fd-calculator' && fin.fd.heading}
            {slug === 'gst-calculator' && fin.gst.heading}
            {slug === 'loan-emi-calculator' && fin.loanEmi.heading}
            {slug === 'tax-calculator' && fin.tax.heading}
          </h2>
        </div>

        <div className="mt-5 space-y-4">
          {/* Currency Converter */}
          {slug === 'currency-converter' && (
            <div className="space-y-4">
              <label className="text-sm font-semibold">
                {fin.currencyConverter.amount}
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={ccAmount}
                  onChange={(e) => setCcAmount(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>

              <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
                <label className="text-sm font-semibold">
                  {fin.currencyConverter.fromCurrency}
                  <select
                    value={ccFrom}
                    onChange={(e) => setCcFrom(e.target.value)}
                    className={fieldClass}
                  >
                    {SUPPORTED_CURRENCIES.map((code) => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    const temp = ccFrom;
                    setCcFrom(ccTo);
                    setCcTo(temp);
                  }}
                  className="mb-1 rounded-xl border border-[var(--border)] p-3 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  aria-label="Swap currencies"
                >
                  <ArrowRightLeft className="size-4" />
                </button>

                <label className="text-sm font-semibold">
                  {fin.currencyConverter.toCurrency}
                  <select
                    value={ccTo}
                    onChange={(e) => setCcTo(e.target.value)}
                    className={fieldClass}
                  >
                    {SUPPORTED_CURRENCIES.map((code) => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {ccIsFallback && (
                <p className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs leading-5 text-amber-700 dark:text-amber-300">
                  {fin.currencyConverter.offlineFallbackNotice}
                </p>
              )}
            </div>
          )}

          {/* UK VAT */}
          {slug === 'uk-vat-calculator' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                {fin.ukVat.amount}
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={vatAmount}
                  onChange={(e) => setVatAmount(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>

              <label className="text-sm font-semibold">
                {fin.ukVat.vatRate}
                <select
                  value={vatRate}
                  onChange={(e) => setVatRate(Number(e.target.value))}
                  className={fieldClass}
                >
                  <option value={20}>{fin.ukVat.rateStandard}</option>
                  <option value={5}>{fin.ukVat.rateReduced}</option>
                  <option value={0}>{fin.ukVat.rateZero}</option>
                </select>
              </label>

              <label className="text-sm font-semibold sm:col-span-2">
                {fin.ukVat.calculationMode}
                <select
                  value={vatMode}
                  onChange={(e) => setVatMode(e.target.value as 'add' | 'remove')}
                  className={fieldClass}
                >
                  <option value="add">{fin.ukVat.modeAdd}</option>
                  <option value="remove">{fin.ukVat.modeRemove}</option>
                </select>
              </label>
            </div>
          )}

          {/* SIP */}
          {slug === 'sip-calculator' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold sm:col-span-2">
                {fin.sip.monthlyInvestment}
                <input
                  type="number"
                  min="100"
                  step="500"
                  value={sipMonthly}
                  onChange={(e) => setSipMonthly(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>

              <label className="text-sm font-semibold">
                {fin.sip.expectedRate}
                <input
                  type="number"
                  min="1"
                  max="50"
                  step="0.5"
                  value={sipRate}
                  onChange={(e) => setSipRate(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>

              <label className="text-sm font-semibold">
                {fin.sip.timePeriod}
                <input
                  type="number"
                  min="1"
                  max="40"
                  step="1"
                  value={sipYears}
                  onChange={(e) => setSipYears(Math.max(1, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
            </div>
          )}

          {/* PPF */}
          {slug === 'ppf-calculator' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold sm:col-span-2">
                {fin.ppf.annualInvestment}
                <input
                  type="number"
                  min="500"
                  max="150000"
                  step="1000"
                  value={ppfAnnual}
                  onChange={(e) => setPpfAnnual(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>

              <label className="text-sm font-semibold">
                {fin.ppf.interestRate}
                <input
                  type="number"
                  min="1"
                  max="20"
                  step="0.1"
                  value={ppfRate}
                  onChange={(e) => setPpfRate(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>

              <label className="text-sm font-semibold">
                {fin.ppf.tenure}
                <input
                  type="number"
                  min="15"
                  max="50"
                  step="5"
                  value={ppfTenure}
                  onChange={(e) => setPpfTenure(Math.max(15, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
            </div>
          )}

          {/* FD */}
          {slug === 'fd-calculator' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold sm:col-span-2">
                {fin.fd.principal}
                <input
                  type="number"
                  min="1000"
                  step="10000"
                  value={fdPrincipal}
                  onChange={(e) => setFdPrincipal(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>

              <label className="text-sm font-semibold">
                {fin.fd.interestRate}
                <input
                  type="number"
                  min="1"
                  max="25"
                  step="0.1"
                  value={fdRate}
                  onChange={(e) => setFdRate(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>

              <label className="text-sm font-semibold">
                {fin.fd.tenure}
                <input
                  type="number"
                  min="1"
                  max="30"
                  step="1"
                  value={fdTenure}
                  onChange={(e) => setFdTenure(Math.max(1, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>

              <label className="text-sm font-semibold sm:col-span-2">
                {fin.fd.compoundingFrequency}
                <select
                  value={fdCompound}
                  onChange={(e) =>
                    setFdCompound(e.target.value as 'quarterly' | 'monthly' | 'yearly')
                  }
                  className={fieldClass}
                >
                  <option value="quarterly">{fin.fd.quarterly}</option>
                  <option value="monthly">{fin.fd.monthly}</option>
                  <option value="yearly">{fin.fd.yearly}</option>
                </select>
              </label>
            </div>
          )}

          {/* GST */}
          {slug === 'gst-calculator' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold sm:col-span-2">
                {fin.gst.amount}
                <input
                  type="number"
                  min="1"
                  step="500"
                  value={gstAmount}
                  onChange={(e) => setGstAmount(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>

              <label className="text-sm font-semibold">
                {fin.gst.rate}
                <select
                  value={gstRate}
                  onChange={(e) => setGstRate(Number(e.target.value))}
                  className={fieldClass}
                >
                  <option value={5}>5%</option>
                  <option value={12}>12%</option>
                  <option value={18}>18%</option>
                  <option value={28}>28%</option>
                </select>
              </label>

              <label className="text-sm font-semibold">
                {fin.gst.type}
                <select
                  value={gstType}
                  onChange={(e) => setGstType(e.target.value as 'exclusive' | 'inclusive')}
                  className={fieldClass}
                >
                  <option value="exclusive">{fin.gst.exclusive}</option>
                  <option value="inclusive">{fin.gst.inclusive}</option>
                </select>
              </label>
            </div>
          )}

          {/* Loan EMI */}
          {slug === 'loan-emi-calculator' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold sm:col-span-2">
                {fin.loanEmi.principal}
                <input
                  type="number"
                  min="10000"
                  step="50000"
                  value={emiPrincipal}
                  onChange={(e) => setEmiPrincipal(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>

              <label className="text-sm font-semibold">
                {fin.loanEmi.rate}
                <input
                  type="number"
                  min="1"
                  max="35"
                  step="0.1"
                  value={emiRate}
                  onChange={(e) => setEmiRate(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>

              <label className="text-sm font-semibold">
                {fin.loanEmi.tenure}
                <input
                  type="number"
                  min="1"
                  max="40"
                  step="1"
                  value={emiTenure}
                  onChange={(e) => setEmiTenure(Math.max(1, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
            </div>
          )}

          {/* Tax Calculator */}
          {slug === 'tax-calculator' && (
            <div className="space-y-4">
              <label className="text-sm font-semibold">
                {fin.tax.income}
                <input
                  type="number"
                  min="0"
                  step="50000"
                  value={taxIncome}
                  onChange={(e) => setTaxIncome(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <p className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 text-xs leading-5 text-[var(--muted-foreground)]">
                {fin.tax.regimeNote}
              </p>
            </div>
          )}

          <div className="mt-5 flex gap-3">
            <button type="button" onClick={handleReset} className={buttonClass}>
              <RotateCcw className="size-4" /> {ui.reset}
            </button>
          </div>
        </div>
      </section>

      {/* Results Card */}
      <section className="min-w-0 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
        <h3 className="text-lg font-bold">{fin.common.results}</h3>

        {currentResults.length > 0 && (
          <div className="mt-4 space-y-4">
            <dl className="grid min-w-0 gap-3 sm:grid-cols-2">
              {currentResults.map(([label, val]) => (
                <div
                  key={label}
                  className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-3"
                >
                  <dt className="truncate text-xs text-[var(--muted-foreground)]">{label}</dt>
                  <dd className="mt-1 break-words text-lg font-bold text-[var(--foreground)]">{val}</dd>
                </div>
              ))}
            </dl>

            <ResultActions
              messages={resultActionMessages[locale]}
              actions={[
                { kind: 'copy', label: d.ui.copy, getContent: () => activeSummary },
                {
                  kind: 'download',
                  label: d.calculatorUi.csv,
                  filename: csvName,
                  mimeType: 'text/csv;charset=utf-8',
                  getContent: () => csvRows,
                },
              ]}
            />
          </div>
        )}
      </section>
    </div>
  );
}
