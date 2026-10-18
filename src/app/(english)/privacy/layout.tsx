import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Privacy Policy', description: 'How Navorika handles local tool processing, live external data, contact submissions, analytics, and browser preferences.', alternates: { canonical: 'https://navorika.com/privacy' } };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
