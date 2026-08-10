'use client';

import { usePathname } from 'next/navigation';

export default function Schema() {
  const pathname = usePathname();
  const baseUrl = 'https://navorika.com';

  // Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Navorika',
    description: '100+ free online calculators, PDF tools, image converters, and developer utilities.',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [
    ],
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/tools?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  // Website Schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Navorika',
    description: '100+ free online tools, calculators, and utilities.',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/tools?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  // Breadcrumb Schema
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbItems = [
    { name: 'Home', url: baseUrl },
    ...segments.map((segment, index) => {
      const href = baseUrl + '/' + segments.slice(0, index + 1).join('/');
      const name = segment.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      return { name, url: href };
    })
  ];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
