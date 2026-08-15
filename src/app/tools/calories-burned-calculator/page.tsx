'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';


import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Flame, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ResultCard } from '@/components/ui/ResultCard';
import { Container } from '@/components/ui/Container';

const ACTIVITY_OPTIONS = [
  { value: 'walking', label: 'Walking (3.5 mph)' },
  { value: 'running', label: 'Running (6 mph)' },
  { value: 'cycling', label: 'Cycling (10-12 mph)' },
  { value: 'swimming', label: 'Swimming (moderate)' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'weights', label: 'Weight Training' },
  { value: 'jumping_jacks', label: 'Jumping Jacks' },
  { value: 'dancing', label: 'Dancing' },
];

const MET_VALUES: Record<string, number> = {
  walking: 3.5,
  running: 9.8,
  cycling: 6.0,
  swimming: 7.0,
  yoga: 3.0,
  weights: 4.5,
  jumping_jacks: 8.0,
  dancing: 5.5,
};

export default function CaloriesBurnedCalculatorWrapper() {
  const meta = tools.find(t => t.slug === 'calories-burned-calculator');
  return (
    <EnhancedToolWrapper meta={meta}>
      <CaloriesBurnedCalculatorWrapper />
    </EnhancedToolWrapper>
  );
}
