'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Globe } from 'lucide-react';

const RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.73,
  JPY: 110.5,
  INR: 74.5,
  CAD: 1.25,
  AUD: 1.35,
  CHF: 0.92,
  CNY: 6.45,
  SGD: 1.35,
  HKD: 7.8,
  KRW: 1200,
  RUB: 75,
  BRL: 5.2,
  ZAR: 15.5,
};

const CURRENCIES = Object.keys(RATES);

export default function CurrencyConverterWrapper() {
  const meta = tools.find(t => t.slug === 'currency-converter');
  return (
    <EnhancedToolWrapper meta={meta}>
      <CurrencyConverter />
    </EnhancedToolWrapper>
  );
}
