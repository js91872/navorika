'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Ruler, Package, Calculator } from 'lucide-react';
import { calculateConcrete } from '@/lib/calculations/construction';

export default function ConcreteCalculatorWrapper() {
  const meta = tools.find(t => t.slug === 'concrete-calculator');
  return (
    <EnhancedToolWrapper meta={meta}>
      <ConcreteCalculator />
    </EnhancedToolWrapper>
  );
}
