'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Image as ImageIcon, ShieldCheck, Download, Upload, X, Maximize } from 'lucide-react';

export default function ResizeImageToolWrapper() {
  const meta = tools.find(t => t.slug === 'resize-image');
  return (
    <EnhancedToolWrapper meta={meta}>
      <ResizeImageTool />
    </EnhancedToolWrapper>
  );
}
