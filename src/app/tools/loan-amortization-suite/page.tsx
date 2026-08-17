'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoanAmortizationBaseRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Forward the root index crawler request to the primary dynamic sub-route endpoint immediately
    router.replace('/tools/loan-amortization-suite/emi-calculator');
  }, [router]);

  return null;
}
