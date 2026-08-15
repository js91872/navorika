'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';


import { useState, useRef } from 'react';
import { FileText, ArrowLeft, Upload, X, ShieldCheck, Download, Loader2, Stamp } from 'lucide-react';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';

export default function AddWatermarkToolWrapper() {
  const meta = tools.find(t => t.slug === 'add-watermark');
  return (
    <EnhancedToolWrapper meta={meta}>
      <AddWatermarkToolWrapper />
    </EnhancedToolWrapper>
  );
}
