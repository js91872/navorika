'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';

import ImageConverterEngineWrapper from '@/components/ImageConverterEngineWrapper';

export const dynamic = 'force-dynamic';

export default function HeicToJpgPageWrapper() {
  const meta = tools.find(t => t.slug === 'heic-to-jpg');
  return (
    <EnhancedToolWrapper meta={meta}>
      <HeicToJpgPage />
    </EnhancedToolWrapper>
  );
}
