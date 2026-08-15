'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';


import { useState, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Fingerprint, KeyRound, Lock, Copy, Check } from 'lucide-react';

export default function WebCryptoStudioToolWrapper() {
  const meta = tools.find(t => t.slug === 'web-crypto-studio');
  return (
    <EnhancedToolWrapper meta={meta}>
      <WebCryptoStudioToolWrapper />
    </EnhancedToolWrapper>
  );
}
