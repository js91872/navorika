'use client';

import { useState, useMemo } from 'react';

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
};

export default function CreditCardCalculators() {
  const [ccBalance, setCcBalance] = useState<string>('50000');
  const [ccInterestRate, setCcInterestRate] = useState<string>('36');
  const [ccMonthlyPayment, setCcMonthlyPayment] = useState<string>('5000');

  const calculations = useMemo(() => {
    const balance = Number(ccBalance) || 0;
    const ccApr = Number(ccInterestRate) || 0;
    const ccPayment = Number(ccMonthlyPayment) || 0;
    
    const r = (ccApr / 100) / 12;
    let monthsToPayoff = 0;
    let totalInterestPaid = 0;
    let isErrorState = false;
    let summary = "";

    if (balance > 0 && ccPayment > 0) {
      if (ccPayment <= balance * r) {
        isErrorState = true;
        summary = "Warning: Your payment is less than the accumulated interest. You will never pay off this balance.";
      } else {
        monthsToPayoff = Math.ceil(-(Math.log(1 - (r * balance) / ccPayment)) / Math.log(1 + r));
        totalInterestPaid = (monthsToPayoff * ccPayment) - balance;
        summary = `At ₹${ccPayment}/month, it takes exactly ${monthsToPayoff} months to clear the card debt completely.`;
      }
    }

    return { months: isErrorState ? "∞" : monthsToPayoff, interest: isErrorState ? "Infinite" : formatCurrency(Math.max(0, totalInterestPaid)), summary, isErrorState };
  }, [ccBalance, ccInterestRate, ccMonthlyPayment]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Credit Card Intelligence Suite</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 text-base">Adjust Parameters</h3>
          <div><label className="text-xs font-bold uppercase text-slate-600 block mb-2">Total Card Balance</label><input type="number" value={ccBalance} onChange={(e) => setCcBalance(e.target.value)} className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" /></div>
          <div><label className="text-xs font-bold uppercase text-slate-600 block mb-2">Annual Interest Rate (APR %)</label><input type="number" step="0.5" value={ccInterestRate} onChange={(e) => setCcInterestRate(e.target.value)} className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" /></div>
          <div><label className="text-xs font-bold uppercase text-slate-600 block mb-2">Planned Monthly Payment</label><input type="number" value={ccMonthlyPayment} onChange={(e) => setCcMonthlyPayment(e.target.value)} className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" /></div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className={`border rounded-2xl p-6 shadow-sm ${calculations.isErrorState ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
              <div className="text-xs font-bold tracking-wider mb-2 uppercase text-slate-500">Months to Payoff</div>
              <div className={`text-3xl font-black ${calculations.isErrorState ? 'text-red-600' : 'text-indigo-600'}`}>{calculations.months}</div>
            </div>
            <div className="border bg-white border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="text-xs font-bold tracking-wider mb-2 uppercase text-slate-500">Total Interest Accrued</div>
              <div className="text-3xl font-black text-slate-900">{calculations.interest}</div>
            </div>
          </div>
          {calculations.summary && (
            <div className={`border rounded-2xl p-6 shadow-inner ${calculations.isErrorState ? 'bg-red-50 border-red-200 text-red-700' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
              <div className="text-sm font-semibold leading-relaxed">{calculations.summary}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
