'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Upload, X, User, Download, Crop } from 'lucide-react';

// Standard 300 DPI resolutions for professional printing
const PRESETS = [
  { id: 'us_passport', name: 'US Passport / Visa (2x2 in)', w: 600, h: 600 },
  { id: 'uk_passport', name: 'UK / Europe / AU (35x45 mm)', w: 413, h: 531 },
  { id: 'in_passport', name: 'India Passport (3.5x4.5 cm)', w: 413, h: 531 },
  { id: 'in_pan', name: 'India PAN Card (2.5x3.5 cm)', w: 295, h: 413 },
  { id: 'linkedin', name: 'Standard Profile (Square)', w: 800, h: 800 },
];

export default function IdPhotoMakerToolWrapper() {
  const meta = tools.find(t => t.slug === 'id-photo-maker');
  return (
    <EnhancedToolWrapper meta={meta}>
      <IdPhotoMakerTool />
    </EnhancedToolWrapper>
  );
}
