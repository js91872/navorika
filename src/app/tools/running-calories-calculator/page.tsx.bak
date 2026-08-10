'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Footprints, Flame } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ResultCard } from '@/components/ui/ResultCard';
import { Container } from '@/components/ui/Container';

const PACE_OPTIONS = [
  { value: 'slow', label: 'Slow (5 mph / 12 min mile)' },
  { value: 'moderate', label: 'Moderate (6 mph / 10 min mile)' },
  { value: 'fast', label: 'Fast (7 mph / 8.5 min mile)' },
  { value: 'sprint', label: 'Sprint (8+ mph)' },
];

const PACE_VALUES: Record<string, number> = {
  slow: 5.0,
  moderate: 6.0,
  fast: 7.0,
  sprint: 8.5,
};

export default function RunningCaloriesCalculator() {
  const [pace, setPace] = useState('moderate');
  const [weight, setWeight] = useState(70);
  const [distance, setDistance] = useState(5);
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    const paceValue = PACE_VALUES[pace] || 6.0;
    const hours = distance / paceValue;
    const met = 8 + (paceValue - 5) * 0.8;
    const caloriesPerHour = (met * 3.5 * weight) / 200;
    const totalCalories = caloriesPerHour * hours;

    setResult({
      pace: paceValue,
      met: Math.round(met * 10) / 10,
      hours: Math.round(hours * 10) / 10,
      caloriesPerHour: Math.round(caloriesPerHour),
      totalCalories: Math.round(totalCalories),
      distance,
    });
  };

  return (
    <Container maxWidth="xl" className="py-8">
      <Link href="/categories/health-calculators" className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline mb-6">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <h1 className="text-3xl font-black mb-2">Running Calories Calculator</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">Calculate calories burned while running</p>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <div className="space-y-4">
            <Select
              label="Running Pace"
              options={PACE_OPTIONS}
              value={pace}
              onChange={(e) => setPace(e.target.value)}
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
              label="Distance (km)"
              type="number"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              min={0.1}
              max={100}
            />
            <Button onClick={handleCalculate} fullWidth>
              <Footprints className="h-4 w-4 mr-2" /> Calculate Calories
            </Button>
          </div>
        </Card>

        <div className="space-y-4">
          {result && (
            <>
              <ResultCard
                label="Calories Burned"
                value={`${result.totalCalories} kcal`}
                subValue={`${result.distance} km at ${result.pace} mph`}
                color="rose"
                icon={<Flame className="h-5 w-5" />}
              />
              <div className="grid grid-cols-3 gap-4">
                <ResultCard
                  label="Time"
                  value={`${result.hours}h`}
                  color="blue"
                />
                <ResultCard
                  label="MET"
                  value={result.met}
                  color="purple"
                />
                <ResultCard
                  label="/ Hour"
                  value={`${result.caloriesPerHour} kcal`}
                  color="amber"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
