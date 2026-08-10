'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Flame, Activity } from 'lucide-react';
import { tools } from '@/data/registry';

export default function BMRCalculator() {
  const meta = tools.find(t => t.slug === 'bmr-calculator');
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [result, setResult] = useState<any>(null);

  const calculateBMR = () => {
    let bmr = 10 * weight + 6.25 * height - 5 * age;
    bmr += gender === 'male' ? 5 : -161;
    setResult({ bmr: Math.round(bmr) });
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/tools" className="inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Tools
        </Link>
        <h1 className="text-3xl font-bold mb-2">BMR Calculator</h1>
        <p className="text-[var(--muted-foreground)] mb-8">Calculate your Basal Metabolic Rate</p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4 p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Gender</label>
                <div className="flex gap-2 mt-1">
                  {['male', 'female'].map((g) => (
                    <button key={g} onClick={() => setGender(g as any)} className={`px-4 py-2 rounded-lg text-sm font-medium ${gender === g ? 'bg-indigo-600 text-white' : 'bg-[var(--muted)]'}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Age</label>
                <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-[var(--muted)] border border-[var(--border)]" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Weight (kg)</label>
              <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-[var(--muted)] border border-[var(--border)]" />
            </div>
            <div>
              <label className="text-sm font-medium">Height (cm)</label>
              <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-[var(--muted)] border border-[var(--border)]" />
            </div>
            <button onClick={calculateBMR} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors">
              Calculate BMR
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center">
            {result ? (
              <div className="text-center">
                <Flame className="h-12 w-12 text-orange-500 mx-auto mb-3" />
                <div className="text-4xl font-bold">{result.bmr} <span className="text-lg font-normal text-[var(--muted-foreground)]">kcal/day</span></div>
                <p className="text-sm text-[var(--muted-foreground)] mt-2">Your body burns this many calories at rest</p>
              </div>
            ) : (
              <div className="text-center text-[var(--muted-foreground)]">
                <Activity className="h-12 w-12 mx-auto mb-3" />
                <p>Enter your details and click Calculate</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
