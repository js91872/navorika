import type { Metadata } from 'next';

export interface ToolPageContent {
  slug: string;
  name: string;
  description: string;
  longTailKeywords: string[];
  category: string;
  applicationCategory: 'HealthApplication' | 'FinanceApplication' | 'UtilitiesApplication' | 'DeveloperApplication' | 'DesignApplication';
  intro: string[];
  formula?: { title: string; body: string }[];
  steps: string[];
  interpretation: string[];
  limitations: string[];
  faqs: { question: string; answer: string }[];
  relatedTools: { slug: string; name: string }[];
  relatedGuides: string[];
}

const baseUrl = 'https://navorika.com';

export function createToolMetadata(tool: ToolPageContent): Metadata {
  const url = `${baseUrl}/tools/${tool.slug}`;
  return {
    title: tool.name,
    description: tool.description,
    keywords: tool.longTailKeywords,
    alternates: { canonical: url },
    openGraph: { type: 'website', url, title: tool.name, description: tool.description, siteName: 'Navorika' },
    twitter: { card: 'summary_large_image', title: tool.name, description: tool.description },
  };
}

export function createToolJsonLd(tool: ToolPageContent) {
  const url = `${baseUrl}/tools/${tool.slug}`;
  const categorySlug = tool.category.toLowerCase().replaceAll(' ', '-');
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication', '@id': `${url}#application`, name: tool.name, url,
        description: tool.description, applicationCategory: tool.applicationCategory,
        operatingSystem: 'Any', browserRequirements: 'JavaScript enabled', isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
      {
        '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
          { '@type': 'ListItem', position: 2, name: tool.category, item: `${baseUrl}/categories/${categorySlug}` },
          { '@type': 'ListItem', position: 3, name: tool.name, item: url },
        ],
      },
    ],
  };
}
