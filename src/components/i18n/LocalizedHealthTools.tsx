'use client';

import { useMemo, useState } from 'react';
import { Activity, Heart, Scale, Ruler, Footprints, Flame, Zap, Dumbbell } from 'lucide-react';
import ResultActions from '@/components/ui/ResultActions';
import { resultActionMessages } from '@/lib/i18n/actionMessages';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';
import { fieldClass, buttonClass } from './ToolControls';
import { calculateBMI, getBMICategory } from '@/lib/calculations/bmi';
import { calculateBMR } from '@/lib/calculations/bmr';
import {
  calculateTDEE,
  calculateBodyFat,
  calculateIdealWeight,
  calculateLeanBodyMass,
  calculateWHR,
  calculateWHRatio,
} from '@/lib/calculations/health';
import {
  calculatePulseBpm,
  calculateHeartRateEstimate,
  PULSE_INTERVALS,
  type PulseInterval,
} from '@/lib/calculations/heartRate';

export type HealthToolSlug =
  | 'bmi-calculator'
  | 'bmr-calculator'
  | 'body-fat-calculator'
  | 'calorie-calculator'
  | 'calories-burned-calculator'
  | 'healthy-weight-calculator'
  | 'heart-rate-calculator'
  | 'ideal-weight-calculator'
  | 'lean-body-mass-calculator'
  | 'running-calories-calculator'
  | 'tdee-calculator'
  | 'waist-to-height-ratio-calculator'
  | 'waist-to-hip-ratio-calculator'
  | 'walking-calories-calculator';

function safeCalc<T>(fn: () => T, defaultError: string) {
  try {
    return { data: fn(), error: '' };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : defaultError };
  }
}

// Pure helper calculation engines
export function calcCaloriesBurned(activity: string, weightKg: number, durationMin: number) {
  if (!Number.isFinite(weightKg) || weightKg <= 0 || !Number.isFinite(durationMin) || durationMin <= 0) {
    throw new RangeError('Weight and duration must be greater than zero.');
  }
  const metMap: Record<string, number> = {
    walking: 3.5,
    running: 9.8,
    cycling: 6.0,
    swimming: 7.0,
    yoga: 3.0,
    weights: 4.5,
    jumpingJacks: 8.0,
    dancing: 5.5,
  };
  const met = metMap[activity] || 3.5;
  const caloriesPerMinute = (met * 3.5 * weightKg) / 200;
  const totalCalories = caloriesPerMinute * durationMin;
  return {
    met,
    caloriesPerMinute: Math.round(caloriesPerMinute * 10) / 10,
    totalCalories: Math.round(totalCalories),
  };
}

export function calcHealthyWeight(heightCm: number, weightKg: number) {
  if (!Number.isFinite(heightCm) || heightCm <= 0 || !Number.isFinite(weightKg) || weightKg <= 0) {
    throw new RangeError('Height and weight must be greater than zero.');
  }
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const minWeight = 18.5 * heightM * heightM;
  const maxWeight = 24.9 * heightM * heightM;
  const idealWeight = 22.0 * heightM * heightM;
  return {
    bmi: Math.round(bmi * 10) / 10,
    minWeight: Math.round(minWeight * 10) / 10,
    maxWeight: Math.round(maxWeight * 10) / 10,
    idealWeight: Math.round(idealWeight * 10) / 10,
  };
}

export function calcRunningCalories(paceKey: string, weightKg: number, distanceKm: number) {
  if (!Number.isFinite(weightKg) || weightKg <= 0 || !Number.isFinite(distanceKm) || distanceKm <= 0) {
    throw new RangeError('Weight and distance must be greater than zero.');
  }
  const paceMap: Record<string, number> = {
    slow: 5.0,
    moderate: 6.0,
    fast: 7.0,
    sprint: 8.5,
  };
  const paceMph = paceMap[paceKey] || 6.0;
  const kmh = paceMph * 1.60934;
  const hours = distanceKm / kmh;
  const met = 8 + (paceMph - 5) * 0.8;
  const caloriesPerMinute = (met * 3.5 * weightKg) / 200;
  const caloriesPerHour = caloriesPerMinute * 60;
  const totalCalories = caloriesPerMinute * hours * 60;
  return {
    met: Math.round(met * 10) / 10,
    hours: Math.round(hours * 100) / 100,
    caloriesPerHour: Math.round(caloriesPerHour),
    totalCalories: Math.round(totalCalories),
  };
}

