'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';

import { useState, useRef } from 'react';
import { ArrowLeft, Image as ImageIcon, ShieldCheck, Download, Upload, X, Minimize } from 'lucide-react';

export default function CompressImageToolWrapper() {
  const meta = tools.find(t => t.slug === 'compress-image');
  return (
    <EnhancedToolWrapper meta={meta}>
      <CompressImageTool />
    </EnhancedToolWrapper>
  );
}
