import type { Metadata } from 'next';
import { languageAlternates } from '@/lib/i18n/config';

export const metadata: Metadata = {
  title: 'Convert WebP to ICO Favicon Online Free | Navorika',
  description: 'Turn a WebP image into a 64 × 64 ICO favicon without uploading it.',
  alternates: {
    canonical: 'https://navorika.com/tools/webp-to-ico',
    languages: languageAlternates('webp-to-ico'),
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

