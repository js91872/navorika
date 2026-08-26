import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import ClientLayout from '@/components/ClientLayout';
import Breadcrumb from '@/components/ui/Breadcrumb';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  verification: {
  other: {
    'msvalidate.01': '6D321C11DD86042A7ABBC4EA63387AC3',
  },
},
  metadataBase: new URL('https://navorika.com'),
  title: {
    default: 'Navorika – Free Online Tools, Calculators & Utilities',
    template: '%s | Navorika',
  },
  description: 'Privacy-first online tools including calculators, PDF editors, image converters, and developer utilities. Most tools process data locally, with no signup required.',
  keywords: 'free online tools, calculators, pdf tools, image tools, developer tools, client-side, privacy-first, no signup',
  openGraph: {
    title: 'Navorika – Free Online Tools & Calculators',
    description: 'Privacy-first online tools, calculators, PDF editors, image converters, and utilities. Most tools process data locally. No signup.',
    url: 'https://navorika.com',
    siteName: 'Navorika',
    images: [
      {
        url: 'https://navorika.com/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Navorika – Free Online Tools & Calculators',
    description: 'Privacy-first online tools, calculators, PDF editors, image converters, and utilities. Most tools process data locally.',
    images: ['https://navorika.com/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const siteUrl = 'https://navorika.com';
  const siteSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'Navorika',
        url: siteUrl,
        logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.svg` },
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        name: 'Navorika',
        url: siteUrl,
        publisher: { '@id': `${siteUrl}/#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics - Direct head injection */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-ZH4XRJSDLZ"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-ZH4XRJSDLZ');
            `,
          }}
        />
      </head>
      <body className="bg-[var(--background)] text-[var(--foreground)] antialiased min-h-screen flex flex-col transition-colors duration-300">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }} />
        <ThemeProvider>
          <ClientLayout>
            <Breadcrumb />
            {children}
          </ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
