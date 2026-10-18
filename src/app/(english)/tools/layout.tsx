import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Online Tools & Calculators',
  description: 'Browse free online calculators and tools for PDF files, images, construction, money, health, everyday tasks, and web development. No signup required.',
  alternates: { canonical: 'https://navorika.com/tools' },
  openGraph: {
    type: 'website',
    url: 'https://navorika.com/tools',
    title: 'Free Online Tools & Calculators',
    description: 'Browse free calculators and tools for PDF files, images, construction, money, health, everyday tasks, and web development.',
    siteName: 'Navorika',
  },
};

export default function ToolsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
