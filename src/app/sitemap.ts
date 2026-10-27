import { locales, localizedPath, translatedTools, languageAlternates, isTranslatedTool } from '@/lib/i18n/config';
import type { MetadataRoute } from 'next';
import { categories, tools } from '@/data/registry';
import { getFinanceSuiteUrls } from '@/lib/seo/financeSuite';
import { toolsUnderReview } from '@/lib/seo/toolReview';
import { guidesMetadata } from '@/lib/guidesMetadata';
import { toolkits } from '@/data/taxonomy';

const baseUrl = 'https://navorika.com';
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
  'yaml-to-json-converter',
  'json-to-yaml-converter',
  'epoch-time-converter',
]);

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    '',
    '/tools',
    '/categories',
    '/toolkits',
    '/guides',
    '/guides/how-to-convert-jpg-to-dxf',
    '/guides/how-does-a-3d-printer-work',
    '/about',
    '/contact',
    '/glossary',
    '/privacy',
    '/terms',
    '/disclaimer',
    '/methodology',
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

  const englishPages = [...staticPages, ...toolPages, ...financeSuitePages, ...categoryPages, ...toolkitPages, ...guidePages]
    .map((page) => {
      const slug = page.url.startsWith(`${baseUrl}/tools/`) ? page.url.slice(`${baseUrl}/tools/`.length) : '';
      if (page.url === baseUrl || isTranslatedTool(slug)) {
        return { ...page, alternates: { languages: languageAlternates(isTranslatedTool(slug) ? slug : undefined) } };
      }
      return page;
    });
  const localizedPages = locales.flatMap((locale) => [
    { url: `${baseUrl}${localizedPath(locale)}`, alternates: { languages: languageAlternates() } },
    ...translatedTools.map((slug) => ({ url: `${baseUrl}${localizedPath(locale, slug)}`, alternates: { languages: languageAlternates(slug) } })),
  ]);
  return [...englishPages, ...localizedPages];
}
