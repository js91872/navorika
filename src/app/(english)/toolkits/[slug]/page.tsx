import PageHelp from '@/components/seo/PageHelp';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, BookOpen } from 'lucide-react';
import { tools } from '@/data/registry';
import { getToolkitToolSlugs, toolkits } from '@/data/taxonomy';
import { guidesMetadata } from '@/lib/guidesMetadata';
import { toolsUnderReview } from '@/lib/seo/toolReview';
import { getToolIcon } from '@/lib/toolIcons';

const baseUrl = 'https://navorika.com';
type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return toolkits.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const toolkit = toolkits.find((item) => item.slug === slug);
  if (!toolkit) return { title: 'Toolkit Not Found', robots: { index: false, follow: false } };
  const url = `${baseUrl}/toolkits/${toolkit.slug}`;
  return { title: toolkit.seoTitle, description: toolkit.description, alternates: { canonical: url }, openGraph: { type: 'website', url, title: toolkit.seoTitle, description: toolkit.description, siteName: 'Navorika' } };
}

export default async function ToolkitPage({ params }: Props) {
  const { slug } = await params;
  const toolkit = toolkits.find((item) => item.slug === slug);
  if (!toolkit) notFound();
  const visibleSlugs = getToolkitToolSlugs(toolkit).filter((slug) => !toolsUnderReview.has(slug));
  const toolkitTools = visibleSlugs.flatMap((slug) => {
    const tool = tools.find((item) => item.slug === slug);
    return tool ? [tool] : [];
  });
  const guides = toolkit.guideSlugs.flatMap((slug) => {
    const guide = guidesMetadata.find((item) => item.slug === slug);
    return guide ? [guide] : [];
  });
  const url = `${baseUrl}/toolkits/${toolkit.slug}`;
  const graph: Record<string, unknown>[] = [
    { '@type': 'CollectionPage', '@id': `${url}#collection`, name: toolkit.name, description: toolkit.description, url, mainEntity: { '@type': 'ItemList', numberOfItems: toolkitTools.length, itemListElement: toolkitTools.map((tool, index) => ({ '@type': 'ListItem', position: index + 1, name: tool.title, url: `${baseUrl}/tools/${tool.slug}` })) } },
    { '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Toolkits', item: `${baseUrl}/toolkits` },
      { '@type': 'ListItem', position: 3, name: toolkit.name, item: url },
    ] },
  ];
  if (toolkit.faqs?.length) graph.push({ '@type': 'FAQPage', '@id': `${url}#faq`, mainEntity: toolkit.faqs.map(({ question, answer }) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) });

  return (
    <div className="pb-20 pt-8 text-[#18181b] dark:text-[#f4f4f5]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replaceAll('<', '\\u003c') }} />
      <header className="mx-auto max-w-4xl text-center mb-10">
        <nav aria-label="Breadcrumb" className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-[#5b5b63] dark:text-[#a1a1aa]">
          <Link href="/" className="hover:text-[#e5322d]">Home</Link>
          <span>/</span>
          <Link href="/toolkits" className="hover:text-[#e5322d]">Toolkits</Link>
          <span>/</span>
          <span className="text-[#18181b] dark:text-white">{toolkit.name}</span>
        </nav>
        <p className="text-xs font-bold uppercase tracking-wider text-[#e5322d]">Related tools for one task</p>
        <h1 className="mt-2 text-balance text-3xl sm:text-5xl font-black tracking-tight text-[#18181b] dark:text-white">{toolkit.name}</h1>
        <p className="mx-auto mt-4 max-w-3xl text-base sm:text-lg leading-relaxed text-[#5b5b63] dark:text-[#a1a1aa]">{toolkit.intro}</p>
        <p className="mt-2 text-xs font-semibold text-[#5b5b63] dark:text-[#a1a1aa]">{toolkitTools.length} tools · {toolkit.groups.length} groups</p>
      </header>

      <div className="mx-auto max-w-5xl space-y-10">{toolkit.groups.map((group) => {
        const groupTools = toolkitTools.filter((tool) => group.toolSlugs.includes(tool.slug));
        if (!groupTools.length) return null;
        return (
          <section key={group.name}>
            <div className="max-w-3xl mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#18181b] dark:text-white">{group.name}</h2>
              <p className="mt-1 text-sm leading-relaxed text-[#5b5b63] dark:text-[#a1a1aa]">{group.description}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {groupTools.map((tool) => (
                <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-5 transition hover:border-[#e5322d] hover:shadow-md flex flex-col justify-between min-h-[140px]">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#fff1f1] dark:bg-[#e5322d]/10 text-xl text-[#e5322d]" aria-hidden="true">{getToolIcon(tool.slug) || '🔧'}</span>
                      <span className="text-[#5b5b63] dark:text-[#a1a1aa] group-hover:text-[#e5322d] group-hover:translate-x-0.5 transition-all">→</span>
                    </div>
                    <h3 className="font-semibold text-base text-[#18181b] dark:text-white group-hover:text-[#e5322d] transition-colors line-clamp-1">{tool.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#5b5b63] dark:text-[#a1a1aa]">{tool.description}</p>
                  </div>
                  <span className="mt-4 pt-3 border-t border-[#e4e4e8] dark:border-[#27272a]/60 inline-flex items-center gap-1 text-xs font-semibold text-[#e5322d]">{`Open ${tool.title}`} <ArrowRight className="size-3.5" /></span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}</div>

      <section className="mx-auto mt-14 max-w-5xl rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-6 sm:p-8 shadow-xs">
        <h2 className="text-xl font-bold text-[#18181b] dark:text-white mb-2">How to use this tool collection</h2>
        <div className="grid gap-4 text-sm leading-relaxed text-[#5b5b63] dark:text-[#a1a1aa] md:grid-cols-2">
          <p>Start with the part of the job you are doing now, not necessarily the first tool shown. Each group above covers a different step, so you can move between calculators or converters only when the next step is useful to you.</p>
          <p>Check the units, assumptions, and limitations on each tool page before using a result for purchasing, budgeting, health, construction, or another important decision. The collection is a navigation aid; each tool remains a separate calculator or utility with its own explanation.</p>
        </div>
      </section>

      {guides.length > 0 && (
        <section className="mx-auto mt-14 max-w-5xl border-t border-[#e4e4e8] dark:border-[#27272a] pt-10">
          <div className="flex items-center gap-2.5 mb-4">
            <BookOpen className="size-5 text-[#e5322d]" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#18181b] dark:text-white">Helpful guides</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {guides.map((guide) => (
              <Link key={guide.slug} href={`/guides/${guide.slug}`} className="group rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-4 transition hover:border-[#e5322d] hover:shadow-xs">
                <h3 className="font-semibold text-sm leading-snug text-[#18181b] dark:text-white group-hover:text-[#e5322d] transition-colors">{guide.title}</h3>
                <p className="mt-2 text-xs text-[#5b5b63] dark:text-[#a1a1aa]">{guide.readTime}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {toolkit.faqs?.length ? (
        <section className="mx-auto mt-14 max-w-4xl border-t border-[#e4e4e8] dark:border-[#27272a] pt-10">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#18181b] dark:text-white mb-4">Frequently asked questions</h2>
          <div className="space-y-3">
            {toolkit.faqs.map(({ question, answer }) => (
              <details key={question} className="rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-4 sm:p-5">
                <summary className="cursor-pointer font-semibold text-sm sm:text-base text-[#18181b] dark:text-white">{question}</summary>
                <p className="mt-2.5 text-sm leading-relaxed text-[#5b5b63] dark:text-[#a1a1aa]">{answer}</p>
              </details>
            ))}
          </div>
        </section>
      ) : null}
    <PageHelp path={`/toolkits/${slug}`} />
    </div>
  );
}
