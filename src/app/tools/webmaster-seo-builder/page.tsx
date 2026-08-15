'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';


import { useState } from 'react';
import { ArrowLeft, ShieldCheck, Globe, Link as LinkIcon, Search, FileText, Copy, Check } from 'lucide-react';

export default function WebmasterSeoToolWrapper() {
  const meta = tools.find(t => t.slug === 'webmaster-seo-builder');
  return (
    <EnhancedToolWrapper meta={meta}>
      <WebmasterSeoToolWrapper />
    </EnhancedToolWrapper>
  );
}
