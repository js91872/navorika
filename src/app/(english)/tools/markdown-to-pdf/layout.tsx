import type { Metadata } from 'next';
import { languageAlternates } from '@/lib/i18n/config';

export const metadata: Metadata = {
  title: 'Markdown to PDF Converter Online Free | Navorika',
  description: 'Convert Markdown text or MD files into a simple downloadable PDF.',
  alternates: {
    canonical: 'https://navorika.com/tools/markdown-to-pdf',
    languages: languageAlternates('markdown-to-pdf'),
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

