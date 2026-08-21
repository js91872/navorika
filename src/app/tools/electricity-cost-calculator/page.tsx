'use client';

import { useMemo, useState } from 'react';
import { Zap, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export default function ElectricityCostCalculator() {
  const [watts, setWatts] = useState(1000);
  const [hoursPerDay, setHoursPerDay] = useState(4);
  const [days, setDays] = useState(30);
  const [rate, setRate] = useState(8);
  const [currency, setCurrency] = useState('₹');

  const result = useMemo(() => {
    if (
      [watts, hoursPerDay, days, rate].some((v) => !Number.isFinite(v)) ||
      watts < 0 ||
      hoursPerDay < 0 ||
      hoursPerDay > 24 ||
      days < 0 ||
      rate < 0
    ) {
      return {
        valid: false,
        error: 'Enter valid non-negative values; hours per day cannot exceed 24.',
      } as const;
    }

    const dailyKwh = (watts / 1000) * hoursPerDay;
    const totalKwh = dailyKwh * days;
    const totalCost = totalKwh * rate;
    const dailyCost = dailyKwh * rate;
    const monthlyCost = dailyCost * 30;
    const yearlyCost = dailyCost * 365;

    return {
      valid: true,
      dailyKwh,
      totalKwh,
      totalCost,
      dailyCost,
      monthlyCost,
      yearlyCost,
    } as const;
  }, [watts, hoursPerDay, days, rate]);

  const money = (v: number) => `${currency}${v.toFixed(2)}`;

  const reset = () => {
    setWatts(1000);
    setHoursPerDay(4);
    setDays(30);
    setRate(8);
    setCurrency('₹');
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
          Energy & Everyday Calculator
        </div>

        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
          Electricity Cost Calculator
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
          Estimate appliance electricity consumption and running cost from
          wattage, daily usage, billing period, and electricity rate.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="h-5 w-5 text-amber-500" />
            <h2 className="text-xl font-bold">Usage details</h2>
          </div>

          <div className="space-y-5">
            <Field label="Appliance power" value={watts} suffix="W" onChange={setWatts} />
            <Field label="Usage per day" value={hoursPerDay} suffix="hours" onChange={setHoursPerDay} />
            <Field label="Number of days" value={days} suffix="days" onChange={setDays} />
            <Field label="Electricity rate per kWh" value={rate} suffix="/kWh" onChange={setRate} />

            <div>
              <label className="block text-sm font-medium mb-2">Currency</label>
              <Select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                options={[
                  { value: '₹', label: '₹ INR' },
                  { value: '$', label: '$ USD' },
                  { value: '€', label: '€ EUR' },
                  { value: '£', label: '£ GBP' },
                  { value: 'C$', label: 'C$ CAD' },
                  { value: 'A$', label: 'A$ AUD' },
                ]}
              />
            </div>
          </div>

          <Button variant="outline" onClick={reset} className="w-full mt-7">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </section>

        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
          <h2 className="text-xl font-bold mb-6">Energy cost</h2>

          {result.valid ? (
            <>
              <div className="rounded-3xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-200 dark:border-amber-800 p-6 text-center">
                <p className="text-xs uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400 mb-2">
                  Cost for {days} days
                </p>
                <p className="text-5xl font-black">{money(result.totalCost)}</p>
                <p className="text-sm text-slate-500 mt-2">
                  {result.totalKwh.toFixed(2)} kWh consumed
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mt-5">
                <Card label="Daily energy" value={`${result.dailyKwh.toFixed(2)} kWh`} />
                <Card label="Daily cost" value={money(result.dailyCost)} />
                <Card label="30-day estimate" value={money(result.monthlyCost)} />
                <Card label="365-day estimate" value={money(result.yearlyCost)} />
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 dark:bg-slate-800 p-5">
                <p className="font-bold mb-2">Formula</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Energy (kWh) = power in watts ÷ 1,000 × hours used.
                  Cost = energy × electricity rate.
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Actual bills may include fixed charges, taxes, tiered tariffs,
                  demand charges, time-of-use pricing, or other utility fees.
                </p>
              </div>
            </>
          ) : (
            <ErrorBox message={result.error} />
          )}
        </section>
      </div>
    </main>
  );
}

function Field({
  label, value, suffix, onChange,
}: {
  label: string;
  value: number;
  suffix: string;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="relative">
        <Input
          type="number"
          min={0}
          step={0.1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="pr-20"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
          {suffix}
        </span>
      </div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4">
      <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">{label}</p>
      <p className="text-xl font-black">{value}</p>
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 p-5">
      <p className="font-bold text-red-700 dark:text-red-300 mb-2">Cannot calculate</p>
      <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
    </div>
  );
}
