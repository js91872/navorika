'use client';

import Link from 'next/link';
import { ArrowLeft, FileText, Globe } from 'lucide-react';
import { categories, tools } from '@/data/registry';
import { toolsUnderReview } from '@/lib/seo/toolReview';
import { guidesMetadata } from '@/lib/guidesMetadata';

export default function SitemapPage() {
  const pages = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/categories', label: 'All Categories' },
    { href: '/tools', label: 'All Tools' },
    { href: '/guides', label: 'Guides' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/disclaimer', label: 'Disclaimer' },
    { href: '/methodology', label: 'Methodology' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/sitemap', label: 'Sitemap' },
  ];

  const allCategories = categories.map((c) => ({
    href: `/categories/${c.slug}`,
    label: c.name,
  }));

  const availableTools = tools.filter((tool) => !toolsUnderReview.has(tool.slug));
  const allTools = availableTools.slice(0, 20).map((t) => ({
    href: `/tools/${t.slug}`,
    label: t.title,
  }));

  const totalTools = availableTools.length;
  const allGuides = guidesMetadata.map((guide) => ({ href: `/guides/${guide.slug}`, label: guide.title }));

  return (
    <div className="min-h-screen bg-[#f7f7f8] dark:bg-[#121214] text-[#18181b] dark:text-[#f4f4f5] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#5b5b63] dark:text-[#a1a1aa] hover:text-[#e5322d] transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3.5 mb-2">
            <div className="grid size-12 place-items-center rounded-xl bg-[#fff1f1] dark:bg-[#e5322d]/10 text-[#e5322d]">
              <Globe className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#18181b] dark:text-white tracking-tight">Sitemap</h1>
              <p className="text-[#5b5b63] dark:text-[#a1a1aa] text-sm sm:text-base mt-1">
                Browse all Navorika tools, calculators, categories, guides, and site pages.
              </p>
            </div>
          </div>
        </div>

        {/* Main Pages */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-[#18181b] dark:text-white mb-3.5 flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#e5322d]" />
            Main Pages
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {pages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="p-3.5 rounded-xl bg-white dark:bg-[#18181b] border border-[#e4e4e8] dark:border-[#27272a] shadow-xs hover:border-[#e5322d]/40 transition-all flex items-center justify-between group"
              >
                <span className="font-medium text-sm text-[#18181b] dark:text-white group-hover:text-[#e5322d] transition-colors">{page.label}</span>
                <span className="text-[#5b5b63] dark:text-[#a1a1aa] group-hover:text-[#e5322d] group-hover:translate-x-1 transition-all text-sm">→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-[#18181b] dark:text-white mb-3.5 flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#e5322d]" />
            Categories ({allCategories.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {allCategories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="p-3.5 rounded-xl bg-white dark:bg-[#18181b] border border-[#e4e4e8] dark:border-[#27272a] shadow-xs hover:border-[#e5322d]/40 transition-all flex items-center justify-between group"
              >
                <span className="font-medium text-sm text-[#18181b] dark:text-white group-hover:text-[#e5322d] transition-colors">{cat.label}</span>
                <span className="text-[#5b5b63] dark:text-[#a1a1aa] group-hover:text-[#e5322d] group-hover:translate-x-1 transition-all text-sm">→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Tools */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-[#18181b] dark:text-white mb-3.5 flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#e5322d]" />
            Popular Tools (showing 20 of {totalTools})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {allTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="p-3.5 rounded-xl bg-white dark:bg-[#18181b] border border-[#e4e4e8] dark:border-[#27272a] shadow-xs hover:border-[#e5322d]/40 transition-all flex items-center justify-between group"
              >
                <span className="font-medium text-sm text-[#18181b] dark:text-white group-hover:text-[#e5322d] transition-colors">{tool.label}</span>
                <span className="text-[#5b5b63] dark:text-[#a1a1aa] group-hover:text-[#e5322d] group-hover:translate-x-1 transition-all text-sm">→</span>
              </Link>
            ))}
          </div>
          {totalTools > 20 && (
            <div className="mt-4 text-center">
              <Link
                href="/tools"
                className="text-sm font-semibold text-[#e5322d] hover:text-[#c71f1e] hover:underline"
              >
                View all {totalTools} tools →
              </Link>
            </div>
          )}
        </section>

        {/* Guides */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-[#18181b] dark:text-white mb-3.5 flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#e5322d]" />
            Guides ({allGuides.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {allGuides.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="p-3.5 rounded-xl bg-white dark:bg-[#18181b] border border-[#e4e4e8] dark:border-[#27272a] shadow-xs hover:border-[#e5322d]/40 transition-all flex items-center justify-between group"
              >
                <span className="font-medium text-sm text-[#18181b] dark:text-white group-hover:text-[#e5322d] transition-colors">{guide.label}</span>
                <span className="text-[#5b5b63] dark:text-[#a1a1aa] group-hover:text-[#e5322d] group-hover:translate-x-1 transition-all text-sm">→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Total Stats */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#18181b] border border-[#e4e4e8] dark:border-[#27272a] shadow-xs text-center">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-2xl font-black text-[#18181b] dark:text-white">{pages.length}</div>
              <div className="text-xs text-[#5b5b63] dark:text-[#a1a1aa] mt-0.5">Main Pages</div>
            </div>
            <div>
              <div className="text-2xl font-black text-[#18181b] dark:text-white">{allCategories.length}</div>
              <div className="text-xs text-[#5b5b63] dark:text-[#a1a1aa] mt-0.5">Categories</div>
            </div>
            <div>
              <div className="text-2xl font-black text-[#18181b] dark:text-white">{totalTools}</div>
              <div className="text-xs text-[#5b5b63] dark:text-[#a1a1aa] mt-0.5">Tools</div>
            </div>
            <div>
              <div className="text-2xl font-black text-[#18181b] dark:text-white">{pages.length + allCategories.length + totalTools + allGuides.length}</div>
              <div className="text-xs text-[#5b5b63] dark:text-[#a1a1aa] mt-0.5">Total Pages</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
