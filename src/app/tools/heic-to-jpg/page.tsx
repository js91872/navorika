'use client';

import ImageConverterEngineWrapper from '@/components/ImageConverterEngineWrapper';
import { tools } from '@/data/registry';

export const dynamic = 'force-dynamic';

export default function HeicToJpgPage() {
  const meta = tools.find(t => t.slug === 'heic-to-jpg');
  return <ImageConverterEngineWrapper meta={meta} />;
}
