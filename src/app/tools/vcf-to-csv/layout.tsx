import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'VCF to CSV Converter – Convert vCard Contacts Online Free | Navorika',
  description: 'Convert a VCF vCard file to CSV for Excel or Google Sheets. Upload contacts, preview results and download CSV free. No signup or contact uploads.',
  alternates: { canonical: '/tools/vcf-to-csv' },
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
