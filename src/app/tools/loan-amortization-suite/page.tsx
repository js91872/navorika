'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoanAmortizationBaseRedirectWrapper() {
  const meta = tools.find(t => t.slug === 'loan-amortization-suite');
  return (
    <EnhancedToolWrapper meta={meta}>
      <LoanAmortizationBaseRedirect />
    </EnhancedToolWrapper>
  );
}
