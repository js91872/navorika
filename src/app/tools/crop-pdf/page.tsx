'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';

import { useState, useRef } from 'react';
import { FileText, ArrowLeft, Upload, X, ShieldCheck, Download, Loader2, Crop } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function CropPDFToolWrapper() {
  const meta = tools.find(t => t.slug === 'crop-pdf');
  return (
    <EnhancedToolWrapper meta={meta}>
      <CropPDFTool />
    </EnhancedToolWrapper>
  );
}
