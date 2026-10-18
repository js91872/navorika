import type english from './dictionaries/en.json';
import type { Locale } from './config';
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
  return (await loaders[locale]()).default;
}
