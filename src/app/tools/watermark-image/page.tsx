'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Image as ImageIcon, ShieldCheck, Download, Upload, X, Stamp } from 'lucide-react';

export default function WatermarkImageToolWrapper() {
  const meta = tools.find(t => t.slug === 'watermark-image');
  return (
    <EnhancedToolWrapper meta={meta}>
      <WatermarkImageTool />
    </EnhancedToolWrapper>
  );
}
