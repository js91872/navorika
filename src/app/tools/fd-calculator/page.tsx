'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';


import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Banknote, TrendingUp } from 'lucide-react';

export default function FDCalculatorWrapper() {
  const meta = tools.find(t => t.slug === 'fd-calculator');
  return (
    <EnhancedToolWrapper meta={meta}>
      <FDCalculatorWrapper />
    </EnhancedToolWrapper>
  );
}
