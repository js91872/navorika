import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions governing the use of Navorika calculators, document utilities, and browser-based software tools.',
  alternates: { canonical: 'https://navorika.com/terms' },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
