import type english from './dictionaries/en.json';
import type { Locale } from './config';
import { TOTAL_ACTIVE_TOOLS } from '@/data/registry';
export type Dictionary = typeof english;
const loaders = {
  fr: () => import('./dictionaries/fr.json'),
  it: () => import('./dictionaries/it.json'),
  pt: () => import('./dictionaries/pt.json'),
  es: () => import('./dictionaries/es.json'),
  ar: () => import('./dictionaries/ar.json'),
  ru: () => import('./dictionaries/ru.json'),
  de: () => import('./dictionaries/de.json'),
};
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const dictionary = (await loaders[locale]()).default;
  return replaceStaticToolCounts(dictionary, new Intl.NumberFormat(locale).format(TOTAL_ACTIVE_TOOLS));
}

/** Replace the legacy translated count wherever it appears in UI copy. */
export function replaceStaticToolCounts<T>(value: T, count: string): T {
  if (typeof value === 'string') return value.replaceAll('{{toolCount}}', count) as T;
  if (Array.isArray(value)) return value.map((item) => replaceStaticToolCounts(item, count)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, replaceStaticToolCounts(item, count)])) as T;
  }
  return value;
}
