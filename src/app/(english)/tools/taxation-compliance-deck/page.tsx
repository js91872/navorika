import type { Metadata } from 'next';
import TaxationDeckTool from './[suboption]/page';
import { languageAlternates } from '@/lib/i18n/config';

export const metadata: Metadata = {
  title: 'Tax Calculators & Planning Tools',
  description: 'Use free tax calculators to estimate taxes, deductions, and common tax-planning scenarios.',
  alternates: {
    canonical: 'https://navorika.com/tools/taxation-compliance-deck',
    languages: languageAlternates('taxation-compliance-deck'),
  },
};

export default function Page() {
  return <TaxationDeckTool />;
}
