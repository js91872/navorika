'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Download, Loader2, FileText, ShieldCheck, X } from 'lucide-react';

export default function BioluminescentReaderToolWrapper() {
  const meta = tools.find(t => t.slug === 'bioluminescent-reader');
  return (
    <EnhancedToolWrapper meta={meta}>
      <BioluminescentReaderTool />
    </EnhancedToolWrapper>
  );
}
