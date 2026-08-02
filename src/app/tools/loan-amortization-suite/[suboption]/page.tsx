'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck, Landmark, Calendar, RefreshCw } from 'lucide-react';
import { loanSubTools } from '@/data/financeMeta';

type ScheduleItem = { month: number; emi: number; principal: number; interest: number; balance: number };

export default function DynamicLoanSubOptionTool() {
  const params = useParams();
  const router = useRouter();
  const suboption = (params?.suboption as string) || 'emi-calculator';
  const seo = loanSubTools[suboption] || loanSubTools['emi-calculator'];

  // Handle numbers or empty strings flawlessly
  const [loanAmount, setLoanAmount] = useState<number | ''>(2500000);
  const [interestRate, setInterestRate] = useState<number | ''>(8.5);
  const [tenureYears, setTenureYears] = useState<number | ''>(20);
  const [prepayment, setPrepayment] = useState<number | ''>(suboption === 'prepayment-calculator' ? 10000 : 0);

  const [monthlyEmi, setMonthlyEmi] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);
  const [totalPayment, setTotalPayment] = useState<number | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    calculateLoanMatrix();
    document.title = seo.title;
  }, [suboption, seo, loanAmount, interestRate, tenureYears, prepayment]);

  const calculateLoanMatrix = () => {
    const P = loanAmount === '' ? 0 : loanAmount;
    const r = ((interestRate === '' ? 0 : interestRate) / 100) / 12;
    const n = (tenureYears === '' ? 0 : tenureYears) * 12;
    const extra = prepayment === '' ? 0 : prepayment;

    if (P === 0 || r === 0 || n === 0) {
      setMonthlyEmi(0); setTotalInterest(0); setTotalPayment(0); setSchedule([]);
      return;
    }

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    
    let balance = P;
    let accumulatedInterest = 0;
    let tempSchedule: ScheduleItem[] = [];
    let currentMonth = 1;

    while (balance > 0 && currentMonth <= n + 120) {
      const interestPaid = balance * r;
      let principalPaid = emi - interestPaid;
      let actualPrincipalPaid = principalPaid + extra;
      
      if (balance - actualPrincipalPaid < 0) {
        actualPrincipalPaid = balance;
      }

      balance -= actualPrincipalPaid;
      accumulatedInterest += interestPaid;

      tempSchedule.push({
        month: currentMonth,
        emi: actualPrincipalPaid + interestPaid > P ? actualPrincipalPaid + interestPaid : emi,
        principal: actualPrincipalPaid,
        interest: interestPaid,
        balance: Math.max(0, balance)
      });

      currentMonth++;
    }

    setMonthlyEmi(Math.round(emi));
    setTotalInterest(Math.round(accumulatedInterest));
    setTotalPayment(Math.round(P + accumulatedInterest));
    setSchedule(tempSchedule);
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 lg:px-8">
      <a href="/categories/finance-calculators" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition mb-8"><ArrowLeft className="h-4 w-4" /> Back</a>
      
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{seo.heading}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">{seo.description}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl w-fit border">
        {Object.keys(loanSubTools).map((key) => (
          <button key={key} onClick={() => router.push(`/tools/loan-amortization-suite/${key}`)} className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${suboption === key ? 'bg-white text-blue-600 shadow' : 'text-slate-500'}`}>{key.replace(/-/g, ' ')}</button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-white dark:bg-slate-900 border rounded-3xl p-8 space-y-6 shadow-sm">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Loan Amount (₹)</label>
            <input type="number" value={loanAmount} onChange={e => setLoanAmount(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border outline-none font-bold text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Interest Rate (% p.a.)</label>
            <input type="number" step="0.05" value={interestRate} onChange={e => setInterestRate(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border outline-none font-bold text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tenure Duration (Years)</label>
            <input type="number" value={tenureYears} onChange={e => setTenureYears(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border outline-none font-bold text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Prepayment Injection Factor (₹)</label>
            <input type="number" value={prepayment} onChange={e => setPrepayment(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border outline-none font-bold text-sm text-emerald-600" />
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-950 text-white rounded-3xl p-8 grid sm:grid-cols-3 gap-6 border h-fit">
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monthly Installment</span>
            <p className="text-2xl font-black text-blue-400 mt-2">₹ {monthlyEmi !== null ? monthlyEmi.toLocaleString('en-IN') : '0'}</p>
          </div>
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Interest Burden</span>
            <p className="text-2xl font-black text-rose-400 mt-2">₹ {totalInterest !== null ? totalInterest.toLocaleString('en-IN') : '0'}</p>
          </div>
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gross Outlay Value</span>
            <p className="text-2xl font-black text-emerald-400 mt-2">₹ {totalPayment !== null ? totalPayment.toLocaleString('en-IN') : '0'}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
