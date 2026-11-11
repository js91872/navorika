import PageHelp from '@/components/seo/PageHelp';
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
  'pdf-tools': 'Merge, split, compress, convert, sign, and organize PDF files with free online tools. Tools under review stay hidden until they are ready.',
  'image-tools': 'Resize, convert, compress, crop, inspect, and prepare images for websites, printing, social media, documents, and everyday use.',
  'finance-calculators': 'Explore borrowing, investing, tax, budgeting, and retirement scenarios. Results are planning estimates and not individualized financial advice.',
  'health-calculators': 'Use body, energy, activity, and heart-rate estimates as educational screening and planning aids—not as medical diagnoses.',
  'developer-tools': 'Work with JSON, YAML, Base64, JWT, regular expressions, network values, timestamps, code formatting, and common web-development tasks.',
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
    <div className="min-h-screen pb-20 pt-8 text-[#18181b] dark:text-[#f4f4f5]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replaceAll('<', '\\u003c') }} />
      <header className="mx-auto max-w-5xl mb-10">
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs font-semibold text-[#5b5b63] dark:text-[#a1a1aa]">
          <Link href="/" className="hover:text-[#e5322d]">Home</Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-[#e5322d]">Categories</Link>
          <span>/</span>
          <span className="text-[#18181b] dark:text-white">{category.name}</span>
        </nav>
        <p className="text-xs font-bold uppercase tracking-wider text-[#e5322d]">Free online tools</p>
        <h1 className="mt-2 text-balance text-3xl sm:text-5xl font-black tracking-tight text-[#18181b] dark:text-white">{category.name}</h1>
        <p className="mt-4 max-w-3xl text-base sm:text-lg leading-relaxed text-[#5b5b63] dark:text-[#a1a1aa]">{categoryIntros[slug] ?? category.description}</p>
        <p className="mt-2 text-xs font-semibold text-[#5b5b63] dark:text-[#a1a1aa]">{categoryTools.length} free tools in {categoryClusters.length} groups</p>
      </header>

      {categoryToolkits.length > 0 && (
        <section className="mx-auto mt-10 max-w-5xl" aria-labelledby="category-toolkits">
          <div className="flex items-center gap-2.5 mb-2">
            <Layers3 className="size-5 text-[#e5322d]" />
            <h2 id="category-toolkits" className="text-xl sm:text-2xl font-bold tracking-tight text-[#18181b] dark:text-white">Start with a common task</h2>
          </div>
          <p className="text-sm text-[#5b5b63] dark:text-[#a1a1aa] mb-4">These collections group tools that are useful for the same job.</p>
          <div className="grid gap-4 md:grid-cols-2">
            {categoryToolkits.map((toolkit) => (
              <Link key={toolkit.slug} href={`/toolkits/${toolkit.slug}`} className="group rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-5 transition hover:border-[#e5322d] hover:shadow-xs">
                <h3 className="text-base font-bold text-[#18181b] dark:text-white group-hover:text-[#e5322d] transition-colors">{toolkit.name}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#5b5b63] dark:text-[#a1a1aa]">{toolkit.description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#e5322d]">Browse {toolkit.name} <ArrowRight className="size-3.5" /></span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto mt-12 max-w-5xl" aria-labelledby="category-clusters">
        <h2 id="category-clusters" className="text-2xl sm:text-3xl font-black text-[#18181b] dark:text-white mb-6">Browse tools</h2>
        <div className="space-y-10">
          {categoryClusters.map((cluster) => (
            <section key={cluster.id} id={cluster.id} className="scroll-mt-24">
              <div className="max-w-3xl mb-4">
                <h3 className="text-xl font-bold text-[#18181b] dark:text-white">{cluster.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#5b5b63] dark:text-[#a1a1aa]">{cluster.description}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cluster.tools.map((tool) => (
                  <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-5 transition hover:border-[#e5322d] hover:shadow-md flex flex-col justify-between min-h-[140px]">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#fff1f1] dark:bg-[#e5322d]/10 text-xl text-[#e5322d]" aria-hidden="true">{getToolIcon(tool.slug) || '🔧'}</span>
                        <span className="text-[#5b5b63] dark:text-[#a1a1aa] group-hover:text-[#e5322d] group-hover:translate-x-0.5 transition-all">→</span>
                      </div>
                      <h4 className="font-semibold text-base text-[#18181b] dark:text-white group-hover:text-[#e5322d] transition-colors line-clamp-1">{tool.title}</h4>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#5b5b63] dark:text-[#a1a1aa]">{tool.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      {relatedGuides.length > 0 && (
        <section className="mx-auto mt-14 max-w-5xl border-t border-[#e4e4e8] dark:border-[#27272a] pt-10" aria-labelledby="category-guides">
          <div className="flex items-center gap-2.5 mb-4">
            <BookOpen className="size-5 text-[#e5322d]" />
            <h2 id="category-guides" className="text-xl sm:text-2xl font-bold tracking-tight text-[#18181b] dark:text-white">Useful guides</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedGuides.map((guide) => (
              <Link key={guide.slug} href={`/guides/${guide.slug}`} className="group rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-4 transition hover:border-[#e5322d] hover:shadow-xs">
                <h3 className="font-semibold text-sm leading-snug text-[#18181b] dark:text-white group-hover:text-[#e5322d] transition-colors">{guide.title}</h3>
                <p className="mt-2 text-xs text-[#5b5b63] dark:text-[#a1a1aa]">{guide.readTime}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    <PageHelp path={`/categories/${slug}`} />
    </div>
  );
}
