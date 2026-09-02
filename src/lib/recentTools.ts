export const RECENT_TOOLS_STORAGE_KEY = 'navorika:recent-tools';
export const RECENT_TOOLS_VERSION = 1;
export const RECENT_TOOLS_LIMIT = 8;
export const RECENT_TOOLS_EVENT = 'navorika:recent-tools-updated';

export interface RecentToolEntry {
  slug: string;
  visitedAt: number;
}

interface RecentToolsPayload {
  version: number;
  tools: RecentToolEntry[];
}

export function sanitizeRecentTools(
  value: unknown,
  validSlugs: ReadonlySet<string>,
  excludedSlugs: ReadonlySet<string> = new Set(),
  limit = RECENT_TOOLS_LIMIT,
): RecentToolEntry[] {
  const payload = value as Partial<RecentToolsPayload> | null;
  if (!payload || payload.version !== RECENT_TOOLS_VERSION || !Array.isArray(payload.tools)) return [];

  const seen = new Set<string>();
  return payload.tools
    .filter((entry): entry is RecentToolEntry => Boolean(
      entry && typeof entry === 'object'
      && typeof entry.slug === 'string'
      && validSlugs.has(entry.slug)
      && !excludedSlugs.has(entry.slug)
      && Number.isFinite(entry.visitedAt)
      && entry.visitedAt > 0,
    ))
    .sort((left, right) => right.visitedAt - left.visitedAt)
    .filter((entry) => {
      if (seen.has(entry.slug)) return false;
      seen.add(entry.slug);
      return true;
    })
    .slice(0, Math.max(0, limit));
}

export function parseRecentTools(
  raw: string | null,
  validSlugs: ReadonlySet<string>,
  excludedSlugs: ReadonlySet<string> = new Set(),
): RecentToolEntry[] {
  if (!raw) return [];
  try {
    return sanitizeRecentTools(JSON.parse(raw), validSlugs, excludedSlugs);
  } catch {
    return [];
  }
}

export function addRecentTool(entries: readonly RecentToolEntry[], slug: string, visitedAt = Date.now()): RecentToolEntry[] {
  if (!slug || !Number.isFinite(visitedAt) || visitedAt <= 0) return [...entries];
  return [{ slug, visitedAt }, ...entries.filter((entry) => entry.slug !== slug)]
    .slice(0, RECENT_TOOLS_LIMIT);
}

export function serializeRecentTools(entries: readonly RecentToolEntry[]): string {
  return JSON.stringify({ version: RECENT_TOOLS_VERSION, tools: entries });
}
