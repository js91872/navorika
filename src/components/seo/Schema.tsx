'use client';

import { usePathname } from 'next/navigation';
import { tools } from '@/data/registry';

export default function Schema() {
  const pathname = usePathname();
  const baseUrl = 'https://navorika.com';
  
  // Get current page info
  const slug = pathname?.split('/').pop() || '';
  const tool = tools.find(t => t.slug === slug);
  
  const schemas = [];

  // Organization Schema (always present)
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'NavorikaPro',
    description: '200+ free online tools, calculators, PDF editors, image converters, and developer utilities. 100% client-side, no data uploads, no signup required.',
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

  // Breadcrumb Schema
  if (pathname) {
    const items = [
      { position: 1, name: 'Home', item: baseUrl }
    ];
    
    if (pathname.includes('/tools/') && tool) {
      items.push(
        { position: 2, name: 'Tools', item: `${baseUrl}/tools` },
        { position: 3, name: tool.title, item: `${baseUrl}${pathname}` }
      );
    } else if (pathname.includes('/categories/')) {
      const catName = pathname.split('/').pop()?.replace('-', ' ').replace('calculators', '');
      items.push(
        { position: 2, name: 'Categories', item: `${baseUrl}/categories` },
        { position: 3, name: catName || 'Category', item: `${baseUrl}${pathname}` }
      );
    } else if (pathname.includes('/guides/')) {
      items.push(
        { position: 2, name: 'Guides', item: `${baseUrl}/guides` },
        { position: 3, name: 'Guide', item: `${baseUrl}${pathname}` }
      );
    }
    
    if (items.length > 1) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map(item => ({
          '@type': 'ListItem',
          position: item.position,
          name: item.name,
          item: item.item
        }))
      });
    }
  }

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
