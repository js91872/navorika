import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, BookOpen, Calendar, Clock, ListOrdered, RefreshCw, ShieldCheck, User } from 'lucide-react';
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

function slugifyHeading(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function renderInlineText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\`[^\`]+\`)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-semibold text-[var(--foreground)]">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index} className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-[0.9em] text-[var(--foreground)]">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

function renderContentBlock(text: string) {
  type Block =
    | { type: 'paragraph'; content: string }
    | { type: 'heading'; level: 3 | 4; content: string }
    | { type: 'ul'; items: string[] }
    | { type: 'ol'; items: string[] }
    | { type: 'table'; headers: string[]; rows: string[][] };

  const lines = text.split('\n');
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let listItems: string[] = [];
  let listType: 'ul' | 'ol' | null = null;
  let tableLines: string[] = [];

  const flushParagraph = () => {
    const content = paragraph.join(' ').trim();
    if (content) blocks.push({ type: 'paragraph', content });
    paragraph = [];
  };

  const flushList = () => {
    if (listType && listItems.length) blocks.push({ type: listType, items: [...listItems] });
    listItems = [];
    listType = null;
  };

  const flushTable = () => {
    if (tableLines.length >= 2) {
      const headers = tableLines[0].split('|').map((c) => c.trim()).filter(Boolean);
      const rows = tableLines
        .slice(1)
        .filter((row) => !/^\|?[\s:|-]+\|?$/.test(row.trim()))
        .map((row) => {
          const cells = row.split('|').map((c) => c.trim());
          if (row.trim().startsWith('|')) cells.shift();
          if (row.trim().endsWith('|')) cells.pop();
          return cells;
        });
      blocks.push({ type: 'table', headers, rows });
    }
    tableLines = [];
  };

  const flushAll = () => {
    flushParagraph();
    flushList();
    flushTable();
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushAll();
      continue;
    }

    if (line.startsWith('|') && line.endsWith('|')) {
      flushParagraph();
      flushList();
      tableLines.push(line);
      continue;
    }
    if (tableLines.length) flushTable();

    const heading = line.match(/^(###|####)\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'heading', level: heading[1] === '###' ? 3 : 4, content: heading[2] });
      continue;
    }

    const bullet = line.match(/^(?:[-*•])\s+(.+)$/);
    if (bullet) {
      flushParagraph();
      if (listType && listType !== 'ul') flushList();
      listType = 'ul';
      listItems.push(bullet[1]);
      continue;
    }

    const numbered = line.match(/^\d+[.)]\s+(.+)$/);
    if (numbered) {
      flushParagraph();
      if (listType && listType !== 'ol') flushList();
      listType = 'ol';
      listItems.push(numbered[1]);
      continue;
    }

    flushList();
    paragraph.push(line);
  }
  flushAll();

  return (
    <div className="space-y-5 text-[var(--muted-foreground)]">
      {blocks.map((block, idx) => {
        if (block.type === 'paragraph') {
          return <p key={idx} className="text-[1.02rem] leading-8">{renderInlineText(block.content)}</p>;
        }
        if (block.type === 'heading') {
          return block.level === 3
            ? <h3 key={idx} className="mt-9 text-xl font-bold tracking-tight text-[var(--foreground)] sm:text-2xl">{renderInlineText(block.content)}</h3>
            : <h4 key={idx} className="mt-7 text-lg font-bold text-[var(--foreground)]">{renderInlineText(block.content)}</h4>;
        }
        if (block.type === 'ul') {
          return (
            <ul key={idx} className="my-5 space-y-2.5 pl-6 text-[1.02rem] leading-8 marker:text-indigo-500">
              {block.items.map((item, itemIdx) => <li key={itemIdx} className="pl-1">{renderInlineText(item)}</li>)}
            </ul>
          );
        }
        if (block.type === 'ol') {
          return (
            <ol key={idx} className="my-5 list-decimal space-y-3 pl-7 text-[1.02rem] leading-8 marker:font-semibold marker:text-indigo-600">
              {block.items.map((item, itemIdx) => <li key={itemIdx} className="pl-1">{renderInlineText(item)}</li>)}
            </ol>
          );
        }
        return (
          <div key={idx} className="my-8 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-xs">
            <table className="min-w-full divide-y divide-[var(--border)] text-left text-sm">
              <thead className="bg-[var(--muted)]/60 text-[var(--foreground)]">
                <tr>
                  {block.headers.map((h, hIdx) => (
                    <th key={hIdx} className="whitespace-nowrap px-4 py-3.5 font-semibold">{renderInlineText(h)}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {block.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="align-top">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="min-w-36 px-4 py-3.5 leading-6">{renderInlineText(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

const printBleedGuideImages: Record<string, {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}> = {
  'The hierarchy of print geometry: Bleed, Trim, and Safe Area': {
    src: '/images/guides/navorika-print-bleed-trim-safe-area.png',
    alt: 'Diagram showing the bleed area outside the trim line and the safe area inside a printed page.',
    caption: 'Bleed extends artwork beyond the final trim line, while important text and logos stay inside the safe area.',
    width: 1536,
    height: 512,
  },
  'The document sizing formula: Moving from trim to total canvas': {
    src: '/images/guides/navorika-a5-3mm-bleed-size.png',
    alt: 'A5 print document diagram showing 3 mm bleed on each edge and a total document size of 154 by 216 mm.',
    caption: 'A5 example: adding 3 mm bleed to every edge increases the 148 × 210 mm trim size to a 154 × 216 mm document.',
    width: 738,
    height: 523,
  },
};

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
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        isPartOf: { '@type': 'WebSite', '@id': `${baseUrl}/#website` },
        headline: guide.title,
        description: guide.description,
        inLanguage: 'en-US',
        image: {
          '@type': 'ImageObject',
          '@id': `${url}#primaryimage`,
          url: `${baseUrl}${guide.featuredImage.src}`,
          width: 1200,
          height: 630,
          caption: guide.featuredImage.caption,
        },
        datePublished: guide.datePublished,
        dateModified: guide.dateModified,
        author: {
          '@type': 'Organization',
          '@id': `${baseUrl}/#organization`,
          name: guide.author,
          url: baseUrl,
        },
        publisher: {
          '@type': 'Organization',
          '@id': `${baseUrl}/#organization`,
          name: 'Navorika',
          url: baseUrl,
          logo: {
            '@type': 'ImageObject',
            '@id': `${baseUrl}/#logo`,
            url: `${baseUrl}/logo.svg`,
          },
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        articleSection: guide.category,
        keywords: guide.keywords.join(', '),
        citation: sources.map(({ url: sourceUrl }) => sourceUrl),
        isAccessibleForFree: true,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
          { '@type': 'ListItem', position: 2, name: 'Guides', item: `${baseUrl}/guides` },
          { '@type': 'ListItem', position: 3, name: guide.title, item: url },
        ],
      },
    ],
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replaceAll('<', '\\u003c') }} />
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-20 pb-16">
      <article className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl"><Link href="/guides" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted-foreground)] hover:text-indigo-600"><ArrowLeft className="h-4 w-4" /> Back to Guides</Link>
        </div><header className="mx-auto max-w-4xl">
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

        {(guide.category === 'Health' || guide.category === 'Finance') && <aside className="mx-auto max-w-3xl mt-8 flex gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-5 text-sm leading-6 text-[var(--muted-foreground)]"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" /><p>{guide.category === 'Health' ? 'Educational information only—not medical diagnosis or individualized treatment. Consult a qualified professional when personal health decisions or symptoms are involved.' : 'Educational estimates only—not individualized financial, investment, accounting, or tax advice. Verify current rules and important decisions with authoritative sources or a qualified professional.'}</p></aside>}

        {/* Table of Contents */}
        {content.sections.length > 2 && (
          <nav aria-label="Table of contents" className="not-prose mx-auto max-w-4xl mt-10 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xs">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <ListOrdered className="h-4 w-4" /> Table of contents
            </div>
            <ol className="mt-4 grid gap-2 sm:grid-cols-2 text-sm">
              {content.sections.map((section, sIdx) => {
                const sId = slugifyHeading(section.title);
                return (
                  <li key={section.title}>
                    <a href={`#${sId}`} className="text-[var(--muted-foreground)] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-baseline gap-2">
                      <span className="text-xs font-semibold text-indigo-600/70 dark:text-indigo-400/70">{sIdx + 1}.</span>
                      <span className="line-clamp-1">{section.title}</span>
                    </a>
                  </li>
                );
              })}
              <li>
                <a href="#key-takeaway" className="text-[var(--muted-foreground)] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-baseline gap-2">
                  <span className="text-xs font-semibold text-indigo-600/70 dark:text-indigo-400/70">•</span>
                  <span>Key takeaway</span>
                </a>
              </li>
              <li>
                <a href="#guide-faqs" className="text-[var(--muted-foreground)] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-baseline gap-2">
                  <span className="text-xs font-semibold text-indigo-600/70 dark:text-indigo-400/70">•</span>
                  <span>Frequently asked questions</span>
                </a>
              </li>
              <li>
                <a href="#guide-sources" className="text-[var(--muted-foreground)] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-baseline gap-2">
                  <span className="text-xs font-semibold text-indigo-600/70 dark:text-indigo-400/70">•</span>
                  <span>Sources & further reading</span>
                </a>
              </li>
              {relatedTools.length > 0 && (
                <li>
                  <a href="#related-tools" className="text-[var(--muted-foreground)] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-baseline gap-2">
                    <span className="text-xs font-semibold text-indigo-600/70 dark:text-indigo-400/70">•</span>
                    <span>Related tools</span>
                  </a>
                </li>
              )}
            </ol>
          </nav>
        )}

        <div className="prose prose-slate dark:prose-invert mx-auto mt-12 max-w-3xl break-words prose-headings:scroll-mt-24">
          <p className="lead mb-12 text-[1.16rem] leading-9 text-[var(--muted-foreground)] sm:text-xl">{content.intro}</p>
          {content.sections.map((section) => {
            const sectionImage =
              slug === 'print-bleed-trim-safe-area-guide'
                ? printBleedGuideImages[section.title]
                : undefined;

            const showCuttingToleranceDiagram =
              slug === 'print-bleed-trim-safe-area-guide' &&
              section.title === 'The hierarchy of print geometry: Bleed, Trim, and Safe Area';

            const sectionAnchor = slugifyHeading(section.title);

            return (
              <section key={section.title} className="mb-14">
                <h2 id={sectionAnchor} className="mb-5 mt-14 scroll-mt-24 border-t border-[var(--border)] pt-10 text-2xl font-black tracking-tight text-[var(--foreground)] sm:text-3xl">{section.title}</h2>

                {renderContentBlock(section.content)}

                {sectionImage && (
                  <figure className="not-prose my-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
                    <Image
                      src={sectionImage.src}
                      width={sectionImage.width}
                      height={sectionImage.height}
                      alt={sectionImage.alt}
                      className="h-auto w-full"
                      sizes="(max-width: 896px) 100vw, 896px"
                    />
                    <figcaption className="border-t border-[var(--border)] px-4 py-3 text-sm leading-6 text-[var(--muted-foreground)]">
                      {sectionImage.caption}
                    </figcaption>
                  </figure>
                )}

                {showCuttingToleranceDiagram && (
                  <figure className="not-prose my-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
                    <Image
                      src="/images/guides/navorika-why-print-bleed-is-necessary.png"
                      width={814}
                      height={523}
                      alt="Comparison showing how trimming artwork without bleed can leave a white edge while full bleed preserves edge-to-edge printing."
                      className="h-auto w-full"
                      sizes="(max-width: 896px) 100vw, 896px"
                    />
                    <figcaption className="border-t border-[var(--border)] px-4 py-3 text-sm leading-6 text-[var(--muted-foreground)]">
                      Why bleed matters: normal cutting variation can expose a white edge when artwork stops at the trim line.
                    </figcaption>
                  </figure>
                )}
              </section>
            );
          })}
          <div id="key-takeaway" className="not-prose mt-10 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-6 scroll-mt-24"><h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-300">Key takeaway</h2><p className="mt-2 leading-7 text-[var(--muted-foreground)]">{content.summary}</p></div>
        </div>

        <section className="mx-auto mt-14 max-w-4xl border-t border-[var(--border)] pt-12 scroll-mt-24" id="guide-faqs" aria-labelledby="guide-faqs-heading"><h2 id="guide-faqs-heading" className="text-3xl font-black">Frequently asked questions</h2><div className="mt-6 space-y-3">{content.faqs.map(({ question, answer }) => <details key={question} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 open:shadow-md"><summary className="cursor-pointer list-none pr-8 font-bold marker:content-none">{question}</summary><p className="mt-3 leading-7 text-[var(--muted-foreground)]">{answer}</p></details>)}</div></section>

        <section className="mx-auto mt-14 max-w-4xl border-t border-[var(--border)] pt-12 scroll-mt-24" id="guide-sources" aria-labelledby="guide-sources-heading"><h2 id="guide-sources-heading" className="text-2xl font-black">Sources and further reading</h2><ul className="mt-4 space-y-2 text-sm">{sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer" className="font-semibold text-indigo-600 hover:underline">{source.name}</a></li>)}</ul><p className="mt-4 text-sm leading-6 text-[var(--muted-foreground)]">Sources support the general explanations above. Rules, rates, standards, and professional guidance may change; verify the current source before acting.</p></section>

        {relatedTools.length > 0 && <section className="mx-auto mt-14 max-w-5xl border-t border-[var(--border)] pt-12 scroll-mt-24" id="related-tools" aria-labelledby="related-tools-heading"><h2 id="related-tools-heading" className="text-3xl font-black">Related tools</h2><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{relatedTools.map((tool) => <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-lg"><div className="flex min-w-0 items-start gap-3"><span className="text-2xl" aria-hidden="true">{getToolIcon(tool.slug) || '🔧'}</span><div className="min-w-0"><h3 className="break-words font-bold group-hover:text-indigo-600">{tool.title}</h3><p className="mt-1 line-clamp-2 text-sm text-[var(--muted-foreground)]">{tool.description}</p></div></div></Link>)}</div></section>}

        {relatedGuides.length > 0 && <section className="mx-auto mt-14 max-w-5xl border-t border-[var(--border)] pt-12 scroll-mt-24" id="related-guides" aria-labelledby="related-guides-heading"><h2 id="related-guides-heading" className="text-3xl font-black">Continue reading</h2><div className="mt-6 grid gap-4 md:grid-cols-3">{relatedGuides.map((item) => <Link key={item.slug} href={`/guides/${item.slug}`} className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:border-indigo-500/40 hover:shadow-lg"><h3 className="font-bold group-hover:text-indigo-600">{item.title}</h3><span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600">Read guide <ArrowRight className="h-4 w-4" /></span></Link>)}</div></section>}
      </article>
    </main>
  </>;
}
