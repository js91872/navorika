'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';


import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Image as ImageIcon, ShieldCheck, Download, Upload, X, Sliders } from 'lucide-react';

export default function PhotoEditorToolWrapper() {
  const meta = tools.find(t => t.slug === 'photo-editor');
  return (
    <EnhancedToolWrapper meta={meta}>
      <PhotoEditorToolWrapper />
    </EnhancedToolWrapper>
  );
}
