import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Search Tools', description: 'Search Navorika tools by name, description, or keyword.', alternates: { canonical: 'https://navorika.com/search' }, robots: { index: false, follow: true } };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
