'use client';

import { useMemo, useState } from 'react';
import { CircleGauge, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

function tire(width: number, aspect: number, rim: number) {
  const sidewallMm = width * aspect / 100;
  const diameterMm = rim * 25.4 + sidewallMm * 2;
  const circumferenceMm = Math.PI * diameterMm;

  return {
    sidewallMm,
    diameterMm,
    diameterIn: diameterMm / 25.4,
    circumferenceMm,
    circumferenceIn: circumferenceMm / 25.4,
    revPerKm: 1_000_000 / circumferenceMm,
    revPerMile: 1_609_344 / circumferenceMm,
  };
}

function fmt(n: number, digits = 2) {
  return Number(n.toFixed(digits)).toLocaleString();
}

export default function TireSizeCalculator() {
  const [oldWidth, setOldWidth] = useState(205);
  const [oldAspect, setOldAspect] = useState(55);
  const [oldRim, setOldRim] = useState(16);

  const [newWidth, setNewWidth] = useState(225);
  const [newAspect, setNewAspect] = useState(45);
  const [newRim, setNewRim] = useState(17);

  const [speed, setSpeed] = useState(100);

  const result = useMemo(() => {
    const values = [oldWidth, oldAspect, oldRim, newWidth, newAspect, newRim, speed];

    if (values.some((v) => !Number.isFinite(v) || v <= 0)) {
      return { valid: false, error: 'All tire dimensions and speed must be greater than zero.' } as const;
    }

    const oldTire = tire(oldWidth, oldAspect, oldRim);
    const newTire = tire(newWidth, newAspect, newRim);

    const difference =
      ((newTire.diameterMm - oldTire.diameterMm) / oldTire.diameterMm) * 100;

    const actualSpeed = speed * newTire.diameterMm / oldTire.diameterMm;

    const clearanceChange =
      (newTire.diameterMm - oldTire.diameterMm) / 2;

    return {
      valid: true,
      oldTire,
      newTire,
      difference,
      actualSpeed,
      clearanceChange,
    } as const;
  }, [oldWidth, oldAspect, oldRim, newWidth, newAspect, newRim, speed]);

  const reset = () => {
    setOldWidth(205);
    setOldAspect(55);
    setOldRim(16);
    setNewWidth(225);
    setNewAspect(45);
    setNewRim(17);
    setSpeed(100);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
          Automotive Utility
        </div>

        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
          Tire Size Calculator
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
          Compare two tire sizes and see diameter, sidewall, circumference,
          revolutions, clearance change and speedometer difference.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.15fr] gap-6">
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <CircleGauge className="h-5 w-5 text-indigo-500" />
            <h2 className="text-xl font-bold">Compare tire sizes</h2>
          </div>

          <TireInputs
            title="Original tire"
            width={oldWidth}
            aspect={oldAspect}
            rim={oldRim}
            setWidth={setOldWidth}
            setAspect={setOldAspect}
            setRim={setOldRim}
          />

          <div className="my-7 border-t border-slate-200 dark:border-slate-800" />

          <TireInputs
            title="New tire"
            width={newWidth}
            aspect={newAspect}
            rim={newRim}
            setWidth={setNewWidth}
            setAspect={setNewAspect}
            setRim={setNewRim}
          />

          <div className="mt-7">
            <label className="block text-sm font-medium mb-2">
              Indicated speed
            </label>
            <div className="relative">
              <Input
                type="number"
                min={1}
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="pr-16"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                km/h
              </span>
            </div>
          </div>

          <Button variant="outline" onClick={reset} className="w-full mt-7">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </section>

        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
          <h2 className="text-xl font-bold mb-6">Size comparison</h2>

          {result.valid ? (
            <>
              <div className="rounded-3xl bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-indigo-200 dark:border-indigo-800 p-6 text-center">
                <p className="text-xs uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  Diameter difference
                </p>
                <p className="text-5xl font-black">
                  {result.difference >= 0 ? '+' : ''}
                  {fmt(result.difference)}%
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  New tire vs original tire
                </p>
              </div>

              <div className="overflow-x-auto mt-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800">
                      <th className="text-left py-3">Measurement</th>
                      <th className="text-right py-3">Original</th>
                      <th className="text-right py-3">New</th>
                    </tr>
                  </thead>
                  <tbody>
                    <CompareRow
                      label="Diameter"
                      a={`${fmt(result.oldTire.diameterMm)} mm`}
                      b={`${fmt(result.newTire.diameterMm)} mm`}
                    />
                    <CompareRow
                      label="Diameter"
                      a={`${fmt(result.oldTire.diameterIn)} in`}
                      b={`${fmt(result.newTire.diameterIn)} in`}
                    />
                    <CompareRow
                      label="Sidewall"
                      a={`${fmt(result.oldTire.sidewallMm)} mm`}
                      b={`${fmt(result.newTire.sidewallMm)} mm`}
                    />
                    <CompareRow
                      label="Circumference"
                      a={`${fmt(result.oldTire.circumferenceMm)} mm`}
                      b={`${fmt(result.newTire.circumferenceMm)} mm`}
                    />
                    <CompareRow
                      label="Revolutions / km"
                      a={fmt(result.oldTire.revPerKm)}
                      b={fmt(result.newTire.revPerKm)}
                    />
                    <CompareRow
                      label="Revolutions / mile"
                      a={fmt(result.oldTire.revPerMile)}
                      b={fmt(result.newTire.revPerMile)}
                    />
                  </tbody>
                </table>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <Card
                  label={`Actual speed at indicated ${speed} km/h`}
                  value={`${fmt(result.actualSpeed)} km/h`}
                />
                <Card
                  label="Ride-height / clearance change"
                  value={`${result.clearanceChange >= 0 ? '+' : ''}${fmt(result.clearanceChange)} mm`}
                />
              </div>

              <div className="mt-6 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-4">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Size calculations do not confirm vehicle fitment. Verify wheel
                  width, offset, load rating, speed rating, suspension clearance,
                  steering clearance and manufacturer specifications.
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

function TireInputs({
  title,
  width,
  aspect,
  rim,
  setWidth,
  setAspect,
  setRim,
}: {
  title: string;
  width: number;
  aspect: number;
  rim: number;
  setWidth: (v: number) => void;
  setAspect: (v: number) => void;
  setRim: (v: number) => void;
}) {
  return (
    <div>
      <h3 className="font-bold mb-4">
        {title} — {width}/{aspect}R{rim}
      </h3>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Width" value={width} suffix="mm" onChange={setWidth} />
        <Field label="Aspect" value={aspect} suffix="%" onChange={setAspect} />
        <Field label="Rim" value={rim} suffix="in" onChange={setRim} />
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  suffix: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium mb-2">{label}</label>
      <Input
        type="number"
        min={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <p className="text-xs text-slate-400 mt-1">{suffix}</p>
    </div>
  );
}

function CompareRow({
  label,
  a,
  b,
}: {
  label: string;
  a: string;
  b: string;
}) {
  return (
    <tr className="border-b border-slate-100 dark:border-slate-800">
      <td className="py-3 text-slate-600 dark:text-slate-300">{label}</td>
      <td className="py-3 text-right font-semibold">{a}</td>
      <td className="py-3 text-right font-semibold">{b}</td>
    </tr>
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
      <p className="font-bold text-red-700 dark:text-red-300">Cannot calculate</p>
      <p className="text-sm text-red-600 dark:text-red-400 mt-2">{message}</p>
    </div>
  );
}
