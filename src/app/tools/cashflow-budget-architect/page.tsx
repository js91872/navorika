'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BaseRedirectWrapper() {
  const meta = tools.find(t => t.slug === 'cashflow-budget-architect');
  return (
    <EnhancedToolWrapper meta={meta}>
      <BaseRedirect />
    </EnhancedToolWrapper>
  );
}
