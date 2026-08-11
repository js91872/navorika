'use client';

import Link from 'next/link';
import { guidesMetadata } from '@/lib/guidesMetadata';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';

export default function GuidesPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tight">Guides & Articles</h1>
          <p className="text-[var(--muted-foreground)] mt-1">
            Expert guides to help you make the most of your tools
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guidesMetadata.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group p-6 bg-[var(--card)] border border-[var(--border)] rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-indigo-500/40"
            >
              <div className="mb-3">
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full">
                  {guide.category}
                </span>
              </div>
              <h2 className="text-xl font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {guide.title}
              </h2>
              <p className="text-sm text-[var(--muted-foreground)] mt-2 line-clamp-2">
                {guide.description}
              </p>
              <div className="flex items-center gap-4 mt-4 text-xs text-[var(--muted-foreground)]">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {guide.publishedDate}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {guide.readTime}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between">
                <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {guide.author}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
