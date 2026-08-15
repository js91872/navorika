'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';

import { useState, useEffect } from 'react';
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

function BMICalculatorContent() {
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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
        <div className="space-y-6">
          {/* Gender Selection */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setGender('male')}
              className={cn(
                "p-4 rounded-xl border-2 transition-all text-center",
                gender === 'male' 
                  ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400" 
                  : "border-[var(--border)] hover:border-blue-500/30"
              )}
            >
              <span className="text-2xl block">👨</span>
              <span className="font-medium text-sm">Male</span>
            </button>
            <button
              onClick={() => setGender('female')}
              className={cn(
                "p-4 rounded-xl border-2 transition-all text-center",
                gender === 'female' 
                  ? "border-pink-500 bg-pink-500/10 text-pink-600 dark:text-pink-400" 
                  : "border-[var(--border)] hover:border-pink-500/30"
              )}
            >
              <span className="text-2xl block">👩</span>
              <span className="font-medium text-sm">Female</span>
            </button>
          </div>

          {/* Unit Selection */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setUnit('metric')}
              className={cn(
                "p-3 rounded-xl border-2 transition-all text-center",
                unit === 'metric' 
                  ? "border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" 
                  : "border-[var(--border)] hover:border-indigo-500/30"
              )}
            >
              📏 Metric
            </button>
            <button
              onClick={() => setUnit('imperial')}
              className={cn(
                "p-3 rounded-xl border-2 transition-all text-center",
                unit === 'imperial' 
                  ? "border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" 
                  : "border-[var(--border)] hover:border-indigo-500/30"
              )}
            >
              📐 Imperial
            </button>
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Age (years)
            </label>
            <Input
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              min={2}
              max={120}
              className="w-full"
            />
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Scale className="h-4 w-4" />
              Weight ({unit === 'metric' ? 'kg' : 'lbs'})
            </label>
            <Input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              min={1}
              step={0.5}
              className="w-full"
            />
          </div>

          {/* Height */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              Height ({unit === 'metric' ? 'cm' : 'ft/in'})
            </label>
            {unit === 'metric' ? (
              <Input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                min={50}
                max={300}
                className="w-full"
              />
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  value={feet}
                  onChange={(e) => setFeet(Number(e.target.value))}
                  min={1}
                  max={8}
                  placeholder="Feet"
                />
                <Input
                  type="number"
                  value={inches}
                  onChange={(e) => setInches(Number(e.target.value))}
                  min={0}
                  max={11}
                  placeholder="Inches"
                />
              </div>
            )}
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Activity Level
            </label>
            <Select
              value={activity}
              onChange={(e) => setActivity(e.target.value as any)}
              options={ACTIVITY_OPTIONS}
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <Button onClick={handleCalculate} className="w-full">
              <Heart className="h-4 w-4 mr-2" />
              Calculate BMI
            </Button>
            <Button variant="outline" onClick={handleReset} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Results */}
          <AnimatePresence mode="wait">
            {isCalculating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="text-sm text-[var(--muted-foreground)] mt-4">Calculating your BMI...</p>
              </motion.div>
            )}

            {result && !isCalculating && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <Card className="p-6">
                  <div className="text-center">
                    <div className="text-6xl mb-2">{getBMIEmoji(result.bmi)}</div>
                    <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                      {result.bmi.toFixed(1)}
                    </div>
                    <div className="text-sm text-[var(--muted-foreground)] mt-1">
                      Your BMI Score
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 bg-[var(--muted)]/30 rounded-lg text-center">
                      <div className="text-[var(--muted-foreground)]">Category</div>
                      <div className="font-bold text-lg">{result.category}</div>
                    </div>
                    <div className="p-3 bg-[var(--muted)]/30 rounded-lg text-center">
                      <div className="text-[var(--muted-foreground)]">Health Risk</div>
                      <div className="font-bold text-lg">{result.risk}</div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="space-y-2">
                    <h4 className="font-bold">BMI Categories</h4>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-center">
                        <div className="text-lg">📉</div>
                        <div className="text-xs font-bold">Underweight</div>
                        <div className="text-xs text-slate-500">&lt; 18.5</div>
                      </div>
                      <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-center">
                        <div className="text-lg">✅</div>
                        <div className="text-xs font-bold">Normal</div>
                        <div className="text-xs text-slate-500">18.5 - 24.9</div>
                      </div>
                      <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-center">
                        <div className="text-lg">⚠️</div>
                        <div className="text-xs font-bold">Overweight</div>
                        <div className="text-xs text-slate-500">25 - 29.9</div>
                      </div>
                      <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-center">
                        <div className="text-lg">🚨</div>
                        <div className="text-xs font-bold">Obese</div>
                        <div className="text-xs text-slate-500">30+</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function BMICalculatorPageWrapper() {
  const meta = tools.find(t => t.slug === 'bmi-calculator');
  return (
    <EnhancedToolWrapper meta={meta}>
      <BMICalculatorContent />
    </EnhancedToolWrapper>
  );
}
