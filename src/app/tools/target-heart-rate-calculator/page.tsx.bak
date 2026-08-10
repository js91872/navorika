'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Target, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ResultCard } from '@/components/ui/ResultCard';
import { Container } from '@/components/ui/Container';

const INTENSITY_OPTIONS = [
  { value: 'moderate', label: 'Moderate (50-70%)' },
  { value: 'vigorous', label: 'Vigorous (70-85%)' },
  { value: 'custom', label: 'Custom Range' },
];

export default function TargetHeartRateCalculator() {
  const [age, setAge] = useState(30);
  const [intensity, setIntensity] = useState('moderate');
  const [customMin, setCustomMin] = useState(50);
  const [customMax, setCustomMax] = useState(70);
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    const maxHR = 220 - age;
    let min, max;

    if (intensity === 'moderate') {
      min = Math.round(maxHR * 0.5);
      max = Math.round(maxHR * 0.7);
    } else if (intensity === 'vigorous') {
      min = Math.round(maxHR * 0.7);
      max = Math.round(maxHR * 0.85);
    } else {
      min = Math.round(maxHR * (customMin / 100));
      max = Math.round(maxHR * (customMax / 100));
    }

    setResult({ maxHR, min, max, intensity });
  };

  return (
    <Container maxWidth="xl" className="py-8">
      <Link href="/categories/health-calculators" className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline mb-6">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <h1 className="text-3xl font-black mb-2">Target Heart Rate Calculator</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">Find your ideal heart rate zone for exercise</p>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <div className="space-y-4">
            <Input
              label="Age (years)"
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              min={1}
              max={120}
            />
            <Select
              label="Intensity"
              options={INTENSITY_OPTIONS}
              value={intensity}
              onChange={(e) => setIntensity(e.target.value)}
            />
            {intensity === 'custom' && (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Min %"
                  type="number"
                  value={customMin}
                  onChange={(e) => setCustomMin(Number(e.target.value))}
                  min={30}
                  max={95}
                />
                <Input
                  label="Max %"
                  type="number"
                  value={customMax}
                  onChange={(e) => setCustomMax(Number(e.target.value))}
                  min={35}
                  max={100}
                />
              </div>
            )}
            <Button onClick={handleCalculate} fullWidth>
              <Target className="h-4 w-4 mr-2" /> Calculate Target
            </Button>
          </div>
        </Card>

        <div className="space-y-4">
          {result && (
            <>
              <ResultCard
                label="Target Heart Rate Range"
                value={`${result.min} - ${result.max} bpm`}
                subValue={`Maximum HR: ${result.maxHR} bpm`}
                color="blue"
                icon={<Heart className="h-5 w-5" />}
              />
              <Card className="p-4 bg-slate-50">
                <h4 className="font-bold mb-2">Zone Guide</h4>
                <ul className="text-sm space-y-1">
                  <li>• Moderate: 50-70% of max HR (Fat burning zone)</li>
                  <li>• Vigorous: 70-85% of max HR (Cardio zone)</li>
                  <li>• Always consult with a healthcare provider</li>
                </ul>
              </Card>
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
