import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Taxation Tools Under Review',
  description: 'Navorika taxation tools are being reviewed and are temporarily excluded from search indexing.',
  robots: { index: false, follow: true },
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
