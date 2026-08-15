'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';


import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Download, Loader2, FileText, ShieldCheck, X, Lock } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function ProtectPDFToolWrapper() {
  const meta = tools.find(t => t.slug === 'protect-pdf');
  return (
    <EnhancedToolWrapper meta={meta}>
      <ProtectPDFToolWrapper />
    </EnhancedToolWrapper>
  );
}
