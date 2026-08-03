'use client';

import ImageConverterEngineWrapper from '@/components/ImageConverterEngineWrapper';
import { tools } from '@/data/registry';

export const dynamic = 'force-dynamic';

export default function AddImageToPDFPage() {
  const meta = tools.find(t => t.slug === 'add-image-to-pdf');
  return <ImageConverterEngineWrapper meta={meta} />;
}
