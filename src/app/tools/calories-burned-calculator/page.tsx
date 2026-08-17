'use client';

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

export default function CaloriesBurnedCalculator() {
  const [activity, setActivity] = useState('walking');
  const [weight, setWeight] = useState(70);
  const [duration, setDuration] = useState(30);
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    const met = MET_VALUES[activity] || 3.5;
    const caloriesPerMinute = (met * 3.5 * weight) / 200;
    const totalCalories = caloriesPerMinute * duration;

    setResult({
      met,
      caloriesPerMinute: Math.round(caloriesPerMinute * 10) / 10,
      totalCalories: Math.round(totalCalories),
      duration,
      activity,
    });
  };

  return (
    <Container maxWidth="xl" className="py-8">
      <Link href="/categories/health-calculators" className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline mb-6">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <h1 className="text-3xl font-black mb-2">Calories Burned Calculator</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">Calculate calories burned during physical activities</p>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <div className="space-y-4">
            <Select
              label="Activity"
              options={ACTIVITY_OPTIONS}
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
            />
            <Input
              label="Weight (kg)"
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              min={20}
              max={300}
            />
            <Input
              label="Duration (minutes)"
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              min={1}
              max={300}
            />
            <Button onClick={handleCalculate} fullWidth>
              <Flame className="h-4 w-4 mr-2" /> Calculate Calories
            </Button>
          </div>
        </Card>

        <div className="space-y-4">
          {result && (
            <>
              <ResultCard
                label="Total Calories Burned"
                value={`${result.totalCalories} kcal`}
                subValue={`${result.duration} minutes of ${result.activity}`}
                color="amber"
                icon={<Flame className="h-5 w-5" />}
              />
              <ResultCard
                label="Per Minute"
                value={`${result.caloriesPerMinute} kcal`}
                subValue={`MET: ${result.met}`}
                color="blue"
                icon={<Clock className="h-5 w-5" />}
              />
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
