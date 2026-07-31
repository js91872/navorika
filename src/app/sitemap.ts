import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://navorika.com';

  // Core static routes
  const routes = [
    '',
    '/categories/finance',
    '/categories/pdf-tools',
    '/categories/image-tools',
    '/categories/health',
    '/categories/productivity',
    '/categories/developer-tools',
    '/privacy',
    '/contact',
    '/tools/pdf-security',
    '/tools/pdf-converter',
    '/tools/pdf-editor',
    '/tools/pdf-optimizer',
    '/tools/pdf-page-numbers',
    '/tools/pdf-tools',
    '/tools/business-calculators',
    '/tools/savings-calculators',
    '/tools/loan-emi-calculator',
    '/tools/retirement-calculators',
    '/tools/tax-calculators',
    '/tools/credit-card-calculators',
    '/tools/banking-calculators',
    '/tools/salary-calculators',
    '/tools/insurance-calculators',
    '/tools/investment-calculators',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  return routes;
}
