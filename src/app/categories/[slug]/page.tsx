import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, BookOpen, Layers3 } from 'lucide-react';
import { categories, tools } from '@/data/registry';
import { getClustersForCategory, getToolkitsForCategory } from '@/data/taxonomy';
import { guidesMetadata } from '@/lib/guidesMetadata';
import { toolsUnderReview } from '@/lib/seo/toolReview';
import { getToolIcon } from '@/lib/toolIcons';

const baseUrl = 'https://navorika.com';

const categoryIntros: Record<string, string> = {
  'pdf-tools': 'Organize, prepare, convert, and sign documents through focused browser workflows. Tools temporarily under review are excluded until their behavior is validated.',
  'image-tools': 'Prepare images for web, print, identity, and social use by choosing the right format, dimensions, quality, and editing workflow.',
  'finance-calculators': 'Explore borrowing, investing, tax, budgeting, and retirement scenarios. Results are planning estimates and not individualized financial advice.',
  'health-calculators': 'Use body, energy, activity, and heart-rate estimates as educational screening and planning aids—not as medical diagnoses.',
  'developer-tools': 'Format data, inspect encoded values, test patterns, and prepare web publishing assets with focused developer utilities.',
  'construction-calculators': 'Estimate materials, quantities, measurements, and project costs for construction, repairs, and home improvement.',
  'everyday-calculators': 'Use practical calculators for shipping, travel, shopping, household planning, time, and everyday decisions.',
};

const categorySeo: Record<string, { title: string; description: string }> = {
  'pdf-tools': {
    title: 'Free PDF Tools – Merge, Split, Compress & Convert PDFs',
    description: 'Free online PDF tools to merge, split, compress, rotate, edit, convert, and organize PDF files. Many tools run privately in your browser.',
  },
  'image-tools': {
    title: 'Free Image Tools – Resize, Convert, Compress & Edit Images',
    description: 'Free online image tools to resize, convert, compress, crop, edit, and prepare JPG, PNG, WebP, HEIC, and SVG files.',
  },
  'finance-calculators': {
    title: 'Free Finance Calculators – Loans, Savings, Tax & Investing',
    description: 'Free finance calculators for loans, savings, investing, budgeting, retirement, tax, and everyday money planning.',
  },
  'health-calculators': {
    title: 'Free Health Calculators – Calories, BMI, Fitness & Heart Rate',
    description: 'Free health and fitness calculators for calories, BMI, BMR, TDEE, body fat, heart rate, hydration, and activity estimates.',
  },
  'developer-tools': {
    title: 'Free Developer Tools – JSON, Code, Network & Web Utilities',
    description: 'Free developer tools for JSON, YAML, Base64, JWT, regex, networking, timestamps, code formatting, and web development tasks.',
  },
  'construction-calculators': {
    title: 'Free Construction Calculators – Materials, Cost & Measurements',
    description: 'Free construction and home improvement calculators for concrete, bricks, flooring, roofing, paint, materials, measurements, and project costs.',
  },
  'everyday-calculators': {
    title: 'Free Everyday Calculators – Shipping, Travel, Shopping & Planning',
    description: 'Free everyday calculators for shipping, travel, shopping, household planning, time, and practical day-to-day decisions.',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) return { title: 'Category Not Found', robots: { index: false, follow: false } };
  const seo = categorySeo[slug] ?? { title: category.name, description: category.description };
  const url = `${baseUrl}/categories/${slug}`;
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: url },
    openGraph: { type: 'website', url, title: seo.title, description: seo.description, siteName: 'Navorika' },
    twitter: { card: 'summary_large_image', title: seo.title, description: seo.description },
  };
}

const guideCategory: Record<string, string> = {
  'pdf-tools': 'PDF', 'image-tools': 'Image', 'finance-calculators': 'Finance',
  'health-calculators': 'Health', 'developer-tools': 'Developer',
  'construction-calculators': 'Construction', 'everyday-calculators': 'Everyday',
};

