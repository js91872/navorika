import { ReactNode } from 'react';

export const metadata = {
  title: 'EMI Calculator | Home, Car & Personal Loan Calculator Suite | Navorika',
  description: 'Free, professional online tool suite featuring an accurate EMI Calculator, Home Loan Calculator, Personal Loan Calculator, and Mortgage Amortization planner.',
  keywords: 'emi calculator, loan calculator, personal loan calculator, home loan calculator, car loan calculator, mortgage calculator, financial utilities',
};

export default function LoanCalculatorLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
