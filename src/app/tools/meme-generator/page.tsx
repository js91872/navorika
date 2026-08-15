'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';


import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Image as ImageIcon, ShieldCheck, Download, Upload, X, Type } from 'lucide-react';

export default function MemeGeneratorToolWrapper() {
  const meta = tools.find(t => t.slug === 'meme-generator');
  return (
    <EnhancedToolWrapper meta={meta}>
      <MemeGeneratorToolWrapper />
    </EnhancedToolWrapper>
  );
}
