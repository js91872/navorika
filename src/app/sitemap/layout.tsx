import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Navorika Sitemap',
  description: 'Browse Navorika pages, tool categories, calculators, online utilities, and how-to guides from one sitemap page.',
  alternates: { canonical: 'https://navorika.com/sitemap' },
  robots: { index: true, follow: true },
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
