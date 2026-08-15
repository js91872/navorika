'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, PiggyBank, TrendingUp } from 'lucide-react';

export default function PPFCalculatorWrapper() {
  const meta = tools.find(t => t.slug === 'ppf-calculator');
  return (
    <EnhancedToolWrapper meta={meta}>
      <PPFCalculator />
    </EnhancedToolWrapper>
  );
}
