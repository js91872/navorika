'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';


import Link from 'next/link';

export default function DeveloperUtilitiesPageWrapper() {
  const meta = tools.find(t => t.slug === 'developer-utilities');
  return (
    <EnhancedToolWrapper meta={meta}>
      <DeveloperUtilitiesPageWrapper />
    </EnhancedToolWrapper>
  );
}
