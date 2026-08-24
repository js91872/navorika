import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Online Tools Directory',
  description: 'Browse Navorika calculators, PDF tools, image utilities, developer tools, and construction tools.',
  alternates: { canonical: 'https://navorika.com/tools' },
  openGraph: { type: 'website', url: 'https://navorika.com/tools', title: 'Navorika Online Tools Directory', description: 'Browse active calculators and browser-based utilities.', siteName: 'Navorika' },
};

export default function ToolsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