export function generateStaticParams() {
  return categories.map(({ slug }) => ({ slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();

  const categoryTools = tools.filter((tool) => tool.category === slug && !toolsUnderReview.has(tool.slug));
  const categoryClusters = getClustersForCategory(slug)
    .map((cluster) => ({ ...cluster, tools: categoryTools.filter((tool) => cluster.toolSlugs.includes(tool.slug)) }))
    .filter((cluster) => cluster.tools.length > 0);
  const categoryToolkits = getToolkitsForCategory(slug);
  const relatedGuides = guidesMetadata.filter((guide) => guide.category === guideCategory[slug]).slice(0, 4);
  const url = `${baseUrl}/categories/${slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', '@id': `${url}#collection`, name: category.name, description: category.description, url, mainEntity: { '@type': 'ItemList', numberOfItems: categoryTools.length, itemListElement: categoryTools.map((tool, index) => ({ '@type': 'ListItem', position: index + 1, name: tool.title, url: `${baseUrl}/tools/${tool.slug}` })) } },
      { '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
        { '@type': 'ListItem', position: 2, name: 'Categories', item: `${baseUrl}/categories` },
        { '@type': 'ListItem', position: 3, name: category.name, item: url },
      ] },
    ],
  };

  return (
    <main className="min-h-screen pb-20 pt-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replaceAll('<', '\\u003c') }} />
      <header className="mx-auto max-w-5xl">
        <p className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Free online tools</p>
        <h1 className="mt-3 text-balance text-4xl font-black tracking-tight sm:text-5xl">{category.name}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--muted-foreground)]">{categoryIntros[slug] ?? category.description}</p>
        <p className="mt-3 text-sm font-semibold text-[var(--muted-foreground)]">{categoryTools.length} free tools in {categoryClusters.length} groups</p>
      </header>

      {categoryToolkits.length > 0 && <section className="mx-auto mt-12 max-w-5xl" aria-labelledby="category-toolkits">
        <div className="flex items-center gap-3"><Layers3 className="size-6 text-indigo-600" /><h2 id="category-toolkits" className="text-2xl font-black">Start with a common task</h2></div>
        <p className="mt-2 text-[var(--muted-foreground)]">These collections group tools that are useful for the same job.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {categoryToolkits.map((toolkit) => <Link key={toolkit.slug} href={`/toolkits/${toolkit.slug}`} className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 transition hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-lg">
            <h3 className="text-lg font-bold group-hover:text-indigo-600">{toolkit.name}</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">{toolkit.description}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600">Explore toolkit <ArrowRight className="size-4" /></span>
          </Link>)}
        </div>
      </section>}

      <section className="mx-auto mt-14 max-w-5xl" aria-labelledby="category-clusters">
        <h2 id="category-clusters" className="text-3xl font-black">Browse tools</h2>
        <div className="mt-7 space-y-10">
          {categoryClusters.map((cluster) => <section key={cluster.id} id={cluster.id} className="scroll-mt-24">
            <div className="max-w-3xl"><h3 className="text-2xl font-bold">{cluster.name}</h3><p className="mt-2 leading-7 text-[var(--muted-foreground)]">{cluster.description}</p></div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cluster.tools.map((tool) => <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-lg">
                <div className="flex items-start gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-indigo-500/10 text-2xl" aria-hidden="true">{getToolIcon(tool.slug) || '🔧'}</span><div><h4 className="font-bold group-hover:text-indigo-600">{tool.title}</h4><p className="mt-1 line-clamp-3 text-sm leading-6 text-[var(--muted-foreground)]">{tool.description}</p></div></div>
              </Link>)}
            </div>
          </section>)}
        </div>
      </section>

      {relatedGuides.length > 0 && <section className="mx-auto mt-16 max-w-5xl border-t border-[var(--border)] pt-12" aria-labelledby="category-guides">
        <div className="flex items-center gap-3"><BookOpen className="size-6 text-violet-600" /><h2 id="category-guides" className="text-2xl font-black">Useful guides</h2></div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{relatedGuides.map((guide) => <Link key={guide.slug} href={`/guides/${guide.slug}`} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:border-violet-500/40 hover:shadow-lg"><h3 className="font-bold leading-6">{guide.title}</h3><p className="mt-3 text-sm text-[var(--muted-foreground)]">{guide.readTime}</p></Link>)}</div>
      </section>}
    </main>
  );
}
