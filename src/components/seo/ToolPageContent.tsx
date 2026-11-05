import Link from 'next/link';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import { guidesMetadata } from '@/lib/guidesMetadata';
import { getToolIcon } from '@/lib/toolIcons';
import { createToolJsonLd, type ToolPageContent as ToolContent } from '@/lib/seo/toolPage';
import { complementaryTools, getClusterForTool, getRelatedTools, getToolkitsForTool } from '@/data/taxonomy';
import { tools } from '@/data/registry';
import { toolsUnderReview } from '@/lib/seo/toolReview';
import { toolUx } from '@/data/toolUx';
import { buildWorkflowItems } from '@/lib/toolWorkflow';

export default function ToolPageContent({ tool, supplementalOnly = false }: { tool: ToolContent; supplementalOnly?: boolean }) {
  const guides = tool.relatedGuides.flatMap((slug) => {
    const guide = guidesMetadata.find((item) => item.slug === slug);
    return guide ? [guide] : [];
  });
  const cluster = getClusterForTool(tool.slug);
  const toolkits = getToolkitsForTool(tool.slug);
  const useWithTools = buildWorkflowItems(
    tool.slug,
    complementaryTools[tool.slug] ?? [],
    tools.filter(({ slug }) => !toolsUnderReview.has(slug)),
    toolUx[tool.slug]?.workflowLabels,
  );
  const workflowSlugs = new Set(useWithTools.map(({ slug }) => slug));
  const relatedTools = getRelatedTools(tool.slug, 10, tool.relatedTools.map(({ slug }) => slug))
    .filter(({ slug }) => !workflowSlugs.has(slug))
    .slice(0, 6);

  return (
    <article className="mx-auto max-w-4xl space-y-10 pb-20 pt-12 text-[#5b5b63] dark:text-[#a1a1aa]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(createToolJsonLd(tool)).replaceAll('<', '\\u003c') }} />

      {useWithTools.length > 0 && (
        <section aria-labelledby={`${tool.slug}-workflow-title`}>
          <p className="text-xs font-bold uppercase tracking-wider text-[#e5322d] dark:text-[#ff6b68]">Suggested next steps</p>
          <h2 id={`${tool.slug}-workflow-title`} className="mt-1 text-xl sm:text-2xl font-bold text-[#18181b] dark:text-white">Continue this workflow</h2>
          <p className="mt-1.5 text-xs sm:text-sm leading-relaxed">Use these before or after this tool to finish the same task.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {useWithTools.map((item) => (
              <Link key={item.slug} href={`/tools/${item.slug}`} className="group flex min-h-14 items-center gap-3.5 rounded-xl border border-[#e5322d]/20 bg-[#fff1f1] dark:bg-[#e5322d]/10 p-3.5 transition-all hover:border-[#e5322d]/50 hover:shadow-xs">
                <span className="grid size-10 place-items-center rounded-lg bg-[#e5322d]/10 text-xl" aria-hidden="true">{getToolIcon(item.slug)}</span>
                <span className="font-semibold text-sm text-[#18181b] dark:text-white group-hover:text-[#e5322d] dark:group-hover:text-[#ff6b68] transition-colors">{item.label}</span>
                <ArrowUpRight className="ml-auto size-4 text-[#e5322d] shrink-0" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {!supplementalOnly && <>
      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-[#18181b] dark:text-white">About this tool</h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-[#5b5b63] dark:text-[#a1a1aa]">
          {tool.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </section>

      {tool.formula && (
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-[#18181b] dark:text-white">Calculation method and key details</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {tool.formula.map(({ title, body }) => (
              <div key={title} className="rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-5 shadow-xs">
                <h3 className="font-bold text-sm text-[#18181b] dark:text-white">{title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#5b5b63] dark:text-[#a1a1aa]">{body}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-[#18181b] dark:text-white">Steps to use this tool</h2>
        <ol className="mt-4 grid gap-2.5">
          {tool.steps.map((step, index) => (
            <li key={step} className="flex gap-3.5 rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-3.5 text-xs sm:text-sm shadow-xs">
              <span className="grid size-6 shrink-0 place-items-center rounded-md bg-[#fff1f1] dark:bg-[#e5322d]/10 text-xs font-bold text-[#e5322d]">{index + 1}</span>
              <span className="pt-0.5 leading-relaxed text-[#5b5b63] dark:text-[#a1a1aa]">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-[#18181b] dark:text-white">Understanding the results</h2>
        <div className="mt-3 space-y-2.5">
          {tool.interpretation.map((item) => (
            <p key={item} className="rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-3.5 text-xs sm:text-sm leading-relaxed text-[#5b5b63] dark:text-[#a1a1aa] shadow-xs">{item}</p>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-5">
        <h2 className="text-base font-bold text-[#18181b] dark:text-white">Limits and assumptions</h2>
        <ul className="mt-2.5 list-disc space-y-1.5 pl-5 text-xs sm:text-sm leading-relaxed text-[#5b5b63] dark:text-[#a1a1aa]">
          {tool.limitations.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      </>}

      {(cluster || toolkits.length > 0) && (
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-[#18181b] dark:text-white">Explore this topic</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {cluster && (
              <Link href={`/categories/${cluster.category}#${cluster.id}`} className="rounded-lg border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] px-3.5 py-1.5 text-xs font-semibold text-[#18181b] dark:text-white hover:border-[#e5322d] hover:text-[#e5322d] transition-colors">
                {cluster.name}
              </Link>
            )}
            {toolkits.map((toolkit) => (
              <Link key={toolkit.slug} href={`/toolkits/${toolkit.slug}`} className="rounded-lg border border-[#e4e4e8] dark:border-[#27272a] bg-[#fff1f1] dark:bg-[#e5322d]/10 px-3.5 py-1.5 text-xs font-semibold text-[#e5322d] hover:border-[#e5322d] transition-colors">
                {toolkit.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {tool.faqs.length > 0 && <section>
        <h2 className="text-xl sm:text-2xl font-bold text-[#18181b] dark:text-white mb-3">Frequently asked questions</h2>
        <div className="divide-y divide-[#e4e4e8] dark:divide-[#27272a] rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] px-5 shadow-xs">
          {tool.faqs.map(({ question, answer }) => (
            <details key={question} className="py-4">
              <summary className="cursor-pointer font-semibold text-sm sm:text-base text-[#18181b] dark:text-white">{question}</summary>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#5b5b63] dark:text-[#a1a1aa]">{answer}</p>
            </details>
          ))}
        </div>
      </section>}

      {relatedTools.length > 0 && (
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-[#18181b] dark:text-white">Related tools</h2>
          <p className="mt-1 text-xs sm:text-sm leading-relaxed text-[#5b5b63] dark:text-[#a1a1aa]">More tools that may help with the same task.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {relatedTools.map((item) => (
              <Link key={item.slug} href={`/tools/${item.slug}`} className="group flex items-center gap-3.5 rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-3.5 transition hover:border-[#e5322d] hover:shadow-xs">
                <span className="grid size-10 place-items-center rounded-lg bg-[#fff1f1] dark:bg-[#e5322d]/10 text-xl text-[#e5322d]">{getToolIcon(item.slug)}</span>
                <span className="font-semibold text-sm text-[#18181b] dark:text-white group-hover:text-[#e5322d] transition-colors">{item.title}</span>
                <ArrowUpRight className="ml-auto size-4 text-[#5b5b63] dark:text-[#a1a1aa] group-hover:text-[#e5322d] transition-colors" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {guides.length > 0 && (
        <section>
          <div className="flex items-end justify-between gap-4 mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#e5322d]">Learn more</p>
              <h2 className="mt-1 text-xl sm:text-2xl font-bold text-[#18181b] dark:text-white">Related guides</h2>
            </div>
            <Link href="/guides" className="text-xs font-semibold text-[#e5322d] hover:underline">View all guides →</Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <Link key={guide.slug} href={`/guides/${guide.slug}`} className="group flex flex-col justify-between rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-4 transition hover:border-[#e5322d] hover:shadow-xs min-h-[130px]">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#e5322d] mb-1.5"><BookOpen className="size-3.5" /> Guide</span>
                  <h3 className="font-semibold text-sm leading-snug text-[#18181b] dark:text-white group-hover:text-[#e5322d] transition-colors line-clamp-2">{guide.title}</h3>
                  <p className="mt-1 text-xs text-[#5b5b63] dark:text-[#a1a1aa] line-clamp-2 leading-relaxed">{guide.description}</p>
                </div>
                <span className="mt-3 pt-2 border-t border-[#e4e4e8] dark:border-[#27272a]/60 text-[11px] font-medium text-[#5b5b63] dark:text-[#a1a1aa]">{guide.readTime}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
