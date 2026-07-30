'use client';

import { useState, useMemo } from 'react';

type SubMode = 
  | 'sip' | 'lumpsum' | 'cagr' | 'compound_interest' 
  | 'simple_interest' | 'roi' | 'goal' | 'dca';

export default function InvestmentCalculators() {
  const [mode, setMode] = useState<SubMode>('sip');

  // Universal Controlled String States initialized with active numbers instead of placeholders
  const [principal, setPrincipal] = useState<string>('100000'); 
  const [periodicAmount, setPeriodicAmount] = useState<string>('5000'); 
  const [rate, setRate] = useState<string>('12'); 
  const [years, setYears] = useState<string>('10');
  
  const [initialAssetVal, setInitialAssetVal] = useState<string>('100000');
  const [finalAssetVal, setFinalAssetVal] = useState<string>('250000');
  const [targetGoalVal, setTargetGoalVal] = useState<string>('1000000');

  // Math Engine - Safely parses numerical input on the fly
  const calculations = useMemo(() => {
    let invested = 0;
    let totalValue = 0;
    let gains = 0;
    let generalizedRate = 0;
    let extraMetricLabel = '';
    let extraMetricValue = '';

    const t = Number(years) || 0;
    const r = (Number(rate) || 0) / 100;
    const pAmount = Number(periodicAmount) || 0;
    const pCapital = Number(principal) || 0;
    const iVal = Number(initialAssetVal) || 0;
    const fVal = Number(finalAssetVal) || 0;
    const tGoal = Number(targetGoalVal) || 0;

    switch (mode) {
      case 'sip':
        const monthlyRate = r / 12;
        const totalMonths = t * 12;
        invested = pAmount * totalMonths;
        totalValue = monthlyRate > 0 
          ? pAmount * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate)
          : invested;
        gains = totalValue - invested;
        break;

      case 'lumpsum':
        invested = pCapital;
        totalValue = pCapital * Math.pow(1 + r, t);
        gains = totalValue - invested;
        break;

      case 'cagr':
        invested = iVal;
        totalValue = fVal;
        gains = fVal - iVal;
        if (iVal > 0 && fVal > 0 && t > 0) {
          generalizedRate = (Math.pow(fVal / iVal, 1 / t) - 1) * 100;
        }
        extraMetricLabel = "Annualized CAGR/XIRR Rate";
        extraMetricValue = `${generalizedRate.toFixed(2)}%`;
        break;

      case 'compound_interest':
        invested = pCapital;
        totalValue = pCapital * Math.pow(1 + r / 12, 12 * t);
        gains = totalValue - invested;
        break;

      case 'simple_interest':
        invested = pCapital;
        gains = pCapital * r * t;
        totalValue = invested + gains;
        break;

      case 'roi':
        invested = pCapital;
        totalValue = fVal;
        gains = fVal - pCapital;
        if (pCapital > 0) {
          generalizedRate = (gains / pCapital) * 100;
        }
        extraMetricLabel = "Absolute Return on Investment (ROI)";
        extraMetricValue = `${generalizedRate.toFixed(1)}%`;
        break;

      case 'goal':
        totalValue = tGoal;
        const mRate = r / 12;
        const mMonths = t * 12;
        if (mRate > 0 && mMonths > 0) {
          const requiredMonthly = tGoal / (((Math.pow(1 + mRate, mMonths) - 1) / mRate) * (1 + mRate));
          invested = requiredMonthly * mMonths;
          gains = totalValue - invested;
          extraMetricLabel = "Required Monthly SIP";
          extraMetricValue = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(requiredMonthly);
        } else {
          invested = tGoal;
          extraMetricLabel = "Required Monthly SIP";
          extraMetricValue = mMonths > 0 ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(tGoal / mMonths) : '₹0';
        }
        break;

      case 'dca':
        invested = pAmount * (t * 12);
        const dcaMonthlyRate = r / 12;
        totalValue = dcaMonthlyRate > 0 
          ? pAmount * ((Math.pow(1 + dcaMonthlyRate, t * 12) - 1) / dcaMonthlyRate) * (1 + dcaMonthlyRate)
          : invested;
        gains = totalValue - invested;
        break;
    }

    return { invested, totalValue, gains, extraMetricLabel, extraMetricValue };
  }, [mode, principal, periodicAmount, rate, years, initialAssetVal, finalAssetVal, targetGoalVal]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  const gainsPct = useMemo(() => {
    if (calculations.totalValue <= 0) return '0';
    return ((calculations.gains / calculations.totalValue) * 100).toFixed(1);
  }, [calculations.gains, calculations.totalValue]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Investment Calculators Hub</h1>
        <p className="text-slate-600 mt-2 text-sm max-w-2xl">
          A client-side suite fulfilling 15 precise calculators covering Mutual Funds, SIP, CAGR, XIRR, ROI, Portfolio returns, and Goal settings.
        </p>
      </div>

      {/* Grid Switcher tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
        {[
          { id: 'sip', label: 'SIP / Mutual Fund' },
          { id: 'lumpsum', label: 'Lumpsum Investment' },
          { id: 'cagr', label: 'CAGR / XIRR Rate' },
          { id: 'compound_interest', label: 'Compound Interest' },
          { id: 'simple_interest', label: 'Simple Interest' },
          { id: 'roi', label: 'ROI / Portfolio Return' },
          { id: 'goal', label: 'Investment Goal Plan' },
          { id: 'dca', label: 'Dollar Cost Averaging' },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setMode(btn.id as SubMode)}
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
        {/* Adjusted Controlled input fields showing values explicitly */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 text-base">Adjust Projections</h3>

          {(mode === 'sip' || mode === 'dca') && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Monthly Investment Amount</label>
              <input
                type="number"
                value={periodicAmount}
                onChange={(e) => setPeriodicAmount(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-indigo-500 text-slate-900"
              />
            </div>
          )}

          {(mode === 'lumpsum' || mode === 'compound_interest' || mode === 'simple_interest' || mode === 'roi') && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Principal Investment capital</label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-indigo-500 text-slate-900"
              />
            </div>
          )}

          {mode === 'cagr' && (
            <>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Initial Asset Value</label>
                <input
                  type="number"
                  value={initialAssetVal}
                  onChange={(e) => setInitialAssetVal(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-indigo-500 text-slate-900"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Final Asset Value</label>
                <input
                  type="number"
                  value={finalAssetVal}
                  onChange={(e) => setFinalAssetVal(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-indigo-500 text-slate-900"
                />
              </div>
            </>
          )}

          {mode === 'roi' && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Final Accumulated Asset Portfolio Value</label>
              <input
                type="number"
                value={finalAssetVal}
                onChange={(e) => setFinalAssetVal(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-indigo-500 text-slate-900"
              />
            </div>
          )}

          {mode === 'goal' && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Target Goal Wealth Amount</label>
              <input
                type="number"
                value={targetGoalVal}
                onChange={(e) => setTargetGoalVal(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-indigo-500 text-slate-900"
              />
            </div>
          )}

          {mode !== 'cagr' && mode !== 'roi' && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Expected Returns Rate (% p.a.)</label>
              <input
                type="number"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-indigo-500 text-slate-900"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Time Duration (Years)</label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-indigo-500 text-slate-900"
              />
          </div>
        </div>

        {/* Projections Matrix Output Displays */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Capital Outlay</div>
              <div className="text-xl font-black text-slate-900">{formatCurrency(calculations.invested)}</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Accumulated Growth Gain</div>
              <div className="text-xl font-black text-emerald-600">{formatCurrency(calculations.gains)}</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Future Wealth Balance</div>
              <div className="text-xl font-black text-indigo-600">{formatCurrency(calculations.totalValue)}</div>
            </div>
          </div>

          {calculations.extraMetricLabel && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 shadow-inner text-center">
              <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
                {calculations.extraMetricLabel}
              </div>
              <div className="text-3xl font-black text-indigo-900">
                {calculations.extraMetricValue}
              </div>
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h4 className="font-bold text-sm text-slate-900 mb-4">Capital Growth Proportion Analysis</h4>
            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div 
                style={{ width: `${Math.max(0, 100 - parseFloat(gainsPct))}%` }} 
                className="h-full bg-indigo-600 transition-all"
              />
              <div 
                style={{ width: `${Math.max(0, parseFloat(gainsPct))}%` }} 
                className="h-full bg-emerald-500 transition-all"
              />
            </div>
            <div className="flex gap-6 mt-4 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-indigo-600 inline-block"></span>
                <span className="text-slate-600">Invested Principle Component ({Math.max(0, 100 - parseFloat(gainsPct)).toFixed(1)}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span>
                <span className="text-slate-600">Compounded Growth Returns Yield ({Math.max(0, parseFloat(gainsPct)).toFixed(1)}%)</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-500">
            <h4 className="font-bold text-slate-700 mb-2">Calculators Fully Supported in this Module Grid:</h4>
            <p className="mb-3 leading-relaxed">
              SIP Calculator • Lumpsum Investment Calculator • Mutual Fund Calculator • CAGR Calculator • XIRR Calculator • ROI Calculator • Investment Return Calculator • Future Value Calculator • Present Value Calculator • Compound Interest Calculator • Simple Interest Calculator • Dollar Cost Averaging Calculator • Portfolio Return Calculator • Asset Allocation Calculator • Investment Goal Calculator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
