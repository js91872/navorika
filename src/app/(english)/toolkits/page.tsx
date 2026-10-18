import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Layers3 } from 'lucide-react';
import { getToolkitToolSlugs, toolkits } from '@/data/taxonomy';
import { toolsUnderReview } from '@/lib/seo/toolReview';

export const metadata: Metadata = {
  title: 'Free Tool Collections for Common Tasks',
  description: 'Browse related Navorika tools grouped by common tasks such as home projects, money planning, documents, images, and web work.',
  alternates: { canonical: 'https://navorika.com/toolkits' },
};

export default function ToolkitsPage() {
  return <main className="min-h-screen pb-20 pt-16">
    <header className="mx-auto max-w-4xl text-center"><Layers3 className="mx-auto size-10 text-indigo-600" /><h1 className="mt-4 text-4xl font-black sm:text-5xl">Tool Collections for Common Tasks</h1><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[var(--muted-foreground)]">Need more than one tool for the same job? These collections group related calculators and utilities so they are easier to find.</p></header>
    <section className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Available toolkits">
      {toolkits.map((toolkit) => {
        const count = getToolkitToolSlugs(toolkit).filter((slug) => !toolsUnderReview.has(slug)).length;
        return <Link key={toolkit.slug} href={`/toolkits/${toolkit.slug}`} className="group flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 transition hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-lg"><h2 className="text-xl font-bold group-hover:text-indigo-600">{toolkit.name}</h2><p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">{toolkit.description}</p><span className="mt-auto flex items-center justify-between pt-6 text-sm font-semibold"><span>{count} tools</span><ArrowRight className="size-4" /></span></Link>;
      })}
    </section>
    <section className="mx-auto mt-12 max-w-5xl rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
      <h2 className="text-2xl font-black">Why use a tool collection?</h2>
      <div className="mt-4 grid gap-5 text-sm leading-7 text-[var(--muted-foreground)] md:grid-cols-2">
        <p>Some jobs need more than one calculator or converter. A home project may involve measurements, materials, waste, and cost. A PDF job may involve merging, reordering, compression, and signing. These collections keep related tools together so you do not have to search for each step separately.</p>
        <p>Open the collection that matches your goal, then use only the tools you need. Each tool still has its own page, explanation, and limitations, so you can move from a broad task to a specific calculation or file operation without changing URLs or learning a complicated workflow.</p>
      </div>
    </section>
  </main>;
}
