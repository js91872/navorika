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
  { value: 'slow', label: 'Slow (2.0 mph)' },
  { value: 'moderate', label: 'Moderate (3.0 mph)' },
  { value: 'brisk', label: 'Brisk (3.5 mph)' },
  { value: 'fast', label: 'Fast (4.0 mph)' },
];

const PACE_VALUES: Record<string, number> = {
  slow: 2.0,
  moderate: 3.0,
  brisk: 3.5,
  fast: 4.0,
};

export default function WalkingCaloriesCalculator() {
  const [pace, setPace] = useState('moderate');
  const [weight, setWeight] = useState(70);
  const [distance, setDistance] = useState(5);
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    const paceValue = PACE_VALUES[pace] || 3.0;
    const hours = distance / paceValue;
    const met = paceValue * 1.2;
    const caloriesPerHour = (met * 3.5 * weight) / 200;
    const totalCalories = caloriesPerHour * hours;

    setResult({
      pace: paceValue,
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

      <h1 className="text-3xl font-black mb-2">Walking Calories Calculator</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">Calculate calories burned while walking</p>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <div className="space-y-4">
            <Select
              label="Walking Pace"
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
              max={50}
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
                color="green"
                icon={<Flame className="h-5 w-5" />}
              />
              <div className="grid grid-cols-2 gap-4">
                <ResultCard
                  label="Time"
                  value={`${result.hours} hrs`}
                  color="blue"
                />
                <ResultCard
                  label="Per Hour"
                  value={`${result.caloriesPerHour} kcal`}
                  color="purple"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
