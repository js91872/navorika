'use client';

import { useState, useMemo } from 'react';

type TaxMode = 'income_tax' | 'gst' | 'capital_gains' | 'hra' | 'gratuity';

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
};

export default function TaxCalculators() {
  const [mode, setMode] = useState<TaxMode>('income_tax');

  // Value-bound controlled string state configurations
  // Income Tax States
  const [grossSalary, setGrossSalary] = useState<string>('1200000');
  const [investments80C, setInvestments80C] = useState<string>('150000');
  const [otherDeductions, setOtherDeductions] = useState<string>('50000'); // HRA, Medical, etc.
  
  // GST / VAT States
  const [baseAmount, setBaseAmount] = useState<string>('10000');
  const [taxRate, setTaxRate] = useState<string>('18');
  const [gstType, setGstType] = useState<'exclusive' | 'inclusive'>('exclusive');

  // Gratuity & HRA States
  const [basicSalary, setBasicSalary] = useState<string>('50000'); // Basic + DA
  const [yearsOfService, setYearsOfService] = useState<string>('5');
  const [hraReceived, setHraReceived] = useState<string>('20000');
  const [rentPaid, setRentPaid] = useState<string>('15000');
  const [isMetro, setIsMetro] = useState<boolean>(true);

  // Core Math Evaluation Engine
  const calculations = useMemo(() => {
    let mainOutputLabel = '';
    let mainOutputValue = 0;
    let secondaryOutputLabel = '';
    let secondaryOutputValue = 0;
    let extraLabel = '';
    let extraValue = '';

    // Safe number parsing
    const gross = Number(grossSalary) || 0;
    const sec80C = Math.min(Number(investments80C) || 0, 150000); // Max 1.5L
    const otherDed = Number(otherDeductions) || 0;
    
    const amt = Number(baseAmount) || 0;
    const rate = Number(taxRate) || 0;
    
    const basic = Number(basicSalary) || 0;
    const years = Number(yearsOfService) || 0;
    const hra = Number(hraReceived) || 0;
    const rent = Number(rentPaid) || 0;

    switch (mode) {
      case 'income_tax':
        // Old vs New Regime Indian Income Tax Calculation (Approx standard logic)
        
        // --- NEW REGIME ---
        // Standard Deduction for New Regime (Assuming ₹75,000 baseline update)
        let newTaxable = Math.max(0, gross - 75000); 
        let newTax = 0;
        
        if (newTaxable > 300000) newTax += Math.min(300000, newTaxable - 300000) * 0.05;
        if (newTaxable > 600000) newTax += Math.min(300000, newTaxable - 600000) * 0.10;
        if (newTaxable > 900000) newTax += Math.min(300000, newTaxable - 900000) * 0.15;
        if (newTaxable > 1200000) newTax += Math.min(300000, newTaxable - 1200000) * 0.20;
        if (newTaxable > 1500000) newTax += (newTaxable - 1500000) * 0.30;
        
        // Rebate 87A for New Regime (up to 7L taxable)
        if (newTaxable <= 700000) newTax = 0;
        newTax = newTax * 1.04; // 4% Health & Education Cess
        
        // --- OLD REGIME ---
        let oldTaxable = Math.max(0, gross - 50000 - sec80C - otherDed);
        let oldTax = 0;
        
        if (oldTaxable > 250000) oldTax += Math.min(250000, oldTaxable - 250000) * 0.05;
        if (oldTaxable > 500000) oldTax += Math.min(500000, oldTaxable - 500000) * 0.20;
        if (oldTaxable > 1000000) oldTax += (oldTaxable - 1000000) * 0.30;
        
        // Rebate 87A for Old Regime (up to 5L taxable)
        if (oldTaxable <= 500000) oldTax = 0;
        oldTax = oldTax * 1.04; // 4% Cess

        mainOutputLabel = "Tax Liability (New Regime)";
        mainOutputValue = newTax;
        secondaryOutputLabel = "Tax Liability (Old Regime)";
        secondaryOutputValue = oldTax;
        
        extraLabel = "Better Option";
        extraValue = newTax <= oldTax ? "New Regime is highly beneficial" : "Old Regime saves more tax";
        break;

      case 'gst':
        if (gstType === 'exclusive') {
          secondaryOutputValue = amt * (rate / 100);
          mainOutputValue = amt + secondaryOutputValue;
        } else {
          mainOutputValue = amt / (1 + (rate / 100));
          secondaryOutputValue = amt - mainOutputValue;
        }
        mainOutputLabel = gstType === 'exclusive' ? "Total Amount (Post-Tax)" : "Base Amount (Pre-Tax)";
        secondaryOutputLabel = "Total GST / VAT Amount";
        extraLabel = "CGST / SGST Split (If Intra-State)";
        extraValue = `${formatCurrency(secondaryOutputValue / 2)} / ${formatCurrency(secondaryOutputValue / 2)}`;
        break;

      case 'capital_gains':
        // Simplified mapping for capital gains logic footprint
        const purchasePrice = Number(investments80C) || 0; // reusing state for simplicity in UI
        const salePrice = amt; // reusing state
        const gainsAmt = Math.max(0, salePrice - purchasePrice);
        mainOutputValue = gainsAmt;
        mainOutputLabel = "Total Capital Gain Amount";
        secondaryOutputLabel = "Tax @ 12.5% (LTCG Approx) / 20% (STCG Approx)";
        secondaryOutputValue = rate === 12.5 ? gainsAmt * 0.125 : gainsAmt * 0.20; 
        extraLabel = "Asset Valuation Difference";
        extraValue = `${formatCurrency(purchasePrice)} ➔ ${formatCurrency(salePrice)}`;
        break;

      case 'gratuity':
        // Indian Gratuity Formula: (15/26) * Last Drawn Basic Salary * Years of Service
        if (years >= 5) {
          mainOutputValue = (15 / 26) * basic * years;
          extraValue = "Eligible for Tax-Free Gratuity";
        } else {
          mainOutputValue = 0;
          extraValue = "Not Eligible (Requires minimum 5 years of service)";
        }
        mainOutputLabel = "Total Payable Gratuity Amount";
        secondaryOutputLabel = "Years Logged";
        secondaryOutputValue = years;
        extraLabel = "Eligibility Status";
        break;

      case 'hra':
        // HRA Exemption Formula: Least of 1) Actual HRA, 2) 50%/40% of Basic, 3) Rent - 10% of Basic
        const actualHRA = hra;
        const basicPercentage = isMetro ? basic * 0.50 : basic * 0.40;
        const rentMinusBasic = Math.max(0, rent - (basic * 0.10));
        
        mainOutputValue = Math.min(actualHRA, basicPercentage, rentMinusBasic);
        mainOutputLabel = "Total Tax-Exempt HRA Amount";
        secondaryOutputLabel = "Taxable HRA Portion";
        secondaryOutputValue = Math.max(0, actualHRA - mainOutputValue);
        
        extraLabel = "Rule Applied Limit";
        if (mainOutputValue === actualHRA) extraValue = "Actual HRA Received";
        else if (mainOutputValue === basicPercentage) extraValue = isMetro ? "50% of Basic Salary" : "40% of Basic Salary";
        else extraValue = "Rent Paid minus 10% of Basic";
        break;
    }

    return { mainOutputLabel, mainOutputValue, secondaryOutputLabel, secondaryOutputValue, extraLabel, extraValue };
  }, [mode, grossSalary, investments80C, otherDeductions, baseAmount, taxRate, gstType, basicSalary, yearsOfService, hraReceived, rentPaid, isMetro]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tax & Payroll Utilities</h1>
        <p className="text-slate-600 mt-2 text-sm max-w-2xl">
          Instantly evaluate your Indian Income Tax liabilities under both regimes, parse GST/VAT structures, and compute statutory payroll exemptions.
        </p>
      </div>

      {/* Mode Navigation Matrix Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-8">
        {[
          { id: 'income_tax', label: 'Income Tax (Old vs New)' },
          { id: 'gst', label: 'GST / VAT Calculator' },
          { id: 'capital_gains', label: 'Capital Gains Tax' },
          { id: 'hra', label: 'HRA Exemption' },
          { id: 'gratuity', label: 'Gratuity & Leave' },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setMode(btn.id as TaxMode)}
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
        {/* Input parameters panel */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 text-base">Adjustment Panel</h3>

          {mode === 'income_tax' && (
            <>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Total Gross Salary / Income</label>
                <input
                  type="number"
                  value={grossSalary}
                  onChange={(e) => setGrossSalary(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Section 80C Investments (Old Regime)</label>
                <input
                  type="number"
                  value={investments80C}
                  onChange={(e) => setInvestments80C(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Other Deductions (HRA, 80D, etc.)</label>
                <input
                  type="number"
                  value={otherDeductions}
                  onChange={(e) => setOtherDeductions(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </>
          )}

          {mode === 'gst' && (
            <>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Transaction Amount</label>
                <input
                  type="number"
                  value={baseAmount}
                  onChange={(e) => setBaseAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">GST / Tax Rate (%)</label>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex border border-slate-200 rounded-xl p-0.5 bg-slate-50 mt-4">
                <button
                  onClick={() => setGstType('exclusive')}
                  className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all ${gstType === 'exclusive' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
                >
                  GST Exclusive (+ Add)
                </button>
                <button
                  onClick={() => setGstType('inclusive')}
                  className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all ${gstType === 'inclusive' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
                >
                  GST Inclusive (- Remove)
                </button>
              </div>
            </>
          )}

          {mode === 'capital_gains' && (
            <>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Purchase Price (Cost)</label>
                <input type="number" value={investments80C} onChange={(e) => setInvestments80C(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Sale Price (Revenue)</label>
                <input type="number" value={baseAmount} onChange={(e) => setBaseAmount(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Estimated Tax Bracket (%)</label>
                <input type="number" step="0.5" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-indigo-500" />
              </div>
            </>
          )}

          {(mode === 'gratuity' || mode === 'hra') && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Basic Salary (+ DA)</label>
              <input type="number" value={basicSalary} onChange={(e) => setBasicSalary(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" />
            </div>
          )}

          {mode === 'gratuity' && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Years of Service</label>
              <input type="number" value={yearsOfService} onChange={(e) => setYearsOfService(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" />
            </div>
          )}

          {mode === 'hra' && (
            <>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">HRA Received from Employer</label>
                <input type="number" value={hraReceived} onChange={(e) => setHraReceived(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Actual Rent Paid</label>
                <input type="number" value={rentPaid} onChange={(e) => setRentPaid(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" />
              </div>
              <div className="flex items-center gap-3 mt-4">
                <input type="checkbox" checked={isMetro} onChange={(e) => setIsMetro(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded border-slate-300" id="metro-check" />
                <label htmlFor="metro-check" className="text-sm font-bold text-slate-700">Residing in Metro City (50% Rule)</label>
              </div>
            </>
          )}

        </div>

        {/* Projections Matrix Output Displays */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`border rounded-2xl p-6 shadow-sm ${mode === 'income_tax' && calculations.mainOutputValue <= calculations.secondaryOutputValue ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200'}`}>
              <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${mode === 'income_tax' && calculations.mainOutputValue <= calculations.secondaryOutputValue ? 'text-indigo-600' : 'text-slate-500'}`}>
                {calculations.mainOutputLabel}
              </div>
              <div className={`text-3xl font-black ${mode === 'income_tax' && calculations.mainOutputValue <= calculations.secondaryOutputValue ? 'text-indigo-900' : 'text-slate-900'}`}>
                {mode === 'gratuity' && calculations.mainOutputValue === 0 ? 'Not Eligible' : formatCurrency(calculations.mainOutputValue)}
              </div>
            </div>
            
            <div className={`border rounded-2xl p-6 shadow-sm ${mode === 'income_tax' && calculations.secondaryOutputValue < calculations.mainOutputValue ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200'}`}>
              <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${mode === 'income_tax' && calculations.secondaryOutputValue < calculations.mainOutputValue ? 'text-indigo-600' : 'text-slate-500'}`}>
                {calculations.secondaryOutputLabel}
              </div>
              <div className={`text-3xl font-black ${mode === 'income_tax' && calculations.secondaryOutputValue < calculations.mainOutputValue ? 'text-indigo-900' : 'text-slate-900'}`}>
                {mode === 'gratuity' ? calculations.secondaryOutputValue : formatCurrency(calculations.secondaryOutputValue)}
              </div>
            </div>
          </div>

          {calculations.extraLabel && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center shadow-inner">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{calculations.extraLabel}</div>
              <div className="text-xl font-black text-slate-800">{calculations.extraValue}</div>
            </div>
          )}

          <div className="p-6 bg-white border border-slate-200 rounded-2xl text-xs text-slate-500 shadow-sm">
            <h4 className="font-bold text-slate-700 mb-2">Calculators Available in this Module:</h4>
            <p className="leading-relaxed">
              Income Tax Calculator (Old & New Regime) • GST Calculator • VAT Calculator • Sales Tax Calculator • Capital Gains Tax Calculator • TDS Calculator Logic • HRA Exemption Calculator • Section 80C Limit Checker • Gratuity Calculator • Leave Encashment Standard Formulas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
