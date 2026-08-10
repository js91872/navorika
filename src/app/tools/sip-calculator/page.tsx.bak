'use client';

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

export default function SIPCalculatorEnhanced() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [expectedRate, setExpectedRate] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);
  const [result, setResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      const sipResult = calculateSIP({
        monthlyInvestment,
        expectedRate,
        timePeriod,
      });
      setResult(sipResult);
      setIsCalculating(false);
    }, 400);
  };

  const handleReset = () => {
    setResult(null);
    setMonthlyInvestment(5000);
    setExpectedRate(12);
    setTimePeriod(10);
  };

  return (
    <Container maxWidth="xl" className="py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 flex-wrap">
        <Link href="/categories/finance-calculators">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            SIP Calculator
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
            Systematic Investment Planning with compound growth projections
          </p>
        </div>
        <Badge variant="indigo" className="hidden sm:inline-flex">
          <Zap className="h-3 w-3 mr-1" /> Client-Side
        </Badge>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-3 space-y-6">
          <Card variant="default" padding="lg">
            <div className="space-y-6">
              <Input
                label="Monthly Investment"
                type="number"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                icon={<Wallet className="h-5 w-5" />}
                unit="₹"
                min={100}
                max={1000000}
                step={100}
              />

              <Slider
                label="Expected Return Rate"
                value={expectedRate}
                onChange={setExpectedRate}
                min={0}
                max={30}
                step={0.5}
                unit="%"
              />

              <Slider
                label="Time Period"
                value={timePeriod}
                onChange={setTimePeriod}
                min={1}
                max={40}
                step={1}
                unit=" Years"
              />

              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleCalculate}
                  isLoading={isCalculating}
                  icon={<RefreshCw className="h-4 w-4" />}
                  className="flex-1"
                >
                  Calculate Projections
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={isCalculating}
                >
                  Reset
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Results Section */}
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
                      Total Portfolio Value
                    </p>
                    <div className="text-4xl font-black text-emerald-400 mt-1">
                      {formatCurrency(result.totalValue)}
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                          Invested
                        </p>
                        <p className="text-lg font-bold text-slate-200">
                          {formatCurrency(result.totalInvested)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                          Returns
                        </p>
                        <p className="text-lg font-bold text-emerald-400">
                          {formatCurrency(result.estimatedReturns)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                <ResultCard
                  label="Wealth Multiplier"
                  value={`${(result.totalValue / result.totalInvested).toFixed(2)}x`}
                  subValue="Total returns on investment"
                  color="green"
                  icon={<TrendingUp className="h-5 w-5" />}
                />

                <Card variant="glass" padding="sm">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Year-by-Year Breakdown
                    </p>
                    <div className="max-h-48 overflow-y-auto space-y-1">
                      {result.yearByYear.map((year: any) => (
                        <div key={year.year} className="flex justify-between text-sm py-1 border-b border-slate-100 dark:border-slate-800 last:border-0">
                          <span className="font-bold">Year {year.year}</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                            {formatCompact(year.value)}
                          </span>
                          <span className="text-xs text-slate-500">
                            +{formatCompact(year.returns)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                <Button
                  onClick={() => window.print()}
                  variant="outline"
                  fullWidth
                  icon={<Download className="h-4 w-4" />}
                >
                  Export Report
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center h-full min-h-[300px]"
              >
                <Card variant="glass" padding="lg" className="text-center w-full">
                  <div className="text-6xl mb-4">💰</div>
                  <h3 className="text-lg font-bold">Plan Your Investment</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    Enter your SIP details and click Calculate
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
