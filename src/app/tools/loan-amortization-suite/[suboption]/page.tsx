'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Landmark, Calendar, Target, Activity } from 'lucide-react';
import { loanSubTools } from '@/data/financeMeta';

type ScheduleItem = { month: number; emi: number; principal: number; interest: number; balance: number };

export default function DynamicLoanSubOptionTool() {
  const params = useParams();
  const router = useRouter();
  const suboption = (params?.suboption as string) || 'emi-calculator';
  const seo = loanSubTools[suboption] || loanSubTools['emi-calculator'];

  const [loanAmount, setLoanAmount] = useState<number | ''>(2500000);
  const [interestRate, setInterestRate] = useState<number | ''>(8.5);
  const [tenureYears, setTenureYears] = useState<number | ''>(20);
  const [prepayment, setPrepayment] = useState<number | ''>(suboption === 'prepayment-calculator' ? 10000 : 0);

  const [monthlyEmi, setMonthlyEmi] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);
  const [totalPayment, setTotalPayment] = useState<number | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    document.title = seo.title;
    calculateLoanMatrix();
  }, [suboption, loanAmount, interestRate, tenureYears, prepayment]);

  const calculateLoanMatrix = () => {
    const P = loanAmount === '' ? 0 : loanAmount;
    const r = ((interestRate === '' ? 0 : interestRate) / 100) / 12;
    const n = (tenureYears === '' ? 0 : tenureYears) * 12;
    const extra = prepayment === '' ? 0 : prepayment;

    if (P === 0 || r === 0 || n === 0) {
      setMonthlyEmi(0); setTotalInterest(0); setTotalPayment(0); setSchedule([]); return;
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
      
      if (balance - actualPrincipalPaid < 0) { actualPrincipalPaid = balance; }

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
    <main className="min-h-[calc(100dvh-80px)] w-full relative overflow-hidden font-sans flex flex-col p-4 lg:p-8">
      
      {/* Ambient Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-500/20 rounded-full blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen"></div>
      
      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col relative z-10 gap-6">
        
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
          <div>
            <a href="/categories/finance-calculators" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-2 uppercase tracking-widest">
              <ArrowLeft className="h-3 w-3" /> Finance Portal
            </a>
            <h1 className="text-2xl lg:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 tracking-tight">
              {seo.heading}
            </h1>
          </div>

          <div className="flex bg-white dark:bg-white/5 backdrop-blur-xl p-1 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm overflow-x-auto no-scrollbar w-full sm:w-auto shrink-0">
            {Object.keys(loanSubTools).map((key) => (
              <button 
                key={key} 
                onClick={() => router.push(`/tools/loan-amortization-suite/${key}`)} 
                className={`px-4 py-2 rounded-lg text-[11px] font-bold capitalize whitespace-nowrap transition-all duration-300 ${
                  suboption === key 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {key.replace(/-/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid lg:grid-cols-12 gap-6 flex-1">
          
          {/* Left Inputs Panel */}
          <div className="lg:col-span-4 bg-white dark:bg-white/[0.02] backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 shadow-xl flex flex-col gap-5 transition-colors h-fit sticky top-[100px]">
            <div className="flex items-center gap-2 mb-2 shrink-0">
              <Landmark className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
              <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest">Borrowing Profile</h3>
            </div>

            <div className="relative group shrink-0">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">Principal Loan Amount</label>
              <div className="relative flex items-center bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                <input type="number" value={loanAmount} onChange={e => setLoanAmount(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-4 py-3.5 bg-transparent outline-none font-bold text-base text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-700" placeholder="0" />
              </div>
            </div>

            <div className="relative group shrink-0">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">Interest Rate (% p.a.)</label>
              <div className="relative flex items-center bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                <input type="number" step="0.1" value={interestRate} onChange={e => setInterestRate(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-4 py-3.5 bg-transparent outline-none font-bold text-base text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-700" placeholder="0" />
              </div>
            </div>

            <div className="relative group shrink-0">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">Tenure Duration (Years)</label>
              <div className="relative flex items-center bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                <input type="number" value={tenureYears} onChange={e => setTenureYears(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-4 py-3.5 bg-transparent outline-none font-bold text-base text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-700" placeholder="0" />
              </div>
            </div>

            <div className="relative group shrink-0">
              <label className="block text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1.5 transition-colors">Optional Prepayment</label>
              <div className="relative flex items-center bg-slate-50 dark:bg-black/40 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl overflow-hidden focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                <input type="number" value={prepayment} onChange={e => setPrepayment(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-4 py-3.5 bg-transparent outline-none font-bold text-base text-emerald-600 dark:text-emerald-400 placeholder:text-emerald-400/50" placeholder="0" />
              </div>
            </div>
          </div>

          {/* Right Outputs Panel */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Top 3 Summary Mini-Bentos */}
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-white/[0.02] backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-[1.5rem] p-6 shadow-sm flex flex-col justify-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Monthly Installment</span>
                <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400 tabular-nums">{monthlyEmi ? monthlyEmi.toLocaleString('en-US') : '0'}</p>
              </div>
              <div className="bg-white dark:bg-white/[0.02] backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-[1.5rem] p-6 shadow-sm flex flex-col justify-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Interest</span>
                <p className="text-3xl font-black text-rose-500 dark:text-rose-400 tabular-nums">{totalInterest ? totalInterest.toLocaleString('en-US') : '0'}</p>
              </div>
              <div className="bg-white dark:bg-white/[0.02] backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-[1.5rem] p-6 shadow-sm flex flex-col justify-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Gross Outlay</span>
                <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">{totalPayment ? totalPayment.toLocaleString('en-US') : '0'}</p>
              </div>
            </div>

            {/* Amortization Schedule Data Table */}
            {schedule.length > 0 && (
              <div className="flex-1 bg-white dark:bg-white/[0.02] backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-xl overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                  <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Amortization Matrix</h3>
                </div>
                
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto no-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-slate-50/90 dark:bg-[#0A0A0B]/90 backdrop-blur-md z-10 border-b border-slate-200 dark:border-white/10">
                      <tr className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                        <th className="p-4 whitespace-nowrap">Month</th>
                        <th className="p-4 whitespace-nowrap">Payment</th>
                        <th className="p-4 whitespace-nowrap">Principal</th>
                        <th className="p-4 whitespace-nowrap">Interest</th>
                        <th className="p-4 whitespace-nowrap">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300">
                      {schedule.map((row) => (
                        <tr key={row.month} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                          <td className="p-4 font-sans text-slate-500">{row.month}</td>
                          <td className="p-4">{Math.round(row.emi).toLocaleString('en-US')}</td>
                          <td className="p-4 text-emerald-600 dark:text-emerald-400">{Math.round(row.principal).toLocaleString('en-US')}</td>
                          <td className="p-4 text-rose-500 dark:text-rose-400">{Math.round(row.interest).toLocaleString('en-US')}</td>
                          <td className="p-4">{Math.round(row.balance).toLocaleString('en-US')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
