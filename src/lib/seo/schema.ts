export function generateWebApplicationSchema(
  name: string,
  description: string,
  url: string,
  category: string
): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: name,
    description: description,
    url: url,
    applicationCategory: category,
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateOrganizationSchema(): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'NavorikaPro',
    description: '200+ free online calculators, PDF tools, image converters, and developer utilities.',
    url: 'https://navorika.com',
    logo: 'https://navorika.com/logo.png',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://navorika.com/tools?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateWebsiteSchema(): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'NavorikaPro',
    description: '200+ free online calculators, PDF tools, image converters, and developer utilities.',
    url: 'https://navorika.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://navorika.com/tools?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
