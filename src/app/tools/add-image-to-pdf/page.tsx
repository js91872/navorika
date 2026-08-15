'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';


import ImageConverterEngineWrapper from '@/components/ImageConverterEngineWrapper';

export const dynamic = 'force-dynamic';

export default function AddImageToPDFPageWrapper() {
  const meta = tools.find(t => t.slug === 'add-image-to-pdf');
  return (
    <EnhancedToolWrapper meta={meta}>
      <AddImageToPDFPageWrapper />
    </EnhancedToolWrapper>
  );
}
