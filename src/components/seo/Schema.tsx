'use client';

import { usePathname } from 'next/navigation';
import { tools } from '@/data/registry';

export default function Schema() {
  const pathname = usePathname();
  const baseUrl = 'https://navorika.com';
  
  const slug = pathname?.split('/').pop() || '';
  const tool = tools.find(t => t.slug === slug);
  
  const schemas = [];

  // Organization Schema
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'NavorikaPro',
    description: '200+ free online tools, calculators, PDF editors, image converters, and developer utilities.',
    url: baseUrl,
    logo: `${baseUrl}/favicon.svg`,
    sameAs: [
      'https://github.com/js91872/navorika',
      'https://twitter.com/navorika',
      'https://linkedin.com/company/navorika'
    ],
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  });

  // WebSite Schema
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'NavorikaPro',
    description: '200+ free online tools, calculators, and utilities.',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  });

  // Tool Schema (if on a tool page)
  if (tool) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: tool.title,
      description: tool.description,
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'All',
      browserRequirements: 'Modern browser with JavaScript enabled',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description: '100% free tool'
      },
      url: `${baseUrl}${pathname}`
    });
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemas)
      }}
    />
  );
}
