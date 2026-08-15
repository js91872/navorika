'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';


import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Footprints, Flame } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ResultCard } from '@/components/ui/ResultCard';
import { Container } from '@/components/ui/Container';

const PACE_OPTIONS = [
  { value: 'slow', label: 'Slow (2.0 mph)' },
  { value: 'moderate', label: 'Moderate (3.0 mph)' },
  { value: 'brisk', label: 'Brisk (3.5 mph)' },
  { value: 'fast', label: 'Fast (4.0 mph)' },
];

const PACE_VALUES: Record<string, number> = {
  slow: 2.0,
  moderate: 3.0,
  brisk: 3.5,
  fast: 4.0,
};

export default function WalkingCaloriesCalculatorWrapper() {
  const meta = tools.find(t => t.slug === 'walking-calories-calculator');
  return (
    <EnhancedToolWrapper meta={meta}>
      <WalkingCaloriesCalculatorWrapper />
    </EnhancedToolWrapper>
  );
}
