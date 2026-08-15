'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';


import { useState } from 'react';
import { ArrowLeft, ShieldCheck, FileJson, CheckCircle2, XCircle, Copy, Minimize2, AlignLeft, Trash2 } from 'lucide-react';

export default function UniversalJsonStudioToolWrapper() {
  const meta = tools.find(t => t.slug === 'universal-json-studio');
  return (
    <EnhancedToolWrapper meta={meta}>
      <UniversalJsonStudioToolWrapper />
    </EnhancedToolWrapper>
  );
}
