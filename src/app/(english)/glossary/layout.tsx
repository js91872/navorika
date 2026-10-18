import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Online Tool & Calculator Glossary',
  description: 'Plain-English definitions of common calculator, finance, health, PDF, web, and technology terms used across Navorika tools and guides.',
  alternates: { canonical: 'https://navorika.com/glossary' },
  openGraph: {
    type: 'website',
    url: 'https://navorika.com/glossary',
    title: 'Navorika Glossary – Common Terms Explained',
    description: 'Plain-English definitions for common calculator, finance, health, PDF, and technology terms.',
    siteName: 'Navorika',
  },
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
