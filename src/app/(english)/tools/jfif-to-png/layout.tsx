import type { Metadata } from 'next';
import { languageAlternates } from '@/lib/i18n/config';

export const metadata: Metadata = {
  title: 'Convert JFIF to PNG Online Free | Navorika',
  description: 'Upload a JFIF or JPEG image and download a PNG in your browser.',
  alternates: {
    canonical: 'https://navorika.com/tools/jfif-to-png',
    languages: languageAlternates('jfif-to-png'),
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

