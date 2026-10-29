import type { Metadata } from 'next';
import { languageAlternates } from '@/lib/i18n/config';

export const metadata: Metadata = {
  title: 'SVG to ICO Converter – Make a Favicon | Navorika',
  description: 'Convert your SVG logo or artwork into a 64px ICO favicon online.',
  alternates: {
    canonical: 'https://navorika.com/tools/svg-to-ico',
    languages: languageAlternates('svg-to-ico'),
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

