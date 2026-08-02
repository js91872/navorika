'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calculator, ShieldCheck, Download, Share2, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';

export default function BMICalculator() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [weight, setWeight] = useState<number | ''>(70);
  const [height, setHeight] = useState<number | ''>(175); // cm or inches total
  const [feet, setFeet] = useState<number | ''>(5);
  const [inches, setInches] = useState<number | ''>('9');

  // Calculation Logic
  const calculateBMI = () => {
    let w = Number(weight);
    let h = Number(height);

    if (!w || w <= 0) return { bmi: 0, category: 'Enter valid weight', color: 'text-slate-400' };

    let bmiValue = 0;
    if (unit === 'metric') {
      if (!h || h <= 0) return { bmi: 0, category: 'Enter valid height', color: 'text-slate-400' };
      const heightM = h / 100;
      bmiValue = w / (heightM * heightM);
    } else {
      const totalInches = (Number(feet) * 12) + Number(inches);
      if (!totalInches || totalInches <= 0) return { bmi: 0, category: 'Enter valid height', color: 'text-slate-400' };
      bmiValue = (w / (totalInches * totalInches)) * 703;
    }

    const bmi = Number(bmiValue.toFixed(1));
    let category = '';
    let color = '';

    if (bmi < 18.5) {
      category = 'Underweight';
      color = 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    } else if (bmi >= 18.5 && bmi < 25) {
      category = 'Normal Weight';
      color = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    } else if (bmi >= 25 && bmi < 30) {
      category = 'Overweight';
      color = 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    } else {
      category = 'Obese';
      color = 'text-rose-500 bg-rose-500/10 border-rose-500/20';
    }

    return { bmi, category, color };
  };

  const { bmi, category, color } = calculateBMI();

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0A0A0B] text-slate-900 dark:text-slate-100 py-12 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Breadcrumb Header */}
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3">
            <Link href="/categories" className="hover:underline">Categories</Link> / 
            <Link href="/categories/health-calculators" className="hover:underline">Health Calculators</Link>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">BMI Calculator</h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
            Calculate your Body Mass Index instantly to evaluate your body weight category and overall health status.
          </p>
        </div>

        {/* Interactive Workspace Engine */}
        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-6 sm:p-10 shadow-xl grid md:grid-cols-2 gap-10">
          
          <div className="space-y-6">
            <div className="flex bg-slate-100 dark:bg-white/5 p-1.5 rounded-2xl border border-slate-200 dark:border-white/10">
              <button 
                onClick={() => setUnit('metric')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${unit === 'metric' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                Metric (kg / cm)
              </button>
              <button 
                onClick={() => setUnit('imperial')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${unit === 'imperial' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                Imperial (lb / ft)
              </button>
            </div>

            {/* Weight Input */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Weight ({unit === 'metric' ? 'Kilograms' : 'Pounds'})
              </label>
              <input 
                type="number" 
                value={weight} 
                onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-bold text-lg outline-none focus:border-indigo-500"
              />
            </div>

            {/* Height Input */}
            {unit === 'metric' ? (
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Height (Centimeters)</label>
                <input 
                  type="number" 
                  value={height} 
                  onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-bold text-lg outline-none focus:border-indigo-500"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Feet</label>
                  <input 
                    type="number" 
                    value={feet} 
                    onChange={(e) => setFeet(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-bold text-lg outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Inches</label>
                  <input 
                    type="number" 
                    value={inches} 
                    onChange={(e) => setInches(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-bold text-lg outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Results Card */}
          <div className="bg-slate-50 dark:bg-[#0d0d11] border border-slate-200 dark:border-white/10 rounded-[2rem] p-8 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Computed BMI</span>
              <div className="text-5xl font-black mt-2 text-slate-900 dark:text-white">{bmi || '—'}</div>
              <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border ${color}`}>
                {category || 'Awaiting Input'}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex gap-3">
              <button 
                onClick={() => window.print()} 
                className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
              >
                <Download className="h-4 w-4" /> Export Report
              </button>
            </div>
          </div>

        </div>

        {/* Engaging Report & SEO Documentation Section */}
        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 sm:p-12 space-y-8">
          <div>
            <h2 className="text-2xl font-black mb-4">Understanding Body Mass Index (BMI)</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Body Mass Index (BMI) is a standardized screening tool used by healthcare professionals to measure body fat based on height and weight. It provides a reliable indicator of total body fat for most adults, helping assess potential health risks associated with being underweight, overweight, or obese.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-slate-200 dark:border-white/10">
            <div>
              <h3 className="text-lg font-bold mb-3">The Calculation Formula</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 font-medium">
                Depending on your selected unit system, the mathematical formulas are:
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono space-y-2">
                <p><strong>Metric:</strong> $\text{BMI} = \frac{\text{weight (kg)}}{\text{height (m)}^2}$</p>
                <p><strong>Imperial:</strong> $\text{BMI} = \frac{\text{weight (lb)}}{\text{height (in)}^2} \times 703$</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-3">WHO Weight Classifications</h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                <li className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-white/5"><span>Severe Thinness</span><strong className="text-slate-900 dark:text-white">&lt; 16.0</strong></li>
                <li className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-white/5"><span>Underweight</span><strong className="text-slate-900 dark:text-white">16.0 – 18.4</strong></li>
                <li className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-white/5"><span>Normal Weight</span><strong className="text-emerald-500">18.5 – 24.9</strong></li>
                <li className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-white/5"><span>Overweight</span><strong className="text-orange-500">25.0 – 29.9</strong></li>
                <li className="flex justify-between p-2 rounded-xl bg-slate-50 dark:bg-white/5"><span>Obese</span><strong className="text-rose-500">&ge; 30.0</strong></li>
              </ul>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="pt-8 border-t border-slate-200 dark:border-white/10 space-y-6">
            <h3 className="text-xl font-black">Frequently Asked Questions</h3>
            <div className="grid gap-4">
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <h4 className="font-bold text-sm mb-1">Is BMI accurate for athletes and bodybuilders?</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  Not always. Muscle mass is much denser than fat tissue. Highly trained athletes may have a high BMI score despite having low body fat percentages.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <h4 className="font-bold text-sm mb-1">Does BMI differ for men and women?</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  The standard formula calculates BMI identically for both genders, though natural body fat distribution percentages differ between males and females.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
