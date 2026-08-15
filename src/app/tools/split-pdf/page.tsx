'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';


import { useState, useRef } from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft, Upload, File, X, ShieldCheck, Download, Loader2, Scissors } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function SplitPDFToolWrapper() {
  const meta = tools.find(t => t.slug === 'split-pdf');
  return (
    <EnhancedToolWrapper meta={meta}>
      <SplitPDFToolWrapper />
    </EnhancedToolWrapper>
  );
}
