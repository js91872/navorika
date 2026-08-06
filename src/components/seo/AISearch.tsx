'use client';

export default function AISearch() {
  const baseUrl = 'https://navorika.vercel.app';

  // AI search optimization
  const aiMeta = {
    // Google AI Overviews (SGE)
    'google-ai': 'NavorikaPro: 200+ free online tools, calculators, PDF editors, and utilities. 100% client-side, no data uploads.',
    
    // Bing AI / Copilot
    'bing-ai': 'NavorikaPro is a free platform with 200+ online tools including calculators, PDF editors, image converters, and developer utilities. All processing happens locally in your browser.',
    
    // ChatGPT / GPT search
    'chatgpt': 'NavorikaPro is a privacy-first, client-side platform offering 200+ free online tools and calculators. No signup required. No data uploads.',
    
    // Perplexity AI
    'perplexity': 'NavorikaPro offers 200+ free online tools including EMI calculators, BMI calculators, PDF compressors, and image converters. Everything runs in your browser.',
  };

  return (
    <>
      {/* AI-specific meta tags */}
      <meta name="google-ai" content={aiMeta['google-ai']} />
      <meta name="bing-ai" content={aiMeta['bing-ai']} />
      <meta name="chatgpt" content={aiMeta['chatgpt']} />
      <meta name="perplexity" content={aiMeta['perplexity']} />
      
      {/* Natural language description for AI */}
      <meta name="description" content="NavorikaPro is a free platform with 200+ online tools, calculators, PDF editors, and utilities. 100% client-side, no data uploads, no signup required." />
      
      {/* AI-friendly keywords */}
      <meta name="keywords" content="free online tools, calculators, PDF tools, image converters, developer utilities, client-side, privacy-first, no signup, 200+ tools" />
      
      {/* Open Graph for AI */}
      <meta property="og:title" content="NavorikaPro – 200+ Free Online Tools & Calculators" />
      <meta property="og:description" content="Free online tools, calculators, PDF editors, and utilities. 100% client-side. No data uploads. No signup required." />
      <meta property="og:image" content={`${baseUrl}/og-image.png`} />
      <meta property="og:url" content={baseUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="NavorikaPro" />
      
      {/* Twitter for AI */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="NavorikaPro – 200+ Free Online Tools & Calculators" />
      <meta name="twitter:description" content="Free online tools, calculators, PDF editors, and utilities. 100% client-side. No data uploads." />
      <meta name="twitter:image" content={`${baseUrl}/og-image.png`} />
      
      {/* JSON-LD for AI understanding */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': ['WebSite', 'Organization'],
            name: 'NavorikaPro',
            description: '200+ free online tools, calculators, PDF editors, image converters, and developer utilities. 100% client-side processing. No data uploads. No signup required.',
            url: baseUrl,
            logo: `${baseUrl}/logo.png`,
            sameAs: [
              'https://github.com/js91872/navorika',
            ],
            potentialAction: {
              '@type': 'SearchAction',
              target: `${baseUrl}/tools?q={search_term_string}`,
              'query-input': 'required name=search_term_string',
            },
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
              description: 'All tools are completely free to use.',
            },
          }),
        }}
      />
    </>
  );
}
