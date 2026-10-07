import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How Navorika Calculators Work – Formulas, Sources & Testing',
  description: 'Learn how Navorika chooses calculator formulas, uses data sources, handles files, tests results, and explains important tool limitations.',
  alternates: { canonical: 'https://navorika.com/methodology' },
};

export default function MethodologyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
