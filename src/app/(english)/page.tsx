import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { languageAlternates } from '@/lib/i18n/config';
import { tools, categories } from '@/data/registry';
import { toolkits } from '@/data/taxonomy';
import { toolsUnderReview } from '@/lib/seo/toolReview';
import { toolDescriptions } from '@/lib/toolDescriptions';
import HomeToolCatalog, { type CatalogTool } from '@/components/home/HomeToolCatalog';
import RecentTools from '@/components/home/RecentTools';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://navorika.com',
    languages: languageAlternates(),
  },
};

export default function HomePage() {
  const activeTools = tools.filter((tool) => !toolsUnderReview.has(tool.slug));
  const totalTools = activeTools.length;
  const displayCount = `${totalTools}`;

  const catalogTools: CatalogTool[] = activeTools.map((tool) => ({
    ...tool,
    displayDescription: toolDescriptions[tool.slug] || tool.description,
  }));

  const helpfulGuides = [
    {
      title: 'How to Convert JPG to DXF',
      href: '/guides/how-to-convert-jpg-to-dxf',
      description: 'Prepare raster artwork and convert JPG images into clean DXF CAD vectors.',
    },
    {
      title: 'How Does a 3D Printer Work?',
      href: '/guides/how-does-a-3d-printer-work',
      description: 'Learn how 3D printers turn digital models into physical objects step by step.',
    },
    {
      title: 'How to Clean Phone Speakers',
      href: '/guides/how-to-clean-phone-speaker',
      description: 'Clear dust, water, and debris from mobile speakers safely using sound frequencies.',
    },
  ];

  const faqs = [
    {
      q: 'Are Navorika tools completely free?',
      a: `Yes. All ${displayCount} active tools are free to use with no account, credit card, or subscription required.`,
    },
    {
      q: 'How is data privacy handled?',
      a: 'Calculators, converters, and file utilities run locally in your browser whenever technically possible. If a tool requires external processing or live data, that is clearly explained on the tool page.',
    },
    {
      q: 'Do I need to install software or sign up?',
      a: 'No. Everything runs directly in modern desktop, tablet, and mobile browsers without software installation or signup.',
    },
    {
      q: 'What types of tools are available?',
      a: `Navorika offers tools across PDF management, image conversion, everyday calculators, construction planning, developer utilities, health estimates, and finance formulas.`,
    },
  ];

  return (
    <div className="pb-16 text-[#18181b] dark:text-[#f4f4f5]">
      {/* Hero Section matching approved visual direction */}
      <section className="text-center pt-8 pb-6 sm:pt-14 sm:pb-8 max-w-4xl mx-auto px-4">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-3 text-[#18181b] dark:text-white">
          Free Online Tools for Everyday Work
        </h1>
        <p className="text-base sm:text-lg text-[#5b5b63] dark:text-[#a1a1aa] max-w-2xl mx-auto mb-8 leading-relaxed">
          Convert files, calculate costs, check measurements and get things done — quickly and easily.
        </p>

        {/* Live Search & Filter Catalogue */}
        <HomeToolCatalog tools={catalogTools} />
      </section>

      <RecentTools />

      {/* Helpful Guides Section matching approved preview */}
      <section className="max-w-6xl mx-auto px-4 mt-12 mb-14" aria-labelledby="helpful-guides-heading">
        <div className="bg-white dark:bg-[#18181b] border border-[#e4e4e8] dark:border-[#27272a] rounded-xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <BookOpen className="h-5 w-5 text-[#e5322d]" aria-hidden="true" />
              <h2 id="helpful-guides-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-[#18181b] dark:text-white">
                Helpful Guides
              </h2>
            </div>
            <Link href="/guides" className="text-sm font-semibold text-[#e5322d] hover:underline">
              All guides →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {helpfulGuides.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="group block p-4 rounded-lg border border-[#e4e4e8] dark:border-[#27272a] hover:border-[#e5322d] transition-all bg-[#f7f7f8] dark:bg-[#202023]"
              >
                <h3 className="font-semibold text-sm text-[#18181b] dark:text-white group-hover:text-[#e5322d] transition-colors flex items-center justify-between gap-2">
                  <span>{guide.title}</span>
                  <span className="text-[#e5322d] shrink-0">→</span>
                </h3>
                <p className="mt-1 text-xs text-[#5b5b63] dark:text-[#a1a1aa] leading-relaxed">
                  {guide.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Toolkits */}
      <section className="max-w-6xl mx-auto px-4 mb-14" aria-labelledby="workflow-toolkits-heading">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 id="workflow-toolkits-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-[#18181b] dark:text-white">
              Workflow Toolkits
            </h2>
            <p className="text-sm text-[#5b5b63] dark:text-[#a1a1aa] mt-1">
              Move directly between tools that support the same project or calculation.
            </p>
          </div>
          <Link href="/toolkits" className="inline-flex items-center gap-1 text-sm font-semibold text-[#e5322d] hover:underline shrink-0">
            View all toolkits <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {toolkits.slice(0, 4).map((toolkit) => (
            <Link
              key={toolkit.slug}
              href={`/toolkits/${toolkit.slug}`}
              className="group block rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-5 hover:border-[#e5322d] hover:shadow-xs transition-all"
            >
              <h3 className="font-semibold text-base text-[#18181b] dark:text-white group-hover:text-[#e5322d] transition-colors">
                {toolkit.name}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#5b5b63] dark:text-[#a1a1aa] line-clamp-2">
                {toolkit.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Tools by Category Grid */}
      <section className="max-w-6xl mx-auto px-4 mb-14" aria-labelledby="categories-heading">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 id="categories-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-[#18181b] dark:text-white">
              Browse by Category
            </h2>
            <p className="text-sm text-[#5b5b63] dark:text-[#a1a1aa] mt-1">
              Explore {displayCount} tools across {categories.length} categories
            </p>
          </div>
          <Link href="/categories" className="text-sm font-semibold text-[#e5322d] hover:underline">
            All categories →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group p-5 rounded-xl bg-white dark:bg-[#18181b] border border-[#e4e4e8] dark:border-[#27272a] hover:border-[#e5322d] hover:shadow-xs transition-all"
            >
              <h3 className="font-semibold text-base text-[#18181b] dark:text-white group-hover:text-[#e5322d] transition-colors">
                {category.name}
              </h3>
              <p className="mt-1.5 text-xs text-[#5b5b63] dark:text-[#a1a1aa] leading-relaxed line-clamp-2">
                {category.description}
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#e5322d]">
                <span>Explore tools</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 mb-14" aria-labelledby="faq-heading">
        <div className="text-center mb-8">
          <h2 id="faq-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-[#18181b] dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#5b5b63] dark:text-[#a1a1aa] mt-1">
            Common questions about using Navorika tools
          </p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="p-5 rounded-xl bg-white dark:bg-[#18181b] border border-[#e4e4e8] dark:border-[#27272a]"
            >
              <h3 className="font-semibold text-base text-[#18181b] dark:text-white mb-2">
                {faq.q}
              </h3>
              <p className="text-sm text-[#5b5b63] dark:text-[#a1a1aa] leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
