'use client';

import Link from 'next/link';
import { ArrowRight, HeartPulse } from 'lucide-react';
import { tools } from '@/data/registry';

export default function HealthCalculatorsPage() {
  const healthTools = tools.filter(t => t.category === 'health-calculators');

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] py-16 px-6 lg:px-8 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Back Link */}
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-8"
        >
          <ArrowRight className="h-4 w-4 rotate-180" /> Back to Categories
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <HeartPulse className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-[var(--foreground)]">Health Calculators</h1>
              <p className="text-[var(--muted-foreground)] mt-1">
                {healthTools.length} zero-latency tools executing privately on your local machine.
              </p>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        {healthTools.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border-2 border-dashed border-[var(--border)] text-[var(--muted-foreground)] text-sm font-medium">
            No utilities deployed under this workspace yet. Ready for additions.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {healthTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group p-6 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-rose-500/40"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-black text-[var(--foreground)] group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                    {tool.title}
                  </h3>
                  <ArrowRight className="h-4 w-4 text-[var(--muted-foreground)] group-hover:text-rose-500 transition-colors" />
                </div>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                  {tool.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tool.keywords && tool.keywords.slice(0, 3).map((keyword) => (
                    <span
                      key={keyword}
                      className="px-2 py-1 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] text-[10px] font-bold uppercase tracking-wider"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
