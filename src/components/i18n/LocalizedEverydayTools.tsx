'use client';

import { useMemo, useState } from 'react';
import {
  Droplets,
  Dumbbell,
  BatteryCharging,
  Box,
  Zap,
  Car,
  Calendar,
  CircleGauge,
  Scale,
  Globe2,
  Loader2,
  RotateCcw,
  Plus,
  Trash2,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import ResultActions from '@/components/ui/ResultActions';
import { resultActionMessages } from '@/lib/i18n/actionMessages';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';
import { fieldClass, buttonClass } from './ToolControls';
import { calculateDimensionalWeight } from '@/lib/calculations/projectEstimators';
import { calculateElectricityCost } from '@/lib/calculations/energyElectrical';
import { calculateSchengenStay, type SchengenTrip } from '@/lib/calculations/schengen';

export type EverydayToolSlug =
  | 'aquarium-volume-calculator'
  | 'barbell-plate-calculator'
  | 'battery-charge-time-calculator'
  | 'dimensional-weight-calculator'
  | 'electricity-cost-calculator'
  | 'fuel-cost-split-calculator'
  | 'schengen-90-180-day-calculator'
  | 'tire-size-calculator'
  | 'unit-price-calculator'
  | 'website-worth-calculator';

function safeCalc<T>(fn: () => T, defaultError: string) {
  try {
    return { data: fn(), error: '' };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : defaultError };
  }
}

const KG_PLATES = [25, 20, 15, 10, 5, 2.5, 1.25];
const LB_PLATES = [55, 45, 35, 25, 10, 5, 2.5];

const LITRES_PER_US_GALLON = 3.785411784;
const LITRES_PER_UK_GALLON = 4.54609;
const LITRES_PER_CUBIC_FOOT = 28.316846592;
const KM_PER_MILE = 1.609344;

type ScanData = {
  url: string;
  title: string;
  status: number;
  responseMs: number;
  https: boolean;
  wordCount: number;
  headings: number;
  internalLinks: number;
  externalLinks: number;
  hasCanonical: boolean;
  hasViewport: boolean;
  hasStructuredData: boolean;
  hasRobots: boolean;
  hasSitemap: boolean;
  technicalScore: number;
};

