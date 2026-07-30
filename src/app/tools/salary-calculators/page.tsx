'use client';

import { useState, useMemo } from 'react';

type SalaryMode = 'in_hand' | 'hike' | 'bonus' | 'hourly_wage' | 'daily_wage';

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
};

export default function SalaryCalculators() {
  const [mode, setMode] = useState<SalaryMode>('in_hand');

  // Controlled Value String State Bindings
  const [grossAnnual, setGrossAnnual] = useState<string>('1200000');
  const [monthlyDeductions, setMonthlyDeductions] = useState<string>('4000'); 
  
  // Hike Appraisal States
  const [currentSalary, setCurrentSalary] = useState<string>('800000');
  const [newSalary, setNewSalary] = useState<string>('1040000');

  // Bonus States
  const [basePay, setBasePay] = useState<string>('50000');
  const [bonusPercentage, setBonusPercentage] = useState<string>('15');

  // Unified Hourly/Daily Wage Sheet States
  const [dailyRate, setDailyRate] = useState<string>('2500');
  const [daysWorked, setDaysWorked] = useState<string>('22');
  const [hourlyRate, setHourlyRate] = useState<string>('400');
  const [hoursWorked, setHoursWorked] = useState<string>('160');
  const [overtimeHours, setOvertimeHours] = useState<string>('15');
  const [overtimeRate, setOvertimeRate] = useState<string>('600');

  // Processing Engine
  const calculations = useMemo(() => {
    let outputLabel1 = '';
    let outputVal1 = 0;
    let outputLabel2 = '';
    let outputVal2 = 0;
    let textSummaryLabel = '';
    let textSummaryValue = '';

    const annualGross = Number(grossAnnual) || 0;
    const mDeduct = Number(monthlyDeductions) || 0;
    const currSal = Number(currentSalary) || 0;
    const nextSal = Number(newSalary) || 0;
    const bPay = Number(basePay) || 0;
    const bPct = Number(bonusPercentage) || 0;
    
    const dRate = Number(dailyRate) || 0;
    const dWorked = Number(daysWorked) || 0;
    const hRate = Number(hourlyRate) || 0;
    const hWorked = Number(hoursWorked) || 0;
    const otHours = Number(overtimeHours) || 0;
    const otRate = Number(overtimeRate) || 0;

    switch (mode) {
      case 'in_hand':
        const monthlyGross = annualGross / 12;
        let estimatedTaxMonthly = 0;
        if (annualGross > 1500000) estimatedTaxMonthly = (annualGross * 0.15) / 12;
        else if (annualGross > 1000000) estimatedTaxMonthly = (annualGross * 0.10) / 12;
        else if (annualGross > 700000) estimatedTaxMonthly = (annualGross * 0.05) / 12;

        outputLabel1 = "Monthly Net Take-Home Pay";
        outputVal1 = Math.max(0, monthlyGross - mDeduct - estimatedTaxMonthly);
        
        outputLabel2 = "Annual Gross CTC";
        outputVal2 = annualGross;
        
        textSummaryLabel = "Payroll & CTC Breakout Matrix";
        textSummaryValue = `Gross Monthly: ${formatCurrency(monthlyGross)} | PF & Deductions: ${formatCurrency(mDeduct)} | Est. Monthly TDS: ${formatCurrency(estimatedTaxMonthly)}`;
        break;

      case 'hike':
        const absoluteIncrement = Math.max(0, nextSal - currSal);
        const percentageGain = currSal > 0 ? (absoluteIncrement / currSal) * 100 : 0;

        outputLabel1 = "Absolute Annual Increment";
        outputVal1 = absoluteIncrement;
        
        outputLabel2 = "Percentage Hike";
        outputVal2 = percentageGain; 
        
        textSummaryLabel = "Appraisal Growth Breakdown";
        textSummaryValue = `Gross monthly salary will increase by ${formatCurrency(absoluteIncrement / 12)} (+${percentageGain.toFixed(1)}% change from original base).`;
        break;

      case 'bonus':
        const computedBonus = bPay * (bPct / 100);
        outputLabel1 = "Performance Bonus Payout";
        outputVal1 = computedBonus;
        
        outputLabel2 = "Total Base Combined Pool";
        outputVal2 = bPay + computedBonus;
        
        textSummaryLabel = "Variable Incentive Summary";
        textSummaryValue = `Your variable component evaluates to an allocation of ${formatCurrency(computedBonus)} on an annual base of ${formatCurrency(bPay)}.`;
        break;

      case 'hourly_wage':
        const baseHourlyEarnings = hWorked * hRate;
        const hourlyOvertimeEarnings = otHours * otRate;

        outputLabel1 = "Total Overtime Payout";
        outputVal1 = hourlyOvertimeEarnings;
        
        outputLabel2 = "Total Gross Wage Earnings";
        outputVal2 = baseHourlyEarnings + hourlyOvertimeEarnings;
        
        textSummaryLabel = "Hourly Contract Summary Metrics";
        textSummaryValue = `Regular Contract Pay: ${formatCurrency(baseHourlyEarnings)} (${hWorked} hrs logged) | Overtime Segment: ${formatCurrency(hourlyOvertimeEarnings)} (${otHours} hrs logged)`;
        break;

      case 'daily_wage':
        const baseDailyEarnings = dWorked * dRate;
        const dailyOvertimeEarnings = otHours * otRate;

        outputLabel1 = "Total Overtime Payout";
        outputVal1 = dailyOvertimeEarnings;
        
        outputLabel2 = "Total Gross Wage Earnings";
        outputVal2 = baseDailyEarnings + dailyOvertimeEarnings;
        
        textSummaryLabel = "Daily Shift Summary Metrics";
        textSummaryValue = `Regular Shift Pay: ${formatCurrency(baseDailyEarnings)} (${dWorked} days logged) | Overtime Segment: ${formatCurrency(dailyOvertimeEarnings)} (${otHours} hrs logged)`;
        break;
    }

    return { outputLabel1, outputVal1, outputLabel2, outputVal2, textSummaryLabel, textSummaryValue };
  }, [mode, grossAnnual, monthlyDeductions, currentSalary, newSalary, basePay, bonusPercentage, dailyRate, daysWorked, hourlyRate, hoursWorked, overtimeHours, overtimeRate]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Salary & Payroll Processing</h1>
        <p className="text-slate-600 mt-2 text-sm max-w-2xl">
          Comprehensive payroll modules running entirely client-side to calculate monthly take-home payouts, CTC breakdowns, appraisals, and detailed hourly/daily work sheets.
        </p>
      </div>

      {/* Tabs Selector Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-8">
        {[
          { id: 'in_hand', label: 'In-Hand, CTC & Payroll' },
          { id: 'hike', label: 'Salary Hike' },
          { id: 'bonus', label: 'Bonus Calculator' },
          { id: 'hourly_wage', label: 'Hourly Wage Sheet' },
          { id: 'daily_wage', label: 'Daily Wage Sheet' },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setMode(btn.id as SalaryMode)}
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
        {/* Input Parameter Settings Card */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 text-base">Adjust Parameters</h3>

          {mode === 'in_hand' && (
            <>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Gross Annual CTC</label>
                <input
                  type="number"
                  value={grossAnnual}
                  onChange={(e) => setGrossAnnual(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Monthly Deductions (PF/ESI/Insurance)</label>
                <input
                  type="number"
                  value={monthlyDeductions}
                  onChange={(e) => setMonthlyDeductions(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </>
          )}

          {mode === 'hike' && (
            <>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Current Annual Salary (Pre-Hike)</label>
                <input
                  type="number"
                  value={currentSalary}
                  onChange={(e) => setCurrentSalary(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">New Annual Salary (Post-Hike)</label>
                <input
                  type="number"
                  value={newSalary}
                  onChange={(e) => setNewSalary(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </>
          )}

          {mode === 'bonus' && (
            <>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Annual Base Salary</label>
                <input type="number" value={basePay} onChange={(e) => setBasePay(e.target.value)} className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Bonus Percentage Multiplier (%)</label>
                <input type="number" value={bonusPercentage} onChange={(e) => setBonusPercentage(e.target.value)} className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" />
              </div>
            </>
          )}

          {mode === 'hourly_wage' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Hourly Rate</label>
                  <input type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Hours Logged</label>
                  <input type="number" value={hoursWorked} onChange={(e) => setHoursWorked(e.target.value)} className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">OT Hours</label>
                  <input type="number" value={overtimeHours} onChange={(e) => setOvertimeHours(e.target.value)} className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">OT Hourly Rate</label>
                  <input type="number" value={overtimeRate} onChange={(e) => setOvertimeRate(e.target.value)} className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" />
                </div>
              </div>
            </div>
          )}

          {mode === 'daily_wage' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Daily Rate</label>
                  <input type="number" value={dailyRate} onChange={(e) => setDailyRate(e.target.value)} className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Days Worked</label>
                  <input type="number" value={daysWorked} onChange={(e) => setDaysWorked(e.target.value)} className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">OT Hours</label>
                  <input type="number" value={overtimeHours} onChange={(e) => setOvertimeHours(e.target.value)} className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">OT Hourly Rate</label>
                  <input type="number" value={overtimeRate} onChange={(e) => setOvertimeRate(e.target.value)} className="w-full bg-slate-50 text-slate-900 text-slate-900 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500" />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Output metrics section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="text-xs font-bold text-slate-500 tracking-wider mb-2 uppercase">
                {calculations.outputLabel1}
              </div>
              <div className="text-3xl font-black text-indigo-600">
                {formatCurrency(calculations.outputVal1)}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="text-xs font-bold text-slate-500 tracking-wider mb-2 uppercase">
                {calculations.outputLabel2}
              </div>
              <div className="text-3xl font-black text-slate-900">
                {mode === 'hike' ? `${calculations.outputVal2.toFixed(1)}%` : formatCurrency(calculations.outputVal2)}
              </div>
            </div>
          </div>

          {calculations.textSummaryValue && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-inner">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{calculations.textSummaryLabel}</div>
              <div className="text-sm font-semibold text-slate-700 leading-relaxed">{calculations.textSummaryValue}</div>
            </div>
          )}

          <div className="p-6 bg-white border border-slate-200 rounded-2xl text-xs text-slate-500 shadow-sm">
            <h4 className="font-bold text-slate-700 mb-2">Calculators Fully Supported in this Suite:</h4>
            <p className="leading-relaxed">
              Salary Calculator • In-Hand Salary Calculator • CTC Calculator • Salary Hike Calculator • Bonus Calculator • Overtime Calculator • Hourly Wage Calculator • Daily Wage Calculator • Payroll Calculator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
