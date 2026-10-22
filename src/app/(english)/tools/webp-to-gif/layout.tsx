import type { Metadata } from 'next';
import { languageAlternates } from '@/lib/i18n/config';

export const metadata: Metadata = {
  title: 'Convert WebP to GIF Online Free | Navorika',
  description: 'Convert WebP images and supported animated WebP files into GIF format.',
  alternates: {
    canonical: 'https://navorika.com/tools/webp-to-gif',
    languages: languageAlternates('webp-to-gif'),
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

