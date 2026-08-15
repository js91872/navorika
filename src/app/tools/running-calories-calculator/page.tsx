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
  { value: 'slow', label: 'Slow (5 mph / 12 min mile)' },
  { value: 'moderate', label: 'Moderate (6 mph / 10 min mile)' },
  { value: 'fast', label: 'Fast (7 mph / 8.5 min mile)' },
  { value: 'sprint', label: 'Sprint (8+ mph)' },
];

const PACE_VALUES: Record<string, number> = {
  slow: 5.0,
  moderate: 6.0,
  fast: 7.0,
  sprint: 8.5,
};

export default function RunningCaloriesCalculatorWrapper() {
  const meta = tools.find(t => t.slug === 'running-calories-calculator');
  return (
    <EnhancedToolWrapper meta={meta}>
      <RunningCaloriesCalculator />
    </EnhancedToolWrapper>
  );
}
