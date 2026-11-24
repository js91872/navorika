import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/llms.txt',
          '/tools.json',
          '/api/step-to-3d-pdf/capabilities',
          '/api/coreldraw/capabilities',
        ],
        disallow: ['/api/', '/debug', '/search'],
      },
    ],
    sitemap: 'https://navorika.com/sitemap.xml',
  };
}
