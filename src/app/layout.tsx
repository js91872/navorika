import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import Navbar from '@/components/header/Navbar';
import Footer from '@/components/footer/Footer';
import './globals.css';

export const metadata = {
  metadataBase: new URL('https://navorika.com'),
  title: {
    default: 'Navorika Pro | Enterprise-Grade Browser Utilities & PDF Suite',
    template: '%s | Navorika Pro'
  },
  description: 'Access 40+ premium client-side calculators, converters, financial tools, and secure PDF utilities with zero latency and absolute privacy.',
  keywords: ['PDF tools', 'financial calculators', 'loan EMI calculator', 'tax calculator', 'browser utilities', 'client side PDF encrypt', 'Navorika Pro'],
  authors: [{ name: 'Navorika Systems' }],
  creator: 'Navorika Systems',
  publisher: 'Navorika Systems',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://navorika.com',
    title: 'Navorika Pro | Enterprise-Grade Browser Utilities',
    description: 'Access 40+ premium client-side calculators, financial tools, and secure PDF utilities.',
    siteName: 'Navorika Pro',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Navorika Pro Dashboard',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Navorika Pro | Enterprise-Grade Browser Utilities',
    description: 'Access 40+ premium client-side calculators and secure PDF utilities.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen flex flex-col transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className="flex-grow pt-20">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
