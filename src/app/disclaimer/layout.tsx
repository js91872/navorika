import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Legal and calculation disclaimers for Navorika financial, health, construction, and document utility tools.',
  alternates: { canonical: 'https://navorika.com/disclaimer' },
};

export default function DisclaimerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
