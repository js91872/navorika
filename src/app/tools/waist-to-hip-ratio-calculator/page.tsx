'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Ruler, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ResultCard } from '@/components/ui/ResultCard';
import { Container } from '@/components/ui/Container';
import { calculateWHR } from '@/lib/calculations/health';

export default function WaistToHipRatioCalculatorWrapper() {
  const meta = tools.find(t => t.slug === 'waist-to-hip-ratio-calculator');
  return (
    <EnhancedToolWrapper meta={meta}>
      <WaistToHipRatioCalculator />
    </EnhancedToolWrapper>
  );
}
