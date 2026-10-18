'use client';

import { useMemo, useState } from 'react';
import { RotateCcw, PanelsTopLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

type Unit = 'm' | 'ft';

const FT_TO_M = 0.3048;

function toMetres(value: number, unit: Unit) {
  return unit === 'm' ? value : value * FT_TO_M;
}

function fmt(value: number, digits = 2) {
  return Number(value.toFixed(digits)).toLocaleString();
}

export default function WallpaperCalculator() {
  const [unit, setUnit] = useState<Unit>('m');
  const [roomLength, setRoomLength] = useState(4);
  const [roomWidth, setRoomWidth] = useState(3);
  const [wallHeight, setWallHeight] = useState(2.7);
  const [rollWidth, setRollWidth] = useState(0.53);
  const [rollLength, setRollLength] = useState(10);
  const [openingsArea, setOpeningsArea] = useState(2);
  const [wastePercent, setWastePercent] = useState(10);

  const result = useMemo(() => {
    const values = [
      roomLength,
      roomWidth,
      wallHeight,
      rollWidth,
      rollLength,
      openingsArea,
      wastePercent,
    ];

    if (values.some((v) => !Number.isFinite(v))) {
      return { valid: false, error: 'Enter valid numeric values.' } as const;
    }

    if (
      roomLength <= 0 ||
      roomWidth <= 0 ||
      wallHeight <= 0 ||
      rollWidth <= 0 ||
      rollLength <= 0
    ) {
      return {
        valid: false,
        error: 'Room and wallpaper roll dimensions must be greater than zero.',
      } as const;
    }

    if (openingsArea < 0 || wastePercent < 0 || wastePercent > 100) {
      return {
        valid: false,
        error: 'Openings cannot be negative and waste must be between 0% and 100%.',
      } as const;
    }

    const l = toMetres(roomLength, unit);
    const w = toMetres(roomWidth, unit);
    const h = toMetres(wallHeight, unit);
    const rw = toMetres(rollWidth, unit);
    const rl = toMetres(rollLength, unit);

    const perimeter = 2 * (l + w);
    const grossWallArea = perimeter * h;

    const openingsM2 =
      unit === 'm' ? openingsArea : openingsArea * FT_TO_M * FT_TO_M;

    const netWallArea = Math.max(0, grossWallArea - openingsM2);
    const adjustedArea = netWallArea * (1 + wastePercent / 100);

    const stripsNeeded = Math.ceil(perimeter / rw);
    const stripsPerRoll = Math.floor(rl / h);

    if (stripsPerRoll < 1) {
      return {
        valid: false,
        error: 'The selected wallpaper roll is shorter than the wall height.',
      } as const;
    }

    const rollsByStrips = Math.ceil(stripsNeeded / stripsPerRoll);
    const rollArea = rw * rl;
    const rollsByArea = Math.ceil(adjustedArea / rollArea);

    const recommendedRolls = Math.max(rollsByStrips, rollsByArea);

    return {
      valid: true,
      perimeter,
      grossWallArea,
      netWallArea,
      adjustedArea,
      stripsNeeded,
      stripsPerRoll,
      rollArea,
      rollsByStrips,
      rollsByArea,
      recommendedRolls,
    } as const;
  }, [
    unit,
    roomLength,
    roomWidth,
    wallHeight,
    rollWidth,
    rollLength,
    openingsArea,
    wastePercent,
  ]);

  const reset = () => {
    setUnit('m');
    setRoomLength(4);
    setRoomWidth(3);
    setWallHeight(2.7);
    setRollWidth(0.53);
    setRollLength(10);
    setOpeningsArea(2);
    setWastePercent(10);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
          Construction & Interior Utility
        </div>

        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
          Wallpaper Calculator
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
          Estimate how many wallpaper rolls you need from room size, wall height,
          roll dimensions, openings, and waste allowance.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <PanelsTopLeft className="h-5 w-5 text-cyan-500" />
            <h2 className="text-xl font-bold">Room & roll dimensions</h2>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium mb-2">Unit</label>

            <Select
              value={unit}
              onChange={(e) => setUnit(e.target.value as Unit)}
              options={[
                { value: 'm', label: 'Metres' },
                { value: 'ft', label: 'Feet' },
              ]}
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Room length" value={roomLength} unit={unit} onChange={setRoomLength} />
            <Field label="Room width" value={roomWidth} unit={unit} onChange={setRoomWidth} />
            <Field label="Wall height" value={wallHeight} unit={unit} onChange={setWallHeight} />
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 mt-7 pt-7">
            <h3 className="font-bold mb-4">Wallpaper roll</h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Roll width" value={rollWidth} unit={unit} onChange={setRollWidth} />
              <Field label="Roll length" value={rollLength} unit={unit} onChange={setRollLength} />
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 mt-7 pt-7">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Doors/windows area ({unit === 'm' ? 'm²' : 'ft²'})
                </label>
                <Input
                  type="number"
                  min={0}
                  step={0.1}
                  value={openingsArea}
                  onChange={(e) => setOpeningsArea(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Waste allowance</label>
                <div className="relative">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    value={wastePercent}
                    onChange={(e) => setWastePercent(Number(e.target.value))}
                    className="pr-10"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Button variant="outline" onClick={reset} className="w-full mt-7">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </section>

        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
          <h2 className="text-xl font-bold mb-6">Wallpaper estimate</h2>

          {result.valid ? (
            <>
              <div className="rounded-3xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-200 dark:border-cyan-800 p-6 text-center">
                <p className="text-xs uppercase tracking-wider font-bold text-cyan-600 dark:text-cyan-400 mb-2">
                  Recommended rolls
                </p>
                <p className="text-5xl font-black">{result.recommendedRolls}</p>
                <p className="text-sm text-slate-500 mt-2">
                  including {wastePercent}% waste allowance
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mt-5">
                <Card label="Net wall area" value={`${fmt(result.netWallArea)} m²`} />
                <Card label="Area incl. waste" value={`${fmt(result.adjustedArea)} m²`} />
                <Card label="Strips needed" value={result.stripsNeeded.toString()} />
                <Card label="Strips per roll" value={result.stripsPerRoll.toString()} />
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 dark:bg-slate-800 p-5 space-y-3 text-sm">
                <Row label="Room perimeter" value={`${fmt(result.perimeter)} m`} />
                <Row label="Gross wall area" value={`${fmt(result.grossWallArea)} m²`} />
                <Row label="Roll area" value={`${fmt(result.rollArea)} m²`} />
                <Row label="Rolls by strip count" value={result.rollsByStrips.toString()} />
                <Row label="Rolls by area" value={result.rollsByArea.toString()} />
              </div>

              <div className="mt-6 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-4">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Pattern repeats and matching can increase wallpaper usage.
                  For patterned wallpaper, consider a higher waste allowance.
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
  label, value, unit, onChange,
}: {
  label: string;
  value: number;
  unit: Unit;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="relative">
        <Input
          type="number"
          min={0.01}
          step={0.01}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="pr-12"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
          {unit}
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-600 dark:text-slate-300">{label}</span>
      <span className="font-semibold">{value}</span>
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
