'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';


import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Download, Loader2, FileText, ShieldCheck, X } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function ExtractPdfTextPageWrapper() {
  const meta = tools.find(t => t.slug === 'extract-pdf-text');
  return (
    <EnhancedToolWrapper meta={meta}>
      <ExtractPdfTextPageWrapper />
    </EnhancedToolWrapper>
  );
}
