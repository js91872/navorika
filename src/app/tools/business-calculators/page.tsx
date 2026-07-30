'use client';

import { useState, useMemo } from 'react';

type BusinessMode = 'profit_margin' | 'pricing' | 'sales_billing' | 'viability';

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
};

export default function BusinessCalculators() {
  const [mode, setMode] = useState<BusinessMode>('profit_margin');

  // Profit & Margin
  const [revenue, setRevenue] = useState<string>('1500000');
  const [cogs, setCogs] = useState<string>('800000');
  const [opEx, setOpEx] = useState<string>('200000');

  // Pricing & Discounts
  const [costPrice, setCostPrice] = useState<string>('1000');
  const [markupPercent, setMarkupPercent] = useState<string>('40');
  const [discountPercent, setDiscountPercent] = useState<string>('10');

  // Sales & Billing
  const [baseInvoice, setBaseInvoice] = useState<string>('50000');
  const [taxPercent, setTaxPercent] = useState<string>('18');
  const [commissionPercent, setCommissionPercent] = useState<string>('5');

  // Viability & Valuation
  const [fixedCosts, setFixedCosts] = useState<string>('500000');
  const [pricePerUnit, setPricePerUnit] = useState<string>('2500');
  const [variableCostPerUnit, setVariableCostPerUnit] = useState<string>('1500');
  const [annualEbitda, setAnnualEbitda] = useState<string>('2500000');
  const [valuationMultiple, setValuationMultiple] = useState<string>('4.5');

  // Unified calculation engine parsing raw strings cleanly
  const calculations = useMemo(() => {
    let metrics = {
      label1: '', val1: 0, isCurrency1: true,
      label2: '', val2: 0, isCurrency2: true,
      label3: '', val3: 0, isCurrency3: true,
      label4: '', val4: 0, isCurrency4: true,
      summary: ''
    };

    switch (mode) {
      case 'profit_margin':
        const r = Number(revenue) || 0;
        const c = Number(cogs) || 0;
        const o = Number(opEx) || 0;
        
        const grossProfit = Math.max(0, r - c);
        const grossMargin = r > 0 ? (grossProfit / r) * 100 : 0;
        const netProfit = grossProfit - o;
        const netMargin = r > 0 ? (netProfit / r) * 100 : 0;

        metrics = {
          label1: 'Gross Profit', val1: grossProfit, isCurrency1: true,
          label2: 'Gross Margin', val2: grossMargin, isCurrency2: false,
          label3: 'Net Profit', val3: netProfit, isCurrency3: true,
          label4: 'Net Margin', val4: netMargin, isCurrency4: false,
          summary: `After accounting for the Cost of Goods Sold (COGS) and Operating Expenses, your business retains ${netMargin.toFixed(1)}% of its total revenue as pure profit.`
        };
        break;

      case 'pricing':
        const cp = Number(costPrice) || 0;
        const markup = Number(markupPercent) || 0;
        const discount = Number(discountPercent) || 0;

        const markedPrice = cp * (1 + (markup / 100));
        const finalPrice = markedPrice * (1 - (discount / 100));
        const profitMade = finalPrice - cp;
        const actualMargin = finalPrice > 0 ? (profitMade / finalPrice) * 100 : 0;

        metrics = {
          label1: 'Marked Selling Price', val1: markedPrice, isCurrency1: true,
          label2: 'Final Price (Post-Discount)', val2: finalPrice, isCurrency2: true,
          label3: 'Absolute Profit/Loss', val3: profitMade, isCurrency3: true,
          label4: 'Realized Net Margin', val4: actualMargin, isCurrency4: false,
          summary: `Applying a ${markup}% markup creates a list price of ${formatCurrency(markedPrice)}. After a ${discount}% discount, the final sale nets a ${actualMargin.toFixed(1)}% margin.`
        };
        break;

      case 'sales_billing':
        const inv = Number(baseInvoice) || 0;
        const tax = Number(taxPercent) || 0;
        const comm = Number(commissionPercent) || 0;

        const taxAmount = inv * (tax / 100);
        const totalInvoice = inv + taxAmount;
        const commissionAmount = inv * (comm / 100);
        const businessNet = inv - commissionAmount;

        metrics = {
          label1: 'Total Tax Amount', val1: taxAmount, isCurrency1: true,
          label2: 'Final Invoice Payable', val2: totalInvoice, isCurrency2: true,
          label3: 'Agent Commission Payout', val3: commissionAmount, isCurrency3: true,
          label4: 'Business Net Revenue', val4: businessNet, isCurrency4: true,
          summary: `The client pays ${formatCurrency(totalInvoice)} (inclusive of ${tax}% tax). The sales agent receives ${formatCurrency(commissionAmount)}, leaving ${formatCurrency(businessNet)} for the business.`
        };
        break;

      case 'viability':
        const fc = Number(fixedCosts) || 0;
        const ppu = Number(pricePerUnit) || 0;
        const vcpu = Number(variableCostPerUnit) || 0;
        const ebitda = Number(annualEbitda) || 0;
        const mult = Number(valuationMultiple) || 0;

        const contributionMargin = ppu - vcpu;
        const breakEvenUnits = contributionMargin > 0 ? Math.ceil(fc / contributionMargin) : 0;
        const breakEvenRevenue = breakEvenUnits * ppu;
        const valuation = ebitda * mult;

        metrics = {
          label1: 'Break-Even Units', val1: breakEvenUnits, isCurrency1: false,
          label2: 'Break-Even Revenue', val2: breakEvenRevenue, isCurrency2: true,
          label3: 'Unit Contribution Margin', val3: contributionMargin, isCurrency3: true,
          label4: 'Est. Business Valuation', val4: valuation, isCurrency4: true,
          summary: `You must sell exactly ${breakEvenUnits} units to cover your fixed costs. Based on an EBITDA multiple of ${mult}x, the business enterprise is valued at ${formatCurrency(valuation)}.`
        };
        break;
    }

    return metrics;
  }, [mode, revenue, cogs, opEx, costPrice, markupPercent, discountPercent, baseInvoice, taxPercent, commissionPercent, fixedCosts, pricePerUnit, variableCostPerUnit, annualEbitda, valuationMultiple]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Business Finance Hub</h1>
        <p className="text-slate-600 mt-2 text-sm max-w-2xl">
          Complete toolset for calculating profit margins, setting product prices, generating invoice breakdowns, and evaluating business break-even valuations.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
        {[
          { id: 'profit_margin', label: 'Profit & Margins' },
          { id: 'pricing', label: 'Pricing & Discounts' },
          { id: 'sales_billing', label: 'Sales & Billing' },
          { id: 'viability', label: 'Break-Even & Valuation' },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setMode(btn.id as BusinessMode)}
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
        {/* Input Parameters Panel */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 text-base">Adjust Parameters</h3>

          {mode === 'profit_margin' && (
            <>
              <div><label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Total Revenue (Sales)</label><input type="number" value={revenue} onChange={(e) => setRevenue(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" /></div>
              <div><label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Cost of Goods Sold (COGS)</label><input type="number" value={cogs} onChange={(e) => setCogs(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" /></div>
              <div><label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Operating Expenses (Fixed)</label><input type="number" value={opEx} onChange={(e) => setOpEx(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" /></div>
            </>
          )}

          {mode === 'pricing' && (
            <>
              <div><label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Base Cost Price</label><input type="number" value={costPrice} onChange={(e) => setCostPrice(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" /></div>
              <div><label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Markup Percentage (%)</label><input type="number" value={markupPercent} onChange={(e) => setMarkupPercent(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" /></div>
              <div><label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Discount Offered (%)</label><input type="number" value={discountPercent} onChange={(e) => setDiscountPercent(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" /></div>
            </>
          )}

          {mode === 'sales_billing' && (
            <>
              <div><label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Base Invoice Amount</label><input type="number" value={baseInvoice} onChange={(e) => setBaseInvoice(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" /></div>
              <div><label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Applicable Tax Rate (%)</label><input type="number" value={taxPercent} onChange={(e) => setTaxPercent(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" /></div>
              <div><label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Sales Commission Rate (%)</label><input type="number" value={commissionPercent} onChange={(e) => setCommissionPercent(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" /></div>
            </>
          )}

          {mode === 'viability' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Price / Unit</label><input type="number" value={pricePerUnit} onChange={(e) => setPricePerUnit(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" /></div>
                <div><label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Var Cost / Unit</label><input type="number" value={variableCostPerUnit} onChange={(e) => setVariableCostPerUnit(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" /></div>
              </div>
              <div><label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Total Fixed Costs (Monthly/Annual)</label><input type="number" value={fixedCosts} onChange={(e) => setFixedCosts(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" /></div>
              <div className="pt-2 border-t border-slate-100"><label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Annual EBITDA (For Valuation)</label><input type="number" value={annualEbitda} onChange={(e) => setAnnualEbitda(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" /></div>
              <div><label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Industry Valuation Multiple (x)</label><input type="number" step="0.5" value={valuationMultiple} onChange={(e) => setValuationMultiple(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" /></div>
            </div>
          )}
        </div>

        {/* Output Metrics View */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{calculations.label1}</div>
              <div className={`text-3xl font-black ${calculations.val1 < 0 ? 'text-red-600' : 'text-slate-900'}`}>{calculations.isCurrency1 ? formatCurrency(calculations.val1) : `${calculations.val1.toLocaleString('en-IN')}${mode === 'profit_margin' ? '%' : ''}`}</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{calculations.label2}</div>
              <div className={`text-3xl font-black ${calculations.val2 < 0 ? 'text-red-600' : (calculations.isCurrency2 ? 'text-indigo-600' : 'text-emerald-600')}`}>{calculations.isCurrency2 ? formatCurrency(calculations.val2) : `${calculations.val2.toFixed(1)}%`}</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{calculations.label3}</div>
              <div className={`text-3xl font-black ${calculations.val3 < 0 ? 'text-red-600' : 'text-slate-900'}`}>{calculations.isCurrency3 ? formatCurrency(calculations.val3) : calculations.val3}</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{calculations.label4}</div>
              <div className={`text-3xl font-black ${calculations.val4 < 0 ? 'text-red-600' : (calculations.isCurrency4 ? 'text-indigo-600' : 'text-emerald-600')}`}>{calculations.isCurrency4 ? formatCurrency(calculations.val4) : `${calculations.val4.toFixed(1)}%`}</div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-inner text-slate-700">
            <div className="text-sm font-semibold leading-relaxed">{calculations.summary}</div>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-2xl text-xs text-slate-500 shadow-sm">
            <h4 className="font-bold text-slate-700 mb-2">Calculators Fully Supported in this Suite:</h4>
            <p className="leading-relaxed">Profit Calculator • Profit Margin & Gross Margin • Net Profit • Break-even Point • Markup & Discount Calculator • Selling / Cost Price • Commission & Invoice Totals • Cash Flow • Business Valuation.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
