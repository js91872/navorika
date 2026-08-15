'use client';

import { Tool } from '@/data/registry';

interface ToolAISearchProps {
  tool: Tool;
}

export default function ToolAISearch({ tool }: ToolAISearchProps) {
  const baseUrl = 'https://navorika.com';
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
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
            priceCurrency: 'USD'
          },
          url: `${baseUrl}/tools/${tool.slug}`
        })
      }}
    />
  );
}
