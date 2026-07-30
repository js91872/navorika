import { ReactNode } from 'react';

export const metadata = {
  title: 'Business Profit, Margin & Break-Even Calculator | Navorika',
  description: 'Free business finance tools. Calculate Net/Gross profit margins, markups, discounts, break-even points, invoice totals, and business valuations.',
  keywords: 'profit calculator, profit margin calculator, gross margin, net profit, break-even calculator, markup calculator, discount calculator, business valuation',
};

export default function BusinessLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
