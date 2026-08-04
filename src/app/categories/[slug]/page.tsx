'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { categories, tools } from '@/data/registry';

const iconMap: Record<string, string> = {
  FileText: '📄',
  Image: '🖼️',
  Calculator: '📊',
  HeartPulse: '❤️',
  Code: '⚡',
  PiggyBank: '💰',
  Globe: '🌍',
  Hammer: '🔨',
};

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const category = categories.find(c => c.slug === slug);
  const categoryTools = tools.filter(t => t.category === slug);

  if (!category) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold">Category Not Found</h1>
          <p className="text-[var(--muted-foreground)] mt-2">The category you're looking for doesn't exist.</p>
          <Link href="/categories" className="inline-block mt-4 text-indigo-600 hover:underline">
            ← Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  const icon = iconMap[category.icon] || '📁';

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-8"
        >
          <ArrowRight className="h-4 w-4 rotate-180" /> Back to Categories
        </Link>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{icon}</span>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-[var(--foreground)]">{category.name}</h1>
              <p className="text-[var(--muted-foreground)] mt-1">{categoryTools.length} tools</p>
            </div>
          </div>
        </div>

        {categoryTools.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border-2 border-dashed border-[var(--border)] text-[var(--muted-foreground)] text-sm font-medium">
            No tools found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group p-6 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-black text-[var(--foreground)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {tool.title}
                  </h3>
                  <ArrowRight className="h-4 w-4 text-[var(--muted-foreground)] group-hover:text-indigo-500 transition-colors" />
                </div>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                  {tool.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tool.keywords && tool.keywords.slice(0, 3).map((keyword) => (
                    <span
                      key={keyword}
                      className="px-2 py-1 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] text-[10px] font-bold uppercase tracking-wider"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
