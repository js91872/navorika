'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';

import { useState } from 'react';
import { ArrowLeft, ShieldCheck, Key, RefreshCw, Copy, Trash2, LockOpen } from 'lucide-react';

export default function JwtBase64ToolWrapper() {
  const meta = tools.find(t => t.slug === 'jwt-base64-deck');
  return (
    <EnhancedToolWrapper meta={meta}>
      <JwtBase64Tool />
    </EnhancedToolWrapper>
  );
}
