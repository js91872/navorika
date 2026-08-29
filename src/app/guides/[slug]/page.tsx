import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Calendar, Clock, RefreshCw, ShieldCheck, User } from 'lucide-react';
import { tools, type RegisteredTool } from '@/data/registry';
import { getGuideContent } from '@/lib/guideContent';
import { getGuideTools } from '@/lib/guideTools';
import { getGuideMetadata, guidesMetadata } from '@/lib/guidesMetadata';
import { getGuideSources } from '@/lib/guideSources';
import { guideRelations } from '@/lib/guideRelations';
import { toolsUnderReview } from '@/lib/seo/toolReview';
import { getToolIcon } from '@/lib/toolIcons';

const baseUrl = 'https://navorika.com';
type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return guidesMetadata.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getGuideMetadata((await params).slug);
  if (!guide) return { title: 'Guide Not Found', robots: { index: false, follow: false } };
  const url = `${baseUrl}/guides/${guide.slug}`;
  return {
    title: guide.title,
    description: guide.description,
    keywords: guide.keywords,
    alternates: { canonical: url },
    authors: [{ name: guide.author, url: baseUrl }],
    category: guide.category,
    openGraph: { type: 'article', url, title: guide.title, description: guide.description, siteName: 'Navorika', publishedTime: guide.datePublished, modifiedTime: guide.dateModified, authors: [baseUrl], images: [{ url: guide.featuredImage.src, width: 1200, height: 630, alt: guide.featuredImage.alt }] },
    twitter: { card: 'summary_large_image', title: guide.title, description: guide.description, images: [{ url: guide.featuredImage.src, alt: guide.featuredImage.alt }] },
  };
}

function dateLabel(value: string) {
  return new Intl.DateTimeFormat('en', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));
}