export function calcWalkingCalories(paceKey: string, weightKg: number, distanceKm: number) {
  if (!Number.isFinite(weightKg) || weightKg <= 0 || !Number.isFinite(distanceKm) || distanceKm <= 0) {
    throw new RangeError('Weight and distance must be greater than zero.');
  }
  const paceMap: Record<string, number> = {
    slow: 2.0,
    moderate: 3.0,
    brisk: 3.5,
    fast: 4.0,
  };
  const paceMph = paceMap[paceKey] || 3.0;
  const kmh = paceMph * 1.60934;
  const hours = distanceKm / kmh;
  const met = paceMph * 1.2;
  const caloriesPerMinute = (met * 3.5 * weightKg) / 200;
  const caloriesPerHour = caloriesPerMinute * 60;
  const totalCalories = caloriesPerMinute * hours * 60;
  return {
    met: Math.round(met * 10) / 10,
    hours: Math.round(hours * 100) / 100,
    caloriesPerHour: Math.round(caloriesPerHour),
    totalCalories: Math.round(totalCalories),
  };
}

export default function LocalizedHealthTools({
  slug,
  d,
  locale,
}: {
  slug: HealthToolSlug;
  d: Dictionary;
  locale: Locale;
}) {
  const ui = d.ui;
  const h = d.health;
  const com = h.common;
  const actionCopy = resultActionMessages[locale];

  const format = (value: number, digits = 1) =>
    Number.isFinite(value)
      ? new Intl.NumberFormat(locale, { maximumFractionDigits: digits }).format(value)
      : '—';

  // Common inputs across health calculators
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [feet, setFeet] = useState(5);
  const [inches, setInches] = useState(9);
  const [activityLevel, setActivityLevel] = useState<
    'sedentary' | 'light' | 'moderate' | 'active' | 'very-active'
  >('moderate');
  const [goal, setGoal] = useState<'maintain' | 'lose' | 'gain'>('maintain');

  // Body Fat specific inputs
  const [waist, setWaist] = useState(80);
  const [hip, setHip] = useState(90);
  const [neck, setNeck] = useState(35);

  // Heart Rate specific inputs
  const [beatsCounted, setBeatsCounted] = useState(18);
  const [interval, setInterval] = useState<PulseInterval>(15);
  const [restingHeartRate, setRestingHeartRate] = useState(70);

  // Exercise activity inputs
  const [activity, setActivity] = useState('walking');
  const [duration, setDuration] = useState(30);
  const [runPace, setRunPace] = useState('moderate');
  const [runDistance, setRunDistance] = useState(5);
  const [walkPace, setWalkPace] = useState('moderate');
  const [walkDistance, setWalkDistance] = useState(5);

  // Lean body mass specific input
  const [bodyFatInput, setBodyFatInput] = useState(18);

  // Calculations
  const bmiResult = useMemo(
    () =>
      safeCalc(
        () =>
          calculateBMI({
            weight: unit === 'metric' ? weight : weight * 0.45359237,
            height: unit === 'metric' ? height : (feet * 12 + inches) * 2.54,
            unit,
            feet,
            inches,
          }),
        com.errorCheck
      ),
    [weight, height, unit, feet, inches, com.errorCheck]
  );

  const bmrResult = useMemo(
    () =>
      safeCalc(
        () => calculateBMR({ age, gender, weight, height, activityLevel, goal }),
        com.errorCheck
      ),
    [age, gender, weight, height, activityLevel, goal, com.errorCheck]
  );

  const bodyFatResult = useMemo(
    () =>
      safeCalc(
        () => calculateBodyFat({ gender, waist, hip, neck, height }),
        com.errorCheck
      ),
    [gender, waist, hip, neck, height, com.errorCheck]
  );

  const calorieResult = useMemo(
    () =>
      safeCalc(() => {
        const t = calculateTDEE({ age, gender, weight, height, activityLevel });
        const target =
          goal === 'maintain' ? t.tdee : goal === 'lose' ? t.tdee - 500 : t.tdee + 300;
        return { targetCalories: target, bmr: t.bmr, tdee: t.tdee };
      }, com.errorCheck),
    [age, gender, weight, height, activityLevel, goal, com.errorCheck]
  );

  const caloriesBurnedResult = useMemo(
    () => safeCalc(() => calcCaloriesBurned(activity, weight, duration), com.errorCheck),
    [activity, weight, duration, com.errorCheck]
  );

  const healthyWeightResult = useMemo(
    () => safeCalc(() => calcHealthyWeight(height, weight), com.errorCheck),
    [height, weight, com.errorCheck]
  );

  const heartRateResult = useMemo(
    () =>
      safeCalc(() => {
        const pulse = calculatePulseBpm(beatsCounted, interval);
        const est = calculateHeartRateEstimate(age, restingHeartRate);
        return { pulse, ...est };
      }, com.errorCheck),
    [beatsCounted, interval, age, restingHeartRate, com.errorCheck]
  );

  const idealWeightResult = useMemo(
    () => safeCalc(() => calculateIdealWeight({ gender, height }), com.errorCheck),
    [gender, height, com.errorCheck]
  );

  const leanBodyMassResult = useMemo(
    () => safeCalc(() => calculateLeanBodyMass({ weight, bodyFat: bodyFatInput }), com.errorCheck),
    [weight, bodyFatInput, com.errorCheck]
  );

  const runningCaloriesResult = useMemo(
    () => safeCalc(() => calcRunningCalories(runPace, weight, runDistance), com.errorCheck),
    [runPace, weight, runDistance, com.errorCheck]
  );

  const tdeeResult = useMemo(
    () => safeCalc(() => calculateTDEE({ age, gender, weight, height, activityLevel }), com.errorCheck),
    [age, gender, weight, height, activityLevel, com.errorCheck]
  );

  const waistToHeightResult = useMemo(
    () => safeCalc(() => calculateWHRatio({ waist, height }), com.errorCheck),
    [waist, height, com.errorCheck]
  );

  const waistToHipResult = useMemo(
    () => safeCalc(() => calculateWHR({ waist, hip }), com.errorCheck),
    [waist, hip, com.errorCheck]
  );

  const walkingCaloriesResult = useMemo(
    () => safeCalc(() => calcWalkingCalories(walkPace, weight, walkDistance), com.errorCheck),
    [walkPace, weight, walkDistance, com.errorCheck]
  );

  // Active results extraction
  let currentResults: [string, string][] = [];
  let currentError = '';

  if (slug === 'bmi-calculator') {
    currentError = bmiResult.error;
    const r = bmiResult.data;
    if (r) {
      const catLabel =
        r.category === 'Underweight'
          ? h.bmi.underweight
          : r.category === 'Healthy Weight'
          ? h.bmi.healthyWeight
          : r.category === 'Overweight'
          ? h.bmi.overweight
          : h.bmi.obese;
      currentResults = [
        [h.bmi.bmi, format(r.bmi, 1)],
        [h.bmi.category, catLabel],
        [h.bmi.healthyRange, `${format(r.healthyWeightRange.min, 1)} – ${format(r.healthyWeightRange.max, 1)} kg`],
      ];
    }
  } else if (slug === 'bmr-calculator') {
    currentError = bmrResult.error;
    const r = bmrResult.data;
    if (r) {
      currentResults = [
        [h.bmr.bmr, `${format(r.bmr, 0)} kcal`],
        [h.bmr.tdee, `${format(r.tdee, 0)} kcal`],
        [h.bmr.maintain, `${format(r.dailyCalories.maintain, 0)} kcal`],
        [h.bmr.lose, `${format(r.dailyCalories.lose, 0)} kcal`],
        [h.bmr.gain, `${format(r.dailyCalories.gain, 0)} kcal`],
        [h.bmr.protein, `${format(r.macros.protein, 0)} g`],
        [h.bmr.carbs, `${format(r.macros.carbs, 0)} g`],
        [h.bmr.fat, `${format(r.macros.fat, 0)} g`],
      ];
    }
  } else if (slug === 'body-fat-calculator') {
    currentError = bodyFatResult.error;
    const r = bodyFatResult.data;
    if (r) {
      const catMap: Record<string, string> = {
        'Essential Fat': h.bodyFat.essential,
        Athlete: h.bodyFat.athletes,
        Fitness: h.bodyFat.fitness,
        Acceptable: h.bodyFat.acceptable,
        Obese: h.bodyFat.obese,
      };
      currentResults = [
        [h.bodyFat.bodyFat, `${format(r.bodyFat, 1)} %`],
        [h.bodyFat.category, catMap[r.category] || r.category],
      ];
    }
  } else if (slug === 'calorie-calculator') {
    currentError = calorieResult.error;
    const r = calorieResult.data;
    if (r) {
      currentResults = [
        [h.calorie.targetCalories, `${format(r.targetCalories, 0)} kcal`],
        [h.calorie.bmr, `${format(r.bmr, 0)} kcal`],
        [h.calorie.tdee, `${format(r.tdee, 0)} kcal`],
      ];
    }
  } else if (slug === 'calories-burned-calculator') {
    currentError = caloriesBurnedResult.error;
    const r = caloriesBurnedResult.data;
    if (r) {
      currentResults = [
        [h.caloriesBurned.totalCalories, `${format(r.totalCalories, 0)} kcal`],
        [h.caloriesBurned.caloriesPerMinute, `${format(r.caloriesPerMinute, 1)} kcal/min`],
        [h.caloriesBurned.met, format(r.met, 1)],
      ];
    }
  } else if (slug === 'healthy-weight-calculator') {
    currentError = healthyWeightResult.error;
    const r = healthyWeightResult.data;
    if (r) {
      const catLabel =
        r.bmi < 18.5
          ? h.bmi.underweight
          : r.bmi < 25
          ? h.bmi.healthyWeight
          : r.bmi < 30
          ? h.bmi.overweight
          : h.bmi.obese;
      currentResults = [
        [h.healthyWeight.bmi, format(r.bmi, 1)],
        [h.healthyWeight.status, catLabel],
        [h.healthyWeight.minWeight, `${format(r.minWeight, 1)} kg`],
        [h.healthyWeight.maxWeight, `${format(r.maxWeight, 1)} kg`],
        [h.healthyWeight.idealWeight, `${format(r.idealWeight, 1)} kg`],
      ];
    }
  } else if (slug === 'heart-rate-calculator') {
    currentError = heartRateResult.error;
    const r = heartRateResult.data;
    if (r) {
      currentResults = [
        [h.heartRate.pulseBpm, `${format(r.pulse, 0)} BPM`],
        [h.heartRate.estimatedMax, `${format(r.estimatedMaximum, 0)} BPM`],
        [h.heartRate.reserve, `${format(r.heartRateReserve, 0)} BPM`],
        [h.heartRate.moderateZone, `${format(r.moderateRange.min, 0)} – ${format(r.moderateRange.max, 0)} BPM`],
        [h.heartRate.vigorousZone, `${format(r.vigorousRange.min, 0)} – ${format(r.vigorousRange.max, 0)} BPM`],
      ];
    }
  } else if (slug === 'ideal-weight-calculator') {
    currentError = idealWeightResult.error;
    const r = idealWeightResult.data;
    if (r) {
      currentResults = [
        [h.idealWeight.robinson, `${format(r.robinson, 1)} kg`],
        [h.idealWeight.miller, `${format(r.miller, 1)} kg`],
        [h.idealWeight.devine, `${format(r.devine, 1)} kg`],
        [h.idealWeight.hamwi, `${format(r.hamwi, 1)} kg`],
        [h.idealWeight.bmiMethod, `${format(r.bmi, 1)} kg`],
      ];
    }
  } else if (slug === 'lean-body-mass-calculator') {
    currentError = leanBodyMassResult.error;
    const r = leanBodyMassResult.data;
    if (r) {
      const pct = weight > 0 ? (r.lbm / weight) * 100 : 0;
      currentResults = [
        [h.leanBodyMass.lbm, `${format(r.lbm, 1)} kg`],
        [h.leanBodyMass.fatMass, `${format(r.fatMass, 1)} kg`],
        [h.leanBodyMass.leanPercentage, `${format(pct, 1)} %`],
      ];
    }
  } else if (slug === 'running-calories-calculator') {
    currentError = runningCaloriesResult.error;
    const r = runningCaloriesResult.data;
    if (r) {
      currentResults = [
        [h.runningCalories.totalCalories, `${format(r.totalCalories, 0)} kcal`],
        [h.runningCalories.caloriesPerHour, `${format(r.caloriesPerHour, 0)} kcal/h`],
        [h.runningCalories.hours, `${format(r.hours, 2)} h`],
        [h.runningCalories.met, format(r.met, 1)],
      ];
    }
  } else if (slug === 'tdee-calculator') {
    currentError = tdeeResult.error;
    const r = tdeeResult.data;
    if (r) {
      currentResults = [
        [h.tdee.tdee, `${format(r.tdee, 0)} kcal`],
        [h.tdee.bmr, `${format(r.bmr, 0)} kcal`],
        [h.tdee.multiplier, format(r.activityMultiplier, 3)],
      ];
    }
  } else if (slug === 'waist-to-height-ratio-calculator') {
    currentError = waistToHeightResult.error;
    const r = waistToHeightResult.data;
    if (r) {
      const riskLabel =
        r.risk === 'Low'
          ? h.waistToHeight.lowRisk
          : r.risk === 'Moderate'
          ? h.waistToHeight.moderateRisk
          : h.waistToHeight.highRisk;
      currentResults = [
        [h.waistToHeight.ratio, format(r.ratio, 2)],
        [h.waistToHeight.risk, riskLabel],
      ];
    }
  } else if (slug === 'waist-to-hip-ratio-calculator') {
    currentError = waistToHipResult.error;
    const r = waistToHipResult.data;
    if (r) {
      const riskLabel =
        r.risk === 'Low'
          ? h.waistToHip.lowRisk
          : r.risk === 'Moderate'
          ? h.waistToHip.moderateRisk
          : h.waistToHip.highRisk;
      currentResults = [
        [h.waistToHip.ratio, format(r.ratio, 2)],
        [h.waistToHip.risk, riskLabel],
      ];
    }
  } else if (slug === 'walking-calories-calculator') {
    currentError = walkingCaloriesResult.error;
    const r = walkingCaloriesResult.data;
    if (r) {
      currentResults = [
        [h.walkingCalories.totalCalories, `${format(r.totalCalories, 0)} kcal`],
        [h.walkingCalories.caloriesPerHour, `${format(r.caloriesPerHour, 0)} kcal/h`],
        [h.walkingCalories.hours, `${format(r.hours, 2)} h`],
        [h.walkingCalories.met, format(r.met, 1)],
      ];
    }
  }

  const activeSummary = currentResults.map(([k, v]) => `${k}: ${v}`).join('\n');
  const csvRows =
    '\uFEFF' +
    [
      `"${d.calculatorUi.result}","${d.calculatorUi.value}"`,
      ...currentResults.map(
        ([label, val]) => `"${label.replace(/"/g, '""')}","${String(val).replace(/"/g, '""')}"`
      ),
    ].join('\n');

  const handleReset = () => {
    setAge(30);
    setGender('male');
    setWeight(70);
    setHeight(175);
    setUnit('metric');
    setFeet(5);
    setInches(9);
    setActivityLevel('moderate');
    setGoal('maintain');
    setWaist(80);
    setHip(90);
    setNeck(35);
    setBeatsCounted(18);
    setInterval(15);
    setRestingHeartRate(70);
    setActivity('walking');
    setDuration(30);
    setRunPace('moderate');
    setRunDistance(5);
    setWalkPace('moderate');
    setWalkDistance(5);
    setBodyFatInput(18);
  };

  const csvName = `${slug}-health.csv`;

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-2">
      {/* Controls Card */}
      <section className="min-w-0 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
        <div className="flex min-w-0 items-center gap-2">
          {slug.includes('heart') ? (
            <Heart className="size-5 shrink-0 text-rose-600 dark:text-rose-400" />
          ) : slug.includes('running') || slug.includes('walking') ? (
            <Footprints className="size-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
          ) : slug.includes('weight') || slug.includes('mass') ? (
            <Scale className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : slug.includes('waist') ? (
            <Ruler className="size-5 shrink-0 text-amber-600 dark:text-amber-400" />
          ) : (
            <Activity className="size-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
          )}
          <h2 className="min-w-0 break-words text-xl font-bold">
            {slug === 'bmi-calculator' && h.bmi.heading}
            {slug === 'bmr-calculator' && h.bmr.heading}
            {slug === 'body-fat-calculator' && h.bodyFat.heading}
            {slug === 'calorie-calculator' && h.calorie.heading}
            {slug === 'calories-burned-calculator' && h.caloriesBurned.heading}
            {slug === 'healthy-weight-calculator' && h.healthyWeight.heading}
            {slug === 'heart-rate-calculator' && h.heartRate.heading}
            {slug === 'ideal-weight-calculator' && h.idealWeight.heading}
            {slug === 'lean-body-mass-calculator' && h.leanBodyMass.heading}
            {slug === 'running-calories-calculator' && h.runningCalories.heading}
            {slug === 'tdee-calculator' && h.tdee.heading}
            {slug === 'waist-to-height-ratio-calculator' && h.waistToHeight.heading}
            {slug === 'waist-to-hip-ratio-calculator' && h.waistToHip.heading}
            {slug === 'walking-calories-calculator' && h.walkingCalories.heading}
          </h2>
        </div>

        <div className="mt-5 grid min-w-0 gap-4 sm:grid-cols-2">
          {/* Gender selection */}
          {(slug === 'bmr-calculator' ||
            slug === 'body-fat-calculator' ||
            slug === 'calorie-calculator' ||
            slug === 'ideal-weight-calculator' ||
            slug === 'tdee-calculator') && (
            <div className="sm:col-span-2">
              <span className="text-xs font-bold uppercase text-[var(--muted-foreground)]">
                {com.gender}
              </span>
              <div className="mt-1 grid grid-cols-2 gap-2">
                {(['male', 'female'] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`rounded-xl py-2.5 text-sm font-semibold transition ${
                      gender === g
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)]'
                    }`}
                  >
                    {g === 'male' ? com.male : com.female}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Age */}
          {(slug === 'bmr-calculator' ||
            slug === 'calorie-calculator' ||
            slug === 'heart-rate-calculator' ||
            slug === 'tdee-calculator') && (
            <label className="text-sm font-semibold">
              {com.age}
              <input
                aria-label={com.age}
                type="number"
                min="10"
                max="120"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className={fieldClass}
              />
            </label>
          )}

          {/* Weight */}
          {(slug === 'bmi-calculator' ||
            slug === 'bmr-calculator' ||
            slug === 'calorie-calculator' ||
            slug === 'calories-burned-calculator' ||
            slug === 'healthy-weight-calculator' ||
            slug === 'lean-body-mass-calculator' ||
            slug === 'running-calories-calculator' ||
            slug === 'tdee-calculator' ||
            slug === 'walking-calories-calculator') && (
            <label className="text-sm font-semibold">
              {com.weight}
              <input
                aria-label={com.weight}
                type="number"
                min="1"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className={fieldClass}
              />
            </label>
          )}

          {/* Height */}
          {(slug === 'bmi-calculator' ||
            slug === 'bmr-calculator' ||
            slug === 'body-fat-calculator' ||
            slug === 'calorie-calculator' ||
            slug === 'healthy-weight-calculator' ||
            slug === 'ideal-weight-calculator' ||
            slug === 'tdee-calculator' ||
            slug === 'waist-to-height-ratio-calculator') && (
            <label className="text-sm font-semibold">
              {com.height}
              <input
                aria-label={com.height}
                type="number"
                min="50"
                max="260"
                step="0.5"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className={fieldClass}
              />
            </label>
          )}

          {/* Activity Level */}
          {(slug === 'bmr-calculator' || slug === 'calorie-calculator' || slug === 'tdee-calculator') && (
            <label className="text-sm font-semibold sm:col-span-2">
              {com.activityLevel}
              <select
                value={activityLevel}
                onChange={(e) =>
                  setActivityLevel(
                    e.target.value as 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active'
                  )
                }
                className={fieldClass}
              >
                <option value="sedentary">{com.sedentary}</option>
                <option value="light">{com.light}</option>
                <option value="moderate">{com.moderate}</option>
                <option value="active">{com.active}</option>
                <option value="very-active">{com.veryActive}</option>
              </select>
            </label>
          )}

          {/* Goal */}
          {(slug === 'bmr-calculator' || slug === 'calorie-calculator') && (
            <label className="text-sm font-semibold sm:col-span-2">
              {com.goal}
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as 'maintain' | 'lose' | 'gain')}
                className={fieldClass}
              >
                <option value="maintain">{com.maintain}</option>
                <option value="lose">{com.lose}</option>
                <option value="gain">{com.gain}</option>
              </select>
            </label>
          )}

          {/* Waist, Hip, Neck */}
          {(slug === 'body-fat-calculator' ||
            slug === 'waist-to-height-ratio-calculator' ||
            slug === 'waist-to-hip-ratio-calculator') && (
            <label className="text-sm font-semibold">
              {h.bodyFat.waist}
              <input
                aria-label={h.bodyFat.waist}
                type="number"
                min="30"
                max="200"
                step="0.5"
                value={waist}
                onChange={(e) => setWaist(Number(e.target.value))}
                className={fieldClass}
              />
            </label>
          )}

          {(slug === 'body-fat-calculator' || slug === 'waist-to-hip-ratio-calculator') && (
            <label className="text-sm font-semibold">
              {h.bodyFat.hip}
              <input
                aria-label={h.bodyFat.hip}
                type="number"
                min="40"
                max="220"
                step="0.5"
                value={hip}
                onChange={(e) => setHip(Number(e.target.value))}
                className={fieldClass}
              />
            </label>
          )}

          {slug === 'body-fat-calculator' && (
            <label className="text-sm font-semibold">
              {h.bodyFat.neck}
              <input
                aria-label={h.bodyFat.neck}
                type="number"
                min="20"
                max="70"
                step="0.5"
                value={neck}
                onChange={(e) => setNeck(Number(e.target.value))}
                className={fieldClass}
              />
            </label>
          )}

          {/* Heart rate inputs */}
          {slug === 'heart-rate-calculator' && (
            <>
              <label className="text-sm font-semibold">
                {h.heartRate.beatsCounted}
                <input
                  aria-label={h.heartRate.beatsCounted}
                  type="number"
                  min="1"
                  max="300"
                  value={beatsCounted}
                  onChange={(e) => setBeatsCounted(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {h.heartRate.interval}
                <select
                  value={interval}
                  onChange={(e) => setInterval(Number(e.target.value) as PulseInterval)}
                  className={fieldClass}
                >
                  {PULSE_INTERVALS.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec} {h.heartRate.seconds}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-semibold sm:col-span-2">
                {h.heartRate.restingHeartRate}
                <input
                  aria-label={h.heartRate.restingHeartRate}
                  type="number"
                  min="30"
                  max="150"
                  value={restingHeartRate}
                  onChange={(e) => setRestingHeartRate(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
            </>
          )}

          {/* Activity calories burned inputs */}
          {slug === 'calories-burned-calculator' && (
            <>
              <label className="text-sm font-semibold sm:col-span-2">
                {h.caloriesBurned.activity}
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className={fieldClass}
                >
                  <option value="walking">{h.caloriesBurned.walking}</option>
                  <option value="running">{h.caloriesBurned.running}</option>
                  <option value="cycling">{h.caloriesBurned.cycling}</option>
                  <option value="swimming">{h.caloriesBurned.swimming}</option>
                  <option value="yoga">{h.caloriesBurned.yoga}</option>
                  <option value="weights">{h.caloriesBurned.weights}</option>
                  <option value="jumpingJacks">{h.caloriesBurned.jumpingJacks}</option>
                  <option value="dancing">{h.caloriesBurned.dancing}</option>
                </select>
              </label>
              <label className="text-sm font-semibold sm:col-span-2">
                {h.caloriesBurned.duration}
                <input
                  aria-label={h.caloriesBurned.duration}
                  type="number"
                  min="1"
                  max="1440"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
            </>
          )}

          {/* Running inputs */}
          {slug === 'running-calories-calculator' && (
            <>
              <label className="text-sm font-semibold">
                {h.runningCalories.pace}
                <select
                  value={runPace}
                  onChange={(e) => setRunPace(e.target.value)}
                  className={fieldClass}
                >
                  <option value="slow">{h.runningCalories.slow}</option>
                  <option value="moderate">{h.runningCalories.moderate}</option>
                  <option value="fast">{h.runningCalories.fast}</option>
                  <option value="sprint">{h.runningCalories.sprint}</option>
                </select>
              </label>
              <label className="text-sm font-semibold">
                {h.runningCalories.distance}
                <input
                  aria-label={h.runningCalories.distance}
                  type="number"
                  min="0.1"
                  max="100"
                  step="0.5"
                  value={runDistance}
                  onChange={(e) => setRunDistance(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
            </>
          )}

          {/* Walking inputs */}
          {slug === 'walking-calories-calculator' && (
            <>
              <label className="text-sm font-semibold">
                {h.walkingCalories.pace}
                <select
                  value={walkPace}
                  onChange={(e) => setWalkPace(e.target.value)}
                  className={fieldClass}
                >
                  <option value="slow">{h.walkingCalories.slow}</option>
                  <option value="moderate">{h.walkingCalories.moderate}</option>
                  <option value="brisk">{h.walkingCalories.brisk}</option>
                  <option value="fast">{h.walkingCalories.fast}</option>
                </select>
              </label>
              <label className="text-sm font-semibold">
                {h.walkingCalories.distance}
                <input
                  aria-label={h.walkingCalories.distance}
                  type="number"
                  min="0.1"
                  max="100"
                  step="0.5"
                  value={walkDistance}
                  onChange={(e) => setWalkDistance(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
            </>
          )}

          {/* Lean body mass input */}
          {slug === 'lean-body-mass-calculator' && (
            <label className="text-sm font-semibold sm:col-span-2">
              {h.leanBodyMass.bodyFat}
              <input
                aria-label={h.leanBodyMass.bodyFat}
                type="number"
                min="3"
                max="60"
                step="0.5"
                value={bodyFatInput}
                onChange={(e) => setBodyFatInput(Number(e.target.value))}
                className={fieldClass}
              />
            </label>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={handleReset} className={buttonClass}>
            {ui.reset}
          </button>
        </div>

        {/* Informational Notes */}
        <p className="mt-4 text-xs text-[var(--muted-foreground)]">
          {slug === 'bmi-calculator' && h.bmi.note}
          {slug === 'bmr-calculator' && h.bmr.note}
          {slug === 'body-fat-calculator' && h.bodyFat.note}
          {slug === 'calorie-calculator' && h.calorie.note}
          {slug === 'calories-burned-calculator' && h.caloriesBurned.note}
          {slug === 'healthy-weight-calculator' && h.healthyWeight.note}
          {slug === 'heart-rate-calculator' && h.heartRate.note}
          {slug === 'ideal-weight-calculator' && h.idealWeight.note}
          {slug === 'lean-body-mass-calculator' && h.leanBodyMass.note}
          {slug === 'running-calories-calculator' && h.runningCalories.note}
          {slug === 'tdee-calculator' && h.tdee.note}
          {slug === 'waist-to-height-ratio-calculator' && h.waistToHeight.note}
          {slug === 'waist-to-hip-ratio-calculator' && h.waistToHip.note}
          {slug === 'walking-calories-calculator' && h.walkingCalories.note}
        </p>
      </section>

      {/* Results Card */}
      <section className="min-w-0 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
        <h2 className="min-w-0 break-words text-xl font-bold">{com.results}</h2>

        {currentError ? (
          <p role="alert" className="mt-4 text-sm font-semibold text-red-600">
            {currentError}
          </p>
        ) : (
          <>
            <dl className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2">
              {currentResults.map(([label, val]) => (
                <div
                  key={label}
                  className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4"
                >
                  <dt className="min-w-0 break-words text-xs font-semibold text-[var(--muted-foreground)]">{label}</dt>
                  <dd suppressHydrationWarning className="mt-1 break-words text-2xl font-black">
                    {val}
                  </dd>
                </div>
              ))}
            </dl>

            {currentResults.length > 0 && (
              <div className="mt-6 border-t border-[var(--border)] pt-5">
                <ResultActions
                  actions={[
                    { kind: 'copy', label: d.ui.copy, getContent: () => activeSummary },
                    {
                      kind: 'download',
                      label: d.calculatorUi.csv,
                      filename: csvName,
                      mimeType: 'text/csv;charset=utf-8',
                      getContent: () => csvRows,
                    },
                  ]}
                  messages={actionCopy}
                />
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
