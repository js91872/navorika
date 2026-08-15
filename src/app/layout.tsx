import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/footer/Footer';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Schema from '@/components/seo/Schema';
import SEO from '@/components/seo/SEO';
import AISearch from '@/components/seo/AISearch';
import GoogleAnalytics from '@/components/GoogleAnalytics';

export const metadata = {
  title: 'Navorika – 100+ Free Online Tools, Calculators & Utilities',
  description: '100+ free online tools including calculators, PDF editors, image converters, and developer utilities. 100% client-side, no data uploads, no signup required.',
  keywords: 'free online tools, calculators, pdf tools, image tools, developer tools, client-side, privacy-first, no signup',
  openGraph: {
    title: 'Navorika – 100+ Free Online Tools & Calculators',
    description: 'Free online tools, calculators, PDF editors, image converters, and utilities. 100% client-side. No data uploads. No signup.',
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
    title: 'Navorika – 100+ Free Online Tools & Calculators',
    description: 'Free online tools, calculators, PDF editors, image converters, and utilities. 100% client-side. No data uploads.',
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
  alternates: {
    canonical: 'https://navorika.com',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>{metadata.title}</title>
      </head>
      <body className="bg-[var(--background)] text-[var(--foreground)] antialiased min-h-screen flex flex-col transition-colors duration-300">
        <GoogleAnalytics />
        <ThemeProvider>
          <SEO />
          <Schema />
          <AISearch />
          <Navbar />
          <main className="flex-1 pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            <Breadcrumb />
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
