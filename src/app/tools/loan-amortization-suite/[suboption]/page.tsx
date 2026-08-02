'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck, Landmark, Calendar, RefreshCw, HelpCircle } from 'lucide-react';
import { loanSubTools } from '@/data/financeMeta';

type ScheduleItem = { month: number; emi: number; principal: number; interest: number; balance: number };

export default function DynamicLoanSubOptionTool() {
  const params = useParams();
  const router = useRouter();
  const suboption = (params?.suboption as string) || 'emi-calculator';
  
  // Resolve localized SEO context fallback loops
  const seo = loanSubTools[suboption] || loanSubTools['emi-calculator'];

  // Inputs
  const [loanAmount, setLoanAmount] = useState(2500000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);
  const [prepayment, setPrepayment] = useState(suboption === 'prepayment-calculator' ? 10000 : 0);

  // Outputs
  const [monthlyEmi, setMonthlyEmi] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);
  const [totalPayment, setTotalPayment] = useState<number | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    calculateLoanMatrix();
    
    // Inject dynamic document title maps for SEO / AI scraper visibility indices
    document.title = seo.title;
  }, [suboption, seo]);

  const calculateLoanMatrix = () => {
    const P = loanAmount;
    const r = (interestRate / 100) / 12;
    const n = tenureYears * 12;

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    
    let balance = P;
    let accumulatedInterest = 0;
    let tempSchedule: ScheduleItem[] = [];
    let currentMonth = 1;

    while (balance > 0 && currentMonth <= n + 120) {
      const interestPaid = balance * r;
      let principalPaid = emi - interestPaid;
      let actualPrincipalPaid = principalPaid + prepayment;
      
      if (balance - actualPrincipalPaid < 0) {
        actualPrincipalPaid = balance;
      }

      balance -= actualPrincipalPaid;
      accumulatedInterest += interestPaid;

      tempSchedule.push({
        month: currentMonth,
        emi: actualPrincipalPaid + interestPaid > loanAmount ? actualPrincipalPaid + interestPaid : emi,
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

  // Structured JSON-LD Data payload maps engineered specifically to command rich snippet rankings on search engine indexing pipelines
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialCalculator",
    "name": seo.title,
    "description": seo.description,
    "url": `https://navorika.com/tools/loan-amortization-suite/${suboption}`,
    "category": "Investment Application Calculator"
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 lg:px-8">
      {/* Inject JSON-LD directly into header context mapping slots */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }} />

      <a href="/categories/finance-calculators" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition mb-8">
        <ArrowLeft className="h-4 w-4" /> Back to Finance Suite
      </a>

      {/* Dynamic SEO Targeting Headers */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-500/20">
          <ShieldCheck className="h-4 w-4" /> Verified High-Precision Sandbox
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{seo.heading}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">{seo.description}</p>
      </div>

      {/* Internal Sub-Navigation Tabs Matrix for Perfect Crawlability Link graphs */}
      <div className="flex flex-wrap gap-2 mb-8 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl w-fit border">
        {Object.keys(loanSubTools).map((key) => (
          <button 
            key={key} 
            onClick={() => router.push(`/tools/loan-amortization-suite/${key}`)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${suboption === key ? 'bg-white dark:bg-slate-900 text-blue-600 shadow' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {key.replace(/-/g, ' ')}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-white dark:bg-slate-900 border rounded-3xl p-8 space-y-6 shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 flex items-center gap-2"><Landmark className="h-4 w-4"/> Calculator Inputs</h3>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Loan Amount (₹)</label>
            <input type="number" value={loanAmount} onChange={e => setLoanAmount(Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border outline-none font-bold text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Interest Rate (% p.a.)</label>
            <input type="number" step="0.05" value={interestRate} onChange={e => setInterestRate(Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border outline-none font-bold text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tenure Duration (Years)</label>
            <input type="number" value={tenureYears} onChange={e => setTenureYears(Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border outline-none font-bold text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Prepayment Injection Factor (₹)</label>
            <input type="number" value={prepayment} onChange={e => setPrepayment(Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-emerald-500/20 outline-none font-bold text-sm text-emerald-600" />
          </div>
          <button onClick={calculateLoanMatrix} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow"><RefreshCw className="h-4 w-4"/> Refresh Matrix</button>
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

      {schedule.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border shadow-xl overflow-hidden p-6">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2"><Calendar className="h-4 w-4"/> Amortization Matrix</h3>
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-xs font-bold uppercase text-slate-400 bg-slate-50 dark:bg-slate-950">
                  <th className="p-3">Month</th>
                  <th className="p-3">Gross Payment</th>
                  <th className="p-3">Principal Shift</th>
                  <th className="p-3">Interest Decay</th>
                  <th className="p-3">Net Balance</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs text-slate-700 dark:text-slate-300">
                {schedule.map((row) => (
                  <tr key={row.month} className="border-b hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                    <td className="p-3 font-sans font-bold">{row.month}</td>
                    <td className="p-3">₹ {Math.round(row.emi).toLocaleString('en-IN')}</td>
                    <td className="p-3 text-emerald-600">₹ {Math.round(row.principal).toLocaleString('en-IN')}</td>
                    <td className="p-3 text-rose-500">₹ {Math.round(row.interest).toLocaleString('en-IN')}</td>
                    <td className="p-3 font-bold">₹ {Math.round(row.balance).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
