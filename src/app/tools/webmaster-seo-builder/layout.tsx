import type { Metadata } from 'next';

const url = 'https://navorika.com/tools/webmaster-seo-builder';
const title = 'Webmaster SEO Tools';
const description = 'Explore free browser-based webmaster SEO tools and utilities for campaign URLs, page metadata, and crawler directives.';

export const metadata: Metadata = {
  title,
  description,
  keywords: ['webmaster SEO tools', 'SEO utilities', 'webmaster tools', 'browser-based SEO tools'],
  alternates: { canonical: url },
  openGraph: { type: 'website', url, title, description, siteName: 'Navorika' },
  twitter: { card: 'summary_large_image', title, description },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  '@id': `${url}#breadcrumb`,
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://navorika.com' },
    { '@type': 'ListItem', position: 2, name: 'Developer Tools', item: 'https://navorika.com/categories/developer-tools' },
    { '@type': 'ListItem', position: 3, name: title, item: url },
  ],
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  );
}
