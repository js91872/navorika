import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Online Tool Categories',
  description: 'Browse free online tools by category, including calculators, PDF tools, image tools, construction calculators, health tools, and developer utilities.',
  alternates: { canonical: 'https://navorika.com/categories' },
  openGraph: {
    type: 'website',
    url: 'https://navorika.com/categories',
    title: 'Free Online Tool Categories',
    description: 'Browse free calculators, PDF tools, image tools, construction calculators, health tools, and developer utilities.',
    siteName: 'Navorika',
  },
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
