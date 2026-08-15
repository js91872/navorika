'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';


import { useState, useRef } from 'react';
import Link from 'next/navigation';
import { FileText, ArrowLeft, Upload, File, X, ShieldCheck, Download, Loader2, RefreshCw } from 'lucide-react';
import { PDFDocument, degrees } from 'pdf-lib';

export default function RotatePDFToolWrapper() {
  const meta = tools.find(t => t.slug === 'rotate-pdf');
  return (
    <EnhancedToolWrapper meta={meta}>
      <RotatePDFToolWrapper />
    </EnhancedToolWrapper>
  );
}
