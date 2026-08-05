import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/footer/Footer';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Schema from '@/components/seo/Schema';
import SEO from '@/components/seo/SEO';

export const metadata = {
  title: 'NavorikaPro - 200+ Free Online Tools, Calculators & Utilities',
  description: '200+ free online tools including calculators, PDF editors, image converters, and developer utilities. 100% client-side, no uploads, no signup.',
  keywords: 'free online tools, calculators, pdf tools, image tools, developer tools',
  openGraph: {
    title: 'NavorikaPro - 200+ Free Online Tools, Calculators & Utilities',
    description: '200+ free online tools including calculators, PDF editors, image converters, and developer utilities.',
    url: 'https://navorika.vercel.app',
    siteName: 'NavorikaPro',
    images: [
      {
        url: 'https://navorika.vercel.app/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NavorikaPro - 200+ Free Online Tools, Calculators & Utilities',
    description: '200+ free online tools including calculators, PDF editors, image converters, and developer utilities.',
    images: ['https://navorika.vercel.app/og-image.png'],
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>{metadata.title}</title>
      </head>
      <body className="bg-[var(--background)] text-[var(--foreground)] antialiased min-h-screen flex flex-col transition-colors duration-300">
        <ThemeProvider>
          <SEO />
          <Schema />
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
