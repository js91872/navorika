'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';


import { useState } from 'react';
import { ArrowLeft, Code, ShieldCheck, RefreshCw, Copy, Check } from 'lucide-react';

export default function Base64EncoderToolWrapper() {
  const meta = tools.find(t => t.slug === 'base64-encoder');
  return (
    <EnhancedToolWrapper meta={meta}>
      <Base64EncoderToolWrapper />
    </EnhancedToolWrapper>
  );
}
