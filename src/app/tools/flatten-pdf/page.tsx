'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';

import { useState, useRef } from 'react';
import { FileText, ArrowLeft, Upload, X, ShieldCheck, Download, Loader2, Layers } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function FlattenPDFToolWrapper() {
  const meta = tools.find(t => t.slug === 'flatten-pdf');
  return (
    <EnhancedToolWrapper meta={meta}>
      <FlattenPDFTool />
    </EnhancedToolWrapper>
  );
}
