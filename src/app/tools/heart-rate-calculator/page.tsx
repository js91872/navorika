'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, Activity } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ResultCard } from '@/components/ui/ResultCard';
import { Container } from '@/components/ui/Container';

export default function HeartRateCalculator() {
  const [age, setAge] = useState(30);
  const [restingHR, setRestingHR] = useState(70);
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    const maxHR = 220 - age;
    const hrr = maxHR - restingHR;
    const zones = {
      warmUp: { min: Math.round(maxHR * 0.5), max: Math.round(maxHR * 0.6) },
      fatBurn: { min: Math.round(maxHR * 0.6), max: Math.round(maxHR * 0.7) },
      cardio: { min: Math.round(maxHR * 0.7), max: Math.round(maxHR * 0.8) },
      peak: { min: Math.round(maxHR * 0.8), max: Math.round(maxHR * 0.9) },
    };

    setResult({ maxHR, hrr, zones });
  };

  return (
    <Container maxWidth="xl" className="py-8">
      <Link href="/categories/health-calculators" className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Health Calculators
      </Link>

      <h1 className="text-3xl font-black mb-2">Heart Rate Calculator</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">Calculate your maximum heart rate and training zones</p>

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
            <Input
              label="Resting Heart Rate (bpm)"
              type="number"
              value={restingHR}
              onChange={(e) => setRestingHR(Number(e.target.value))}
              min={40}
              max={120}
            />
            <Button onClick={handleCalculate} fullWidth>
              <Heart className="h-4 w-4 mr-2" /> Calculate Heart Rate
            </Button>
          </div>
        </Card>

        <div className="space-y-4">
          {result && (
            <>
              <ResultCard
                label="Maximum Heart Rate"
                value={`${result.maxHR} bpm`}
                subValue={`Heart Rate Reserve: ${result.hrr} bpm`}
                color="rose"
                icon={<Heart className="h-5 w-5" />}
              />
              <Card className="p-4">
                <h4 className="font-bold mb-3">Training Zones</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 bg-blue-50 rounded">
                    <span>Warm Up (50-60%)</span>
                    <span className="font-bold">{result.zones.warmUp.min} - {result.zones.warmUp.max} bpm</span>
                  </div>
                  <div className="flex justify-between p-2 bg-green-50 rounded">
                    <span>Fat Burn (60-70%)</span>
                    <span className="font-bold">{result.zones.fatBurn.min} - {result.zones.fatBurn.max} bpm</span>
                  </div>
                  <div className="flex justify-between p-2 bg-amber-50 rounded">
                    <span>Cardio (70-80%)</span>
                    <span className="font-bold">{result.zones.cardio.min} - {result.zones.cardio.max} bpm</span>
                  </div>
                  <div className="flex justify-between p-2 bg-red-50 rounded">
                    <span>Peak (80-90%)</span>
                    <span className="font-bold">{result.zones.peak.min} - {result.zones.peak.max} bpm</span>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
