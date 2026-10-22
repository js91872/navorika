import type { Metadata } from 'next';
import { languageAlternates } from '@/lib/i18n/config';

export const metadata: Metadata = {
  title: 'HEIC to PDF Converter Online Free | Navorika',
  description: 'Convert iPhone HEIC photos into PDF documents in your browser.',
  alternates: {
    canonical: 'https://navorika.com/tools/heic-to-pdf',
    languages: languageAlternates('heic-to-pdf'),
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

