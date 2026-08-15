'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';


import ImageConverterEngine from '@/components/ImageConverterEngineWrapper';

export default function PageWrapper() {
  const meta = tools.find(t => t.slug === 'jpg-to-pdf');
  return (
    <EnhancedToolWrapper meta={meta}>
      <PageWrapper />
    </EnhancedToolWrapper>
  );
}
