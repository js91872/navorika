import type { Metadata } from 'next';
import { languageAlternates } from '@/lib/i18n/config';

export const metadata: Metadata = {
  title: 'Convert AVIF to PNG Online Free | Navorika',
  description: 'Convert AVIF image files into PNG images online without uploading files.',
  alternates: {
    canonical: 'https://navorika.com/tools/avif-to-png',
    languages: languageAlternates('avif-to-png'),
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
