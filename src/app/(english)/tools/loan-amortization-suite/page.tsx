import type { Metadata } from 'next';
import DynamicLoanSubOptionTool from './[suboption]/page';
import { languageAlternates } from '@/lib/i18n/config';

export const metadata: Metadata = {
  title: 'Loan Payment & Amortization Calculator',
  description: 'Calculate loan payments, interest, payoff schedules, and how much you will repay over time.',
  alternates: {
    canonical: 'https://navorika.com/tools/loan-amortization-suite',
    languages: languageAlternates('loan-amortization-suite'),
  },
};

export default function Page() {
  return <DynamicLoanSubOptionTool />;
}
