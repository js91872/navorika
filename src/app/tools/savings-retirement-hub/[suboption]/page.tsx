'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { savingsSubTools } from '@/data/financeMeta';
import { calculateEpfProjection, calculateNpsProjection } from '@/lib/calculations/retirementFinance';

type NumericValue = number | '';

const currency = (value: number) => value.toLocaleString('en-IN', { maximumFractionDigits: 0 });

function NumberField({ id, label, value, onChange, min = 0, max, step = 1, help }: {
  id: string;
  label: string;
  value: NumericValue;
  onChange: (value: NumericValue) => void;
  min?: number;
  max?: number;
  step?: number;
  help?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-bold text-slate-500 uppercase mb-2">{label}</label>
      <input id={id} type="number" value={value} min={min} max={max} step={step}
        onChange={(event) => onChange(event.target.value === '' ? '' : Number(event.target.value))}
        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border font-bold outline-none focus:ring-2 focus:ring-cyan-500/30" />
      {help && <p className="mt-1.5 text-xs leading-5 text-slate-500">{help}</p>}
    </div>
  );
}

function ResultCard({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 min-w-0">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-2 text-2xl font-black break-words ${accent ? 'text-cyan-400' : 'text-white'}`}>{value}</p>
    </div>
  );
}

function EpfCalculator() {
  const [wage, setWage] = useState<NumericValue>(50_000);
  const [employeeRate, setEmployeeRate] = useState<NumericValue>(12);
  const [interestRate, setInterestRate] = useState<NumericValue>(8.25);
  const [openingBalance, setOpeningBalance] = useState<NumericValue>(0);
  const [salaryGrowth, setSalaryGrowth] = useState<NumericValue>(5);
  const [years, setYears] = useState<NumericValue>(15);

  const calculation = useMemo(() => {
    if ([wage, employeeRate, interestRate, openingBalance, salaryGrowth, years].some((value) => value === '')) {
      return { error: 'Complete every field to calculate the estimate.' } as const;
    }
    try {
      return { result: calculateEpfProjection({
        monthlyContributionWage: wage as number,
        employeeContributionRate: employeeRate as number,
        annualInterestRate: interestRate as number,
        openingBalance: openingBalance as number,
        annualSalaryGrowthRate: salaryGrowth as number,
        years: years as number,
      }) } as const;
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Check the entered assumptions.' } as const;
    }
  }, [employeeRate, interestRate, openingBalance, salaryGrowth, wage, years]);

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      <section className="lg:col-span-2 bg-white dark:bg-slate-900 border rounded-3xl p-5 sm:p-8 space-y-4 shadow-sm">
        <NumberField id="epf-wage" label="Monthly EPF contribution wage (₹)" value={wage} onChange={setWage} max={100_000_000} help="The estimate assumes both standard employer contributions and your selected employee rate use this wage." />
        <NumberField id="epf-employee-rate" label="Employee contribution (%)" value={employeeRate} onChange={setEmployeeRate} max={100} step={0.01} help="12% is the standard default. A higher value models an employee-side voluntary contribution; the employer share stays at 12%." />
        <NumberField id="epf-interest" label="Assumed annual EPF interest (%)" value={interestRate} onChange={setInterestRate} max={25} step={0.01} help="Editable projection assumption. Actual EPF rates are declared for each financial year." />
        <NumberField id="epf-opening" label="Opening EPF balance (₹)" value={openingBalance} onChange={setOpeningBalance} max={1_000_000_000_000} />
        <NumberField id="epf-growth" label="Annual contribution-wage growth (%)" value={salaryGrowth} onChange={setSalaryGrowth} max={100} step={0.1} />
        <NumberField id="epf-years" label="Projection period (years)" value={years} onChange={setYears} max={60} step={1 / 12} />
      </section>

      <section className="lg:col-span-3 bg-slate-950 text-white rounded-3xl p-5 sm:p-8 border min-w-0" aria-live="polite">
        {'error' in calculation ? <p role="alert" className="rounded-2xl bg-rose-500/10 border border-rose-400/30 p-4 text-rose-200">{calculation.error}</p> : <>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Projected EPF estimate</p>
          <h2 className="mt-2 text-4xl sm:text-5xl font-black text-cyan-400 break-words">₹{currency(calculation.result.closingEpfBalance)}</h2>
          <div className="mt-6 grid sm:grid-cols-2 gap-3">
            <ResultCard label="Employee EPF contributions" value={`₹${currency(calculation.result.employeeContributions)}`} />
            <ResultCard label="Employer amount entering EPF" value={`₹${currency(calculation.result.employerEpfContributions)}`} />
            <ResultCard label="Estimated EPF interest" value={`₹${currency(calculation.result.interestEarned)}`} />
            <ResultCard label="Employer amount diverted to EPS" value={`₹${currency(calculation.result.epsContributions)}`} />
          </div>
          <div className="mt-6 space-y-2 text-sm leading-6 text-slate-300">
            <p>The default employer contribution is 12%. EPS is estimated at 8.33% of contribution wage up to the ₹15,000 monthly ceiling; the remainder of the employer share enters EPF.</p>
            <p>Interest is estimated from monthly running balances, with each month&apos;s contribution earning from the following month. This is a planning estimate, not a reproduction of an EPFO passbook.</p>
          </div>
        </>}
      </section>
    </div>
  );
}

