'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';


import ImageConverterEngine from '@/components/ImageConverterEngineWrapper';

export const dynamic = 'force-dynamic';

export default function PageWrapper() {
  const meta = tools.find(t => t.slug === 'convert-png-to-jpg');
  return (
    <EnhancedToolWrapper meta={meta}>
      <PageWrapper />
    </EnhancedToolWrapper>
  );
}
