'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';


import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Download, Loader2, FileText, ShieldCheck, X, Hash } from 'lucide-react';
import { PDFDocument, rgb } from 'pdf-lib';

export default function AddPageNumbersToolWrapper() {
  const meta = tools.find(t => t.slug === 'add-page-numbers');
  return (
    <EnhancedToolWrapper meta={meta}>
      <AddPageNumbersToolWrapper />
    </EnhancedToolWrapper>
  );
}
