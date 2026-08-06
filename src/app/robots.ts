import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/', '/favicon.ico'],
    },
    sitemap: 'https://navorika.vercel.app/sitemap.xml',
    host: 'https://navorika.vercel.app',
  };
}
