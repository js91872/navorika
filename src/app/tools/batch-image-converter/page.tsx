'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';


import { useState, useRef } from 'react';
import { ArrowLeft, ShieldCheck, Upload, X, Layers, ArrowRight } from 'lucide-react';

export default function BatchImageConverterToolWrapper() {
  const meta = tools.find(t => t.slug === 'batch-image-converter');
  return (
    <EnhancedToolWrapper meta={meta}>
      <BatchImageConverterToolWrapper />
    </EnhancedToolWrapper>
  );
}
