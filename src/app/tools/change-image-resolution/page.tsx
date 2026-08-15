'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';

import { useState, useRef } from 'react';
import { ArrowLeft, Upload, X, Monitor } from 'lucide-react';

export default function ChangeResolutionToolWrapper() {
  const meta = tools.find(t => t.slug === 'change-image-resolution');
  return (
    <EnhancedToolWrapper meta={meta}>
      <ChangeResolutionTool />
    </EnhancedToolWrapper>
  );
}
