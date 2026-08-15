'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';

import { useState, useRef } from 'react';
import { ArrowLeft, Upload, LayoutGrid, Download, X } from 'lucide-react';

export default function PhotoCollageMakerToolWrapper() {
  const meta = tools.find(t => t.slug === 'photo-collage-maker');
  return (
    <EnhancedToolWrapper meta={meta}>
      <PhotoCollageMakerTool />
    </EnhancedToolWrapper>
  );
}
