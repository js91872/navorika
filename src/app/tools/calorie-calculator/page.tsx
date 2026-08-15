'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Utensils, Target, Flame } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ResultCard } from '@/components/ui/ResultCard';
import { Container } from '@/components/ui/Container';
import { calculateTDEE } from '@/lib/calculations/health';

const ACTIVITY_OPTIONS = [
  { value: 'sedentary', label: 'Sedentary' },
  { value: 'light', label: 'Light' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'active', label: 'Active' },
  { value: 'very-active', label: 'Very Active' },
];

const GOAL_OPTIONS = [
  { value: 'maintain', label: 'Maintain Weight' },
  { value: 'lose', label: 'Lose Weight' },
  { value: 'gain', label: 'Gain Weight' },
];

export default function CalorieCalculatorWrapper() {
  const meta = tools.find(t => t.slug === 'calorie-calculator');
  return (
    <EnhancedToolWrapper meta={meta}>
      <CalorieCalculator />
    </EnhancedToolWrapper>
  );
}
