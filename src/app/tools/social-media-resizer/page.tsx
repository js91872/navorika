'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Upload, X, Crop, MonitorSmartphone } from 'lucide-react';

type PlatformPreset = { id: string; name: string; formats: { name: string; w: number; h: number }[] };

const PRESETS: PlatformPreset[] = [
  { id: 'instagram', name: 'Instagram', formats: [{ name: 'Square Post', w: 1080, h: 1080 }, { name: 'Portrait Post', w: 1080, h: 1350 }, { name: 'Story / Reel', w: 1080, h: 1920 }] },
  { id: 'facebook', name: 'Facebook', formats: [{ name: 'Shared Image', w: 1200, h: 630 }, { name: 'Cover Photo', w: 820, h: 312 }, { name: 'Profile Picture', w: 170, h: 170 }] },
  { id: 'youtube', name: 'YouTube', formats: [{ name: 'Thumbnail', w: 1280, h: 720 }, { name: 'Channel Banner', w: 2560, h: 1440 }, { name: 'Profile Pic', w: 800, h: 800 }] },
  { id: 'twitter', name: 'Twitter / X', formats: [{ name: 'In-Stream Photo', w: 1600, h: 900 }, { name: 'Header', w: 1500, h: 500 }] },
  { id: 'linkedin', name: 'LinkedIn', formats: [{ name: 'Company Logo', w: 300, h: 300 }, { name: 'Cover Photo', w: 1128, h: 191 }, { name: 'Shared Image', w: 1200, h: 627 }] },
  { id: 'pinterest', name: 'Pinterest', formats: [{ name: 'Standard Pin', w: 1000, h: 1500 }, { name: 'Square Pin', w: 1000, h: 1000 }] },
];

export default function SocialMediaResizerToolWrapper() {
  const meta = tools.find(t => t.slug === 'social-media-resizer');
  return (
    <EnhancedToolWrapper meta={meta}>
      <SocialMediaResizerTool />
    </EnhancedToolWrapper>
  );
}
