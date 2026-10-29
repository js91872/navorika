import type { Metadata } from 'next';
import { languageAlternates } from '@/lib/i18n/config';

export const metadata: Metadata = {
  title: 'XML to CSV Converter Online Free | Navorika',
  description: 'Turn flat XML records into CSV rows for spreadsheets and downloads.',
  alternates: {
    canonical: 'https://navorika.com/tools/xml-to-csv',
    languages: languageAlternates('xml-to-csv'),
  },
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
