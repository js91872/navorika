'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';


import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Download, Loader2, ImageIcon, ShieldCheck, X } from 'lucide-react';

export default function PngToSvgPageWrapper() {
  const meta = tools.find(t => t.slug === 'png-to-svg');
  return (
    <EnhancedToolWrapper meta={meta}>
      <PngToSvgPageWrapper />
    </EnhancedToolWrapper>
  );
}
