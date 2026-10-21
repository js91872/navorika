import type { Metadata } from 'next';
import CashflowArchitectTool from './[suboption]/page';
import { languageAlternates } from '@/lib/i18n/config';

export const metadata: Metadata = {
  title: 'Budget Planner & Cash Flow Calculator',
  description: 'Plan a monthly budget, track income and expenses, and see how much money is left.',
  alternates: {
    canonical: 'https://navorika.com/tools/cashflow-budget-architect',
    languages: languageAlternates('cashflow-budget-architect'),
  },
};

export default function Page() {
  return <CashflowArchitectTool />;
}
