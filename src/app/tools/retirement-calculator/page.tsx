'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, PiggyBank, TrendingUp, Shield, Calendar,
  IndianRupee, Clock, AlertCircle, CheckCircle
} from 'lucide-react';
import { calculateRetirement } from '@/lib/calculations/retirement';

export default function RetirementCalculatorWrapper() {
  const meta = tools.find(t => t.slug === 'retirement-calculator');
  return (
    <EnhancedToolWrapper meta={meta}>
      <RetirementCalculator />
    </EnhancedToolWrapper>
  );
}
