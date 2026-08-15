'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';

import { useState, useRef } from 'react';
import { ArrowLeft, Image as ImageIcon, ShieldCheck, Upload, X, Minimize } from 'lucide-react';

export default function CompressWEBPToolWrapper() {
  const meta = tools.find(t => t.slug === 'compress-webp');
  return (
    <EnhancedToolWrapper meta={meta}>
      <CompressWEBPTool />
    </EnhancedToolWrapper>
  );
}
