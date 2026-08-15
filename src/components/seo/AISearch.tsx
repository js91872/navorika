'use client';

import { tools } from '@/data/registry';

export default function AISearch() {
  const baseUrl = 'https://navorika.com';
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Navorika',
          description: '200+ free online tools, calculators, PDF editors, image converters, and developer utilities.',
          url: baseUrl,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${baseUrl}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
          }
        })
      }}
    />
  );
}
