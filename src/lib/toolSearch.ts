export interface SearchableTool {
  slug: string;
  title: string;
  description: string;
  category: string;
  categoryName?: string;
  keywords?: string[];
  aliases?: string[];
  clusterName?: string;
  toolkitNames?: string[];
}

export interface ToolSearchResult extends SearchableTool {
  score: number;
}

export function normalizeToolSearch(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function editDistanceAtMostOne(left: string, right: string): boolean {
  if (left === right) return true;
  if (Math.abs(left.length - right.length) > 1) return false;

  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < left.length && j < right.length) {
    if (left[i] === right[j]) {
      i += 1;
      j += 1;
      continue;
    }
    edits += 1;
    if (edits > 1) return false;
    if (left.length > right.length) i += 1;
    else if (right.length > left.length) j += 1;
    else {
      i += 1;
      j += 1;
    }
  }
  return edits + (i < left.length || j < right.length ? 1 : 0) <= 1;
}

function normalizedList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(normalizeToolSearch).filter(Boolean);
}

function scoreTerm(term: string, values: Array<{ value: string; exact: number; prefix: number; contains: number }>) {
  let best = 0;
  for (const field of values) {
    if (!field.value) continue;
    if (field.value === term) best = Math.max(best, field.exact);
    else if (field.value.startsWith(term)) best = Math.max(best, field.prefix);
    else if (field.value.includes(term)) best = Math.max(best, field.contains);
  }
  if (best > 0 || term.length < 4) return best;

  const tokens = values.flatMap(({ value }) => value.split(' ')).filter((token) => token.length >= 4);
  return tokens.some((token) => editDistanceAtMostOne(term, token)) ? 80 : 0;
}

function scoreTool(query: string, record: SearchableTool): number {
  const title = normalizeToolSearch(record.title);
  const slug = normalizeToolSearch(record.slug);
  const description = normalizeToolSearch(record.description);
  const category = normalizeToolSearch(record.categoryName || record.category);
  const aliases = normalizedList(record.aliases);
  const keywords = normalizedList(record.keywords);
  const supporting = [
    normalizeToolSearch(record.clusterName),
    ...normalizedList(record.toolkitNames),
  ].filter(Boolean);
  const terms = query.split(' ');

  let score = 0;
  if (title === query) score += 10_000;
  else if (title.startsWith(query)) score += 9_000;
  else if (title.includes(query)) score += 5_000;
  if (aliases.includes(query)) score += 8_500;
  else if (aliases.some((alias) => alias.startsWith(query))) score += 8_000;
  if (slug === query) score += 7_500;
  else if (slug.startsWith(query)) score += 7_000;

  for (const term of terms) {
    const termScore = scoreTerm(term, [
      { value: title, exact: 1_200, prefix: 1_000, contains: 700 },
      ...aliases.map((value) => ({ value, exact: 950, prefix: 850, contains: 650 })),
      ...keywords.map((value) => ({ value, exact: 800, prefix: 700, contains: 500 })),
      { value: slug, exact: 700, prefix: 600, contains: 450 },
      { value: category, exact: 350, prefix: 300, contains: 220 },
      ...supporting.map((value) => ({ value, exact: 300, prefix: 250, contains: 180 })),
      { value: description, exact: 180, prefix: 150, contains: 120 },
    ]);
    if (termScore === 0) return 0;
    score += termScore;
  }
  return score;
}

function isSearchableTool(value: unknown): value is SearchableTool {
  if (!value || typeof value !== 'object') return false;
  const record = value as Partial<SearchableTool>;
  return typeof record.slug === 'string' && Boolean(normalizeToolSearch(record.slug))
    && typeof record.title === 'string' && Boolean(normalizeToolSearch(record.title))
    && typeof record.description === 'string'
    && typeof record.category === 'string';
}

export function searchTools(query: unknown, records: readonly unknown[], limit = Number.POSITIVE_INFINITY): ToolSearchResult[] {
  const normalizedQuery = normalizeToolSearch(query);
  if (!normalizedQuery || !Array.isArray(records) || limit <= 0) return [];

  return records
    .filter(isSearchableTool)
    .map((record) => ({ ...record, score: scoreTool(normalizedQuery, record) }))
    .filter((record) => record.score > 0)
    .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title))
    .slice(0, Math.floor(limit));
}
