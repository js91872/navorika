'use client';

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

export default function EnhancedCategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-3xl font-bold mb-8">Workspaces</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => {
          const toolCount = tools.filter(t => t.category === category.slug).length;
          const icon = iconMap[category.icon] || '📁';
          return (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-indigo-500/40 transition-all group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{icon}</div>
              <h3 className="font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-[var(--muted-foreground)] mt-1 line-clamp-2">{category.description}</p>
              <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                <span>{toolCount} tools</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
