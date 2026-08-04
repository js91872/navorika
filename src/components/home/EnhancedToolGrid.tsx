'use client';

import Link from 'next/link';
import { tools } from '@/data/registry';
import { getToolIcon } from '@/lib/toolIcons';

export default function EnhancedToolGrid() {
  const featuredTools = tools.slice(0, 8);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-3xl font-bold mb-8">Popular Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {featuredTools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-indigo-500/40 transition-all group"
          >
            <div className="flex items-start justify-between">
              <span className="text-2xl">{getToolIcon(tool.slug)}</span>
              <span className="text-xs text-[var(--muted-foreground)] bg-[var(--muted)] px-2 py-0.5 rounded-full">
                {tool.category.split('-')[0]}
              </span>
            </div>
            <h3 className="font-semibold mt-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {tool.title}
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] mt-1 line-clamp-2">{tool.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
