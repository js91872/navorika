import type { MetadataRoute } from 'next';
import { categories, tools } from '@/data/registry';
import { getFinanceSuiteUrls } from '@/lib/seo/financeSuite';
import { toolsUnderReview } from '@/lib/seo/toolReview';
import { guidesMetadata } from '@/lib/guidesMetadata';

const baseUrl = 'https://navorika.com';
const financeSuiteRoots = new Set(['cashflow-budget-architect', 'investment-return-profiler', 'loan-amortization-suite', 'savings-retirement-hub', 'taxation-compliance-deck', 'wealth-inflation-matrix']);

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ['', '/tools', '/categories', '/guides', '/about', '/contact', '/glossary', '/privacy', '/hubs/finance'];
  const staticPages = staticPaths.map((path) => ({ url: `${baseUrl}${path}` }));
  const toolPages = tools
    .filter(({ slug }) => !financeSuiteRoots.has(slug) && !toolsUnderReview.has(slug))
    .map(({ slug }) => ({ url: `${baseUrl}/tools/${slug}` }));
  const duplicateFinanceSuitePaths = new Set([
  '/tools/savings-retirement-hub/fd-calculator',
  '/tools/savings-retirement-hub/ppf-calculator',
]);

const financeSuitePages = getFinanceSuiteUrls()
  .filter((path) => !path.includes('/taxation-compliance-deck/'))
  .filter((path) => !duplicateFinanceSuitePaths.has(path))
  .map((path) => ({ url: `${baseUrl}${path}` }));
  const categoryPages = categories.map(({ slug }) => ({ url: `${baseUrl}/categories/${slug}` }));
  const guidePages = guidesMetadata.map(({ slug, dateModified }) => ({ url: `${baseUrl}/guides/${slug}`, lastModified: new Date(dateModified) }));

  return [...staticPages, ...toolPages, ...financeSuitePages, ...categoryPages, ...guidePages];
}
