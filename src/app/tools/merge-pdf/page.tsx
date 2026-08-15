'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';


import { useState, useRef } from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft, Upload, File, X, ShieldCheck, Download, Loader2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function MergePDFToolWrapper() {
  const meta = tools.find(t => t.slug === 'merge-pdf');
  return (
    <EnhancedToolWrapper meta={meta}>
      <MergePDFToolWrapper />
    </EnhancedToolWrapper>
  );
}
