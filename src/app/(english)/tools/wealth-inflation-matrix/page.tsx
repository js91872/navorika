import type { Metadata } from 'next';
import WealthMatrixTool from './[suboption]/page';
import { languageAlternates } from '@/lib/i18n/config';

export const metadata: Metadata = {
  title: 'Inflation & Future Value Calculator',
  description: 'See how inflation changes the future buying power of your money and savings over time.',
  alternates: {
    canonical: 'https://navorika.com/tools/wealth-inflation-matrix',
    languages: languageAlternates('wealth-inflation-matrix'),
  },
};

export default function Page() {
  return <WealthMatrixTool />;
}
