'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';


import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Download, Loader2, ImageIcon, ShieldCheck, X } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function ConvertPngToWebpPageWrapper() {
  const meta = tools.find(t => t.slug === 'convert-png-to-webp');
  return (
    <EnhancedToolWrapper meta={meta}>
      <ConvertPngToWebpPageWrapper />
    </EnhancedToolWrapper>
  );
}
