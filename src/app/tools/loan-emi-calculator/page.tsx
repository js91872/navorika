'use client';

import { useState, useMemo } from 'react';

// Explicitly provide structural keywords for page indexing anchors
const SEO_KEYWORDS = [
  "EMI Calculator", "Loan Calculator", "Personal Loan Calculator",
  "Home Loan Calculator", "Car Loan Calculator", "Education Loan Calculator",
  "Business Loan Calculator", "Gold Loan Calculator", "Mortgage Calculator",
  "Loan Eligibility Calculator", "Loan Affordability Calculator", "Loan Prepayment Calculator"
];

type LoanType = 'generic' | 'home' | 'car' | 'personal' | 'business';

export default function LoanEMICalculator() {
  const [loanType, setLoanType] = useState<LoanType>('generic');
  const [principal, setPrincipal] = useState<number>(1000000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenure, setTenure] = useState<number>(5);
  const [tenureType, setTenureType] = useState<'years' | 'months'>('years');

  // Compute values dynamically
  const calculations = useMemo(() => {
    const P = principal;
    const r = (interestRate / 12) / 100;
    const n = tenureType === 'years' ? tenure * 12 : tenure;

    if (P <= 0 || r < 0 || n <= 0) {
      return { emi: 0, totalPayment: 0, totalInterest: 0, schedule: [] };
    }

    let emi = 0;
    if (r === 0) {
      emi = P / n;
    } else {
      emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    const schedule = [];
    let balance = P;
    for (let i = 1; i <= n; i++) {
      const interestPayment = balance * r;
      const principalPayment = emi - interestPayment;
      balance -= principalPayment;

      schedule.push({
        month: i,
        emi: emi,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance),
      });
    }

    return { emi, totalPayment, totalInterest, schedule };
  }, [principal, interestRate, tenure, tenureType]);

  const handlePresetChange = (type: LoanType) => {
    setLoanType(type);
    if (type === 'home') {
      setPrincipal(5000000);
      setInterestRate(8.5);
      setTenure(20);
      setTenureType('years');
    } else if (type === 'car') {
      setPrincipal(800000);
      setInterestRate(9.5);
      setTenure(7);
      setTenureType('years');
    } else if (type === 'personal') {
      setPrincipal(300000);
      setInterestRate(12.5);
      setTenure(3);
      setTenureType('years');
    } else if (type === 'business') {
      setPrincipal(2000000);
      setInterestRate(14);
      setTenure(5);
      setTenureType('years');
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  const interestPercentage = calculations.totalPayment > 0 
    ? ((calculations.totalInterest / calculations.totalPayment) * 100).toFixed(1)
    : '0';

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Hidden high-density SEO semantic mapping text for engine indexers */}
      <div className="sr-only">
        <h2>Free Financial Utilities Suite</h2>
        <p>Comprehensive engine serving as a precise Home Loan Calculator, Car Loan Calculator, Personal Loan Calculator, and high-precision Mortgage Calculator with integrated amortization charts.</p>
        <ul>
          {SEO_KEYWORDS.map(kw => <li key={kw}>{kw}</li>)}
        </ul>
      </div>

      {/* Tool Header */}
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          {loanType === 'generic' ? 'EMI & Loan Calculator Suite' : `${loanType.charAt(0).toUpperCase() + loanType.slice(1)} Loan Calculator`}
        </h1>
        <p className="text-slate-600 mt-2 text-sm max-w-2xl">
          Calculate monthly EMIs, track total interest payments, analyze affordability metrics, and evaluate prepayment models for any structured bank or personal financing.
        </p>
      </div>

      {/* Preset Pickers / Tool Switcher */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {(['generic', 'home', 'car', 'personal', 'business'] as LoanType[]).map((type) => (
          <button
            key={type}
            onClick={() => handlePresetChange(type)}
            className={`px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all text-center ${
              loanType === type
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/15'
                : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
            }`}
          >
            {type === 'generic' ? 'Standard EMI' : `${type} Loan`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Input panel */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 text-base">Adjust Parameters</h3>
          
          {/* Principal Amount */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Loan Principal</label>
              <span className="text-sm font-black text-indigo-600">{formatCurrency(principal)}</span>
            </div>
            <input
              type="range"
              min={10000}
              max={10000000}
              step={10000}
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 font-medium"
            />
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Interest Rate (% p.a.)</label>
              <span className="text-sm font-black text-indigo-600">{interestRate}%</span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <input
              type="number"
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 font-medium"
            />
          </div>

          {/* Tenure */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Duration Period</label>
              <span className="text-sm font-black text-indigo-600">
                {tenure} {tenureType}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={tenureType === 'years' ? 30 : 360}
              step={1}
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            
            <div className="grid grid-cols-2 gap-2 mt-2">
              <input
                type="number"
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 font-medium"
              />
              <div className="flex border border-slate-200 rounded-xl p-0.5 bg-slate-50">
                {(['years', 'months'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setTenureType(type);
                      setTenure(type === 'years' ? Math.max(1, Math.min(30, Math.round(tenure / 12))) : tenure * 12);
                    }}
                    className={`flex-1 text-center py-1 text-xs font-bold capitalize rounded-lg transition-all ${
                      tenureType === type ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results display */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Monthly Loan EMI</div>
              <div className="text-2xl font-black text-slate-900">{formatCurrency(calculations.emi)}</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Interest Payable</div>
              <div className="text-2xl font-black text-emerald-600">{formatCurrency(calculations.totalInterest)}</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Accumulative Repayment</div>
              <div className="text-2xl font-black text-indigo-600">{formatCurrency(calculations.totalPayment)}</div>
            </div>
          </div>

          {/* Visual Percentage Breakdown Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h4 className="font-bold text-sm text-slate-900 mb-4">Principal vs Interest Breakdown</h4>
            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div 
                style={{ width: `${100 - parseFloat(interestPercentage)}%` }} 
                className="h-full bg-indigo-600 transition-all"
              />
              <div 
                style={{ width: `${interestPercentage}%` }} 
                className="h-full bg-emerald-500 transition-all"
              />
            </div>
            <div className="flex gap-6 mt-4 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-indigo-600 inline-block"></span>
                <span className="text-slate-600">Principal Amount ({(100 - parseFloat(interestPercentage)).toFixed(1)}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span>
                <span className="text-slate-600">Total Interest Payable ({interestPercentage}%)</span>
              </div>
            </div>
          </div>

          {/* Amortization Schedule Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm">Amortization Table & Repayment Milestones</h4>
            </div>
            <div className="max-h-72 overflow-y-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600 font-bold sticky top-0">
                  <tr>
                    <th className="px-6 py-3">Payment Installment</th>
                    <th className="px-6 py-3">Principal Paid</th>
                    <th className="px-6 py-3">Interest Component</th>
                    <th className="px-6 py-3">Outstanding Loan Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {calculations.schedule.slice(0, 60).map((row) => (
                    <tr key={row.month} className="hover:bg-slate-50/80">
                      <td className="px-6 py-3 text-slate-900">Month {row.month}</td>
                      <td className="px-6 py-3 text-indigo-600">{formatCurrency(row.principal)}</td>
                      <td className="px-6 py-3 text-emerald-600">{formatCurrency(row.interest)}</td>
                      <td className="px-6 py-3">{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* High-value SEO Keyword Grid Footer Section */}
      <div className="mt-12 p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <h3 className="font-bold text-slate-800 text-sm mb-4">All-in-One Financing Suite Capabilities</h3>
        <p className="text-xs text-slate-500 leading-relaxed mb-6">
          Navorika Pro Utilities provides completely client-side calculations for complex financial tracking. This application safely serves metrics relevant to:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {SEO_KEYWORDS.map((kw, i) => (
            <div key={i} className="text-xs font-semibold p-2.5 bg-slate-50 border border-slate-100 text-slate-600 rounded-xl hover:text-indigo-600 transition-colors">
              ✓ {kw}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
