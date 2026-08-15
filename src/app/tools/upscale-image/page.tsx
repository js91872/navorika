'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Image as ImageIcon, ShieldCheck, Download, Upload, X, ZoomIn } from 'lucide-react';

export default function UpscaleImageToolWrapper() {
  const meta = tools.find(t => t.slug === 'upscale-image');
  return (
    <EnhancedToolWrapper meta={meta}>
      <UpscaleImageTool />
    </EnhancedToolWrapper>
  );
}
