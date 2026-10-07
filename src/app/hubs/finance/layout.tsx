import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Finance Calculators – Loans, Savings, Investing & Budgets',
  description: 'Browse free finance calculators for loans, savings, investing, budgets, property, business metrics, and everyday money planning.',
  alternates: { canonical: 'https://navorika.com/hubs/finance' },
  openGraph: {
    type: 'website',
    url: 'https://navorika.com/hubs/finance',
    title: 'Free Finance Calculators & Money Guides',
    description: 'Free calculators and guides for loans, savings, investing, budgets, property, and everyday money decisions.',
    siteName: 'Navorika',
  },
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
