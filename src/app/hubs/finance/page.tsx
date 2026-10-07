'use client';

import Link from 'next/link';
import { ArrowRight, Calculator, BookOpen, Sparkles } from 'lucide-react';
import { tools } from '@/data/registry';
import { toolsUnderReview } from '@/lib/seo/toolReview';

const financeSuiteRoots = new Set([
  'cashflow-budget-architect',
  'investment-return-profiler',
  'loan-amortization-suite',
  'savings-retirement-hub',
  'taxation-compliance-deck',
  'wealth-inflation-matrix',
]);

export default function FinanceHub() {
  const financeTools = tools.filter(
    (t) => t.category === 'finance-calculators' && !toolsUnderReview.has(t.slug) && !financeSuiteRoots.has(t.slug)
  );

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black tracking-tight mb-4">
            Free Finance Calculators
            <span className="text-[var(--muted-foreground)] text-2xl font-normal ml-3">
              — Money, Loans, Savings & Investing
            </span>
          </h1>
          <p className="text-[var(--muted-foreground)] text-lg max-w-2xl">
            Use free calculators for loans, savings, investing, budgeting, property,
            business metrics, and everyday money decisions. Check each tool for its
            assumptions, currency, and data source.
          </p>
        </div>

        {/* Finance Calculators */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Calculator className="h-6 w-6 text-emerald-500" />
            Finance Calculators
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {financeTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-emerald-500/40 transition-all group"
              >
                <h3 className="font-semibold group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-sm text-[var(--muted-foreground)] mt-1">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="text-2xl font-bold">How to Use These Finance Calculators</h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted-foreground)]">
            <p>Start with the calculator that matches your decision: a loan payment, savings goal, investment return, budget, property estimate, or business metric.</p>
            <p>Use current US-dollar rates and fees when a tool asks for them. Calculator examples are not live market quotes unless the page clearly says it uses current external data.</p>
            <p>Results are planning estimates. Interest rates, taxes, fees, insurance, investment returns, and local rules can change the real outcome.</p>
          </div>
          <Link href="/categories/finance-calculators" className="mt-5 inline-flex items-center gap-2 font-semibold text-indigo-600">
            Browse all finance calculators <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        {/* Finance FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-amber-500" />
            Finance FAQ
          </h2>
          <div className="space-y-3">
            {[
              { q: 'Are Navorika finance calculators free?', a: 'Yes. The active calculators are free to use and do not require an account.' },
              { q: 'Do the calculators use current interest rates?', a: 'Most finance calculators use the rate you enter. If a tool uses live external data, the page identifies the source.' },
              { q: 'Can I use these calculators for US dollars?', a: 'Many general finance calculators support or display US dollars. Check the individual tool because some country-specific calculators use their own currency and rules.' },
              { q: 'Are investment returns guaranteed?', a: 'No. Investment calculators show scenarios based on the assumptions you enter. Actual returns, fees, taxes, and inflation can differ.' },
              { q: 'Can a calculator replace financial or tax advice?', a: 'No. Use the results for planning and comparison, and verify important decisions with current rules and a qualified professional when needed.' },
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)]">
                <h4 className="font-semibold text-sm">{item.q}</h4>
                <p className="text-sm text-[var(--muted-foreground)] mt-1">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
