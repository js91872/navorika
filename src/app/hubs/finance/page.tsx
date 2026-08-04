'use client';

import Link from 'next/link';
import { ArrowRight, Calculator, BookOpen, Sparkles } from 'lucide-react';
import { tools } from '@/data/registry';

export default function FinanceHub() {
  const financeTools = tools.filter(t => t.category === 'finance-calculators');
  const financeArticles = [
    { title: 'How to Calculate SIP Returns', slug: 'how-to-calculate-sip-returns' },
    { title: 'Understanding EMI Calculations', slug: 'understanding-emi-calculations' },
    { title: 'GST Compliance Guide', slug: 'gst-compliance-guide' },
    { title: 'PPF vs FD: Where to Invest', slug: 'ppf-vs-fd-where-to-invest' },
    { title: 'Income Tax Planning Tips', slug: 'income-tax-planning-tips' },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black tracking-tight mb-4">
            Finance Hub
            <span className="text-[var(--muted-foreground)] text-2xl font-normal ml-3">
              — Calculators, Guides & Resources
            </span>
          </h1>
          <p className="text-[var(--muted-foreground)] text-lg max-w-2xl">
            Everything you need for financial planning: calculators, guides, and expert insights.
            All tools are 100% free and client-side.
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

        {/* Finance Guides */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-indigo-500" />
            Finance Guides
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {financeArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/guides/${article.slug}`}
                className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-indigo-500/40 transition-all group"
              >
                <h3 className="font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {article.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>

        {/* Finance FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-amber-500" />
            Finance FAQ
          </h2>
          <div className="space-y-3">
            {[
              { q: 'What is the best way to save for retirement?', a: 'The best way is to start early, invest regularly, and diversify across PPF, NPS, and mutual funds.' },
              { q: 'How much should I invest in PPF?', a: 'The maximum is ₹1.5 lakh per year, which is tax-deductible under Section 80C.' },
              { q: 'What is the difference between FD and RD?', a: 'FD is a lump sum deposit, while RD is a recurring monthly deposit.' },
              { q: 'How is income tax calculated in India?', a: 'Income tax is calculated based on income slabs, with deductions available under Section 80C, 80D, etc.' },
              { q: 'What is GST and how does it work?', a: 'GST is a comprehensive indirect tax on goods and services, divided into CGST, SGST, and IGST.' },
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
