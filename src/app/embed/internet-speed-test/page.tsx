import type { Metadata } from 'next';
import SpeedTest from '@/components/tools/network/SpeedTest';

export const metadata: Metadata = {
  title: 'Navorika Internet Speed Test',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <main><SpeedTest embed /></main>;
}