export default async function GuidePage({ params }: Props) {
  const slug = (await params).slug;
  const guide = getGuideMetadata(slug);
  const content = getGuideContent(slug);
  if (!guide || !content) notFound();

  const relatedTools = getGuideTools(slug).map((toolSlug) => tools.find((tool) => tool.slug === toolSlug)).filter((tool): tool is RegisteredTool => Boolean(tool && !toolsUnderReview.has(tool.slug)));
  const curatedRelatedGuides = (guideRelations[slug] ?? []).flatMap((relatedSlug) => {
    const item = guidesMetadata.find((candidate) => candidate.slug === relatedSlug);
    return item ? [item] : [];
  });
  const relatedGuides = curatedRelatedGuides.length > 0
    ? curatedRelatedGuides.slice(0, 3)
    : guidesMetadata.filter((item) => item.category === guide.category && item.slug !== slug).slice(0, 3);
  const sources = getGuideSources(slug);
  const url = `${baseUrl}/guides/${slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Article', '@id': `${url}#article`, headline: guide.title, description: guide.description, image: { '@type': 'ImageObject', url: `${baseUrl}${guide.featuredImage.src}`, width: 1200, height: 630, caption: guide.featuredImage.caption }, datePublished: guide.datePublished, dateModified: guide.dateModified, author: { '@type': 'Organization', name: guide.author, url: baseUrl }, publisher: { '@type': 'Organization', name: 'Navorika', url: baseUrl, logo: { '@type': 'ImageObject', url: `${baseUrl}/logo.svg` } }, mainEntityOfPage: { '@type': 'WebPage', '@id': url }, articleSection: guide.category, keywords: guide.keywords.join(', '), citation: sources.map(({ url: sourceUrl }) => sourceUrl), isAccessibleForFree: true },
      { '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl }, { '@type': 'ListItem', position: 2, name: 'Guides', item: `${baseUrl}/guides` }, { '@type': 'ListItem', position: 3, name: guide.title, item: url }] },
    ],
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replaceAll('<', '\\u003c') }} />
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-20 pb-16">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/guides" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted-foreground)] hover:text-indigo-600"><ArrowLeft className="h-4 w-4" /> Back to Guides</Link>
        <header>
          <span className="inline-flex rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400">{guide.category}</span>
          <h1 className="mt-4 text-balance text-4xl font-black tracking-tight sm:text-5xl">{guide.title}</h1>
          <p className="mt-5 text-xl leading-8 text-[var(--muted-foreground)]">{guide.description}</p>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--muted-foreground)]">
            <span className="flex items-center gap-2"><User className="h-4 w-4" /> {guide.author}</span>
            <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Published {dateLabel(guide.datePublished)}</span>
            <span className="flex items-center gap-2"><RefreshCw className="h-4 w-4" /> Updated {dateLabel(guide.dateModified)}</span>
            <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> {guide.readTime}</span>
          </div>
          <figure className="mt-8 overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-xl">
            <Image src={guide.featuredImage.src} width={1200} height={630} alt={guide.featuredImage.alt} priority className="h-auto w-full" sizes="(max-width: 896px) 100vw, 896px" />
            <figcaption className="border-t border-[var(--border)] px-5 py-3 text-sm text-[var(--muted-foreground)]">{guide.featuredImage.caption}</figcaption>
          </figure>
        </header>

        {(guide.category === 'Health' || guide.category === 'Finance') && <aside className="mt-8 flex gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-5 text-sm leading-6 text-[var(--muted-foreground)]"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" /><p>{guide.category === 'Health' ? 'Educational information only—not medical diagnosis or individualized treatment. Consult a qualified professional when personal health decisions or symptoms are involved.' : 'Educational estimates only—not individualized financial, investment, accounting, or tax advice. Verify current rules and important decisions with authoritative sources or a qualified professional.'}</p></aside>}

        <div className="prose prose-slate dark:prose-invert mt-10 max-w-none break-words prose-headings:scroll-mt-24 prose-p:leading-8">
          <p className="lead text-xl leading-8 text-[var(--muted-foreground)]">{content.intro}</p>
          {content.sections.map((section) => <section key={section.title}><h2>{section.title}</h2><div className="whitespace-pre-line leading-8 text-[var(--muted-foreground)]">{section.content}</div></section>)}
          <div className="not-prose mt-10 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-6"><h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-300">Key takeaway</h2><p className="mt-2 leading-7 text-[var(--muted-foreground)]">{content.summary}</p></div>
        </div>

        <section className="mt-14 border-t border-[var(--border)] pt-12" aria-labelledby="guide-faqs"><h2 id="guide-faqs" className="text-3xl font-black">Frequently asked questions</h2><div className="mt-6 space-y-3">{content.faqs.map(({ question, answer }) => <details key={question} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 open:shadow-md"><summary className="cursor-pointer list-none pr-8 font-bold marker:content-none">{question}</summary><p className="mt-3 leading-7 text-[var(--muted-foreground)]">{answer}</p></details>)}</div></section>

        <section className="mt-14 border-t border-[var(--border)] pt-12" aria-labelledby="guide-sources"><h2 id="guide-sources" className="text-2xl font-black">Sources and further reading</h2><ul className="mt-4 space-y-2 text-sm">{sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer" className="font-semibold text-indigo-600 hover:underline">{source.name}</a></li>)}</ul><p className="mt-4 text-sm leading-6 text-[var(--muted-foreground)]">Sources support the general explanations above. Rules, rates, standards, and professional guidance may change; verify the current source before acting.</p></section>

        {relatedTools.length > 0 && <section className="mt-14 border-t border-[var(--border)] pt-12" aria-labelledby="related-tools"><h2 id="related-tools" className="text-3xl font-black">Related tools</h2><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{relatedTools.map((tool) => <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-lg"><div className="flex min-w-0 items-start gap-3"><span className="text-2xl" aria-hidden="true">{getToolIcon(tool.slug) || '🔧'}</span><div className="min-w-0"><h3 className="break-words font-bold group-hover:text-indigo-600">{tool.title}</h3><p className="mt-1 line-clamp-2 text-sm text-[var(--muted-foreground)]">{tool.description}</p></div></div></Link>)}</div></section>}

        {relatedGuides.length > 0 && <section className="mt-14 border-t border-[var(--border)] pt-12" aria-labelledby="related-guides"><h2 id="related-guides" className="text-3xl font-black">Continue reading</h2><div className="mt-6 grid gap-4 md:grid-cols-3">{relatedGuides.map((item) => <Link key={item.slug} href={`/guides/${item.slug}`} className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:border-indigo-500/40 hover:shadow-lg"><h3 className="font-bold group-hover:text-indigo-600">{item.title}</h3><span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600">Read guide <ArrowRight className="h-4 w-4" /></span></Link>)}</div></section>}
      </article>
    </main>
  </>;
}