export default function LocalizedEverydayTools({
  slug,
  locale,
  dictionary,
}: {
  slug: EverydayToolSlug;
  locale: Locale;
  dictionary: Dictionary;
}) {
  const d = dictionary;
  const ui = d.ui;
  const ev = (d as unknown as { everyday: Record<string, Record<string, string>> }).everyday;
  const com = ev.common;
  const actionCopy = resultActionMessages[locale];

  const format = (n: number, maxDigits = 2) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: maxDigits }).format(n);

  const formatMoney = (n: number, currencySymbol = '$') =>
    `${currencySymbol}${new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n)}`;

  // 1. Aquarium Volume State
  const [aqShape, setAqShape] = useState<'rectangular' | 'cylindrical'>('rectangular');
  const [aqUnit, setAqUnit] = useState<'cm' | 'in'>('cm');
  const [aqLength, setAqLength] = useState(90);
  const [aqWidth, setAqWidth] = useState(45);
  const [aqHeight, setAqHeight] = useState(45);
  const [aqDiameter, setAqDiameter] = useState(50);
  const [aqCylinderHeight, setAqCylinderHeight] = useState(60);
  const [aqFillPercent, setAqFillPercent] = useState(90);
  const [aqDisplacement, setAqDisplacement] = useState(5);

  const aquariumResult = useMemo(
    () =>
      safeCalc(() => {
        if (
          !Number.isFinite(aqFillPercent) ||
          !Number.isFinite(aqDisplacement) ||
          aqFillPercent <= 0 ||
          aqFillPercent > 100 ||
          aqDisplacement < 0 ||
          aqDisplacement >= 100
        ) {
          throw new RangeError(com.errorCheck);
        }
        const toCm = (val: number) => (aqUnit === 'cm' ? val : val * 2.54);
        let grossLitres = 0;
        if (aqShape === 'rectangular') {
          if (aqLength <= 0 || aqWidth <= 0 || aqHeight <= 0) {
            throw new RangeError(com.errorCheck);
          }
          const l = toCm(aqLength);
          const w = toCm(aqWidth);
          const h = toCm(aqHeight);
          grossLitres = (l * w * h) / 1000;
        } else {
          if (aqDiameter <= 0 || aqCylinderHeight <= 0) {
            throw new RangeError(com.errorCheck);
          }
          const dCm = toCm(aqDiameter);
          const hCm = toCm(aqCylinderHeight);
          const radius = dCm / 2;
          grossLitres = (Math.PI * radius * radius * hCm) / 1000;
        }
        const filledLitres = grossLitres * (aqFillPercent / 100);
        const displacementLitres = filledLitres * (aqDisplacement / 100);
        const estimatedWaterLitres = filledLitres - displacementLitres;
        return {
          grossLitres,
          filledLitres,
          displacementLitres,
          estimatedWaterLitres,
          usGallons: estimatedWaterLitres / LITRES_PER_US_GALLON,
          ukGallons: estimatedWaterLitres / LITRES_PER_UK_GALLON,
          cubicFeet: estimatedWaterLitres / LITRES_PER_CUBIC_FOOT,
        };
      }, com.errorCheck),
    [
      aqShape,
      aqUnit,
      aqLength,
      aqWidth,
      aqHeight,
      aqDiameter,
      aqCylinderHeight,
      aqFillPercent,
      aqDisplacement,
      com.errorCheck,
    ]
  );

  // 2. Barbell Plate State
  const [bbUnit, setBbUnit] = useState<'kg' | 'lb'>('kg');
  const [bbTargetWeight, setBbTargetWeight] = useState(100);
  const [bbBarWeight, setBbBarWeight] = useState(20);

  const barbellResult = useMemo(
    () =>
      safeCalc(() => {
        if (
          !Number.isFinite(bbTargetWeight) ||
          !Number.isFinite(bbBarWeight) ||
          bbTargetWeight <= 0 ||
          bbBarWeight < 0
        ) {
          throw new RangeError(com.errorCheck);
        }
        if (bbTargetWeight < bbBarWeight) {
          throw new RangeError(ev.barbell.targetBelowBar || com.errorCheck);
        }
        const plates = bbUnit === 'kg' ? KG_PLATES : LB_PLATES;
        let remainingPerSide = (bbTargetWeight - bbBarWeight) / 2;
        const combo: Array<{ plate: number; count: number }> = [];
        for (const p of plates) {
          const c = Math.floor((remainingPerSide + 1e-9) / p);
          if (c > 0) {
            combo.push({ plate: p, count: c });
            remainingPerSide -= c * p;
          }
        }
        const loadedPerSide = (bbTargetWeight - bbBarWeight) / 2 - remainingPerSide;
        const achievedWeight = bbBarWeight + loadedPerSide * 2;
        const diff = bbTargetWeight - achievedWeight;
        return {
          combo,
          loadedPerSide,
          achievedWeight,
          difference: diff,
          exact: Math.abs(diff) < 0.001,
          totalPlateWeight: loadedPerSide * 2,
        };
      }, com.errorCheck),
    [bbUnit, bbTargetWeight, bbBarWeight, com.errorCheck, ev.barbell.targetBelowBar]
  );

  // 3. Battery Charge Time State
  const [batCapacity, setBatCapacity] = useState(100);
  const [batCurrent, setBatCurrent] = useState(10);
  const [batStart, setBatStart] = useState(20);
  const [batTarget, setBatTarget] = useState(80);
  const [batEfficiency, setBatEfficiency] = useState(85);

  const batteryResult = useMemo(
    () =>
      safeCalc(() => {
        if (
          !Number.isFinite(batCapacity) ||
          !Number.isFinite(batCurrent) ||
          !Number.isFinite(batStart) ||
          !Number.isFinite(batTarget) ||
          !Number.isFinite(batEfficiency) ||
          batCapacity <= 0 ||
          batCurrent <= 0 ||
          batStart < 0 ||
          batStart > 100 ||
          batTarget <= batStart ||
          batTarget > 100 ||
          batEfficiency <= 0 ||
          batEfficiency > 100
        ) {
          throw new RangeError(com.errorCheck);
        }
        const hours = (batCapacity * (batTarget - batStart)) / 100 / batCurrent / (batEfficiency / 100);
        const minutes = Math.round(hours * 60);
        return {
          hours,
          minutes,
          hoursPart: Math.floor(minutes / 60),
          minutesPart: minutes % 60,
        };
      }, com.errorCheck),
    [batCapacity, batCurrent, batStart, batTarget, batEfficiency, com.errorCheck]
  );

  // 4. Dimensional Weight State
  const [dimSystem, setDimSystem] = useState<'metric' | 'imperial'>('metric');
  const [dimLength, setDimLength] = useState(50);
  const [dimWidth, setDimWidth] = useState(40);
  const [dimHeight, setDimHeight] = useState(30);
  const [dimActualWeight, setDimActualWeight] = useState(8);
  const [dimDivisor, setDimDivisor] = useState(5000);

  const dimResult = useMemo(
    () =>
      safeCalc(() => {
        return calculateDimensionalWeight({
          length: dimLength,
          width: dimWidth,
          height: dimHeight,
          actualWeight: dimActualWeight,
          divisor: dimDivisor,
        });
      }, com.errorCheck),
    [dimLength, dimWidth, dimHeight, dimActualWeight, dimDivisor, com.errorCheck]
  );

  // 5. Electricity Cost State
  const [elecWatts, setElecWatts] = useState(1000);
  const [elecHours, setElecHours] = useState(4);
  const [elecDays, setElecDays] = useState(30);
  const [elecRate, setElecRate] = useState(0.2);
  const [elecCurrency, setElecCurrency] = useState('$');

  const electricityResult = useMemo(
    () =>
      safeCalc(() => {
        return calculateElectricityCost({
          watts: elecWatts,
          hoursPerDay: elecHours,
          days: elecDays,
          ratePerKwh: elecRate,
        });
      }, com.errorCheck),
    [elecWatts, elecHours, elecDays, elecRate, com.errorCheck]
  );

  // 6. Fuel Cost Split State
  const [fuelDistance, setFuelDistance] = useState(300);
  const [fuelDistanceUnit, setFuelDistanceUnit] = useState<'km' | 'mi'>('km');
  const [fuelEfficiency, setFuelEfficiency] = useState(15);
  const [fuelEfficiencyUnit, setFuelEfficiencyUnit] = useState<'kmpl' | 'l100km' | 'mpg'>('kmpl');
  const [fuelPrice, setFuelPrice] = useState(1.8);
  const [fuelPassengers, setFuelPassengers] = useState(4);
  const [fuelRoundTrip, setFuelRoundTrip] = useState(false);
  const [fuelTolls, setFuelTolls] = useState(10);
  const [fuelParking, setFuelParking] = useState(15);
  const [fuelOtherCosts, setFuelOtherCosts] = useState(0);
  const [fuelCurrency, setFuelCurrency] = useState('$');

  const fuelResult = useMemo(
    () =>
      safeCalc(() => {
        if (
          !Number.isFinite(fuelDistance) ||
          fuelDistance <= 0 ||
          !Number.isFinite(fuelEfficiency) ||
          fuelEfficiency <= 0 ||
          fuelPrice < 0 ||
          fuelPassengers < 1 ||
          !Number.isInteger(fuelPassengers)
        ) {
          throw new RangeError(com.errorCheck);
        }
        const tripDistance = fuelRoundTrip ? fuelDistance * 2 : fuelDistance;
        const distanceKm = fuelDistanceUnit === 'km' ? tripDistance : tripDistance * KM_PER_MILE;
        let litresNeeded = 0;
        if (fuelEfficiencyUnit === 'kmpl') {
          litresNeeded = distanceKm / fuelEfficiency;
        } else if (fuelEfficiencyUnit === 'l100km') {
          litresNeeded = (distanceKm * fuelEfficiency) / 100;
        } else {
          const miles = distanceKm / KM_PER_MILE;
          const gallons = miles / fuelEfficiency;
          litresNeeded = gallons * LITRES_PER_US_GALLON;
        }
        const fuelCost = litresNeeded * fuelPrice;
        const extras = fuelTolls + fuelParking + fuelOtherCosts;
        const totalCost = fuelCost + extras;
        const perPassenger = totalCost / fuelPassengers;
        return {
          tripDistance,
          distanceKm,
          litresNeeded,
          fuelCost,
          extras,
          totalCost,
          perPassenger,
        };
      }, com.errorCheck),
    [
      fuelDistance,
      fuelDistanceUnit,
      fuelEfficiency,
      fuelEfficiencyUnit,
      fuelPrice,
      fuelPassengers,
      fuelRoundTrip,
      fuelTolls,
      fuelParking,
      fuelOtherCosts,
      com.errorCheck,
    ]
  );

  // 7. Schengen 90/180 State
  const [schengenRefDate, setSchengenRefDate] = useState('2026-09-04');
  const [schengenTrips, setSchengenTrips] = useState<SchengenTrip[]>([
    { id: 'trip-1', entryDate: '2026-06-01', exitDate: '2026-06-20', label: 'Trip 1' },
    { id: 'trip-2', entryDate: '2026-07-15', exitDate: '2026-08-05', label: 'Trip 2' },
  ]);

  const updateTrip = (id: string, key: 'entryDate' | 'exitDate' | 'label', val: string) => {
    setSchengenTrips((items) =>
      items.map((t) => (t.id === id ? { ...t, [key]: val } : t))
    );
  };

  const addTrip = () => {
    setSchengenTrips((items) => [
      ...items,
      {
        id: `trip-${Date.now()}`,
        entryDate: schengenRefDate,
        exitDate: schengenRefDate,
        label: `Trip ${items.length + 1}`,
      },
    ]);
  };

  const removeTrip = (id: string) => {
    setSchengenTrips((items) => items.filter((t) => t.id !== id));
  };

  const schengenResult = useMemo(
    () =>
      safeCalc(() => {
        return calculateSchengenStay({
          referenceDate: schengenRefDate,
          trips: schengenTrips,
        });
      }, com.errorCheck),
    [schengenRefDate, schengenTrips, com.errorCheck]
  );

  // 8. Tire Size State
  const [tireOldWidth, setTireOldWidth] = useState(205);
  const [tireOldAspect, setTireOldAspect] = useState(55);
  const [tireOldRim, setTireOldRim] = useState(16);
  const [tireNewWidth, setTireNewWidth] = useState(225);
  const [tireNewAspect, setTireNewAspect] = useState(45);
  const [tireNewRim, setTireNewRim] = useState(17);
  const [tireSpeed, setTireSpeed] = useState(100);

  const tireResult = useMemo(
    () =>
      safeCalc(() => {
        const values = [
          tireOldWidth,
          tireOldAspect,
          tireOldRim,
          tireNewWidth,
          tireNewAspect,
          tireNewRim,
          tireSpeed,
        ];
        if (values.some((v) => !Number.isFinite(v) || v <= 0)) {
          throw new RangeError(com.errorCheck);
        }
        const calcTire = (w: number, a: number, r: number) => {
          const sidewallMm = (w * a) / 100;
          const diameterMm = r * 25.4 + sidewallMm * 2;
          const circumferenceMm = Math.PI * diameterMm;
          return {
            sidewallMm,
            diameterMm,
            circumferenceMm,
            revPerKm: 1_000_000 / circumferenceMm,
          };
        };
        const oldT = calcTire(tireOldWidth, tireOldAspect, tireOldRim);
        const newT = calcTire(tireNewWidth, tireNewAspect, tireNewRim);
        const diff = ((newT.diameterMm - oldT.diameterMm) / oldT.diameterMm) * 100;
        const actualSpeed = (tireSpeed * newT.diameterMm) / oldT.diameterMm;
        const clearance = (newT.diameterMm - oldT.diameterMm) / 2;
        return {
          oldT,
          newT,
          difference: diff,
          actualSpeed,
          clearance,
        };
      }, com.errorCheck),
    [
      tireOldWidth,
      tireOldAspect,
      tireOldRim,
      tireNewWidth,
      tireNewAspect,
      tireNewRim,
      tireSpeed,
      com.errorCheck,
    ]
  );

  // 9. Unit Price State
  const [upPriceA, setUpPriceA] = useState(10);
  const [upQtyA, setUpQtyA] = useState(2);
  const [upPriceB, setUpPriceB] = useState(18);
  const [upQtyB, setUpQtyB] = useState(4);
  const [upUnitLabel, setUpUnitLabel] = useState('kg');
  const [upCurrency, setUpCurrency] = useState('$');

  const unitPriceResult = useMemo(
    () =>
      safeCalc(() => {
        if (
          !Number.isFinite(upPriceA) ||
          !Number.isFinite(upQtyA) ||
          !Number.isFinite(upPriceB) ||
          !Number.isFinite(upQtyB) ||
          upPriceA < 0 ||
          upPriceB < 0 ||
          upQtyA <= 0 ||
          upQtyB <= 0
        ) {
          throw new RangeError(com.errorCheck);
        }
        const unitA = upPriceA / upQtyA;
        const unitB = upPriceB / upQtyB;
        const cheaper = unitA === unitB ? 'same' : unitA < unitB ? 'A' : 'B';
        const diff = Math.abs(unitA - unitB);
        const maxUnit = Math.max(unitA, unitB);
        const savingPercent = maxUnit === 0 ? 0 : (diff / maxUnit) * 100;
        return {
          unitA,
          unitB,
          cheaper,
          diff,
          savingPercent,
        };
      }, com.errorCheck),
    [upPriceA, upQtyA, upPriceB, upQtyB, com.errorCheck]
  );

  // 10. Website Worth State
  const [wwUrl, setWwUrl] = useState('');
  const [wwVisits, setWwVisits] = useState('50000');
  const [wwRevenue, setWwRevenue] = useState('1500');
  const [wwProfit, setWwProfit] = useState('1000');
  const [wwScan, setWwScan] = useState<ScanData | null>(null);
  const [wwLoading, setWwLoading] = useState(false);
  const [wwError, setWwError] = useState('');

  const websiteWorthResult = useMemo(() => {
    const v = Math.max(0, Number(wwVisits) || 0);
    const r = Math.max(0, Number(wwRevenue) || 0);
    const p = Math.max(0, Number(wwProfit) || 0);
    let monthly = p || r * 0.65;
    if (!monthly && v) monthly = (v / 1000) * 12 * 0.65;
    if (!monthly) return null;
    const quality = wwScan ? 0.85 + (wwScan.technicalScore / 100) * 0.3 : 1;
    return {
      low: monthly * 24 * quality,
      mid: monthly * 32 * quality,
      high: monthly * 40 * quality,
    };
  }, [wwVisits, wwRevenue, wwProfit, wwScan]);

  async function handleAnalyzeUrl() {
    if (!wwUrl.trim()) return;
    setWwLoading(true);
    setWwError('');
    setWwScan(null);
    try {
      const res = await fetch('/api/website-worth', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url: wwUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || ev.websiteWorth.scanFailed || 'Scan failed');
      setWwScan(data);
    } catch (e) {
      setWwError(e instanceof Error ? e.message : 'Analysis failed');
    } finally {
      setWwLoading(false);
    }
  }

  // Active results extraction
  let currentResults: Array<[string, string]> = [];
  let currentError = '';

  if (slug === 'aquarium-volume-calculator') {
    currentError = aquariumResult.error;
    const r = aquariumResult.data;
    if (r) {
      currentResults = [
        [ev.aquarium.estimatedActualWater, `${format(r.estimatedWaterLitres, 1)} L`],
        [ev.aquarium.grossCapacity, `${format(r.grossLitres, 1)} L`],
        [ev.aquarium.usGallons, `${format(r.usGallons, 1)} gal`],
        [ev.aquarium.ukGallons, `${format(r.ukGallons, 1)} gal`],
        [ev.aquarium.cubicFeet, `${format(r.cubicFeet, 2)} ft³`],
      ];
    }
  } else if (slug === 'barbell-plate-calculator') {
    currentError = barbellResult.error;
    const r = barbellResult.data;
    if (r) {
      const plateStr = r.combo.map((c) => `${c.count} × ${c.plate} ${bbUnit}`).join(', ') || '—';
      currentResults = [
        [ev.barbell.platesPerSide, plateStr],
        [ev.barbell.totalWeight, `${format(r.achievedWeight, 1)} ${bbUnit}`],
        [ev.barbell.plateWeight, `${format(r.totalPlateWeight, 1)} ${bbUnit}`],
        [ev.barbell.weightDifference, `${format(r.difference, 2)} ${bbUnit}`],
        [ev.barbell.status, r.exact ? ev.barbell.exact : `${format(r.difference, 2)} ${bbUnit}`],
      ];
    }
  } else if (slug === 'battery-charge-time-calculator') {
    currentError = batteryResult.error;
    const r = batteryResult.data;
    if (r) {
      currentResults = [
        [ev.battery.chargeTime, `${r.hoursPart} h ${r.minutesPart} min`],
        [ev.battery.totalHours, `${format(r.hours, 2)} h`],
      ];
    }
  } else if (slug === 'dimensional-weight-calculator') {
    currentError = dimResult.error;
    const r = dimResult.data;
    if (r) {
      const unit = dimSystem === 'metric' ? 'kg' : 'lb';
      const volUnit = dimSystem === 'metric' ? 'cm³' : 'in³';
      const basis =
        r.dimensionalWeight > dimActualWeight
          ? ev.dimWeight.chargedByDim
          : ev.dimWeight.chargedByActual;
      currentResults = [
        [ev.dimWeight.billableWeight, `${format(r.billableWeight, 2)} ${unit}`],
        [ev.dimWeight.dimWeightResult, `${format(r.dimensionalWeight, 2)} ${unit}`],
        [ev.dimWeight.volume, `${format(r.volume, 0)} ${volUnit}`],
        [ev.dimWeight.chargedBy, basis],
      ];
    }
  } else if (slug === 'electricity-cost-calculator') {
    currentError = electricityResult.error;
    const r = electricityResult.data;
    if (r) {
      currentResults = [
        [ev.electricity.totalCost, formatMoney(r.totalCost, elecCurrency)],
        [ev.electricity.totalKwh, `${format(r.totalKwh, 2)} kWh`],
        [ev.electricity.costPerDay, formatMoney(r.dailyCost, elecCurrency)],
        [ev.electricity.costPerMonth, formatMoney(r.monthlyCost, elecCurrency)],
        [ev.electricity.costPerYear, formatMoney(r.yearlyCost, elecCurrency)],
      ];
    }
  } else if (slug === 'fuel-cost-split-calculator') {
    currentError = fuelResult.error;
    const r = fuelResult.data;
    if (r) {
      currentResults = [
        [ev.fuelSplit.costPerPerson, formatMoney(r.perPassenger, fuelCurrency)],
        [ev.fuelSplit.totalCost, formatMoney(r.totalCost, fuelCurrency)],
        [ev.fuelSplit.fuelCost, formatMoney(r.fuelCost, fuelCurrency)],
        [ev.fuelSplit.fuelNeeded, `${format(r.litresNeeded, 1)} L`],
        [ev.fuelSplit.distance, `${format(r.tripDistance, 0)} ${fuelDistanceUnit}`],
      ];
    }
  } else if (slug === 'schengen-90-180-day-calculator') {
    currentError = schengenResult.error;
    const r = schengenResult.data;
    if (r) {
      const status = r.compliant
        ? ev.schengen.compliant
        : `${ev.schengen.overstay}: ${r.overstayDays}`;
      currentResults = [
        [ev.schengen.complianceStatus, status],
        [ev.schengen.daysUsed, `${r.daysUsed} / 90`],
        [ev.schengen.daysRemaining, `${r.daysRemaining}`],
        [ev.schengen.windowStart, `${r.windowStart}`],
      ];
    }
  } else if (slug === 'tire-size-calculator') {
    currentError = tireResult.error;
    const r = tireResult.data;
    if (r) {
      currentResults = [
        [ev.tireSize.diameterDiff, `${format(r.difference, 2)} %`],
        [ev.tireSize.speedometerReading, `${format(r.actualSpeed, 1)} km/h`],
        [ev.tireSize.clearanceDiff, `${format(r.clearance, 1)} mm`],
        [ev.tireSize.originalDiameter, `${format(r.oldT.diameterMm, 1)} mm`],
        [ev.tireSize.newDiameter, `${format(r.newT.diameterMm, 1)} mm`],
      ];
    }
  } else if (slug === 'unit-price-calculator') {
    currentError = unitPriceResult.error;
    const r = unitPriceResult.data;
    if (r) {
      const best =
        r.cheaper === 'same'
          ? ev.unitPrice.equalPrice
          : r.cheaper === 'A'
          ? ev.unitPrice.optionACheaper
          : ev.unitPrice.optionBCheaper;
      currentResults = [
        [ev.unitPrice.cheaperOption, best],
        [ev.unitPrice.unitPriceA, `${formatMoney(r.unitA, upCurrency)} / ${upUnitLabel}`],
        [ev.unitPrice.unitPriceB, `${formatMoney(r.unitB, upCurrency)} / ${upUnitLabel}`],
        [ev.unitPrice.savingsPercent, `${format(r.savingPercent, 1)} %`],
        [ev.unitPrice.priceDifference, `${formatMoney(r.diff, upCurrency)}`],
      ];
    }
  } else if (slug === 'website-worth-calculator') {
    if (websiteWorthResult) {
      currentResults = [
        [ev.websiteWorth.midpoint, formatMoney(websiteWorthResult.mid, '$')],
        [ev.websiteWorth.marketRange, `${formatMoney(websiteWorthResult.low, '$')} – ${formatMoney(websiteWorthResult.high, '$')}`],
      ];
    }
  }

  const toolTitle = d.tools[slug]?.title || slug;
  const activeSummary = `${toolTitle} (${locale})\n${currentResults
    .map(([label, val]) => `${label}: ${val}`)
    .join('\n')}`;

  const csvRows =
    '\uFEFF' +
    [
      `"${d.calculatorUi.result}","${d.calculatorUi.value}"`,
      ...currentResults.map(
        ([label, val]) => `"${label.replace(/"/g, '""')}","${String(val).replace(/"/g, '""')}"`
      ),
    ].join('\n');

  const handleReset = () => {
    setAqShape('rectangular');
    setAqUnit('cm');
    setAqLength(90);
    setAqWidth(45);
    setAqHeight(45);
    setAqDiameter(50);
    setAqCylinderHeight(60);
    setAqFillPercent(90);
    setAqDisplacement(5);

    setBbUnit('kg');
    setBbTargetWeight(100);
    setBbBarWeight(20);

    setBatCapacity(100);
    setBatCurrent(10);
    setBatStart(20);
    setBatTarget(80);
    setBatEfficiency(85);

    setDimSystem('metric');
    setDimLength(50);
    setDimWidth(40);
    setDimHeight(30);
    setDimActualWeight(8);
    setDimDivisor(5000);

    setElecWatts(1000);
    setElecHours(4);
    setElecDays(30);
    setElecRate(0.2);
    setElecCurrency('$');

    setFuelDistance(300);
    setFuelDistanceUnit('km');
    setFuelEfficiency(15);
    setFuelEfficiencyUnit('kmpl');
    setFuelPrice(1.8);
    setFuelPassengers(4);
    setFuelRoundTrip(false);
    setFuelTolls(10);
    setFuelParking(15);
    setFuelOtherCosts(0);
    setFuelCurrency('$');

    setSchengenRefDate('2026-09-04');
    setSchengenTrips([
      { id: 'trip-1', entryDate: '2026-06-01', exitDate: '2026-06-20', label: 'Trip 1' },
      { id: 'trip-2', entryDate: '2026-07-15', exitDate: '2026-08-05', label: 'Trip 2' },
    ]);

    setTireOldWidth(205);
    setTireOldAspect(55);
    setTireOldRim(16);
    setTireNewWidth(225);
    setTireNewAspect(45);
    setTireNewRim(17);
    setTireSpeed(100);

    setUpPriceA(10);
    setUpQtyA(2);
    setUpPriceB(18);
    setUpQtyB(4);
    setUpUnitLabel('kg');
    setUpCurrency('$');

    setWwUrl('');
    setWwVisits('50000');
    setWwRevenue('1500');
    setWwProfit('1000');
    setWwScan(null);
  };

  const csvName = `${slug}-${locale}.csv`;

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-2">
      {/* Controls Card */}
      <section className="min-w-0 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
        <div className="flex min-w-0 items-center gap-2">
          {slug === 'aquarium-volume-calculator' && <Droplets className="size-5 shrink-0 text-cyan-500" />}
          {slug === 'barbell-plate-calculator' && <Dumbbell className="size-5 shrink-0 text-indigo-500" />}
          {slug === 'battery-charge-time-calculator' && <BatteryCharging className="size-5 shrink-0 text-emerald-500" />}
          {slug === 'dimensional-weight-calculator' && <Box className="size-5 shrink-0 text-violet-500" />}
          {slug === 'electricity-cost-calculator' && <Zap className="size-5 shrink-0 text-amber-500" />}
          {slug === 'fuel-cost-split-calculator' && <Car className="size-5 shrink-0 text-blue-500" />}
          {slug === 'schengen-90-180-day-calculator' && <Calendar className="size-5 shrink-0 text-indigo-500" />}
          {slug === 'tire-size-calculator' && <CircleGauge className="size-5 shrink-0 text-indigo-500" />}
          {slug === 'unit-price-calculator' && <Scale className="size-5 shrink-0 text-emerald-500" />}
          {slug === 'website-worth-calculator' && <TrendingUp className="size-5 shrink-0 text-indigo-500" />}

          <h2 className="min-w-0 break-words text-xl font-bold">
            {slug === 'aquarium-volume-calculator' && ev.aquarium.heading}
            {slug === 'barbell-plate-calculator' && ev.barbell.heading}
            {slug === 'battery-charge-time-calculator' && ev.battery.heading}
            {slug === 'dimensional-weight-calculator' && ev.dimWeight.heading}
            {slug === 'electricity-cost-calculator' && ev.electricity.heading}
            {slug === 'fuel-cost-split-calculator' && ev.fuelSplit.heading}
            {slug === 'schengen-90-180-day-calculator' && ev.schengen.heading}
            {slug === 'tire-size-calculator' && ev.tireSize.heading}
            {slug === 'unit-price-calculator' && ev.unitPrice.heading}
            {slug === 'website-worth-calculator' && ev.websiteWorth.heading}
          </h2>
        </div>

        <div className="mt-5 grid min-w-0 gap-4 sm:grid-cols-2">
          {/* 1. Aquarium Inputs */}
          {slug === 'aquarium-volume-calculator' && (
            <>
              <label className="min-w-0 text-sm font-semibold">
                {ev.aquarium.shape}
                <select
                  value={aqShape}
                  onChange={(e) => setAqShape(e.target.value as 'rectangular' | 'cylindrical')}
                  className={fieldClass}
                >
                  <option value="rectangular">{ev.aquarium.rectangular}</option>
                  <option value="cylindrical">{ev.aquarium.cylindrical}</option>
                </select>
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {ev.aquarium.unit}
                <select
                  value={aqUnit}
                  onChange={(e) => setAqUnit(e.target.value as 'cm' | 'in')}
                  className={fieldClass}
                >
                  <option value="cm">{ev.aquarium.cm}</option>
                  <option value="in">{ev.aquarium.in}</option>
                </select>
              </label>
              {aqShape === 'rectangular' ? (
                <>
                  <label className="min-w-0 text-sm font-semibold">
                    {ev.aquarium.length}
                    <input
                      type="number"
                      min="1"
                      value={aqLength}
                      onChange={(e) => setAqLength(Number(e.target.value))}
                      className={fieldClass}
                    />
                  </label>
                  <label className="min-w-0 text-sm font-semibold">
                    {ev.aquarium.width}
                    <input
                      type="number"
                      min="1"
                      value={aqWidth}
                      onChange={(e) => setAqWidth(Number(e.target.value))}
                      className={fieldClass}
                    />
                  </label>
                  <label className="min-w-0 text-sm font-semibold sm:col-span-2">
                    {ev.aquarium.height}
                    <input
                      type="number"
                      min="1"
                      value={aqHeight}
                      onChange={(e) => setAqHeight(Number(e.target.value))}
                      className={fieldClass}
                    />
                  </label>
                </>
              ) : (
                <>
                  <label className="min-w-0 text-sm font-semibold">
                    {ev.aquarium.diameter}
                    <input
                      type="number"
                      min="1"
                      value={aqDiameter}
                      onChange={(e) => setAqDiameter(Number(e.target.value))}
                      className={fieldClass}
                    />
                  </label>
                  <label className="min-w-0 text-sm font-semibold">
                    {ev.aquarium.cylinderHeight}
                    <input
                      type="number"
                      min="1"
                      value={aqCylinderHeight}
                      onChange={(e) => setAqCylinderHeight(Number(e.target.value))}
                      className={fieldClass}
                    />
                  </label>
                </>
              )}
              <label className="min-w-0 text-sm font-semibold">
                {ev.aquarium.fillPercent}
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={aqFillPercent}
                  onChange={(e) => setAqFillPercent(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {ev.aquarium.displacementPercent}
                <input
                  type="number"
                  min="0"
                  max="90"
                  value={aqDisplacement}
                  onChange={(e) => setAqDisplacement(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
            </>
          )}

          {/* 2. Barbell Inputs */}
          {slug === 'barbell-plate-calculator' && (
            <>
              <label className="min-w-0 text-sm font-semibold">
                {ev.barbell.unit}
                <select
                  value={bbUnit}
                  onChange={(e) => {
                    const next = e.target.value as 'kg' | 'lb';
                    setBbUnit(next);
                    if (next === 'kg') {
                      setBbBarWeight(20);
                      setBbTargetWeight(100);
                    } else {
                      setBbBarWeight(45);
                      setBbTargetWeight(225);
                    }
                  }}
                  className={fieldClass}
                >
                  <option value="kg">{ev.barbell.kg}</option>
                  <option value="lb">{ev.barbell.lb}</option>
                </select>
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {ev.barbell.barWeight}
                <input
                  type="number"
                  min="0"
                  value={bbBarWeight}
                  onChange={(e) => setBbBarWeight(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold sm:col-span-2">
                {ev.barbell.targetWeight}
                <input
                  type="number"
                  min="1"
                  value={bbTargetWeight}
                  onChange={(e) => setBbTargetWeight(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
            </>
          )}

          {/* 3. Battery Inputs */}
          {slug === 'battery-charge-time-calculator' && (
            <>
              <label className="min-w-0 text-sm font-semibold">
                {ev.battery.capacity}
                <input
                  type="number"
                  min="1"
                  value={batCapacity}
                  onChange={(e) => setBatCapacity(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {ev.battery.current}
                <input
                  type="number"
                  min="0.1"
                  step="0.5"
                  value={batCurrent}
                  onChange={(e) => setBatCurrent(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {ev.battery.start}
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={batStart}
                  onChange={(e) => setBatStart(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {ev.battery.target}
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={batTarget}
                  onChange={(e) => setBatTarget(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold sm:col-span-2">
                {ev.battery.efficiency}
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={batEfficiency}
                  onChange={(e) => setBatEfficiency(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
            </>
          )}

          {/* 4. Dimensional Weight Inputs */}
          {slug === 'dimensional-weight-calculator' && (
            <>
              <label className="min-w-0 text-sm font-semibold sm:col-span-2">
                {ev.dimWeight.system}
                <select
                  value={dimSystem}
                  onChange={(e) => {
                    const next = e.target.value as 'metric' | 'imperial';
                    setDimSystem(next);
                    if (next === 'metric') {
                      setDimLength(50);
                      setDimWidth(40);
                      setDimHeight(30);
                      setDimActualWeight(8);
                      setDimDivisor(5000);
                    } else {
                      setDimLength(20);
                      setDimWidth(16);
                      setDimHeight(12);
                      setDimActualWeight(18);
                      setDimDivisor(139);
                    }
                  }}
                  className={fieldClass}
                >
                  <option value="metric">{ev.dimWeight.metricSystem}</option>
                  <option value="imperial">{ev.dimWeight.imperialSystem}</option>
                </select>
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {ev.dimWeight.length}
                <input
                  type="number"
                  min="1"
                  value={dimLength}
                  onChange={(e) => setDimLength(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {ev.dimWeight.width}
                <input
                  type="number"
                  min="1"
                  value={dimWidth}
                  onChange={(e) => setDimWidth(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {ev.dimWeight.height}
                <input
                  type="number"
                  min="1"
                  value={dimHeight}
                  onChange={(e) => setDimHeight(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {ev.dimWeight.actualWeight}
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={dimActualWeight}
                  onChange={(e) => setDimActualWeight(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold sm:col-span-2">
                {ev.dimWeight.divisor}
                <input
                  type="number"
                  min="1"
                  value={dimDivisor}
                  onChange={(e) => setDimDivisor(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
            </>
          )}

          {/* 5. Electricity Cost Inputs */}
          {slug === 'electricity-cost-calculator' && (
            <>
              <label className="min-w-0 text-sm font-semibold">
                {ev.electricity.power}
                <input
                  type="number"
                  min="1"
                  value={elecWatts}
                  onChange={(e) => setElecWatts(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {ev.electricity.hoursPerDay}
                <input
                  type="number"
                  min="0.1"
                  max="24"
                  step="0.5"
                  value={elecHours}
                  onChange={(e) => setElecHours(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {ev.electricity.days}
                <input
                  type="number"
                  min="1"
                  value={elecDays}
                  onChange={(e) => setElecDays(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {ev.electricity.rate}
                <input
                  type="number"
                  min="0.001"
                  step="0.01"
                  value={elecRate}
                  onChange={(e) => setElecRate(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold sm:col-span-2">
                {com.currency}
                <select
                  value={elecCurrency}
                  onChange={(e) => setElecCurrency(e.target.value)}
                  className={fieldClass}
                >
                  <option value="$">$ USD</option>
                  <option value="€">€ EUR</option>
                  <option value="£">£ GBP</option>
                  <option value="₹">₹ INR</option>
                  <option value="C$">C$ CAD</option>
                  <option value="A$">A$ AUD</option>
                </select>
              </label>
            </>
          )}

          {/* 6. Fuel Cost Split Inputs */}
          {slug === 'fuel-cost-split-calculator' && (
            <>
              <label className="min-w-0 text-sm font-semibold">
                {ev.fuelSplit.distance}
                <input
                  type="number"
                  min="1"
                  value={fuelDistance}
                  onChange={(e) => setFuelDistance(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {ev.fuelSplit.distanceUnit}
                <select
                  value={fuelDistanceUnit}
                  onChange={(e) => setFuelDistanceUnit(e.target.value as 'km' | 'mi')}
                  className={fieldClass}
                >
                  <option value="km">{ev.fuelSplit.km}</option>
                  <option value="mi">{ev.fuelSplit.mi}</option>
                </select>
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {ev.fuelSplit.efficiency}
                <input
                  type="number"
                  min="0.1"
                  step="0.5"
                  value={fuelEfficiency}
                  onChange={(e) => setFuelEfficiency(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {ev.fuelSplit.efficiencyUnit}
                <select
                  value={fuelEfficiencyUnit}
                  onChange={(e) =>
                    setFuelEfficiencyUnit(e.target.value as 'kmpl' | 'l100km' | 'mpg')
                  }
                  className={fieldClass}
                >
                  <option value="kmpl">{ev.fuelSplit.kmpl}</option>
                  <option value="l100km">{ev.fuelSplit.l100km}</option>
                  <option value="mpg">{ev.fuelSplit.mpg}</option>
                </select>
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {ev.fuelSplit.fuelPrice}
                <input
                  type="number"
                  min="0.01"
                  step="0.05"
                  value={fuelPrice}
                  onChange={(e) => setFuelPrice(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {ev.fuelSplit.passengers}
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={fuelPassengers}
                  onChange={(e) => setFuelPassengers(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {ev.fuelSplit.tolls}
                <input
                  type="number"
                  min="0"
                  value={fuelTolls}
                  onChange={(e) => setFuelTolls(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {ev.fuelSplit.parking}
                <input
                  type="number"
                  min="0"
                  value={fuelParking}
                  onChange={(e) => setFuelParking(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="flex min-w-0 items-center gap-2 text-sm font-semibold sm:col-span-2">
                <input
                  type="checkbox"
                  checked={fuelRoundTrip}
                  onChange={(e) => setFuelRoundTrip(e.target.checked)}
                  className="size-4 rounded"
                />
                {ev.fuelSplit.roundTrip}
              </label>
            </>
          )}

          {/* 7. Schengen Inputs */}
          {slug === 'schengen-90-180-day-calculator' && (
            <div className="min-w-0 space-y-4 sm:col-span-2">
              <label className="block text-sm font-semibold">
                {ev.schengen.referenceDate}
                <input
                  type="date"
                  value={schengenRefDate}
                  onChange={(e) => setSchengenRefDate(e.target.value)}
                  className={fieldClass}
                />
              </label>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  {ev.schengen.staysTitle}
                </span>
                <button
                  type="button"
                  onClick={addTrip}
                  className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700"
                >
                  <Plus className="size-3.5" /> {ev.schengen.addStay}
                </button>
              </div>
              <div className="space-y-3">
                {schengenTrips.map((t) => (
                  <div
                    key={t.id}
                    className="flex flex-wrap items-center gap-2 rounded-2xl border border-[var(--border)] p-3"
                  >
                    <input
                      type="date"
                      value={t.entryDate}
                      onChange={(e) => updateTrip(t.id!, 'entryDate', e.target.value)}
                      className="rounded-lg border border-[var(--border)] bg-transparent px-2 py-1 text-sm"
                    />
                    <span className="text-xs text-[var(--muted-foreground)]">→</span>
                    <input
                      type="date"
                      value={t.exitDate}
                      onChange={(e) => updateTrip(t.id!, 'exitDate', e.target.value)}
                      className="rounded-lg border border-[var(--border)] bg-transparent px-2 py-1 text-sm"
                    />
                    <input
                      type="text"
                      value={t.label || ''}
                      placeholder={ev.schengen.tripLabel}
                      onChange={(e) => updateTrip(t.id!, 'label', e.target.value)}
                      className="min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-transparent px-2 py-1 text-sm"
                    />
                    {schengenTrips.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTrip(t.id!)}
                        className="rounded-lg p-1.5 text-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. Tire Size Inputs */}
          {slug === 'tire-size-calculator' && (
            <>
              <div className="min-w-0 sm:col-span-2">
                <span className="break-words text-xs font-bold uppercase text-[var(--muted-foreground)]">
                  {ev.tireSize.originalTire}
                </span>
                <div className="mt-1 grid min-w-0 grid-cols-3 gap-2">
                  <label className="min-w-0 break-words text-xs">
                    {ev.tireSize.width}
                    <input
                      type="number"
                      value={tireOldWidth}
                      onChange={(e) => setTireOldWidth(Number(e.target.value))}
                      className={fieldClass}
                    />
                  </label>
                  <label className="min-w-0 break-words text-xs">
                    {ev.tireSize.aspectRatio}
                    <input
                      type="number"
                      value={tireOldAspect}
                      onChange={(e) => setTireOldAspect(Number(e.target.value))}
                      className={fieldClass}
                    />
                  </label>
                  <label className="min-w-0 break-words text-xs">
                    {ev.tireSize.rimDiameter}
                    <input
                      type="number"
                      value={tireOldRim}
                      onChange={(e) => setTireOldRim(Number(e.target.value))}
                      className={fieldClass}
                    />
                  </label>
                </div>
              </div>

              <div className="min-w-0 sm:col-span-2">
                <span className="break-words text-xs font-bold uppercase text-[var(--muted-foreground)]">
                  {ev.tireSize.newTire}
                </span>
                <div className="mt-1 grid min-w-0 grid-cols-3 gap-2">
                  <label className="min-w-0 break-words text-xs">
                    {ev.tireSize.width}
                    <input
                      type="number"
                      value={tireNewWidth}
                      onChange={(e) => setTireNewWidth(Number(e.target.value))}
                      className={fieldClass}
                    />
                  </label>
                  <label className="min-w-0 break-words text-xs">
                    {ev.tireSize.aspectRatio}
                    <input
                      type="number"
                      value={tireNewAspect}
                      onChange={(e) => setTireNewAspect(Number(e.target.value))}
                      className={fieldClass}
                    />
                  </label>
                  <label className="min-w-0 break-words text-xs">
                    {ev.tireSize.rimDiameter}
                    <input
                      type="number"
                      value={tireNewRim}
                      onChange={(e) => setTireNewRim(Number(e.target.value))}
                      className={fieldClass}
                    />
                  </label>
                </div>
              </div>

              <label className="min-w-0 text-sm font-semibold sm:col-span-2">
                {ev.tireSize.referenceSpeed}
                <input
                  type="number"
                  min="1"
                  value={tireSpeed}
                  onChange={(e) => setTireSpeed(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
            </>
          )}

          {/* 9. Unit Price Inputs */}
          {slug === 'unit-price-calculator' && (
            <>
              <div className="min-w-0 sm:col-span-2">
                <span className="break-words text-xs font-bold uppercase text-[var(--muted-foreground)]">
                  {ev.unitPrice.itemA}
                </span>
                <div className="mt-1 grid min-w-0 grid-cols-2 gap-2">
                  <label className="min-w-0 break-words text-xs">
                    {ev.unitPrice.price}
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={upPriceA}
                      onChange={(e) => setUpPriceA(Number(e.target.value))}
                      className={fieldClass}
                    />
                  </label>
                  <label className="min-w-0 break-words text-xs">
                    {ev.unitPrice.quantity}
                    <input
                      type="number"
                      min="0.01"
                      step="0.1"
                      value={upQtyA}
                      onChange={(e) => setUpQtyA(Number(e.target.value))}
                      className={fieldClass}
                    />
                  </label>
                </div>
              </div>

              <div className="min-w-0 sm:col-span-2">
                <span className="break-words text-xs font-bold uppercase text-[var(--muted-foreground)]">
                  {ev.unitPrice.itemB}
                </span>
                <div className="mt-1 grid min-w-0 grid-cols-2 gap-2">
                  <label className="min-w-0 break-words text-xs">
                    {ev.unitPrice.price}
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={upPriceB}
                      onChange={(e) => setUpPriceB(Number(e.target.value))}
                      className={fieldClass}
                    />
                  </label>
                  <label className="min-w-0 break-words text-xs">
                    {ev.unitPrice.quantity}
                    <input
                      type="number"
                      min="0.01"
                      step="0.1"
                      value={upQtyB}
                      onChange={(e) => setUpQtyB(Number(e.target.value))}
                      className={fieldClass}
                    />
                  </label>
                </div>
              </div>

              <label className="min-w-0 text-sm font-semibold">
                {ev.unitPrice.unitLabel}
                <input
                  type="text"
                  value={upUnitLabel}
                  onChange={(e) => setUpUnitLabel(e.target.value)}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {com.currency}
                <select
                  value={upCurrency}
                  onChange={(e) => setUpCurrency(e.target.value)}
                  className={fieldClass}
                >
                  <option value="$">$ USD</option>
                  <option value="€">€ EUR</option>
                  <option value="£">£ GBP</option>
                  <option value="₹">₹ INR</option>
                  <option value="C$">C$ CAD</option>
                  <option value="A$">A$ AUD</option>
                </select>
              </label>
            </>
          )}

          {/* 10. Website Worth Inputs */}
          {slug === 'website-worth-calculator' && (
            <div className="min-w-0 space-y-4 sm:col-span-2">
              <label className="block min-w-0 text-sm font-semibold">
                {ev.websiteWorth.urlLabel}
                <div className="mt-1 flex flex-col gap-2 sm:flex-row">
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={wwUrl}
                    onChange={(e) => setWwUrl(e.target.value)}
                    className="w-full min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAnalyzeUrl}
                    disabled={wwLoading || !wwUrl.trim()}
                    className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {wwLoading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Globe2 className="size-4" />
                    )}
                    {wwLoading ? ev.websiteWorth.analyzing : ev.websiteWorth.analyzeBtn}
                  </button>
                </div>
              </label>

              {wwError && <p className="text-xs font-semibold text-red-500">{wwError}</p>}

              {wwScan && (
                <div className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-3 text-xs space-y-1">
                  <p className="min-w-0 break-words font-bold">{wwScan.title || wwScan.url}</p>
                  <div className="flex flex-wrap gap-2 text-[var(--muted-foreground)]">
                    <span>{wwScan.technicalScore}/100</span>
                    <span>•</span>
                    <span>{wwScan.responseMs} ms</span>
                    <span>•</span>
                    <span>{wwScan.wordCount} words</span>
                  </div>
                </div>
              )}

              <div className="grid min-w-0 gap-3 pt-2 sm:grid-cols-3">
                <label className="min-w-0 break-words text-xs font-semibold">
                  {ev.websiteWorth.visits}
                  <input
                    type="number"
                    min="0"
                    value={wwVisits}
                    onChange={(e) => setWwVisits(e.target.value)}
                    className={fieldClass}
                  />
                </label>
                <label className="min-w-0 break-words text-xs font-semibold">
                  {ev.websiteWorth.revenue}
                  <input
                    type="number"
                    min="0"
                    value={wwRevenue}
                    onChange={(e) => setWwRevenue(e.target.value)}
                    className={fieldClass}
                  />
                </label>
                <label className="min-w-0 break-words text-xs font-semibold">
                  {ev.websiteWorth.profit}
                  <input
                    type="number"
                    min="0"
                    value={wwProfit}
                    onChange={(e) => setWwProfit(e.target.value)}
                    className={fieldClass}
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={handleReset} className={buttonClass}>
            {ui.reset}
          </button>
        </div>

        {/* Informational Notes */}
        <p className="mt-4 text-xs text-[var(--muted-foreground)]">
          {slug === 'aquarium-volume-calculator' && ev.aquarium.note}
          {slug === 'barbell-plate-calculator' && ev.barbell.note}
          {slug === 'battery-charge-time-calculator' && ev.battery.note}
          {slug === 'dimensional-weight-calculator' && ev.dimWeight.note}
          {slug === 'electricity-cost-calculator' && ev.electricity.note}
          {slug === 'fuel-cost-split-calculator' && ev.fuelSplit.note}
          {slug === 'schengen-90-180-day-calculator' && ev.schengen.note}
          {slug === 'tire-size-calculator' && ev.tireSize.note}
          {slug === 'unit-price-calculator' && ev.unitPrice.note}
          {slug === 'website-worth-calculator' && ev.websiteWorth.note}
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
                  <dt className="min-w-0 break-words text-xs font-semibold text-[var(--muted-foreground)]">
                    {label}
                  </dt>
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
