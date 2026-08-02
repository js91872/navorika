'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  ShieldAlert, 
  ArrowLeft, 
  RefreshCw,
  Scale,
  Ruler,
  Calendar,
  Activity,
  User,
  Heart,
  Zap
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Slider } from '@/components/ui/Slider';
import { ResultCard } from '@/components/ui/ResultCard';
import { Badge } from '@/components/ui/Badge';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils';
import { calculateBMI, getBMIEmoji } from '@/lib/calculations/bmi';

const ACTIVITY_OPTIONS = [
  { value: 'sedentary', label: 'Sedentary (Little or no exercise)' },
  { value: 'moderate', label: 'Moderate (Light exercise 3-5 days/week)' },
  { value: 'active', label: 'Active (Hard exercise 6-7 days/week)' },
  { value: 'athlete', label: 'Athlete / High Muscle Mass' },
];

export default function BMICalculatorEnhanced() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activity, setActivity] = useState<'sedentary' | 'moderate' | 'active' | 'athlete'>('moderate');
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(175);
  const [feet, setFeet] = useState<number>(5);
  const [inches, setInches] = useState<number>(9);
  const [age, setAge] = useState<number>(30);
  const [result, setResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));
  }, []);

  const handleCalculate = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      const bmiResult = calculateBMI({
        weight,
        height,
        age,
        gender,
        activity,
        unit,
        feet,
        inches,
      });

      setResult({
        ...bmiResult,
        gender,
        age,
        activity,
        unit,
        weight,
        height: unit === 'metric' ? height : `${feet}'${inches}"`,
      });
      
      setIsCalculating(false);
    }, 400);
  };

  const handleReset = () => {
    setResult(null);
    setWeight(70);
    setHeight(175);
    setFeet(5);
    setInches(9);
    setAge(30);
    setGender('male');
    setActivity('moderate');
  };

  return (
    <Container maxWidth="xl" className="py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 flex-wrap">
        <Link href="/categories/health-calculators">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Clinical BMI Calculator
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
            Advanced body composition analysis with gender coefficients and activity adjustments
          </p>
        </div>
        <Badge variant="indigo" className="hidden sm:inline-flex">
          <Zap className="h-3 w-3 mr-1" /> Client-Side
        </Badge>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Input Section - 3 columns */}
        <div className="lg:col-span-3 space-y-6">
          <Card variant="default" padding="lg">
            <div className="space-y-6">
              {/* Unit Toggle */}
              <div className="flex bg-slate-100 dark:bg-white/5 p-1.5 rounded-2xl border border-slate-200 dark:border-white/10">
                {[
                  { value: 'metric', label: 'Metric (kg/cm)' },
                  { value: 'imperial', label: 'Imperial (lb/ft)' }
                ].map((u) => (
                  <button
                    key={u.value}
                    onClick={() => setUnit(u.value as 'metric' | 'imperial')}
                    className={cn(
                      'flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all',
                      unit === u.value 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    )}
                  >
                    {u.label}
                  </button>
                ))}
              </div>

              {/* Personal Info Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Gender
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['male', 'female'].map((g) => (
                      <button
                        key={g}
                        onClick={() => setGender(g as 'male' | 'female')}
                        className={cn(
                          'py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border transition-all',
                          gender === g 
                            ? 'bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                            : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 hover:border-slate-300'
                        )}
                      >
                        <User className="h-4 w-4 mx-auto mb-1" />
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <Input
                  label="Age (Years)"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  icon={<Calendar className="h-5 w-5" />}
                  min={1}
                  max={120}
                />
              </div>

              {/* Activity Level */}
              <Select
                label="Activity Level"
                options={ACTIVITY_OPTIONS}
                value={activity}
                onChange={(e) => setActivity(e.target.value as any)}
                icon={<Activity className="h-5 w-5" />}
              />

              {/* Weight & Height */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label={`Weight (${unit === 'metric' ? 'kg' : 'lb'})`}
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  icon={<Scale className="h-5 w-5" />}
                  min={1}
                  max={500}
                />

                {unit === 'metric' ? (
                  <Input
                    label="Height (cm)"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    icon={<Ruler className="h-5 w-5" />}
                    min={50}
                    max={300}
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      label="Feet"
                      type="number"
                      value={feet}
                      onChange={(e) => setFeet(Number(e.target.value))}
                      min={1}
                      max={8}
                    />
                    <Input
                      label="Inches"
                      type="number"
                      value={inches}
                      onChange={(e) => setInches(Number(e.target.value))}
                      min={0}
                      max={11}
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleCalculate}
                  isLoading={isCalculating}
                  icon={<RefreshCw className="h-4 w-4" />}
                  className="flex-1"
                >
                  Calculate BMI
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={isCalculating}
                >
                  Reset
                </Button>
              </div>

              {/* Keyboard shortcut hint */}
              <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                Press Ctrl+Enter to calculate
              </p>
            </div>
          </Card>
        </div>

        {/* Results Section - 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <Card variant="gradient" padding="md">
                  <div className="text-center">
                    <div className="text-6xl mb-2">{getBMIEmoji(result.bmi)}</div>
                    <div className="text-5xl font-black text-indigo-600 dark:text-indigo-400">
                      {result.bmi}
                    </div>
                    <p className="text-sm font-bold mt-1">BMI Score</p>
                    <Badge variant={
                      result.category === 'Normal Weight' ? 'success' :
                      result.category === 'Underweight' ? 'warning' :
                      result.category === 'Overweight' ? 'info' : 'danger'
                    } className="mt-2">
                      {result.category}
                    </Badge>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      {currentDate}
                    </p>
                  </div>
                </Card>

                <ResultCard
                  label="Estimated Body Fat"
                  value={`${result.bodyFat}%`}
                  subValue={`${result.gender}, ${result.age} years, ${result.activity} activity`}
                  color="purple"
                  icon={<Heart className="h-5 w-5" />}
                />

                <ResultCard
                  label="Healthy Weight Range"
                  value={`${result.healthyWeightRange.min} - ${result.healthyWeightRange.max}`}
                  subValue={unit === 'metric' ? 'kilograms' : 'pounds'}
                  color="blue"
                  icon={<Scale className="h-5 w-5" />}
                />

                {result.isAthleticSkew && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm font-bold flex items-start gap-3"
                  >
                    <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                    <span>High muscle mass detected: Elevated BMI may be driven by muscle weight rather than excess body fat.</span>
                  </motion.div>
                )}

                <Button
                  onClick={() => window.print()}
                  variant="outline"
                  fullWidth
                  icon={<Download className="h-4 w-4" />}
                >
                  Export Report (PDF)
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center h-full min-h-[300px]"
              >
                <Card variant="glass" padding="lg" className="text-center w-full">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-lg font-bold">Ready to Calculate</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    Enter your details and click Calculate
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Your results will appear here instantly
                  </p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Educational Section */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <Card variant="default" padding="lg">
            <h2 className="text-xl font-bold mb-4">Understanding Your BMI</h2>
            <div className="grid sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <div className="text-2xl mb-1">📉</div>
                <h4 className="font-bold text-sm">Underweight</h4>
                <p className="text-xs text-slate-500">Below 18.5</p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                <div className="text-2xl mb-1">✅</div>
                <h4 className="font-bold text-sm">Normal</h4>
                <p className="text-xs text-slate-500">18.5 - 24.9</p>
              </div>
              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                <div className="text-2xl mb-1">⚠️</div>
                <h4 className="font-bold text-sm">Overweight</h4>
                <p className="text-xs text-slate-500">25 - 29.9</p>
              </div>
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800">
                <div className="text-2xl mb-1">🚨</div>
                <h4 className="font-bold text-sm">Obese</h4>
                <p className="text-xs text-slate-500">30+</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </Container>
  );
}
