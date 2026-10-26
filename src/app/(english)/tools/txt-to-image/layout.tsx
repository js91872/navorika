import type { Metadata } from 'next';
import { languageAlternates } from '@/lib/i18n/config';

export const metadata: Metadata = {
  title: 'Text to Image Converter – Save Text as PNG Free | Navorika',
  description: 'Turn plain text into a downloadable PNG image with font-size and background options.',
  alternates: {
    canonical: 'https://navorika.com/tools/txt-to-image',
    languages: languageAlternates('txt-to-image'),
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
