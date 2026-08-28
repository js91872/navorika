import type { MetadataRoute } from 'next';
import { categories, tools } from '@/data/registry';
import { getFinanceSuiteUrls } from '@/lib/seo/financeSuite';
import { toolsUnderReview } from '@/lib/seo/toolReview';
import { guidesMetadata } from '@/lib/guidesMetadata';
import { toolkits } from '@/data/taxonomy';

const baseUrl = 'https://navorika.com';
const financeSuiteRoots = new Set(['cashflow-budget-architect', 'investment-return-profiler', 'loan-amortization-suite', 'savings-retirement-hub', 'taxation-compliance-deck', 'wealth-inflation-matrix']);

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ['', '/tools', '/categories', '/toolkits', '/guides', '/about', '/contact', '/glossary', '/privacy', '/hubs/finance'];
  const staticPages = staticPaths.map((path) => ({ url: `${baseUrl}${path}` }));
  const toolPages = tools
    .filter(({ slug }) => !financeSuiteRoots.has(slug) && !toolsUnderReview.has(slug))
    .map(({ slug }) => ({ url: `${baseUrl}/tools/${slug}` }));
  const financeSuitePages = getFinanceSuiteUrls()
    .filter((path) => !path.includes('/taxation-compliance-deck/') && !path.endsWith('/fd-calculator') && !path.endsWith('/ppf-calculator'))
    .map((path) => ({ url: `${baseUrl}${path}` }));
  const categoryPages = categories.map(({ slug }) => ({ url: `${baseUrl}/categories/${slug}` }));
  const guidePages = guidesMetadata.map(({ slug, dateModified }) => ({ url: `${baseUrl}/guides/${slug}`, lastModified: new Date(dateModified) }));
  const toolkitPages = toolkits.map(({ slug }) => ({ url: `${baseUrl}/toolkits/${slug}` }));

  return [...staticPages, ...toolPages, ...financeSuitePages, ...categoryPages, ...toolkitPages, ...guidePages];
}
