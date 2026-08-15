'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';

import { useState, useRef } from 'react';
import { ArrowLeft, Image as ImageIcon, ShieldCheck, Crop, Upload, X } from 'lucide-react';

export default function CropImageToolWrapper() {
  const meta = tools.find(t => t.slug === 'crop-image');
  return (
    <EnhancedToolWrapper meta={meta}>
      <CropImageTool />
    </EnhancedToolWrapper>
  );
}
