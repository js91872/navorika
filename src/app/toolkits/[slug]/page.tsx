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

  return <main className="min-h-screen pb-20 pt-16">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replaceAll('<', '\\u003c') }} />
    <header className="mx-auto max-w-4xl text-center"><p className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Navorika toolkit</p><h1 className="mt-3 text-balance text-4xl font-black tracking-tight sm:text-5xl">{toolkit.name}</h1><p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-[var(--muted-foreground)]">{toolkit.intro}</p><p className="mt-4 text-sm font-semibold text-[var(--muted-foreground)]">{toolkitTools.length} available tools · {toolkit.groups.length} workflow stages</p></header>

    <div className="mx-auto mt-14 max-w-5xl space-y-12">{toolkit.groups.map((group) => {
      const groupTools = toolkitTools.filter((tool) => group.toolSlugs.includes(tool.slug));
      if (!groupTools.length) return null;
      return <section key={group.name}><h2 className="text-2xl font-black">{group.name}</h2><p className="mt-2 max-w-3xl leading-7 text-[var(--muted-foreground)]">{group.description}</p><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{groupTools.map((tool) => <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-lg"><div className="flex items-start gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-indigo-500/10 text-2xl" aria-hidden="true">{getToolIcon(tool.slug) || '🔧'}</span><div><h3 className="font-bold group-hover:text-indigo-600">{tool.title}</h3><p className="mt-1 line-clamp-3 text-sm leading-6 text-[var(--muted-foreground)]">{tool.description}</p></div></div><span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600">Open tool <ArrowRight className="size-4" /></span></Link>)}</div></section>;
    })}</div>

    {guides.length > 0 && <section className="mx-auto mt-16 max-w-5xl border-t border-[var(--border)] pt-12"><div className="flex items-center gap-3"><BookOpen className="size-6 text-violet-600" /><h2 className="text-2xl font-black">Guides for this workflow</h2></div><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{guides.map((guide) => <Link key={guide.slug} href={`/guides/${guide.slug}`} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:border-violet-500/40 hover:shadow-lg"><h3 className="font-bold leading-6">{guide.title}</h3><p className="mt-3 text-sm text-[var(--muted-foreground)]">{guide.readTime}</p></Link>)}</div></section>}

    {toolkit.faqs?.length ? <section className="mx-auto mt-16 max-w-4xl border-t border-[var(--border)] pt-12"><h2 className="text-2xl font-black">Frequently asked questions</h2><div className="mt-5 space-y-3">{toolkit.faqs.map(({ question, answer }) => <details key={question} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"><summary className="cursor-pointer font-bold">{question}</summary><p className="mt-3 leading-7 text-[var(--muted-foreground)]">{answer}</p></details>)}</div></section> : null}
  </main>;
}
