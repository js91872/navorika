'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';


import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Download, Loader2, ImageIcon, ShieldCheck, X } from 'lucide-react';

export default function ConvertWebpToJpgPageWrapper() {
  const meta = tools.find(t => t.slug === 'convert-webp-to-jpg');
  return (
    <EnhancedToolWrapper meta={meta}>
      <ConvertWebpToJpgPageWrapper />
    </EnhancedToolWrapper>
  );
}
