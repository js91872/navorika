'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';


import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Image as ImageIcon, ShieldCheck, Download, Upload, X, RotateCw, RotateCcw, FlipHorizontal, FlipVertical } from 'lucide-react';

export default function RotateImageToolWrapper() {
  const meta = tools.find(t => t.slug === 'rotate-image');
  return (
    <EnhancedToolWrapper meta={meta}>
      <RotateImageToolWrapper />
    </EnhancedToolWrapper>
  );
}
