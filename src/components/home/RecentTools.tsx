'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock3 } from 'lucide-react';
import { tools } from '@/data/registry';
import { toolsUnderReview } from '@/lib/seo/toolReview';
import { parseRecentTools, RECENT_TOOLS_EVENT, RECENT_TOOLS_STORAGE_KEY, type RecentToolEntry } from '@/lib/recentTools';
import { getToolIcon } from '@/lib/toolIcons';

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

  return <section className="mx-auto max-w-6xl px-4 py-10" aria-labelledby="recent-tools-title">
    <div className="flex items-center gap-3"><Clock3 className="size-5 text-indigo-600" aria-hidden="true" /><h2 id="recent-tools-title" className="text-2xl font-black">Recent tools</h2></div>
    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{recent.map((tool) => <Link key={tool.slug} href={`/tools/${tool.slug}`} className="flex min-h-16 items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 transition hover:border-indigo-500/50"><span className="text-2xl" aria-hidden="true">{getToolIcon(tool.slug) || '🔧'}</span><span className="font-semibold">{tool.title}</span></Link>)}</div>
  </section>;
}
