'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';


import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Receipt, Percent } from 'lucide-react';

export default function GSTCalculatorWrapper() {
  const meta = tools.find(t => t.slug === 'gst-calculator');
  return (
    <EnhancedToolWrapper meta={meta}>
      <GSTCalculatorWrapper />
    </EnhancedToolWrapper>
  );
}
