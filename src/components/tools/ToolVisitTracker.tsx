'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { tools } from '@/data/registry';
import { toolsUnderReview } from '@/lib/seo/toolReview';
import { addRecentTool, parseRecentTools, RECENT_TOOLS_EVENT, RECENT_TOOLS_STORAGE_KEY, serializeRecentTools } from '@/lib/recentTools';

const validSlugs = new Set(tools.map((tool) => tool.slug));

export default function ToolVisitTracker() {
  const pathname = usePathname();
  useEffect(() => {
    const match = pathname.match(/^\/tools\/([^/]+)\/?$/);
    const slug = match?.[1];
    if (!slug || !validSlugs.has(slug) || toolsUnderReview.has(slug)) return;
    try {
      const entries = parseRecentTools(localStorage.getItem(RECENT_TOOLS_STORAGE_KEY), validSlugs, toolsUnderReview);
      localStorage.setItem(RECENT_TOOLS_STORAGE_KEY, serializeRecentTools(addRecentTool(entries, slug)));
      window.dispatchEvent(new CustomEvent(RECENT_TOOLS_EVENT));
    } catch {
      // Storage may be blocked; the tool remains fully usable without recents.
    }
  }, [pathname]);
  return null;
}
