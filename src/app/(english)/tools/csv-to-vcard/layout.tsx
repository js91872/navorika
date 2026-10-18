import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'CSV to vCard Converter – Convert CSV to VCF Online Free | Navorika',
  description: 'Convert CSV contact lists to VCF (vCard 3.0) online free. Upload CSV, preview contacts and download a VCF file. No signup or contact uploads.',
  alternates: { canonical: '/tools/csv-to-vcard' },
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
