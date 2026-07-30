import { ReactNode } from 'react';

export const metadata = {
  title: 'SIP Calculator | Lumpsum, CAGR & Mutual Fund Investment Suite | Navorika',
  description: 'Free high-performance investment calculators. Instantly calculate SIP growth, Lumpsum returns, CAGR metrics, ROI, Compound Interest, and Future Value targets.',
  keywords: 'sip calculator, lumpsum calculator, cagr calculator, mutual fund calculator, roi calculator, compound interest calculator, future value calculator, financial utilities',
};

export default function InvestmentLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
