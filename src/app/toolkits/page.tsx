import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Layers3 } from 'lucide-react';
import { getToolkitToolSlugs, toolkits } from '@/data/taxonomy';
import { toolsUnderReview } from '@/lib/seo/toolReview';

export const metadata: Metadata = {
  title: 'Toolkits and Workflow Collections',
  description: 'Browse Navorika tools grouped into useful workflows for construction, finance, health, documents, images, and web development.',
  alternates: { canonical: 'https://navorika.com/toolkits' },
};

export default function ToolkitsPage() {
  return <main className="min-h-screen pb-20 pt-16">
    <header className="mx-auto max-w-4xl text-center"><Layers3 className="mx-auto size-10 text-indigo-600" /><h1 className="mt-4 text-4xl font-black sm:text-5xl">Toolkits for complete workflows</h1><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[var(--muted-foreground)]">Start with a goal, then move between tools that support the same task without browsing a flat directory.</p></header>
    <section className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Available toolkits">
      {toolkits.map((toolkit) => {
        const count = getToolkitToolSlugs(toolkit).filter((slug) => !toolsUnderReview.has(slug)).length;
        return <Link key={toolkit.slug} href={`/toolkits/${toolkit.slug}`} className="group flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 transition hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-lg"><h2 className="text-xl font-bold group-hover:text-indigo-600">{toolkit.name}</h2><p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">{toolkit.description}</p><span className="mt-auto flex items-center justify-between pt-6 text-sm font-semibold"><span>{count} available tools</span><ArrowRight className="size-4" /></span></Link>;
      })}
    </section>
  </main>;
}
