'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';


import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, Scale } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ResultCard } from '@/components/ui/ResultCard';
import { Container } from '@/components/ui/Container';

export default function HealthyWeightCalculatorWrapper() {
  const meta = tools.find(t => t.slug === 'healthy-weight-calculator');
  return (
    <EnhancedToolWrapper meta={meta}>
      <HealthyWeightCalculatorWrapper />
    </EnhancedToolWrapper>
  );
}
