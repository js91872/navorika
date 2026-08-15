'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';


import { useState, useRef, useEffect } from 'react';
import { FileText, ArrowLeft, Upload, X, ShieldCheck, Download, Loader2, PenTool, Eraser } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function SignPDFToolWrapper() {
  const meta = tools.find(t => t.slug === 'sign-pdf');
  return (
    <EnhancedToolWrapper meta={meta}>
      <SignPDFToolWrapper />
    </EnhancedToolWrapper>
  );
}
