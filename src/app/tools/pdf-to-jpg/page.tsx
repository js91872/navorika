'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';


import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Download, Loader2, FileText, ShieldCheck, X } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function PdfToJpgPageWrapper() {
  const meta = tools.find(t => t.slug === 'pdf-to-jpg');
  return (
    <EnhancedToolWrapper meta={meta}>
      <PdfToJpgPageWrapper />
    </EnhancedToolWrapper>
  );
}
