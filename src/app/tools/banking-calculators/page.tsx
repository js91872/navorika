'use client';

import { useState, useMemo } from 'react';

type BankingMode = 'fd_interest' | 'rd_interest' | 'savings_interest' | 'charges' | 'validators';

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
};

export default function BankingCalculators() {
  const [mode, setMode] = useState<BankingMode>('fd_interest');

  // Input States
  const [bankPrincipal, setBankPrincipal] = useState<string>('100000');
  const [bankRate, setBankRate] = useState<string>('6.5');
  const [bankMonths, setBankMonths] = useState<string>('12');
  const [maintenanceFee, setMaintenanceFee] = useState<string>('500');
  const [transactionCount, setTransactionCount] = useState<string>('5');
  
  const [bankCode, setBankCode] = useState<string>('');
  const [validationType, setValidationType] = useState<'IBAN' | 'SWIFT'>('IBAN');

  const calculations = useMemo(() => {
    let outputLabel1 = '';
    let outputVal1: number | string = 0;
    let outputLabel2 = '';
    let outputVal2: number | string = 0;
    let isErrorState = false;
    let summaryText = '';

    const p = Number(bankPrincipal) || 0;
    const r = (Number(bankRate) || 0) / 100;
    const m = Number(bankMonths) || 0;
    const fee = Number(maintenanceFee) || 0;
    const txs = Number(transactionCount) || 0;
    const t = m / 12;

    switch (mode) {
      case 'fd_interest':
        // FD Compounded Quarterly standard bank rule
        const fdMaturity = p * Math.pow(1 + r / 4, 4 * t);
        const fdInterest = fdMaturity - p;
        outputLabel1 = "FD Interest Earned";
        outputVal1 = formatCurrency(fdInterest);
        outputLabel2 = "Total FD Maturity Value";
        outputVal2 = formatCurrency(fdMaturity);
        summaryText = `Fixed Deposit computed over ${m} months at ${bankRate}% compounded quarterly.`;
        break;

      case 'rd_interest':
        // RD Quarterly compounding approximation loop for monthly deposits
        let rdMaturity = 0;
        const totalMonths = m;
        for (let i = 1; i <= totalMonths; i++) {
          rdMaturity += p * Math.pow(1 + r / 4, (4 * (totalMonths - i + 1)) / 12);
        }
        outputLabel1 = "Total Amount Saved";
        outputVal1 = formatCurrency(p * totalMonths);
        outputLabel2 = "RD Maturity Value";
        outputVal2 = formatCurrency(rdMaturity);
        summaryText = `Recurring Deposit of ${formatCurrency(p)}/month tracking quarterly compounding cycles.`;
        break;

      case 'savings_interest':
        // Savings account calculated on daily/simple interest baseline yield
        const savingsInterest = p * r * t;
        outputLabel1 = "Savings Interest Yield";
        outputVal1 = formatCurrency(savingsInterest);
        outputLabel2 = "End Balance Pool";
        outputVal2 = formatCurrency(p + savingsInterest);
        summaryText = `Standard liquid savings account calculation tracking annualized yields.`;
        break;

      case 'charges':
        // Bank service charges and dynamic tx ledger penalty evaluations
        const flatCharges = fee;
        const perTxPenalty = Math.max(0, txs - 3) * 20; // Example rule: ₹20 per tx after 3 free transactions
        const totalFees = flatCharges + perTxPenalty;
        outputLabel1 = "Transaction Overages";
        outputVal1 = formatCurrency(perTxPenalty);
        outputLabel2 = "Total Monthly Charges";
        outputVal2 = formatCurrency(totalFees);
        summaryText = `Assesses structural maintenance overhead plus variable transaction limit penalties.`;
        break;

      case 'validators':
        const code = bankCode.replace(/\s+/g, '').toUpperCase();
        let isValid = false;
        if (validationType === 'IBAN') {
          isValid = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{4,30}$/.test(code);
        } else {
          isValid = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(code);
        }
        isErrorState = code.length > 0 && !isValid;
        outputLabel1 = `${validationType} Status`;
        outputVal1 = code.length === 0 ? "Awaiting Input" : (isValid ? "Valid Format" : "Invalid Format");
        outputLabel2 = "Length Verification";
        outputVal2 = `${code.length} Characters`;
        summaryText = isValid ? "Matches standard international ISO routing formats." : "Invalid length or structural check parameters.";
        break;
    }

    return { outputLabel1, outputVal1, outputLabel2, outputVal2, isErrorState, summaryText };
  }, [mode, bankPrincipal, bankRate, bankMonths, maintenanceFee, transactionCount, bankCode, validationType]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Banking Utilities Suite</h1>
        <p className="text-slate-600 text-sm mt-1">Free modules for Fixed Deposits, Recurring Deposits, bank charges, and routing validations.</p>
      </div>
      
      {/* Tab select engine matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-8">
        {[
          { id: 'fd_interest', label: 'FD Calculator' },
          { id: 'rd_interest', label: 'RD Calculator' },
          { id: 'savings_interest', label: 'Savings Interest' },
          { id: 'charges', label: 'Bank Charges' },
          { id: 'validators', label: 'SWIFT/IBAN Check' },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setMode(btn.id as BankingMode)}
            className={`px-3 py-3 rounded-xl border text-xs font-bold transition-all text-center ${mode === btn.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200'}`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Dynamic Parameter form inputs featuring onChange hooks to allow direct clicking and modification */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 text-base">Adjust Parameters</h3>
          
          {mode !== 'validators' && mode !== 'charges' && (
            <>
              <div>
                <label className="text-xs font-bold uppercase text-slate-600 block mb-2">
                  {mode === 'rd_interest' ? 'Monthly Deposit Amount' : 'Principal / Initial Balance'}
                </label>
                <input type="number" value={bankPrincipal} onChange={(e) => setBankPrincipal(e.target.value)} className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-600 block mb-2">Interest Rate (% p.a.)</label>
                <input type="number" step="0.1" value={bankRate} onChange={(e) => setBankRate(e.target.value)} className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-600 block mb-2">Duration Horizon (Months)</label>
                <input type="number" value={bankMonths} onChange={(e) => setBankMonths(e.target.value)} className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" />
              </div>
            </>
          )}

          {mode === 'charges' && (
            <>
              <div>
                <label className="text-xs font-bold uppercase text-slate-600 block mb-2">Monthly Maintenance Overhead</label>
                <input type="number" value={maintenanceFee} onChange={(e) => setMaintenanceFee(e.target.value)} className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-600 block mb-2">Total Monthly ATM/Transactions Logged</label>
                <input type="number" value={transactionCount} onChange={(e) => setTransactionCount(e.target.value)} className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" />
              </div>
            </>
          )}

          {mode === 'validators' && (
            <>
              <div className="flex gap-2 mb-4">
                <button type="button" onClick={() => setValidationType('IBAN')} className={`flex-1 py-2 text-xs font-bold border rounded-lg ${validationType === 'IBAN' ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-slate-50 text-slate-500'}`}>IBAN Validator</button>
                <button type="button" onClick={() => setValidationType('SWIFT')} className={`flex-1 py-2 text-xs font-bold border rounded-lg ${validationType === 'SWIFT' ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-slate-50 text-slate-500'}`}>SWIFT Finder</button>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-600 block mb-2">Enter Routing Code</label>
                <input type="text" value={bankCode} onChange={(e) => setBankCode(e.target.value)} placeholder={`Type ${validationType}...`} className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl px-3 py-3 text-sm font-bold uppercase text-slate-900 focus:outline-none focus:border-indigo-500" />
              </div>
            </>
          )}
        </div>

        {/* Display Metrics Board */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`border rounded-2xl p-6 shadow-sm ${calculations.isErrorState ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
              <div className="text-xs font-bold tracking-wider mb-2 uppercase text-slate-500">{calculations.outputLabel1}</div>
              <div className={`text-3xl font-black ${calculations.isErrorState ? 'text-red-600' : (calculations.outputVal1 === 'Valid Format' ? 'text-emerald-600' : 'text-indigo-600')}`}>{calculations.outputVal1}</div>
            </div>
            <div className="border bg-white rounded-2xl p-6 shadow-sm border-slate-200">
              <div className="text-xs font-bold tracking-wider mb-2 uppercase text-slate-500">{calculations.outputLabel2}</div>
              <div className="text-3xl font-black text-slate-900">{calculations.outputVal2}</div>
            </div>
          </div>
          {calculations.summaryText && (
            <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50 text-slate-700 shadow-inner">
              <div className="text-sm font-semibold leading-relaxed">{calculations.summaryText}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
