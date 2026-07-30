import { ReactNode } from 'react';

export const metadata = {
  title: 'FD Calculator | RD, PPF & Retirement Savings Calculator Suite | Navorika',
  description: 'Free online savings tools. Calculate Fixed Deposit (FD) returns, Recurring Deposits (RD), PPF growth, EPF corpora, NPS yields, and Emergency fund safety marks.',
  keywords: 'fd calculator, rd calculator, ppf calculator, epf calculator, nps calculator, sukanya samriddhi calculator, emergency fund calculator, savings hub',
};

export default function SavingsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
