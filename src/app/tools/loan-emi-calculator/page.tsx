'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LoanEMICalculatorWrapper() {
  const meta = tools.find(t => t.slug === 'loan-emi-calculator');
  return (
    <EnhancedToolWrapper meta={meta}>
      <LoanEMICalculator />
    </EnhancedToolWrapper>
  );
}
