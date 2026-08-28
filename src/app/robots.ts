import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: ['/', '/llms.txt', '/tools.json'], disallow: ['/api/', '/debug', '/search'] },
      { userAgent: ['GPTBot', 'Google-Extended', 'ClaudeBot', 'PerplexityBot', 'CCBot'], allow: ['/', '/llms.txt', '/tools.json'], disallow: ['/api/', '/debug', '/search'] },
    ],
    sitemap: 'https://navorika.com/sitemap.xml',
  };
}
