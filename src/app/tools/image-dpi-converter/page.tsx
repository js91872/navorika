'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';

import ImageConverterEngine from '@/components/ImageConverterEngineWrapper';

export default function PageWrapper() {
  const meta = tools.find(t => t.slug === 'image-dpi-converter');
  return (
    <EnhancedToolWrapper meta={meta}>
      <Page />
    </EnhancedToolWrapper>
  );
}
