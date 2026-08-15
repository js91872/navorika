'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Target, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ResultCard } from '@/components/ui/ResultCard';
import { Container } from '@/components/ui/Container';

const INTENSITY_OPTIONS = [
  { value: 'moderate', label: 'Moderate (50-70%)' },
  { value: 'vigorous', label: 'Vigorous (70-85%)' },
  { value: 'custom', label: 'Custom Range' },
];

export default function TargetHeartRateCalculatorWrapper() {
  const meta = tools.find(t => t.slug === 'target-heart-rate-calculator');
  return (
    <EnhancedToolWrapper meta={meta}>
      <TargetHeartRateCalculator />
    </EnhancedToolWrapper>
  );
}
