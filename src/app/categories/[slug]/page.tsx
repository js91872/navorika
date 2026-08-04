'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { categories, tools } from '@/data/registry';
import { getToolIcon } from '@/lib/toolIcons';

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
          <Link href="/categories" className="inline-block mt-4 text-indigo-600 hover:underline">← Back to Categories</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <Link href="/categories" className="inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Categories
        </Link>

        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        <p className="text-[var(--muted-foreground)] mb-8">{categoryTools.length} tools</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-indigo-500/40 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getToolIcon(tool.slug)}</span>
                <h3 className="font-semibold">{tool.title}</h3>
              </div>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">{tool.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
