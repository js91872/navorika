'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Globe, CheckCircle } from 'lucide-react';
import { categories, tools } from '@/data/registry';

export default function SitemapPage() {
  const pages = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/categories', label: 'All Categories' },
    { href: '/tools', label: 'All Tools' },
    { href: '/guides', label: 'Guides' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/sitemap', label: 'XML Sitemap' },
  ];

  const allCategories = categories.map(c => ({
    href: `/categories/${c.slug}`,
    label: c.name,
  }));

  const allTools = tools.slice(0, 20).map(t => ({
    href: `/tools/${t.slug}`,
    label: t.title,
  }));

  const totalTools = tools.length;

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Globe className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">XML Sitemap</h1>
              <p className="text-[var(--muted-foreground)] mt-1">
                Complete site structure with {pages.length + allCategories.length + allTools.length} pages
              </p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm">
            <CheckCircle className="h-5 w-5 inline mr-2" />
            <span className="font-medium">All pages are statically generated for maximum SEO performance.</span>
          </div>
        </div>

        {/* Main Pages */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-500" />
            Main Pages
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {pages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="p-3 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-indigo-500/40 transition-all flex items-center justify-between group"
              >
                <span className="font-medium">{page.label}</span>
                <span className="text-[var(--muted-foreground)] group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-500" />
            Categories ({allCategories.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {allCategories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="p-3 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-indigo-500/40 transition-all flex items-center justify-between group"
              >
                <span className="font-medium">{cat.label}</span>
                <span className="text-[var(--muted-foreground)] group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Tools */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-amber-500" />
            Popular Tools ({totalTools} total, showing first 20)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {allTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="p-3 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-indigo-500/40 transition-all flex items-center justify-between group"
              >
                <span className="font-medium">{tool.label}</span>
                <span className="text-[var(--muted-foreground)] group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            ))}
          </div>
          {totalTools > 20 && (
            <div className="mt-4 text-center">
              <Link
                href="/tools"
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View all {totalTools} tools →
              </Link>
            </div>
          )}
        </section>

        {/* Total Stats */}
        <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-2xl font-black">{pages.length}</div>
              <div className="text-xs text-[var(--muted-foreground)]">Main Pages</div>
            </div>
            <div>
              <div className="text-2xl font-black">{allCategories.length}</div>
              <div className="text-xs text-[var(--muted-foreground)]">Categories</div>
            </div>
            <div>
              <div className="text-2xl font-black">{totalTools}</div>
              <div className="text-xs text-[var(--muted-foreground)]">Tools</div>
            </div>
            <div>
              <div className="text-2xl font-black">{pages.length + allCategories.length + totalTools}</div>
              <div className="text-xs text-[var(--muted-foreground)]">Total Pages</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
