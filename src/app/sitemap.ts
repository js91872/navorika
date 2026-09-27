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
    '/about',
    '/contact',
    '/glossary',
    '/privacy',
    '/terms',
    '/disclaimer',
    '/methodology',
    '/hubs/finance',
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

  return [...staticPages, ...toolPages, ...financeSuitePages, ...categoryPages, ...toolkitPages, ...guidePages];
}
