'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BaseRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/tools/savings-retirement-hub/ppf-calculator');
  }, [router]);
  return null;
}
