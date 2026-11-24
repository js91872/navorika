'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock3, ArrowRight } from 'lucide-react';
import { tools } from '@/data/registry';
import { toolsUnderReview } from '@/lib/seo/toolReview';
import { parseRecentTools, RECENT_TOOLS_EVENT, RECENT_TOOLS_STORAGE_KEY, type RecentToolEntry } from '@/lib/recentTools';

const validSlugs = new Set(tools.map((tool) => tool.slug));

export default function RecentTools() {
  const [entries, setEntries] = useState<RecentToolEntry[]>([]);
  const refresh = useCallback(() => {
    try {
      setEntries(parseRecentTools(localStorage.getItem(RECENT_TOOLS_STORAGE_KEY), validSlugs, toolsUnderReview));
    } catch {
      setEntries([]);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(refresh, 0);
    window.addEventListener(RECENT_TOOLS_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(RECENT_TOOLS_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [refresh]);

  const recent = entries.flatMap((entry) => {
    const tool = tools.find((candidate) => candidate.slug === entry.slug);
    return tool ? [tool] : [];
  });
  if (!recent.length) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-8" aria-labelledby="recent-tools-title">
      <div className="flex items-center gap-2 mb-4">
        <Clock3 className="size-5 text-[#e5322d]" aria-hidden="true" />
        <h2 id="recent-tools-title" className="text-xl font-bold tracking-tight text-[#18181b] dark:text-white">
          Recently Used Tools
        </h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {recent.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="group flex min-h-14 items-center justify-between gap-3 rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-3.5 transition-all hover:border-[#e5322d] hover:shadow-xs"
          >
            <span className="font-semibold text-sm text-[#18181b] dark:text-white line-clamp-1 group-hover:text-[#e5322d] transition-colors">
              {tool.title}
            </span>
            <ArrowRight className="size-4 text-[#5b5b63] dark:text-[#a1a1aa] group-hover:text-[#e5322d] shrink-0 transition-colors" />
          </Link>
        ))}
      </div>
    </section>
  );
}
