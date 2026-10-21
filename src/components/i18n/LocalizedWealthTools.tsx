'use client';

import { useMemo, useState } from 'react';
import {
  Calculator,
  DollarSign,
  LineChart,
  PiggyBank,
  RotateCcw,
  Scale,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import ResultActions from '@/components/ui/ResultActions';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';
import { fieldClass, buttonClass } from './ToolControls';
import { calculateRetirement } from '@/lib/calculations/retirement';
import { calculateEMI } from '@/lib/calculations/emi';

export type WealthToolSlug =
  | 'debt-snowball-vs-avalanche-calculator'
  | 'retirement-calculator'
  | 'cashflow-budget-architect'
  | 'investment-return-profiler'
  | 'loan-amortization-suite'
  | 'savings-retirement-hub'
  | 'taxation-compliance-deck'
  | 'wealth-inflation-matrix';

export default function LocalizedWealthTools({
  slug,
  locale,
  dictionary,
}: {
  slug: WealthToolSlug;
  locale: Locale;
  dictionary: Dictionary;
}) {
  const d = dictionary;
  const ui = d.ui;
  const w = (d as unknown as { wealth: Record<string, Record<string, string>> }).wealth;

  const format = (n: number, maxDigits = 2) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: maxDigits }).format(n);

  const formatMoney = (n: number) =>
    new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0,
    }).format(Math.round(n));

  // 1. Debt Strategy State
  const [d1Bal, setD1Bal] = useState<number>(5000);
  const [d1Rate, setD1Rate] = useState<number>(18.9);
  const [d1Min, setD1Min] = useState<number>(150);
  const [d2Bal, setD2Bal] = useState<number>(12000);
  const [d2Rate, setD2Rate] = useState<number>(9.5);
  const [d2Min, setD2Min] = useState<number>(250);
  const [extraPayment, setExtraPayment] = useState<number>(200);

  // 2. Retirement State
  const [retCurAge, setRetCurAge] = useState<number>(30);
  const [retAge, setRetAge] = useState<number>(60);
  const [retLifeExp, setRetLifeExp] = useState<number>(85);
  const [retExpenses, setRetExpenses] = useState<number>(40000);
  const [retInflation, setRetInflation] = useState<number>(6);
  const [retReturn, setRetReturn] = useState<number>(10);
  const [retSavings, setRetSavings] = useState<number>(500000);
  const [retMonthly, setRetMonthly] = useState<number>(15000);
  const [retGrowth, setRetGrowth] = useState<number>(5);

  // 3. Cashflow Budget State
  const [cfIncome, setCfIncome] = useState<number>(5000);
  const [cfNeeds, setCfNeeds] = useState<number>(2500);
  const [cfWants, setCfWants] = useState<number>(1500);
  const [cfSavings, setCfSavings] = useState<number>(1000);

  // 4. Investment Return State
  const [invInitial, setInvInitial] = useState<number>(10000);
  const [invFinal, setInvFinal] = useState<number>(25000);
  const [invYears, setInvYears] = useState<number>(5);
  const [invAnnualAddition, setInvAnnualAddition] = useState<number>(1000);

  // 5. Loan Amortization State
  const [laAmount, setLaAmount] = useState<number>(200000);
  const [laRate, setLaRate] = useState<number>(6.5);
  const [laTenure, setLaTenure] = useState<number>(15);
  const [laPrepayment, setLaPrepayment] = useState<number>(200);

  // 6. Savings Hub State
  const [shTarget, setShTarget] = useState<number>(1000000);
  const [shYears, setShYears] = useState<number>(20);
  const [shReturn, setShReturn] = useState<number>(8);
  const [shExisting, setShExisting] = useState<number>(50000);

  // 7. Taxation Compliance State
  const [taxGross, setTaxGross] = useState<number>(1500000);
  const [tax80c, setTax80c] = useState<number>(150000);
  const [taxNps, setTaxNps] = useState<number>(50000);
  const [tax80d, setTax80d] = useState<number>(25000);
  const [taxHra, setTaxHra] = useState<number>(100000);

  // 8. Wealth Inflation Matrix State
  const [wimPresent, setWimPresent] = useState<number>(100000);
  const [wimInflation, setWimInflation] = useState<number>(5.5);
  const [wimReturn, setWimReturn] = useState<number>(9.0);
  const [wimYears, setWimYears] = useState<number>(15);

  // Calculation Results
  const currentResults = useMemo(() => {
    const results: Array<[string, string]> = [];

    if (slug === 'debt-snowball-vs-avalanche-calculator') {
      // Simulate Avalanche (higher rate debt 1 first, then debt 2)
      let b1Av = d1Bal, b2Av = d2Bal, avInterest = 0, avMonths = 0;
      const r1 = (d1Rate / 100) / 12, r2 = (d2Rate / 100) / 12;
      while ((b1Av > 0 || b2Av > 0) && avMonths < 360) {
        avMonths++;
        const int1 = b1Av * r1, int2 = b2Av * r2;
        avInterest += int1 + int2;
        b1Av += int1; b2Av += int2;
        if (b1Av > 0) {
          const pay1 = Math.min(b1Av, d1Min + extraPayment);
          b1Av -= pay1;
          const pay2 = Math.min(b2Av, d2Min);
          b2Av -= pay2;
        } else {
          const pay2 = Math.min(b2Av, d2Min + d1Min + extraPayment);
          b2Av -= pay2;
        }
      }

      // Simulate Snowball (lower balance debt 1 first, then debt 2)
      let b1Sn = d1Bal, b2Sn = d2Bal, snInterest = 0, snMonths = 0;
      while ((b1Sn > 0 || b2Sn > 0) && snMonths < 360) {
        snMonths++;
        const int1 = b1Sn * r1, int2 = b2Sn * r2;
        snInterest += int1 + int2;
        b1Sn += int1; b2Sn += int2;
        if (b1Sn > 0) {
          const pay1 = Math.min(b1Sn, d1Min + extraPayment);
          b1Sn -= pay1;
          const pay2 = Math.min(b2Sn, d2Min);
          b2Sn -= pay2;
        } else {
          const pay2 = Math.min(b2Sn, d2Min + d1Min + extraPayment);
          b2Sn -= pay2;
        }
      }

      const interestSaved = Math.max(0, snInterest - avInterest);
      results.push([w.debtStrategy.avalancheInterest, formatMoney(avInterest)]);
      results.push([w.debtStrategy.snowballInterest, formatMoney(snInterest)]);
      results.push([w.debtStrategy.interestSaved, formatMoney(interestSaved)]);
      results.push([w.debtStrategy.monthsToPayoff, `${avMonths}`]);
    } else if (slug === 'retirement-calculator') {
      const ret = calculateRetirement({
        currentAge: retCurAge,
        retirementAge: retAge,
        lifeExpectancy: retLifeExp,
        currentSavings: retSavings,
        monthlyExpenses: retExpenses,
        inflationRate: retInflation,
        expectedReturn: retReturn,
        monthlyContribution: retMonthly,
        contributionIncreaseRate: retGrowth,
      });
      results.push([w.retirement.projectedCorpus, formatMoney(ret.retirementCorpus)]);
      results.push([w.retirement.monthlyIncome, formatMoney(ret.inflationAdjustedIncome)]);
      results.push([w.retirement.corpusShortfall, formatMoney(ret.corpusShortfall)]);
      results.push([w.retirement.yearsCoverage, `${ret.yearsOfCoverage}`]);
      results.push([w.retirement.sustainabilityScore, `${ret.sustainabilityScore}%`]);
    } else if (slug === 'cashflow-budget-architect') {
      const totalSpend = cfNeeds + cfWants;
      const netCashflow = cfIncome - totalSpend - cfSavings;
      const savingsRate = cfIncome > 0 ? (cfSavings / cfIncome) * 100 : 0;
      const needsPct = cfIncome > 0 ? (cfNeeds / cfIncome) * 100 : 0;
      const wantsPct = cfIncome > 0 ? (cfWants / cfIncome) * 100 : 0;
      const emergencyTarget = cfNeeds * 6;

      results.push([w.cashflow.netCashflow, formatMoney(netCashflow)]);
      results.push([w.cashflow.savingsRate, `${format(savingsRate, 1)}%`]);
      results.push([w.cashflow.needsRatio, `${format(needsPct, 1)}% (50/30/20)`]);
      results.push([w.cashflow.wantsRatio, `${format(wantsPct, 1)}% (50/30/20)`]);
      results.push([w.cashflow.emergencyFundTarget, formatMoney(emergencyTarget)]);
    } else if (slug === 'investment-return-profiler') {
      const totalContributed = invInitial + invAnnualAddition * invYears;
      const netGains = Math.max(0, invFinal - totalContributed);
      const roi = totalContributed > 0 ? ((invFinal - totalContributed) / totalContributed) * 100 : 0;
      const cagr =
        invInitial > 0 && invYears > 0 ? (Math.pow(invFinal / invInitial, 1 / invYears) - 1) * 100 : 0;
      const multiplier = invInitial > 0 ? invFinal / invInitial : 1;

      results.push([w.investment.cagr, `${format(cagr, 2)}%`]);
      results.push([w.investment.totalRoi, `${format(roi, 1)}%`]);
      results.push([w.investment.netGains, formatMoney(netGains)]);
      results.push([w.investment.wealthMultiplier, `${format(multiplier, 2)}x`]);
    } else if (slug === 'loan-amortization-suite') {
      const emi = calculateEMI({
        principal: laAmount,
        rate: laRate,
        tenure: laTenure,
        tenureUnit: 'years',
      });
      const r = (laRate / 100) / 12;
      let balance = laAmount;
      let accInterest = 0;
      let months = 0;
      const acceleratedPayment = emi.monthlyPayment + laPrepayment;

      while (balance > 0 && months < laTenure * 12) {
        months++;
        const interest = balance * r;
        accInterest += interest;
        balance = balance + interest - Math.min(balance + interest, acceleratedPayment);
      }

      const interestSaved = Math.max(0, emi.totalInterest - accInterest);
      const monthsSaved = Math.max(0, laTenure * 12 - months);

      results.push([w.amortization.monthlyPayment, formatMoney(emi.monthlyPayment)]);
      results.push([w.amortization.interestSaved, formatMoney(interestSaved)]);
      results.push([w.amortization.payoffMonthsReduced, `${monthsSaved}`]);
      results.push([w.amortization.totalInterest, formatMoney(accInterest)]);
    } else if (slug === 'savings-retirement-hub') {
      const r = (shReturn / 100) / 12;
      const n = shYears * 12;
      const fvExisting = shExisting * Math.pow(1 + r, n);
      const remainingTarget = Math.max(0, shTarget - fvExisting);
      const monthlyNeeded = r > 0 ? (remainingTarget * r) / (Math.pow(1 + r, n) - 1) : remainingTarget / n;
      const totalDeposited = shExisting + monthlyNeeded * n;
      const interestEarned = Math.max(0, shTarget - totalDeposited);

      results.push([w.savingsHub.monthlySavingsNeeded, formatMoney(monthlyNeeded)]);
      results.push([w.savingsHub.totalDeposited, formatMoney(totalDeposited)]);
      results.push([w.savingsHub.projectedInterest, formatMoney(interestEarned)]);
      results.push([w.savingsHub.targetCorpus, formatMoney(shTarget)]);
    } else if (slug === 'taxation-compliance-deck') {
      // Old regime deductions
      const stdDedOld = 50000;
      const totalDed =
        stdDedOld +
        Math.min(150000, tax80c) +
        Math.min(50000, taxNps) +
        Math.min(25000, tax80d) +
        taxHra;
      const taxableOld = Math.max(0, taxGross - totalDed);

      let oldTax = 0;
      if (taxableOld > 1000000) {
        oldTax = 112500 + (taxableOld - 1000000) * 0.3;
      } else if (taxableOld > 500000) {
        oldTax = 12500 + (taxableOld - 500000) * 0.2;
      } else if (taxableOld > 250000) {
        oldTax = (taxableOld - 250000) * 0.05;
      }
      if (taxableOld <= 500000) oldTax = 0;
      oldTax *= 1.04;

      // New regime calculation
      const stdDedNew = 75000;
      const taxableNew = Math.max(0, taxGross - stdDedNew);
      let newTax = 0;
      if (taxableNew > 2400000) {
        newTax = 380000 + (taxableNew - 2400000) * 0.3;
      } else if (taxableNew > 2000000) {
        newTax = 280000 + (taxableNew - 2000000) * 0.25;
      } else if (taxableNew > 1600000) {
        newTax = 200000 + (taxableNew - 1600000) * 0.2;
      } else if (taxableNew > 1200000) {
        newTax = 140000 + (taxableNew - 1200000) * 0.15;
      } else if (taxableNew > 800000) {
        newTax = 80000 + (taxableNew - 800000) * 0.1;
      } else if (taxableNew > 400000) {
        newTax = (taxableNew - 400000) * 0.05;
      }
      if (taxableNew <= 1200000) newTax = 0;
      newTax *= 1.04;

      const isNewBetter = newTax <= oldTax;
      const savings = Math.abs(oldTax - newTax);

      results.push([
        w.taxCompliance.recommendedRegime,
        isNewBetter ? w.taxCompliance.newRegime : w.taxCompliance.oldRegime,
      ]);
      results.push([w.taxCompliance.newRegimeTax, formatMoney(newTax)]);
      results.push([w.taxCompliance.oldRegimeTax, formatMoney(oldTax)]);
      results.push([w.taxCompliance.annualTaxSavings, formatMoney(savings)]);
      results.push([w.taxCompliance.totalDeductions, formatMoney(totalDed)]);
    } else if (slug === 'wealth-inflation-matrix') {
      const inflationFactor = Math.pow(1 + wimInflation / 100, wimYears);
      const nominalFuture = wimPresent * Math.pow(1 + wimReturn / 100, wimYears);
      const realPurchasingPower = nominalFuture / inflationFactor;
      const cashLost = wimPresent - wimPresent / inflationFactor;
      const realAnnualReturn =
        ((1 + wimReturn / 100) / (1 + wimInflation / 100) - 1) * 100;

      results.push([w.wealthMatrix.futureNominalValue, formatMoney(nominalFuture)]);
      results.push([w.wealthMatrix.realPurchasingPower, formatMoney(realPurchasingPower)]);
      results.push([w.wealthMatrix.purchasingPowerLost, formatMoney(cashLost)]);
      results.push([w.wealthMatrix.realAnnualReturn, `${format(realAnnualReturn, 2)}%`]);
    }

    return results;
  }, [
    slug,
    d1Bal,
    d1Rate,
    d1Min,
    d2Bal,
    d2Rate,
    d2Min,
    extraPayment,
    retCurAge,
    retAge,
    retLifeExp,
    retExpenses,
    retInflation,
    retReturn,
    retSavings,
    retMonthly,
    retGrowth,
    cfIncome,
    cfNeeds,
    cfWants,
    cfSavings,
    invInitial,
    invFinal,
    invYears,
    invAnnualAddition,
    laAmount,
    laRate,
    laTenure,
    laPrepayment,
    shTarget,
    shYears,
    shReturn,
    shExisting,
    taxGross,
    tax80c,
    taxNps,
    tax80d,
    taxHra,
    wimPresent,
    wimInflation,
    wimReturn,
    wimYears,
    w,
    format,
    formatMoney,
  ]);

  const handleReset = () => {
    if (slug === 'debt-snowball-vs-avalanche-calculator') {
      setD1Bal(5000);
      setD1Rate(18.9);
      setD1Min(150);
      setD2Bal(12000);
      setD2Rate(9.5);
      setD2Min(250);
      setExtraPayment(200);
    } else if (slug === 'retirement-calculator') {
      setRetCurAge(30);
      setRetAge(60);
      setRetLifeExp(85);
      setRetExpenses(40000);
      setRetInflation(6);
      setRetReturn(10);
      setRetSavings(500000);
      setRetMonthly(15000);
      setRetGrowth(5);
    } else if (slug === 'cashflow-budget-architect') {
      setCfIncome(5000);
      setCfNeeds(2500);
      setCfWants(1500);
      setCfSavings(1000);
    } else if (slug === 'investment-return-profiler') {
      setInvInitial(10000);
      setInvFinal(25000);
      setInvYears(5);
      setInvAnnualAddition(1000);
    } else if (slug === 'loan-amortization-suite') {
      setLaAmount(200000);
      setLaRate(6.5);
      setLaTenure(15);
      setLaPrepayment(200);
    } else if (slug === 'savings-retirement-hub') {
      setShTarget(1000000);
      setShYears(20);
      setShReturn(8);
      setShExisting(50000);
    } else if (slug === 'taxation-compliance-deck') {
      setTaxGross(1500000);
      setTax80c(150000);
      setTaxNps(50000);
      setTax80d(25000);
      setTaxHra(100000);
    } else if (slug === 'wealth-inflation-matrix') {
      setWimPresent(100000);
      setWimInflation(5.5);
      setWimReturn(9.0);
      setWimYears(15);
    }
  };

  const toolTitle = (d.tools as Record<string, { title?: string }>)[slug]?.title || slug;
  const activeSummary = `${toolTitle}\n${currentResults
    .map(([lbl, val]) => `${lbl}: ${val}`)
    .join('\n')}`;

  const csvRows = `\uFEFF${toolTitle}\nMetric,Value\n${currentResults
    .map(([lbl, val]) => `"${lbl.replace(/"/g, '""')}","${val.replace(/"/g, '""')}"`)
    .join('\n')}\n`;

  const csvName = `${slug}-report.csv`;

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-2">
      {/* Controls Card */}
      <section className="min-w-0 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
        <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
          {slug === 'debt-snowball-vs-avalanche-calculator' && (
            <Scale className="size-5 shrink-0 text-amber-500" />
          )}
          {slug === 'retirement-calculator' && (
            <PiggyBank className="size-5 shrink-0 text-emerald-500" />
          )}
          {slug === 'cashflow-budget-architect' && (
            <Wallet className="size-5 shrink-0 text-indigo-500" />
          )}
          {slug === 'investment-return-profiler' && (
            <TrendingUp className="size-5 shrink-0 text-blue-500" />
          )}
          {slug === 'loan-amortization-suite' && (
            <Calculator className="size-5 shrink-0 text-rose-500" />
          )}
          {slug === 'savings-retirement-hub' && (
            <DollarSign className="size-5 shrink-0 text-cyan-500" />
          )}
          {slug === 'taxation-compliance-deck' && (
            <ShieldCheck className="size-5 shrink-0 text-purple-500" />
          )}
          {slug === 'wealth-inflation-matrix' && (
            <LineChart className="size-5 shrink-0 text-teal-500" />
          )}
          <h2 className="text-xl font-bold">
            {slug === 'debt-snowball-vs-avalanche-calculator' && w.debtStrategy.heading}
            {slug === 'retirement-calculator' && w.retirement.heading}
            {slug === 'cashflow-budget-architect' && w.cashflow.heading}
            {slug === 'investment-return-profiler' && w.investment.heading}
            {slug === 'loan-amortization-suite' && w.amortization.heading}
            {slug === 'savings-retirement-hub' && w.savingsHub.heading}
            {slug === 'taxation-compliance-deck' && w.taxCompliance.heading}
            {slug === 'wealth-inflation-matrix' && w.wealthMatrix.heading}
          </h2>
        </div>

        <div className="mt-5 space-y-4">
          {/* Debt Snowball vs Avalanche */}
          {slug === 'debt-snowball-vs-avalanche-calculator' && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="text-sm font-semibold">
                  {w.debtStrategy.debt1Balance}
                  <input
                    type="number"
                    min="100"
                    step="500"
                    value={d1Bal}
                    onChange={(e) => setD1Bal(Math.max(0, Number(e.target.value)))}
                    className={fieldClass}
                  />
                </label>
                <label className="text-sm font-semibold">
                  {w.debtStrategy.debt1Rate}
                  <input
                    type="number"
                    min="1"
                    max="50"
                    step="0.1"
                    value={d1Rate}
                    onChange={(e) => setD1Rate(Math.max(0, Number(e.target.value)))}
                    className={fieldClass}
                  />
                </label>
                <label className="text-sm font-semibold">
                  {w.debtStrategy.debt1Min}
                  <input
                    type="number"
                    min="10"
                    step="25"
                    value={d1Min}
                    onChange={(e) => setD1Min(Math.max(0, Number(e.target.value)))}
                    className={fieldClass}
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="text-sm font-semibold">
                  {w.debtStrategy.debt2Balance}
                  <input
                    type="number"
                    min="100"
                    step="500"
                    value={d2Bal}
                    onChange={(e) => setD2Bal(Math.max(0, Number(e.target.value)))}
                    className={fieldClass}
                  />
                </label>
                <label className="text-sm font-semibold">
                  {w.debtStrategy.debt2Rate}
                  <input
                    type="number"
                    min="1"
                    max="50"
                    step="0.1"
                    value={d2Rate}
                    onChange={(e) => setD2Rate(Math.max(0, Number(e.target.value)))}
                    className={fieldClass}
                  />
                </label>
                <label className="text-sm font-semibold">
                  {w.debtStrategy.debt2Min}
                  <input
                    type="number"
                    min="10"
                    step="25"
                    value={d2Min}
                    onChange={(e) => setD2Min(Math.max(0, Number(e.target.value)))}
                    className={fieldClass}
                  />
                </label>
              </div>

              <label className="block text-sm font-semibold">
                {w.debtStrategy.extraPayment}
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={extraPayment}
                  onChange={(e) => setExtraPayment(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
            </div>
          )}

          {/* Retirement Calculator */}
          {slug === 'retirement-calculator' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                {w.retirement.currentAge}
                <input
                  type="number"
                  min="18"
                  max="90"
                  value={retCurAge}
                  onChange={(e) => setRetCurAge(Math.max(18, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {w.retirement.retirementAge}
                <input
                  type="number"
                  min={retCurAge + 1}
                  max="100"
                  value={retAge}
                  onChange={(e) => setRetAge(Math.max(retCurAge + 1, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {w.retirement.monthlyExpenses}
                <input
                  type="number"
                  min="1000"
                  step="5000"
                  value={retExpenses}
                  onChange={(e) => setRetExpenses(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {w.retirement.currentSavings}
                <input
                  type="number"
                  min="0"
                  step="50000"
                  value={retSavings}
                  onChange={(e) => setRetSavings(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {w.retirement.monthlyContribution}
                <input
                  type="number"
                  min="0"
                  step="2000"
                  value={retMonthly}
                  onChange={(e) => setRetMonthly(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {w.retirement.expectedReturn}
                <input
                  type="number"
                  min="1"
                  max="25"
                  step="0.5"
                  value={retReturn}
                  onChange={(e) => setRetReturn(Math.max(0.1, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
            </div>
          )}

          {/* Cashflow Budget Architect */}
          {slug === 'cashflow-budget-architect' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold sm:col-span-2">
                {w.cashflow.monthlyIncome}
                <input
                  type="number"
                  min="500"
                  step="500"
                  value={cfIncome}
                  onChange={(e) => setCfIncome(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {w.cashflow.needsExpenses}
                <input
                  type="number"
                  min="0"
                  step="250"
                  value={cfNeeds}
                  onChange={(e) => setCfNeeds(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {w.cashflow.wantsExpenses}
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={cfWants}
                  onChange={(e) => setCfWants(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold sm:col-span-2">
                {w.cashflow.savingsAmount}
                <input
                  type="number"
                  min="0"
                  step="250"
                  value={cfSavings}
                  onChange={(e) => setCfSavings(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
            </div>
          )}

          {/* Investment Return Profiler */}
          {slug === 'investment-return-profiler' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                {w.investment.initialInvestment}
                <input
                  type="number"
                  min="100"
                  step="1000"
                  value={invInitial}
                  onChange={(e) => setInvInitial(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {w.investment.finalValue}
                <input
                  type="number"
                  min="100"
                  step="1000"
                  value={invFinal}
                  onChange={(e) => setInvFinal(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {w.investment.holdingPeriod}
                <input
                  type="number"
                  min="1"
                  max="50"
                  step="1"
                  value={invYears}
                  onChange={(e) => setInvYears(Math.max(1, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {w.investment.annualAddition}
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={invAnnualAddition}
                  onChange={(e) => setInvAnnualAddition(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
            </div>
          )}

          {/* Loan Amortization Suite */}
          {slug === 'loan-amortization-suite' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold sm:col-span-2">
                {w.amortization.loanAmount}
                <input
                  type="number"
                  min="1000"
                  step="10000"
                  value={laAmount}
                  onChange={(e) => setLaAmount(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {w.amortization.interestRate}
                <input
                  type="number"
                  min="0.5"
                  max="30"
                  step="0.1"
                  value={laRate}
                  onChange={(e) => setLaRate(Math.max(0.1, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {w.amortization.tenure}
                <input
                  type="number"
                  min="1"
                  max="40"
                  step="1"
                  value={laTenure}
                  onChange={(e) => setLaTenure(Math.max(1, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold sm:col-span-2">
                {w.amortization.monthlyPrepayment}
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={laPrepayment}
                  onChange={(e) => setLaPrepayment(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
            </div>
          )}

          {/* Savings Retirement Hub */}
          {slug === 'savings-retirement-hub' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold sm:col-span-2">
                {w.savingsHub.targetCorpus}
                <input
                  type="number"
                  min="10000"
                  step="50000"
                  value={shTarget}
                  onChange={(e) => setShTarget(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {w.savingsHub.years}
                <input
                  type="number"
                  min="1"
                  max="50"
                  step="1"
                  value={shYears}
                  onChange={(e) => setShYears(Math.max(1, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {w.savingsHub.expectedReturn}
                <input
                  type="number"
                  min="1"
                  max="25"
                  step="0.5"
                  value={shReturn}
                  onChange={(e) => setShReturn(Math.max(0.1, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold sm:col-span-2">
                {w.savingsHub.existingSavings}
                <input
                  type="number"
                  min="0"
                  step="10000"
                  value={shExisting}
                  onChange={(e) => setShExisting(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
            </div>
          )}

          {/* Taxation Compliance Deck */}
          {slug === 'taxation-compliance-deck' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold sm:col-span-2">
                {w.taxCompliance.grossIncome}
                <input
                  type="number"
                  min="100000"
                  step="50000"
                  value={taxGross}
                  onChange={(e) => setTaxGross(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {w.taxCompliance.sec80c}
                <input
                  type="number"
                  min="0"
                  max="150000"
                  step="10000"
                  value={tax80c}
                  onChange={(e) => setTax80c(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {w.taxCompliance.nps}
                <input
                  type="number"
                  min="0"
                  max="50000"
                  step="10000"
                  value={taxNps}
                  onChange={(e) => setTaxNps(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {w.taxCompliance.healthIns}
                <input
                  type="number"
                  min="0"
                  max="100000"
                  step="5000"
                  value={tax80d}
                  onChange={(e) => setTax80d(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {w.taxCompliance.hra}
                <input
                  type="number"
                  min="0"
                  step="10000"
                  value={taxHra}
                  onChange={(e) => setTaxHra(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
            </div>
          )}

          {/* Wealth Inflation Matrix */}
          {slug === 'wealth-inflation-matrix' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold sm:col-span-2">
                {w.wealthMatrix.presentAmount}
                <input
                  type="number"
                  min="1000"
                  step="10000"
                  value={wimPresent}
                  onChange={(e) => setWimPresent(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {w.wealthMatrix.annualInflation}
                <input
                  type="number"
                  min="0.5"
                  max="25"
                  step="0.5"
                  value={wimInflation}
                  onChange={(e) => setWimInflation(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {w.wealthMatrix.investmentReturn}
                <input
                  type="number"
                  min="0.5"
                  max="35"
                  step="0.5"
                  value={wimReturn}
                  onChange={(e) => setWimReturn(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold sm:col-span-2">
                {w.wealthMatrix.timeHorizon}
                <input
                  type="number"
                  min="1"
                  max="50"
                  step="1"
                  value={wimYears}
                  onChange={(e) => setWimYears(Math.max(1, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
            </div>
          )}

          <div className="mt-5 flex gap-3">
            <button type="button" onClick={handleReset} className={buttonClass}>
              <RotateCcw className="size-4" /> {ui.reset}
            </button>
          </div>
        </div>
      </section>

      {/* Results Card */}
      <section className="min-w-0 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
        <h3 className="text-lg font-bold">{w.common.results}</h3>

        {currentResults.length > 0 && (
          <div className="mt-4 space-y-4">
            <dl className="grid min-w-0 gap-3 sm:grid-cols-2">
              {currentResults.map(([label, val]) => (
                <div
                  key={label}
                  className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-3"
                >
                  <dt className="truncate text-xs text-[var(--muted-foreground)]">{label}</dt>
                  <dd className="mt-1 break-words text-lg font-bold text-[var(--foreground)]">{val}</dd>
                </div>
              ))}
            </dl>

            <ResultActions
              actions={[
                { kind: 'copy', label: d.ui.copy, getContent: () => activeSummary },
                {
                  kind: 'download',
                  label: d.calculatorUi.csv,
                  filename: csvName,
                  mimeType: 'text/csv;charset=utf-8',
                  getContent: () => csvRows,
                },
              ]}
            />
          </div>
        )}
      </section>
    </div>
  );
}
