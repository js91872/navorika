import type { Metadata } from 'next';
import { languageAlternates } from '@/lib/i18n/config';

export const metadata: Metadata = {
  title: 'VCF to CSV Converter – Convert vCard Contacts Online Free | Navorika',
  description: 'Convert a VCF vCard file to CSV for Excel or Google Sheets. Upload contacts, preview results and download CSV free. No signup or contact uploads.',
  alternates: {
    canonical: 'https://navorika.com/tools/vcf-to-csv',
    languages: languageAlternates('vcf-to-csv'),
  },
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
