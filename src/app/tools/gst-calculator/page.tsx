'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, RefreshCw, Download, Zap,
  Receipt, Percent, Truck
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ResultCard } from '@/components/ui/ResultCard';
import { Badge } from '@/components/ui/Badge';
import { Container } from '@/components/ui/Container';
import { ComparisonTable } from '@/components/ui/ComparisonTable';
import { HistoryTracker } from '@/components/ui/HistoryTracker';
import { formatCurrency } from '@/lib/utils';
import { calculateGST, GST_RATES } from '@/lib/calculations/gst';

const TYPE_OPTIONS = [
  { value: 'exclusive', label: 'Exclusive (Add GST)' },
  { value: 'inclusive', label: 'Inclusive (GST Included)' },
];

export default function GSTCalculator() {
  const [amount, setAmount] = useState(1000);
  const [rate, setRate] = useState(18);
  const [type, setType] = useState<'inclusive' | 'exclusive'>('exclusive');
  const [isInterState, setIsInterState] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const gstResult = calculateGST({
        amount,
        rate,
        type,
        isInterState,
      });
      setResult(gstResult);
      setIsCalculating(false);
    }, 400);
  };

  const rows = result ? [
    {
      label: 'Base Amount',
      values: [
        { value: formatCurrency(result.baseAmount) },
      ],
    },
    {
      label: 'GST Amount',
      values: [
        { value: formatCurrency(result.gstAmount), highlight: true },
      ],
    },
    {
      label: 'CGST',
      values: [
        { value: formatCurrency(result.cgst) },
      ],
    },
    {
      label: 'SGST',
      values: [
        { value: formatCurrency(result.sgst) },
      ],
    },
    {
      label: 'Total Amount',
      values: [
        { value: formatCurrency(result.totalAmount), color: 'emerald' },
      ],
    },
  ] : [];

  return (
    <Container maxWidth="xl" className="py-8">
      <div className="flex items-center gap-4 mb-8 flex-wrap">
        <Link href="/categories/finance-calculators">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            GST Calculator
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
            Calculate GST with CGST/SGST breakdown
          </p>
        </div>
        <Badge variant="indigo" className="hidden sm:inline-flex">
          <Zap className="h-3 w-3 mr-1" /> Client-Side
        </Badge>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <Card variant="default" padding="lg">
            <div className="space-y-6">
              <Input
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                icon={<Receipt className="h-5 w-5" />}
                unit="₹"
                min={0}
              />

              <Select
                label="GST Rate"
                options={GST_RATES}
                value={rate.toString()}
                onChange={(e) => setRate(Number(e.target.value))}
              />

              <Select
                label="Calculation Type"
                options={TYPE_OPTIONS}
                value={type}
                onChange={(e) => setType(e.target.value as 'inclusive' | 'exclusive')}
              />

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={isInterState}
                    onChange={(e) => setIsInterState(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <Truck className="h-4 w-4" />
                  Inter-State Transaction (IGST)
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleCalculate}
                  isLoading={isCalculating}
                  icon={<RefreshCw className="h-4 w-4" />}
                  className="flex-1"
                >
                  Calculate GST
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setResult(null)}
                >
                  Reset
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <Card variant="dark" padding="md">
                  <div className="text-center">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                      Total Amount
                    </p>
                    <div className="text-4xl font-black text-blue-400 mt-1">
                      {formatCurrency(result.totalAmount)}
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                          Base Amount
                        </p>
                        <p className="text-lg font-bold text-slate-200">
                          {formatCurrency(result.baseAmount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                          GST Amount
                        </p>
                        <p className="text-lg font-bold text-amber-400">
                          {formatCurrency(result.gstAmount)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <ResultCard
                    label="CGST"
                    value={formatCurrency(result.cgst)}
                    color="blue"
                    icon={<Percent className="h-4 w-4" />}
                  />
                  <ResultCard
                    label="SGST"
                    value={formatCurrency(result.sgst)}
                    color="green"
                    icon={<Percent className="h-4 w-4" />}
                  />
                </div>

                <ComparisonTable
                  headers={['Component', 'Amount']}
                  rows={rows}
                />

                <Button
                  onClick={() => window.print()}
                  variant="outline"
                  fullWidth
                  icon={<Download className="h-4 w-4" />}
                >
                  Export Report
                </Button>

                <HistoryTracker
                  storageKey="gst-history"
                  onSelect={(item) => {
                    setAmount(item.values.amount);
                    setRate(item.values.rate);
                    setType(item.values.type);
                    setResult(item.result);
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center h-full min-h-[300px]"
              >
                <Card variant="glass" padding="lg" className="text-center w-full">
                  <div className="text-6xl mb-4">🧾</div>
                  <h3 className="text-lg font-bold">Calculate GST</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    Enter amount and GST rate to calculate
                  </p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Container>
  );
}