function NpsCalculator() {
  const [openingCorpus, setOpeningCorpus] = useState<NumericValue>(0);
  const [monthlyContribution, setMonthlyContribution] = useState<NumericValue>(10_000);
  const [contributionIncrease, setContributionIncrease] = useState<NumericValue>(5);
  const [returnRate, setReturnRate] = useState<NumericValue>(10);
  const [years, setYears] = useState<NumericValue>(25);
  const [annuityAllocation, setAnnuityAllocation] = useState<NumericValue>(20);
  const [annuityRate, setAnnuityRate] = useState<NumericValue>(6);

  const calculation = useMemo(() => {
    const values = [openingCorpus, monthlyContribution, contributionIncrease, returnRate, years, annuityAllocation, annuityRate];
    if (values.some((value) => value === '')) return { error: 'Complete every field to calculate the estimate.' } as const;
    try {
      return { result: calculateNpsProjection({
        openingCorpus: openingCorpus as number,
        monthlyContribution: monthlyContribution as number,
        annualContributionIncreaseRate: contributionIncrease as number,
        annualReturnRate: returnRate as number,
        years: years as number,
        annuityAllocationRate: annuityAllocation as number,
        annualAnnuityRate: annuityRate as number,
      }) } as const;
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Check the entered assumptions.' } as const;
    }
  }, [annuityAllocation, annuityRate, contributionIncrease, monthlyContribution, openingCorpus, returnRate, years]);

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      <section className="lg:col-span-2 bg-white dark:bg-slate-900 border rounded-3xl p-5 sm:p-8 space-y-4 shadow-sm">
        <NumberField id="nps-opening" label="Existing Tier I corpus (₹)" value={openingCorpus} onChange={setOpeningCorpus} max={1_000_000_000_000} />
        <NumberField id="nps-contribution" label="Monthly contribution (₹)" value={monthlyContribution} onChange={setMonthlyContribution} max={100_000_000} help="Modelled as an end-of-month contribution." />
        <NumberField id="nps-step-up" label="Annual contribution increase (%)" value={contributionIncrease} onChange={setContributionIncrease} max={100} step={0.1} />
        <NumberField id="nps-return" label="Expected corpus return (% p.a.)" value={returnRate} onChange={setReturnRate} max={100} step={0.1} />
        <NumberField id="nps-years" label="Years to exit" value={years} onChange={setYears} max={60} step={1 / 12} />
        <NumberField id="nps-annuity-allocation" label="Corpus allocated to annuity (%)" value={annuityAllocation} onChange={setAnnuityAllocation} max={100} step={0.1} help="Configurable because the applicable minimum and payout options depend on sector, exit type, corpus, and current rules." />
        <NumberField id="nps-annuity-rate" label="Expected annuity payout rate (% p.a.)" value={annuityRate} onChange={setAnnuityRate} max={100} step={0.1} help="An illustrative payout assumption, not a guaranteed return." />
      </section>

      <section className="lg:col-span-3 bg-slate-950 text-white rounded-3xl p-5 sm:p-8 border min-w-0" aria-live="polite">
        {'error' in calculation ? <p role="alert" className="rounded-2xl bg-rose-500/10 border border-rose-400/30 p-4 text-rose-200">{calculation.error}</p> : <>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Projected NPS corpus</p>
          <h2 className="mt-2 text-4xl sm:text-5xl font-black text-cyan-400 break-words">₹{currency(calculation.result.projectedCorpus)}</h2>
          <div className="mt-6 grid sm:grid-cols-2 gap-3">
            <ResultCard label="New contributions" value={`₹${currency(calculation.result.newContributions)}`} />
            <ResultCard label="Estimated investment gain" value={`₹${currency(calculation.result.investmentGain)}`} />
            <ResultCard label="Assumed withdrawable component" value={`₹${currency(calculation.result.withdrawableAmount)}`} />
            <ResultCard label="Amount allocated to annuity" value={`₹${currency(calculation.result.annuityAllocation)}`} />
            <ResultCard label="Estimated annual pension" value={`₹${currency(calculation.result.estimatedAnnualPension)}`} />
            <ResultCard label="Estimated monthly pension" value={`₹${currency(calculation.result.estimatedMonthlyPension)}`} accent />
          </div>
          <p className="mt-6 text-sm leading-6 text-slate-300">Corpus growth uses monthly compounding and end-of-month contributions. NPS is market-linked, and annuity prices and exit rules can change; these outputs are scenario estimates, not guaranteed retirement benefits.</p>
        </>}
      </section>
    </div>
  );
}

