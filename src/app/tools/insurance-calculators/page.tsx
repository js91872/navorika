'use client';

import { useState, useMemo } from 'react';

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
};

export default function InsuranceCalculators() {
  const [currentAge, setCurrentAge] = useState<string>('30');
  const [retirementAge, setRetirementAge] = useState<string>('60');
  const [annualIncome, setAnnualIncome] = useState<string>('1200000');
  const [existingCover, setExistingCover] = useState<string>('5000000');

  const calculations = useMemo(() => {
    const age = Number(currentAge) || 0;
    const retire = Number(retirementAge) || 0;
    const income = Number(annualIncome) || 0;
    const cover = Number(existingCover) || 0;

    const workingYearsLeft = Math.max(0, retire - age);
    const totalIncomeReplacement = income * workingYearsLeft;
    const netHlvRequired = Math.max(0, totalIncomeReplacement - cover);

    return { hlv: formatCurrency(totalIncomeReplacement), gap: formatCurrency(netHlvRequired), years: workingYearsLeft };
  }, [currentAge, retirementAge, annualIncome, existingCover]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Insurance & Cover Planning</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 text-base">Adjust Parameters</h3>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="text-xs font-bold uppercase text-slate-600 block mb-2">Current Age</label><input type="number" value={currentAge} onChange={(e) => setCurrentAge(e.target.value)} className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" /></div>
            <div><label className="text-xs font-bold uppercase text-slate-600 block mb-2">Retire Age</label><input type="number" value={retirementAge} onChange={(e) => setRetirementAge(e.target.value)} className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" /></div>
          </div>
          <div><label className="text-xs font-bold uppercase text-slate-600 block mb-2">Annual Income / Salary</label><input type="number" value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" /></div>
          <div><label className="text-xs font-bold uppercase text-slate-600 block mb-2">Existing Life Cover</label><input type="number" value={existingCover} onChange={(e) => setExistingCover(e.target.value)} className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" /></div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="border bg-white border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="text-xs font-bold tracking-wider mb-2 uppercase text-slate-500">Human Life Value (HLV)</div>
              <div className="text-3xl font-black text-indigo-600">{calculations.hlv}</div>
            </div>
            <div className="border bg-white border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="text-xs font-bold tracking-wider mb-2 uppercase text-slate-500">Additional Cover Gap</div>
              <div className="text-3xl font-black text-slate-900">{calculations.gap}</div>
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-inner text-slate-700">
            <div className="text-sm font-semibold leading-relaxed">
              Based on {calculations.years} remaining working years, your income replacement target is {calculations.hlv}. Your existing cover acts as an offset, leaving a protection gap of {calculations.gap}.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
