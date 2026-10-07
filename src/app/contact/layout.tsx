import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Navorika – Tool Help, Feedback & Bug Reports',
  description: 'Contact Navorika about a calculator, file tool, incorrect result, privacy question, bug report, or suggestion for a new online tool.',
  alternates: { canonical: 'https://navorika.com/contact' },
  openGraph: {
    type: 'website',
    url: 'https://navorika.com/contact',
    title: 'Contact Navorika',
    description: 'Get help with a Navorika calculator or online tool, report a problem, or send feedback.',
    siteName: 'Navorika',
  },
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
