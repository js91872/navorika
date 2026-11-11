import PageHelp from '@/components/seo/PageHelp';
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
  return (
    <div className="pb-20 pt-8 text-[#18181b] dark:text-[#f4f4f5]">
      <header className="mx-auto max-w-4xl text-center mb-10">
        <div className="mx-auto inline-flex p-3 rounded-xl bg-[#fff1f1] dark:bg-[#e5322d]/10 text-[#e5322d] mb-3">
          <Layers3 className="size-6" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#18181b] dark:text-white">
          Tool Collections for Common Tasks
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base sm:text-lg leading-relaxed text-[#5b5b63] dark:text-[#a1a1aa]">
          Need more than one tool for the same job? These collections group related calculators and utilities so they are easier to find.
        </p>
      </header>

      <section className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-12" aria-label="Available toolkits">
        {toolkits.map((toolkit) => {
          const count = getToolkitToolSlugs(toolkit).filter((slug) => !toolsUnderReview.has(slug)).length;
          return (
            <Link
              key={toolkit.slug}
              href={`/toolkits/${toolkit.slug}`}
              className="group flex flex-col justify-between rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-5 transition hover:border-[#e5322d] hover:shadow-md min-h-[160px]"
            >
              <div>
                <h2 className="text-lg font-bold text-[#18181b] dark:text-white group-hover:text-[#e5322d] transition-colors">
                  {toolkit.name}
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-[#5b5b63] dark:text-[#a1a1aa] line-clamp-3">
                  {toolkit.description}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#e4e4e8] dark:border-[#27272a]/60 flex items-center justify-between text-xs font-semibold text-[#e5322d]">
                <span>{count} tools</span>
                <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </section>

      <section className="mx-auto max-w-5xl rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-6 sm:p-8 shadow-xs">
        <h2 className="text-xl font-bold text-[#18181b] dark:text-white mb-2">
          Why use a tool collection?
        </h2>
        <div className="grid gap-4 text-sm leading-relaxed text-[#5b5b63] dark:text-[#a1a1aa] md:grid-cols-2">
          <p>
            Some jobs need more than one calculator or converter. A home project may involve measurements, materials, waste, and cost. A PDF job may involve merging, reordering, compression, and signing. These collections keep related tools together so you do not have to search for each step separately.
          </p>
          <p>
            Open the collection that matches your goal, then use only the tools you need. Each tool still has its own page, explanation, and limitations, so you can move from a broad task to a specific calculation or file operation without changing URLs or learning a complicated workflow.
          </p>
        </div>
      </section>
    <PageHelp path="/toolkits" />
    </div>
  );
}
