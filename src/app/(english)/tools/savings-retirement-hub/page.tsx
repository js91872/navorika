import type { Metadata } from 'next';
import SavingsRetirementHubTool from './[suboption]/page';
import { languageAlternates } from '@/lib/i18n/config';

export const metadata: Metadata = {
  title: 'Savings Retirement Hub',
  description: 'Plan your savings and retirement online free. Calculate how much you need to save for retirement.',
  alternates: {
    canonical: 'https://navorika.com/tools/savings-retirement-hub',
    languages: languageAlternates('savings-retirement-hub'),
  },
};

export default function Page() {
  return <SavingsRetirementHubTool />;
}
