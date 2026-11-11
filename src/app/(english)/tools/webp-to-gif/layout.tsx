import PageHelp from '@/components/seo/PageHelp';
import type { Metadata } from 'next';
import { languageAlternates } from '@/lib/i18n/config';

export const metadata: Metadata = {
  title: 'Convert WebP to GIF Online Free | Navorika',
  description: 'Convert a WebP image into a still GIF in your browser. Animation is not preserved.',
  alternates: {
    canonical: 'https://navorika.com/tools/webp-to-gif',
    languages: languageAlternates('webp-to-gif'),
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}<PageHelp path="/tools/webp-to-gif" /></>;
}

