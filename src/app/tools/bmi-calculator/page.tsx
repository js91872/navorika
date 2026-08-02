'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download, ShieldAlert } from 'lucide-react';

export default function BMICalculator() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activity, setActivity] = useState<string>('moderate');
  const [weight, setWeight] = useState<number | ''>(70);
  const [height, setHeight] = useState<number | ''>(175);
  const [feet, setFeet] = useState<number | ''>(5);
  const [inches, setInches] = useState<number | ''>(9);
  const [age, setAge] = useState<number | ''>(30);
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString());
  }, []);

  const calculateBMI = () => {
    let w = Number(weight);
    let h = Number(height);
    let a = Number(age) || 30;

    if (!w || w <= 0) return { bmi: 0, category: 'Enter valid weight', color: 'text-slate-400', bodyFat: 0, isAthleticSkew: false };

    let bmiValue = 0;
    if (unit === 'metric') {
      if (!h || h <= 0) return { bmi: 0, category: 'Enter valid height', color: 'text-slate-400', bodyFat: 0, isAthleticSkew: false };
      const heightM = h / 100;
      bmiValue = w / (heightM * heightM);
    } else {
      const totalInches = (Number(feet) * 12) + Number(inches);
      if (!totalInches || totalInches <= 0) return { bmi: 0, category: 'Enter valid height', color: 'text-slate-400', bodyFat: 0, isAthleticSkew: false };
      bmiValue = (w / (totalInches * totalInches)) * 703;
    }

    const rawBmi = Number(bmiValue.toFixed(1));
    const genderConstant = gender === 'female' ? 0 : 1;
    let estimatedBodyFat = 1.20 * rawBmi + 0.23 * a - 10.8 * genderConstant - 5.4;

    if (activity === 'active') estimatedBodyFat -= 3.0;
    if (activity === 'athlete') estimatedBodyFat -= 6.0;

    const sexAdjustment = gender === 'female' ? 0.96 : 1.0;
    const adjustedBmi = Number((rawBmi * sexAdjustment).toFixed(1));

    let category = '';
    let color = '';

    if (adjustedBmi < 18.5) {
      category = 'Underweight';
      color = 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    } else if (adjustedBmi >= 18.5 && adjustedBmi < 25) {
      category = 'Normal Weight';
      color = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    } else if (adjustedBmi >= 25 && adjustedBmi < 30) {
      category = 'Overweight';
      color = 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    } else {
      category = 'Obese';
      color = 'text-rose-500 bg-rose-500/10 border-rose-500/20';
    }

    const isAthleticSkew = activity === 'athlete' && adjustedBmi >= 25;

    return { 
      bmi: adjustedBmi, 
      category, 
      color, 
      bodyFat: Math.max(4, Number(estimatedBodyFat.toFixed(1))), 
      isAthleticSkew 
    };
  };

  const { bmi, category, color, bodyFat, isAthleticSkew } = calculateBMI();

  return (
    <>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-report, #printable-report * {
            visibility: visible;
          }
          #printable-report {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            padding: 40px;
          }
        }
      `}</style>

      <main className="min-h-screen bg-slate-50 dark:bg-[#0A0A0B] text-slate-900 dark:text-slate-100 py-12 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Breadcrumb Header */}
          <div className="print:hidden">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3">
              <Link href="/categories" className="hover:underline">Categories</Link> / 
              <Link href="/categories/health-calculators" className="hover:underline">Health Calculators</Link>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">Advanced Clinical BMI Calculator</h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
              Calculate your Body Mass Index with biological gender coefficients, age factoring, and activity level adjustments.
            </p>
          </div>

          {/* Interactive Workspace Engine */}
          <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-6 sm:p-10 shadow-xl grid md:grid-cols-2 gap-10">
            
            <div className="space-y-6 print:hidden">
              {/* Unit Toggle */}
              <div className="flex bg-slate-100 dark:bg-white/5 p-1.5 rounded-2xl border border-slate-200 dark:border-white/10">
                <button 
                  onClick={() => setUnit('metric')}
                  className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${unit === 'metric' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  Metric (kg/cm)
                </button>
                <button 
                  onClick={() => setUnit('imperial')}
                  className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${unit === 'imperial' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  Imperial (lb/ft)
                </button>
              </div>

              {/* Gender Selection */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Biological Gender</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-3 rounded-2xl text-xs font-black uppercase tracking-wider border transition-all ${gender === 'male' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500'}`}
                  >
                    Male
                  </button>
                  <button 
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-3 rounded-2xl text-xs font-black uppercase tracking-wider border transition-all ${gender === 'female' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500'}`}
                  >
                    Female
                  </button>
                </div>
              </div>

              {/* Age Input */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Age (Years)</label>
                <input 
                  type="number" 
                  value={age} 
                  onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-bold text-lg outline-none focus:border-indigo-500"
                />
              </div>

              {/* Activity Level */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Activity Level & Fitness Profile</label>
                <select 
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-bold text-sm outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                >
                  <option value="sedentary">Sedentary (Little or no exercise)</option>
                  <option value="moderate">Moderate (Light exercise 3-5 days/week)</option>
                  <option value="active">Active (Hard exercise 6-7 days/week)</option>
                  <option value="athlete">Athlete / High Muscle Mass</option>
                </select>
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
            <div id="printable-report" className="bg-slate-50 dark:bg-[#0d0d11] border border-slate-200 dark:border-white/10 rounded-[2rem] p-8 flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <div className="hidden print:block mb-4">
                    <h2 className="text-xl font-black">NavorikaPro - Clinical Health Report</h2>
                    <p className="text-xs text-slate-500">Generated on {currentDate || 'Today'}</p>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Computed BMI Score</span>
                  <div className="text-5xl font-black mt-2 text-slate-900 dark:text-white">{bmi || '—'}</div>
                  <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border ${color}`}>
                    {category || 'Awaiting Input'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Estimated Body Fat Percentage</span>
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{bodyFat}%</div>
                  <p className="text-[11px] text-slate-500 capitalize pt-1">Profile: {gender}, Age {age || 30}, {activity} activity</p>
                </div>

                {isAthleticSkew && (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-start gap-2">
                    <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>High muscle mass detected: Elevated BMI may be driven by muscle weight rather than excess body fat.</span>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex gap-3 print:hidden">
                <button 
                  onClick={() => window.print()} 
                  className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
                >
                  <Download className="h-4 w-4" /> Export Report (PDF)
                </button>
              </div>
            </div>

          </div>

          {/* SEO Documentation & Clinical Guide Section */}
          <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 sm:p-12 space-y-8 print:hidden">
            <div>
              <h2 className="text-2xl font-black mb-4">Understanding Body Mass Index & Activity Factors</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Body Mass Index (BMI) is a standardized screening metric used globally to gauge whether an individual has a healthy body weight for their height. Our advanced clinical calculator integrates biological gender constants and activity profiles to estimate true adiposity and flag potential muscle-mass skewing.
              </p>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
