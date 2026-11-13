import { locales, localizedPath, translatedTools, languageAlternates, isTranslatedTool, publicPageAlternates } from '@/lib/i18n/config';
import type { MetadataRoute } from 'next';
import { categories, tools } from '@/data/registry';
import { getFinanceSuiteUrls } from '@/lib/seo/financeSuite';
import { toolsUnderReview } from '@/lib/seo/toolReview';
import { guidesMetadata } from '@/lib/guidesMetadata';
import { toolkits } from '@/data/taxonomy';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { hasIndexableLocalizedToolCopy } from '@/lib/i18n/contentDepth';

const baseUrl = 'https://navorika.com';
const trustSlugs = ['about', 'contact', 'privacy', 'terms', 'disclaimer', 'methodology', 'glossary'] as const;
const financeSuiteRoots = new Set([
  'cashflow-budget-architect',
  'investment-return-profiler',
  'loan-amortization-suite',
  'savings-retirement-hub',
  'taxation-compliance-deck',
  'wealth-inflation-matrix',
]);

const nonCanonicalToolSlugs = new Set([
  'developer-utils',
  'webmaster-seo-builder',
  'compress-image-to-20kb',
  'compress-image-to-50kb',
  'compress-image-to-100kb',
  'compress-image-to-200kb',
  'compress-jpg-to-100kb',
  'compress-png-to-100kb',
  'pdf-to-jpg',
  'jpg-to-pdf',
  'webp-to-pdf',
  'epoch-time-converter',
]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    '',
    '/tools',
    '/categories',
    '/toolkits',
    '/guides',
    '/guides/how-to-convert-jpg-to-dxf',
    '/guides/how-does-a-3d-printer-work',
    '/guides/can-chatgpt-make-videos',
    '/guides/how-to-clean-phone-speaker',
    '/guides/shopify-profit-margin-calculator',
    '/about',
    '/contact',
    '/glossary',
    '/privacy',
    '/terms',
    '/disclaimer',
    '/methodology',
    '/sitemap',
    '/hubs/finance',
    '/paper-sizes',
    '/paper-size-converter',
    '/paper-sizes/a4',
    '/paper-sizes/a3',
    '/paper-sizes/us-letter-vs-a4',
  ];
  const staticPages = staticPaths.map((path) => ({ url: `${baseUrl}${path}` }));
  const toolPages = tools
    .filter(({ slug }) => !financeSuiteRoots.has(slug) && !toolsUnderReview.has(slug) && !nonCanonicalToolSlugs.has(slug))
    .map(({ slug }) => ({ url: `${baseUrl}/tools/${slug}` }));
  const financeSuitePages = getFinanceSuiteUrls()
    .filter(
      (path) =>
        !path.includes('/taxation-compliance-deck/') &&
        !path.endsWith('/fd-calculator') &&
        !path.endsWith('/ppf-calculator') &&
        path !== '/tools/loan-amortization-suite/emi-calculator'
    )
    .map((path) => ({ url: `${baseUrl}${path}` }));
  const categoryPages = categories.map(({ slug }) => ({ url: `${baseUrl}/categories/${slug}` }));
  const guidePages = guidesMetadata.map(({ slug, dateModified }) => ({ url: `${baseUrl}/guides/${slug}`, lastModified: new Date(dateModified) }));
  const toolkitPages = toolkits.map(({ slug }) => ({ url: `${baseUrl}/toolkits/${slug}` }));

  const localizedGuideLanguages = Object.fromEntries(
    (['en', ...locales]).map((locale) => [locale, locale === 'en' ? `${baseUrl}/guides/webp-to-png-guide` : `${baseUrl}/${locale}/guides/webp-to-png-guide`]),
  );
  localizedGuideLanguages['x-default'] = `${baseUrl}/guides/webp-to-png-guide`;
  const englishPages = [...staticPages, ...toolPages, ...financeSuitePages, ...categoryPages, ...toolkitPages, ...guidePages]
    .map((page) => {
      const toolSlug = page.url.startsWith(`${baseUrl}/tools/`) ? page.url.slice(`${baseUrl}/tools/`.length) : '';
      const path = page.url.replace(baseUrl, '') || '/';
      const trustSlug = trustSlugs.find((s) => path === `/${s}`);
      if (path === '/guides/webp-to-png-guide') return { ...page, alternates: { languages: localizedGuideLanguages } };
      if (page.url === baseUrl || isTranslatedTool(toolSlug)) {
        return { ...page, alternates: { languages: languageAlternates(isTranslatedTool(toolSlug) ? toolSlug : undefined) } };
      }
      if (trustSlug) {
        return { ...page, alternates: { languages: publicPageAlternates(`/${trustSlug}`) } };
      }
      return page;
    });
  const localizedGuidePages = locales.map((locale) => ({
    url: `${baseUrl}/${locale}/guides/webp-to-png-guide`,
    lastModified: new Date('2026-11-13'),
    alternates: { languages: localizedGuideLanguages },
  }));
  const localizedPages = (await Promise.all(locales.map(async (locale) => {
    const dictionary = await getDictionary(locale);
    return [
      { url: `${baseUrl}${localizedPath(locale)}`, alternates: { languages: languageAlternates() } },
      ...translatedTools
        .filter((slug) => hasIndexableLocalizedToolCopy(dictionary.tools[slug]))
        .map((slug) => ({ url: `${baseUrl}${localizedPath(locale, slug)}`, alternates: { languages: languageAlternates(slug) } })),
      ...trustSlugs.map((slug) => ({
        url: `${baseUrl}/${locale}/${slug}`,
        alternates: { languages: publicPageAlternates(`/${slug}`) },
      })),
    ];
  }))).flat();
  // Preserve existing public URLs, but emit each only once. The two directional
  // JSON/YAML converters are self-canonical and should remain discoverable.
  const uniquePages = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const page of [...englishPages, ...localizedPages, ...localizedGuidePages]) uniquePages.set(page.url, page);
  return [...uniquePages.values()];
}
