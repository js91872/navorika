import type { Metadata } from 'next';
import { publicPageAlternates } from '@/lib/i18n/config';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Navorika handles local tool processing, live external data, contact submissions, analytics, and browser preferences.',
  alternates: {
    canonical: 'https://navorika.com/privacy',
    languages: publicPageAlternates('/privacy'),
  },
};
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
