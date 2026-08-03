'use client';

import Link from 'next/link';
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

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <h1 className="text-3xl font-bold mb-8">Categories</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const toolCount = tools.filter(t => t.category === category.slug).length;
            const icon = iconMap[category.icon] || '📁';
            return (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="p-6 bg-[var(--card)] border border-[var(--border)] rounded-xl hover:border-indigo-500 transition-all"
              >
                <div className="text-3xl mb-3">{icon}</div>
                <h2 className="text-xl font-semibold">{category.name}</h2>
                <p className="text-[var(--muted-foreground)] mt-1">{toolCount} tools</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
