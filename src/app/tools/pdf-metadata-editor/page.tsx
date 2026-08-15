'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';

import { useState, useRef } from 'react';
import { FileText, ArrowLeft, Upload, X, ShieldCheck, Download, Loader2, Tag } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function PDFMetadataEditorToolWrapper() {
  const meta = tools.find(t => t.slug === 'pdf-metadata-editor');
  return (
    <EnhancedToolWrapper meta={meta}>
      <PDFMetadataEditorTool />
    </EnhancedToolWrapper>
  );
}
