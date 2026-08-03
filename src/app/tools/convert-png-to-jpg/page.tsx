'use client';

import ImageConverterEngine from '@/components/ImageConverterEngineWrapper';
import { tools } from '@/data/registry';

export const dynamic = 'force-dynamic';

export default function Page() {
  const meta = tools.find(t => t.slug === 'convert-png-to-jpg');
  return <ImageConverterEngine meta={meta} />;
}
