'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';


import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, TrendingUp, Wallet, PieChart, Download, Zap } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Slider } from '@/components/ui/Slider';
import { ResultCard } from '@/components/ui/ResultCard';
import { Badge } from '@/components/ui/Badge';
import { Container } from '@/components/ui/Container';
import { formatCurrency, formatCompact } from '@/lib/utils';
import { calculateSIP } from '@/lib/calculations/sip';

export default function SIPCalculatorEnhancedWrapper() {
  const meta = tools.find(t => t.slug === 'sip-calculator');
  return (
    <EnhancedToolWrapper meta={meta}>
      <SIPCalculatorEnhancedWrapper />
    </EnhancedToolWrapper>
  );
}
