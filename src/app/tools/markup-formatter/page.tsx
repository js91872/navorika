'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';


import { useState } from 'react';
import { ArrowLeft, ShieldCheck, Database, FileCode2, Copy, AlignLeft, Trash2 } from 'lucide-react';

export default function MarkupFormatterToolWrapper() {
  const meta = tools.find(t => t.slug === 'markup-formatter');
  return (
    <EnhancedToolWrapper meta={meta}>
      <MarkupFormatterToolWrapper />
    </EnhancedToolWrapper>
  );
}
