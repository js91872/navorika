'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';


import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Flame, Activity } from 'lucide-react';

export default function BMRCalculatorWrapper() {
  const meta = tools.find(t => t.slug === 'bmr-calculator');
  return (
    <EnhancedToolWrapper meta={meta}>
      <BMRCalculatorWrapper />
    </EnhancedToolWrapper>
  );
}
