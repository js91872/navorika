'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BaseRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/tools/taxation-compliance-deck/income-tax-calculator');
  }, [router]);
  return null;
}