function LegacySavingsCalculator({ suboption }: { suboption: string }) {
  const [valA, setValA] = useState<NumericValue>(150_000);
  const [valB, setValB] = useState<NumericValue>(7.1);
  const [valC, setValC] = useState<NumericValue>(15);
  const config = {
    'ppf-calculator': { labelA: 'Yearly Investment (₹)', labelB: 'Interest Rate (% p.a.)', labelC: 'Duration (Years)', showC: true },
    'fd-calculator': { labelA: 'Fixed Deposit Amount (₹)', labelB: 'Interest Rate (% p.a.)', labelC: 'Tenure (Years)', showC: true },
    'gratuity-calculator': { labelA: 'Last Drawn Basic Salary + DA (₹)', labelB: 'Years of Service', labelC: '', showC: false },
  }[suboption]!;

  const result = useMemo(() => {
    const a = valA === '' ? 0 : valA;
    const b = valB === '' ? 0 : valB;
    const c = valC === '' ? 0 : valC;
    if (suboption === 'ppf-calculator') {
      let corpus = 0;
      for (let year = 0; year < c; year += 1) corpus = (corpus + a) * (1 + b / 100);
      return { value: currency(corpus), unit: '₹ Estimated maturity amount' };
    }
    if (suboption === 'fd-calculator') return { value: currency(a * Math.pow(1 + (b / 100) / 4, 4 * c)), unit: '₹ Estimated maturity value' };
    if (b < 5) return { value: '0', unit: 'Minimum five years assumed for this estimate' };
    return { value: currency((15 * a * b) / 26), unit: '₹ Estimated gratuity payout' };
  }, [suboption, valA, valB, valC]);

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="bg-white dark:bg-slate-900 border rounded-3xl p-5 sm:p-8 space-y-4 shadow-sm">
        <NumberField id="legacy-a" label={config.labelA} value={valA} onChange={setValA} />
        <NumberField id="legacy-b" label={config.labelB} value={valB} onChange={setValB} step={0.1} />
        {config.showC && <NumberField id="legacy-c" label={config.labelC} value={valC} onChange={setValC} />}
      </div>
      <div className="lg:col-span-2 bg-slate-950 text-white rounded-3xl p-5 sm:p-8 flex flex-col justify-center border min-h-[300px]" aria-live="polite">
        <span className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Calculated result</span>
        <h2 className="text-4xl sm:text-5xl font-black text-cyan-400 break-words">{result.value}</h2>
        <p className="text-lg font-bold text-slate-500 mt-2">{result.unit}</p>
      </div>
    </div>
  );
}

export default function SavingsHubTool() {
  const params = useParams();
  const router = useRouter();
  const suboption = params.suboption as string;
  const seo = savingsSubTools[suboption];
  if (!seo) return null;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:px-8">
      <a href="/categories/finance-calculators" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition mb-8"><ArrowLeft className="h-4 w-4" /> Back</a>
      <div className="text-center mb-10"><h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4">{seo.heading}</h1><p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">{seo.description}</p></div>
      <div className="flex max-w-full overflow-x-auto gap-2 mb-8 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl w-fit border">
        {Object.keys(savingsSubTools).map((key) => <button key={key} onClick={() => router.push(key === 'ppf-calculator' || key === 'fd-calculator' ? `/tools/${key}` : `/tools/savings-retirement-hub/${key}`)} className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${suboption === key ? 'bg-white text-blue-600 shadow' : 'text-slate-500'}`}>{key.replace(/-/g, ' ')}</button>)}
      </div>
      {suboption === 'epf-calculator' ? <EpfCalculator /> : suboption === 'nps-calculator' ? <NpsCalculator /> : <LegacySavingsCalculator suboption={suboption} />}
    </main>
  );
}
