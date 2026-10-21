import type { Metadata } from 'next';
import InvestmentProfilerTool from './[suboption]/page';
import { languageAlternates } from '@/lib/i18n/config';

export const metadata: Metadata = {
  title: 'Investment Return Calculator',
  description: 'Calculate investment growth, return on investment (ROI), and annual growth rate (CAGR).',
  alternates: {
    canonical: 'https://navorika.com/tools/investment-return-profiler',
    languages: languageAlternates('investment-return-profiler'),
  },
};

export default function Page() {
  return <InvestmentProfilerTool />;
}
