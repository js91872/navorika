'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';

import { useState, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Regex, Clock, Palette, Copy, Check } from 'lucide-react';

export default function DeveloperUtilsToolWrapper() {
  const meta = tools.find(t => t.slug === 'developer-utils');
  return (
    <EnhancedToolWrapper meta={meta}>
      <DeveloperUtilsTool />
    </EnhancedToolWrapper>
  );
}
