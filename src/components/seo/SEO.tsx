'use client';

import Head from 'next/head';
import { usePathname } from 'next/navigation';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
}

export default function SEO({
  title = 'Navorika – 100+ Free Online Tools, Calculators & Utilities',
  description = '100+ free online tools including calculators, PDF editors, image converters, and developer utilities. 100% client-side, no uploads, no signup.',
  keywords = ['free online tools', 'calculators', 'pdf tools', 'image tools', 'developer tools'],
  ogImage = 'https://navorika.com/og-image.png',
  canonical = 'https://navorika.com'
}: SEOProps) {
  const pathname = usePathname();
  const url = canonical + pathname;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="robots" content="index, follow" />
      
      <link rel="canonical" href={url} />
      
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Head>
  );
}
