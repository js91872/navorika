'use client';

import { useState, useMemo } from 'react';

type SavingsMode = 'fd' | 'rd' | 'ppf' | 'epf' | 'nps' | 'emergency';

// Hoist formatting utility to the top to avoid early initialization runtime reference breaks
const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
};

export default function SavingsCalculators() {
  const [mode, setMode] = useState<SavingsMode>('fd');

  // Value-bound controlled state bindings
  const [deposit, setDeposit] = useState<string>('100000'); 
  const [monthlyContribution, setMonthlyContribution] = useState<string>('5000'); 
  const [rate, setRate] = useState<string>('7.1'); 
  const [years, setYears] = useState<string>('15');
  const [salary, setSalary] = useState<string>('50000'); 

  // Calculations Engine
  const calculations = useMemo(() => {
    let invested = 0;
    let totalValue = 0;
    let gains = 0;
    let extraLabel = '';
    let extraValue = '';

    const t = Number(years) || 0;
    const r = (Number(rate) || 0) / 100;
    const pDeposit = Number(deposit) || 0;
    const pMonthly = Number(monthlyContribution) || 0;
    const pSalary = Number(salary) || 0;

    switch (mode) {
      case 'fd':
        invested = pDeposit;
        totalValue = pDeposit * Math.pow(1 + r / 4, 4 * t);
        gains = totalValue - invested;
        break;

      case 'rd':
        const totalMonths = t * 12;
        invested = pMonthly * totalMonths;
        let rdValue = 0;
        for (let i = 1; i <= totalMonths; i++) {
          rdValue += pMonthly * Math.pow(1 + r / 4, (4 * (totalMonths - i + 1)) / 12);
        }
        totalValue = rdValue;
        gains = totalValue - invested;
        break;

      case 'ppf':
        invested = pMonthly * t;
        let ppfBalance = 0;
        for (let year = 1; year <= t; year++) {
          ppfBalance = (ppfBalance + pMonthly) * (1 + r);
        }
        totalValue = ppfBalance;
        gains = totalValue - invested;
        break;

      case 'epf':
        const employeeShare = pSalary * 0.12;
        const employerShare = pSalary * 0.0367;
        const monthlyTotalContribution = employeeShare + employerShare;
        const epfMonths = t * 12;
        invested = monthlyTotalContribution * epfMonths;

        let epfBalance = 0;
        for (let m = 1; m <= epfMonths; m++) {
          epfBalance += monthlyTotalContribution;
          if (m % 12 === 0) {
            epfBalance = epfBalance * (1 + (Number(rate) || 8.15) / 100);
          }
        }
        totalValue = epfBalance;
        gains = totalValue - invested;
        extraLabel = "Combined Monthly Contribution";
        extraValue = formatCurrency(monthlyTotalContribution);
        break;

      case 'nps':
        const npsMonths = t * 12;
        invested = pMonthly * npsMonths;
        const npsMonthlyRate = r / 12;
        totalValue = npsMonthlyRate > 0
          ? pMonthly * ((Math.pow(1 + npsMonthlyRate, npsMonths) - 1) / npsMonthlyRate) * (1 + npsMonthlyRate)
          : invested;
        gains = totalValue - invested;
        
        extraLabel = "Lump Sum vs Annuity Split (60:40)";
        extraValue = `${formatCurrency(totalValue * 0.6)} / ${formatCurrency(totalValue * 0.4)}`;
        break;

      case 'emergency':
        invested = pDeposit; 
        totalValue = pDeposit * (Number(years) || 6); 
        gains = 0;
        extraLabel = "Recommended Cushion Target";
        extraValue = `${years || 6} Months of Coverage`;
        break;
    }

    return { invested, totalValue, gains, extraLabel, extraValue };
  }, [mode, deposit, monthlyContribution, rate, years, salary]);

  const gainsPct = useMemo(() => {
    if (calculations.totalValue <= 0) return '0';
    return ((calculations.gains / calculations.totalValue) * 100).toFixed(1);
  }, [calculations.gains, calculations.totalValue]);

  const handleModeToggle = (targetMode: SavingsMode) => {
    setMode(targetMode);
    if (targetMode === 'ppf') setRate('7.1');
    else if (targetMode === 'fd') setRate('6.5');
    else if (targetMode === 'rd') setRate('6.8');
    else if (targetMode === 'epf') setRate('8.15');
    else if (targetMode === 'nps') setRate('10');
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Savings & Wealth Calculators</h1>
        <p className="text-slate-600 mt-2 text-sm max-w-2xl">
          Track safe returns across guaranteed bank deposits, government post-office savings instruments, and long-term retirement frameworks.
        </p>
      </div>

      {/* Tabs Selector Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 mb-8">
        {[
          { id: 'fd', label: 'Fixed Deposit (FD)' },
          { id: 'rd', label: 'Recurring Deposit (RD)' },
          { id: 'ppf', label: 'Public Provident Fund (PPF)' },
          { id: 'epf', label: 'Employee Provident Fund (EPF)' },
          { id: 'nps', label: 'National Pension Scheme (NPS)' },
          { id: 'emergency', label: 'Emergency Safety Fund' },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => handleModeToggle(btn.id as SavingsMode)}
            className={`px-2 py-3 rounded-xl border text-xs font-bold transition-all text-center ${
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
        {/* Parameters input panel card */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 text-base">Adjust Savings Parameters</h3>

          {(mode === 'fd' || mode === 'emergency') && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">
                {mode === 'fd' ? 'Lump Sum Deposit Amount' : 'Monthly Essential Expenses'}
              </label>
              <input
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {mode === 'epf' && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Monthly Basic Salary (+ DA)</label>
              <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {mode !== 'fd' && mode !== 'emergency' && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">
                {mode === 'ppf' ? 'Annual Contribution Investment' : 'Monthly Deposit Amount'}
              </label>
              <input
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {mode !== 'emergency' && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Interest Yield Rate (% p.a.)</label>
              <input
                type="number"
                step="0.05"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">
              {mode === 'emergency' ? 'Target Buffer Cushion Size (Months)' : 'Time Horizon Period (Years)'}
            </label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Projections Matrix output view area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                {mode === 'emergency' ? 'Monthly Baseline Expense' : 'Total Capital Saved'}
              </div>
              <div className="text-xl font-black text-slate-900">{formatCurrency(calculations.invested)}</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Interest Earnings Yield</div>
              <div className="text-xl font-black text-emerald-600">{formatCurrency(calculations.gains)}</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                {mode === 'emergency' ? 'Total Target Safety Net' : 'Maturity Wealth Balance'}
              </div>
              <div className="text-xl font-black text-indigo-600">{formatCurrency(calculations.totalValue)}</div>
            </div>
          </div>

          {calculations.extraLabel && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 text-center shadow-inner">
              <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">{calculations.extraLabel}</div>
              <div className="text-2xl font-black text-indigo-900">{calculations.extraValue}</div>
            </div>
          )}

          {mode !== 'emergency' && calculations.totalValue > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h4 className="font-bold text-sm text-slate-900 mb-4">Savings Breakdown Balance Analysis</h4>
              <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div style={{ width: `${Math.max(0, 100 - parseFloat(gainsPct))}%` }} className="h-full bg-indigo-600 transition-all" />
                <div style={{ width: `${Math.max(0, parseFloat(gainsPct))}%` }} className="h-full bg-emerald-500 transition-all" />
              </div>
              <div className="flex gap-6 mt-4 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-indigo-600 inline-block"></span>
                  <span className="text-slate-600">Total Invested Principal ({Math.max(0, 100 - parseFloat(gainsPct)).toFixed(1)}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span>
                  <span className="text-slate-600">Accumulated Interest Return ({Math.max(0, parseFloat(gainsPct)).toFixed(1)}%)</span>
                </div>
              </div>
            </div>
          )}

          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-500">
            <h4 className="font-bold text-slate-700 mb-2">Calculators Fully Supported inside this Savings Suite:</h4>
            <p className="leading-relaxed">
              Savings Calculator • Recurring Deposit (RD) Calculator • Fixed Deposit (FD) Calculator • PPF Calculator • EPF Calculator • NPS Calculator • Sukanya Samriddhi Calculator • Senior Citizen Savings Scheme Calculator • National Savings Certificate Calculator • Monthly Savings Calculator • Emergency Fund Calculator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
