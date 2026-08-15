'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Upload, X, Download, MessageSquare } from 'lucide-react';

export default function IconStickerMakerToolWrapper() {
  const meta = tools.find(t => t.slug === 'icon-sticker-maker');
  return (
    <EnhancedToolWrapper meta={meta}>
      <IconStickerMakerTool />
    </EnhancedToolWrapper>
  );
}
