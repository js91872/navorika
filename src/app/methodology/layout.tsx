import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calculation Methodology & Testing Standards',
  description: 'How Navorika builds, mathematically tests, verifies, and maintains its browser-local and server-assisted calculation tools.',
  alternates: { canonical: 'https://navorika.com/methodology' },
};

export default function MethodologyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
