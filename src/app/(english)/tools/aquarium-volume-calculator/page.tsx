'use client';

import { useMemo, useState } from 'react';
import { Droplets, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

type Unit = 'cm' | 'in';
type Shape = 'rectangular' | 'cylindrical';

const LITRES_PER_US_GALLON = 3.785411784;
const LITRES_PER_UK_GALLON = 4.54609;
const LITRES_PER_CUBIC_FOOT = 28.316846592;

function toCm(value: number, unit: Unit) {
  return unit === 'cm' ? value : value * 2.54;
}

function fmt(value: number, digits = 2) {
  return Number(value.toFixed(digits)).toLocaleString();
}

export default function AquariumVolumeCalculator() {
  const [shape, setShape] = useState<Shape>('rectangular');
  const [unit, setUnit] = useState<Unit>('cm');

  const [length, setLength] = useState(90);
  const [width, setWidth] = useState(45);
  const [height, setHeight] = useState(45);

  const [diameter, setDiameter] = useState(50);
  const [cylinderHeight, setCylinderHeight] = useState(60);

  const [fillPercent, setFillPercent] = useState(90);
  const [displacementPercent, setDisplacementPercent] = useState(5);

  const result = useMemo(() => {
    const commonValid =
      Number.isFinite(fillPercent) &&
      Number.isFinite(displacementPercent) &&
      fillPercent > 0 &&
      fillPercent <= 100 &&
      displacementPercent >= 0 &&
      displacementPercent < 100;

    if (!commonValid) {
      return {
        valid: false,
        error:
          'Fill percentage must be between 0 and 100, and displacement must be between 0 and less than 100.',
      } as const;
    }

    let grossLitres = 0;

    if (shape === 'rectangular') {
      if (
        !Number.isFinite(length) ||
        !Number.isFinite(width) ||
        !Number.isFinite(height) ||
        length <= 0 ||
        width <= 0 ||
        height <= 0
      ) {
        return {
          valid: false,
          error: 'Length, width, and height must all be greater than zero.',
        } as const;
      }

      const l = toCm(length, unit);
      const w = toCm(width, unit);
      const h = toCm(height, unit);

      grossLitres = (l * w * h) / 1000;
    } else {
      if (
        !Number.isFinite(diameter) ||
        !Number.isFinite(cylinderHeight) ||
        diameter <= 0 ||
        cylinderHeight <= 0
      ) {
        return {
          valid: false,
          error: 'Diameter and height must both be greater than zero.',
        } as const;
      }

      const d = toCm(diameter, unit);
      const h = toCm(cylinderHeight, unit);
      const radius = d / 2;

      grossLitres = (Math.PI * radius * radius * h) / 1000;
    }

    const filledLitres = grossLitres * (fillPercent / 100);
    const displacementLitres =
      filledLitres * (displacementPercent / 100);

    const estimatedWaterLitres =
      filledLitres - displacementLitres;

    return {
      valid: true,
      grossLitres,
      filledLitres,
      displacementLitres,
      estimatedWaterLitres,
      usGallons: estimatedWaterLitres / LITRES_PER_US_GALLON,
      ukGallons: estimatedWaterLitres / LITRES_PER_UK_GALLON,
      cubicFeet: estimatedWaterLitres / LITRES_PER_CUBIC_FOOT,
    } as const;
  }, [
    shape,
    unit,
    length,
    width,
    height,
    diameter,
    cylinderHeight,
    fillPercent,
    displacementPercent,
  ]);

  const reset = () => {
    setShape('rectangular');
    setUnit('cm');
    setLength(90);
    setWidth(45);
    setHeight(45);
    setDiameter(50);
    setCylinderHeight(60);
    setFillPercent(90);
    setDisplacementPercent(5);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
          Aquarium & Volume Utility
        </div>

        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
          Aquarium Volume Calculator
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
          Calculate aquarium capacity and estimated actual water volume in
          litres, US gallons, UK gallons, and cubic feet.
        </p>
      </div>

      <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-6">
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <Droplets className="h-5 w-5 text-cyan-500" />
            <h2 className="text-xl font-bold">Tank dimensions</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-sm font-medium mb-2">
                Tank shape
              </label>

              <Select
                value={shape}
                onChange={(e) =>
                  setShape(e.target.value as Shape)
                }
                options={[
                  {
                    value: 'rectangular',
                    label: 'Rectangular / Box',
                  },
                  {
                    value: 'cylindrical',
                    label: 'Cylindrical',
                  },
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Dimension unit
              </label>

              <Select
                value={unit}
                onChange={(e) =>
                  setUnit(e.target.value as Unit)
                }
                options={[
                  { value: 'cm', label: 'Centimetres (cm)' },
                  { value: 'in', label: 'Inches (in)' },
                ]}
              />
            </div>
          </div>

          {shape === 'rectangular' ? (
            <div className="grid sm:grid-cols-3 gap-4">
              <DimensionField
                label="Length"
                value={length}
                unit={unit}
                onChange={setLength}
              />

              <DimensionField
                label="Width"
                value={width}
                unit={unit}
                onChange={setWidth}
              />

              <DimensionField
                label="Height"
                value={height}
                unit={unit}
                onChange={setHeight}
              />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              <DimensionField
                label="Diameter"
                value={diameter}
                unit={unit}
                onChange={setDiameter}
              />

              <DimensionField
                label="Height"
                value={cylinderHeight}
                unit={unit}
                onChange={setCylinderHeight}
              />
            </div>
          )}

          <div className="border-t border-slate-200 dark:border-slate-800 mt-7 pt-7">
            <h3 className="font-bold mb-4">
              Actual water estimate
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <PercentField
                label="Water fill level"
                value={fillPercent}
                onChange={setFillPercent}
              />

              <PercentField
                label="Substrate/decor displacement"
                value={displacementPercent}
                onChange={setDisplacementPercent}
              />
            </div>

            <p className="text-xs text-slate-500 mt-3 leading-relaxed">
              Use displacement to approximate volume occupied by
              substrate, rocks, wood, internal equipment, or other
              objects.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={reset}
            className="w-full mt-7"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </section>

        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
          <h2 className="text-xl font-bold mb-6">
            Aquarium volume
          </h2>

          {result.valid ? (
            <>
              <div className="rounded-3xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-200 dark:border-cyan-800 p-6 text-center">
                <p className="text-xs uppercase tracking-wider font-bold text-cyan-600 dark:text-cyan-400 mb-2">
                  Estimated actual water
                </p>

                <p className="text-5xl font-black text-slate-900 dark:text-white">
                  {fmt(result.estimatedWaterLitres)} L
                </p>

                <p className="text-sm text-slate-500 mt-2">
                  after fill level and displacement adjustments
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mt-5">
                <ResultCard
                  label="US gallons"
                  value={`${fmt(result.usGallons)} gal`}
                />

                <ResultCard
                  label="UK gallons"
                  value={`${fmt(result.ukGallons)} gal`}
                />

                <ResultCard
                  label="Cubic feet"
                  value={`${fmt(result.cubicFeet)} ft³`}
                />
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 dark:bg-slate-800 p-5">
                <h3 className="font-bold mb-4">
                  Volume breakdown
                </h3>

                <div className="space-y-3 text-sm">
                  <Row
                    label="Gross tank capacity"
                    value={`${fmt(result.grossLitres)} L`}
                  />

                  <Row
                    label={`At ${fillPercent}% fill`}
                    value={`${fmt(result.filledLitres)} L`}
                  />

                  <Row
                    label={`Estimated displacement (${displacementPercent}%)`}
                    value={`− ${fmt(result.displacementLitres)} L`}
                  />

                  <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                    <Row
                      label="Estimated actual water"
                      value={`${fmt(
                        result.estimatedWaterLitres
                      )} L`}
                      bold
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                <h3 className="font-bold mb-2">
                  Tank formula
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {shape === 'rectangular'
                    ? 'Rectangular volume = length × width × height.'
                    : 'Cylinder volume = π × radius² × height.'}
                  {' '}Dimensions are converted internally to centimetres,
                  then cubic centimetres are converted to litres.
                </p>
              </div>

              <div className="mt-6 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-4">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Manufacturer-rated tank volume can differ because of
                  glass thickness, curved panels, internal chambers, or
                  nominal dimensions.
                </p>
              </div>
            </>
          ) : (
            <div className="rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 p-5">
              <p className="font-bold text-red-700 dark:text-red-300 mb-2">
                Cannot calculate aquarium volume
              </p>

              <p className="text-sm text-red-600 dark:text-red-400">
                {result.error}
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function DimensionField({
  label,
  value,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  unit: Unit;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label}
      </label>

      <div className="relative">
        <Input
          type="number"
          min={0.1}
          step={0.1}
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

function PercentField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label}
      </label>

      <div className="relative">
        <Input
          type="number"
          min={0}
          max={100}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="pr-10"
        />

        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
          %
        </span>
      </div>
    </div>
  );
}

function ResultCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4">
      <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">
        {label}
      </p>

      <p className="text-xl font-black">{value}</p>
    </div>
  );
}

function Row({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 ${
        bold ? 'font-bold text-base' : ''
      }`}
    >
      <span className="text-slate-600 dark:text-slate-300">
        {label}
      </span>

      <span>{value}</span>
    </div>
  );
}
