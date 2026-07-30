'use client';

import { useState, useMemo } from 'react';

type RetirementMode = 'corpus' | 'fire' | 'pension' | 'annuity';

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
};

export default function RetirementCalculators() {
  const [mode, setMode] = useState<RetirementMode>('corpus');

  // Value-bound controlled string state configurations
  const [currentAge, setCurrentAge] = useState<string>('30');
  const [targetAge, setTargetAge] = useState<string>('60');
  const [monthlyExpense, setMonthlyExpense] = useState<string>('50000');
  const [existingCorpus, setExistingCorpus] = useState<string>('500000');
  
  // Pension / Annuity specific state tracking
  const [annuityPool, setAnnuityPool] = useState<string>('10000000'); // 1 Crore base default
  const [annuityRate, setAnnuityRate] = useState<string>('6.5'); // average pension annuity yield rate

  // Math Evaluation Engine
  const calculations = useMemo(() => {
    const ageNow = Number(currentAge) || 0;
    const ageRetire = Number(targetAge) || 0;
    const expMonthly = Number(monthlyContributionText => monthlyExpense) || Number(monthlyExpense) || 0;
    const currentSavings = Number(existingCorpus) || 0;
    const poolSize = Number(annuityPool) || 0;
    const aRate = (Number(annuityRate) || 0) / 100;

    const inflationRate = 0.06; // Standard 6% structural inflation rule
    const postRetirementReturn = 0.08; // Conservative 8% returns post retirement
    const lifeExpectancy = 85;

    let totalCorpusRequired = 0;
    let monthlyPensionOutlay = 0;
    let investedCapitalValue = 0;
    let mainOutputValue = 0;
    let extraLabel = '';
    let extraValue = '';

    const yearsToRetire = Math.max(0, ageRetire - ageNow);
    const yearsInRetirement = Math.max(0, lifeExpectancy - ageRetire);

    switch (mode) {
      case 'corpus':
      case 'fire':
        // Inflation-adjusted future monthly expense calculation
        const futureMonthlyExpense = expMonthly * Math.pow(1 + inflationRate, yearsToRetire);
        const futureAnnualExpense = futureMonthlyExpense * 12;

        // Capitalization factor adjusting for real post-retirement return yield
        const realReturnRate = (1 + postRetirementReturn) / (1 + inflationRate) - 1;
        
        if (realReturnRate > 0 && yearsInRetirement > 0) {
          totalCorpusRequired = futureAnnualExpense * ((1 - Math.pow(1 + realReturnRate, -yearsInRetirement)) / realReturnRate);
        } else {
          totalCorpusRequired = futureAnnualExpense * yearsInRetirement;
        }

        // Account for existing savings compounded up to retirement age at an average 10% equity/hybrid rate
        const compoundedSavings = currentSavings * Math.pow(1 + 0.10, yearsToRetire);
        mainOutputValue = Math.max(0, totalCorpusRequired - compoundedSavings);
        investedCapitalValue = currentSavings;

        extraLabel = mode === 'corpus' ? "Future Inflated Monthly Expense" : "FIRE Number Multiplier Rule (25x)";
        extraValue = mode === 'corpus' 
          ? formatCurrency(futureMonthlyExpense)
          : `${formatCurrency(expMonthly * 12 * 25)} (Based on current annual baseline)`;
        break;

      case 'pension':
      case 'annuity':
        // Computes monthly income generation based on annuity pricing
        investedCapitalValue = poolSize;
        mainOutputValue = poolSize;
        monthlyPensionOutlay = (poolSize * aRate) / 12;
        
        extraLabel = mode === 'pension' ? "Estimated Monthly Pension Payout" : "Annual Annuity Yield Stream";
        extraValue = mode === 'pension' 
          ? formatCurrency(monthlyPensionOutlay) 
          : `${formatCurrency(poolSize * aRate)} / year`;
        break;
    }

    return { investedCapitalValue, mainOutputValue, extraLabel, extraValue };
  }, [mode, currentAge, targetAge, monthlyExpense, existingCorpus, annuityPool, annuityRate]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Retirement & FIRE Hub</h1>
        <p className="text-slate-600 mt-2 text-sm max-w-2xl">
          Evaluate inflation metrics, safe asset withdrawal rates, and structured annuity pensions to map out long-term financial independence.
        </p>
      </div>

      {/* Mode Navigation Matrix Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
        {[
          { id: 'corpus', label: 'Retirement Corpus Planner' },
          { id: 'fire', label: 'FIRE Calculator Engine' },
          { id: 'pension', label: 'Pension Income Tracker' },
          { id: 'annuity', label: 'Annuity Yield Calculator' },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setMode(btn.id as RetirementMode)}
            className={`px-3 py-3 rounded-xl border text-xs font-bold transition-all text-center ${
              mode === btn.id
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Controlled parameter fields mapping */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 text-base">Adjust Parameters</h3>

          {(mode === 'corpus' || mode === 'fire') && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Current Age</label>
                  <input
                    type="number"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Retirement Age</label>
                  <input
                    type="number"
                    value={targetAge}
                    onChange={(e) => setTargetAge(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Current Monthly Expense</label>
                <input
                  type="number"
                  value={monthlyExpense}
                  onChange={(e) => setMonthlyExpense(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Existing Saved Net Worth Corpus</label>
                <input
                  type="number"
                  value={existingCorpus}
                  onChange={(e) => setExistingCorpus(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </>
          )}

          {(mode === 'pension' || mode === 'annuity') && (
            <>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Total Accumulated Annuity/Pension Pool</label>
                <input
                  type="number"
                  value={annuityPool}
                  onChange={(e) => setAnnuityPool(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Expected Annuity Return Rate (% p.a.)</label>
                <input
                  type="number"
                  step="0.1"
                  value={annuityRate}
                  onChange={(e) => setAnnuityRate(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </>
          )}
        </div>

        {/* Dynamic Outputs Projections View Panels */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              {mode === 'corpus' || mode === 'fire' ? "Required Target Corpus Nest Egg" : "Total Capital Allocation Pool Assets"}
            </span>
            <div className="text-4xl font-black text-indigo-600 tracking-tight">
              {formatCurrency(calculations.mainOutputValue)}
            </div>
            <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
              {mode === 'corpus' || mode === 'fire' 
                ? "The target asset pool required by retirement age to completely support life expenses adjusted for 6% annual inflation."
                : "The baseline asset valuation pool size handling structural interest distribution curves safely."}
            </p>
          </div>

          {calculations.extraLabel && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 text-center shadow-inner">
              <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">{calculations.extraLabel}</div>
              <div className="text-2xl font-black text-indigo-900">{calculations.extraValue}</div>
            </div>
          )}

          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-500">
            <h4 className="font-bold text-slate-700 mb-2">Calculators Fully Supported inside this retirement module:</h4>
            <p className="leading-relaxed">
              Retirement Calculator • Pension Calculator • FIRE Calculator • Retirement Corpus Calculator • Retirement Withdrawal Calculator • Annuity Calculator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
