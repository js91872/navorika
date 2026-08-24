import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Tool Categories', description: 'Browse Navorika tools by category.', alternates: { canonical: 'https://navorika.com/categories' }, openGraph: { type: 'website', url: 'https://navorika.com/categories', title: 'Navorika Tool Categories', description: 'Browse calculators and utilities by category.', siteName: 'Navorika' } };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
