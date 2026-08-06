'use client';

interface ToolAISearchProps {
  tool: {
    title: string;
    description: string;
    category: string;
    slug: string;
    keywords: string[];
  };
}

export default function ToolAISearch({ tool }: ToolAISearchProps) {
  const baseUrl = 'https://navorika.vercel.app';
  
  // AI-optimized descriptions for each tool
  const getAIDescription = () => {
    const category = tool.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    return `${tool.title} – a free online ${category} tool that helps you calculate and convert values instantly. 100% client-side, no data uploads.`;
  };

  return (
    <>
      <meta name="description" content={getAIDescription()} />
      <meta name="keywords" content={[...tool.keywords, 'free online tool', 'calculator', 'client-side'].join(', ')} />
      
      <meta property="og:title" content={`${tool.title} – Free Online Tool | NavorikaPro`} />
      <meta property="og:description" content={getAIDescription()} />
      <meta property="og:url" content={`${baseUrl}/tools/${tool.slug}`} />
      <meta property="og:type" content="website" />
      
      <meta name="twitter:title" content={`${tool.title} – Free Online Tool`} />
      <meta name="twitter:description" content={getAIDescription()} />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: tool.title,
            description: getAIDescription(),
            url: `${baseUrl}/tools/${tool.slug}`,
            applicationCategory: tool.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            operatingSystem: 'All',
            browserRequirements: 'Requires JavaScript',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            potentialAction: {
              '@type': 'UseAction',
              target: `${baseUrl}/tools/${tool.slug}`,
            },
          }),
        }}
      />
    </>
  );
}
