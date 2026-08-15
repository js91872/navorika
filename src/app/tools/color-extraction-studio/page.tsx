'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';


import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Upload, X, Pipette, Copy, Check } from 'lucide-react';

export default function ColorExtractionToolWrapper() {
  const meta = tools.find(t => t.slug === 'color-extraction-studio');
  return (
    <EnhancedToolWrapper meta={meta}>
      <ColorExtractionToolWrapper />
    </EnhancedToolWrapper>
  );
}
