import Link from 'next/link';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import { guidesMetadata } from '@/lib/guidesMetadata';
import { getToolIcon } from '@/lib/toolIcons';
import { createToolJsonLd, type ToolPageContent as ToolContent } from '@/lib/seo/toolPage';

export default function ToolPageContent({ tool }: { tool: ToolContent }) {
  const guides = tool.relatedGuides.flatMap((slug) => {
    const guide = guidesMetadata.find((item) => item.slug === slug);
    return guide ? [guide] : [];
  });

  return (
    <article className="mx-auto max-w-4xl space-y-12 pb-20 pt-14 text-[var(--muted-foreground)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(createToolJsonLd(tool)) }} />
      <section><h2 className="text-2xl font-bold text-[var(--foreground)]">About {tool.name}</h2><div className="mt-4 space-y-4 leading-7">{tool.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></section>

      {tool.formula && <section><h2 className="text-2xl font-bold text-[var(--foreground)]">How the calculation works</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">{tool.formula.map(({ title, body }) => <div key={title} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6"><h3 className="font-bold text-[var(--foreground)]">{title}</h3><p className="mt-2 text-sm leading-6">{body}</p></div>)}</div></section>}

      <section><h2 className="text-2xl font-bold text-[var(--foreground)]">How to use this calculator</h2><ol className="mt-4 grid gap-3">{tool.steps.map((step, index) => <li key={step} className="flex gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-indigo-500/10 text-sm font-bold text-indigo-600 dark:text-indigo-400">{index + 1}</span><span className="pt-1 text-sm leading-6">{step}</span></li>)}</ol></section>

      <section><h2 className="text-2xl font-bold text-[var(--foreground)]">Understanding the result</h2><div className="mt-4 space-y-3">{tool.interpretation.map((item) => <p key={item} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm leading-6">{item}</p>)}</div></section>

      <section className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-6"><h2 className="text-xl font-bold text-[var(--foreground)]">Important limitations</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6">{tool.limitations.map((item) => <li key={item}>{item}</li>)}</ul></section>

      <section><h2 className="text-2xl font-bold text-[var(--foreground)]">Frequently asked questions</h2><div className="mt-4 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-[var(--card)] px-6">{tool.faqs.map(({ question, answer }) => <details key={question} className="py-5"><summary className="cursor-pointer font-semibold text-[var(--foreground)]">{question}</summary><p className="mt-3 text-sm leading-6">{answer}</p></details>)}</div></section>

      <section><h2 className="text-2xl font-bold text-[var(--foreground)]">Related tools</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{tool.relatedTools.map(({ slug, name }) => <Link key={slug} href={`/tools/${slug}`} className="group flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 transition-all hover:-translate-y-0.5 hover:border-indigo-500/50"><span className="grid size-11 place-items-center rounded-xl bg-indigo-500/10 text-2xl">{getToolIcon(slug)}</span><span className="font-semibold text-[var(--foreground)]">{name}</span><ArrowUpRight className="ml-auto size-4" /></Link>)}</div></section>

      {guides.length > 0 && <section><div className="flex items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Learn more</p><h2 className="mt-1 text-2xl font-bold text-[var(--foreground)]">Related guides</h2></div><Link href="/guides" className="text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-400">View all guides</Link></div><div className="mt-4 grid gap-4 lg:grid-cols-3">{guides.map((guide) => <Link key={guide.slug} href={`/guides/${guide.slug}`} className="group flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition-all hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-lg"><span className="grid size-10 place-items-center rounded-xl bg-violet-500/10 text-violet-600"><BookOpen className="size-5" /></span><h3 className="mt-4 font-bold leading-6 text-[var(--foreground)]">{guide.title}</h3><p className="mt-2 text-sm leading-6">{guide.description}</p><span className="mt-auto pt-4 text-xs font-semibold">{guide.readTime}</span></Link>)}</div></section>}
    </article>
  );
}
