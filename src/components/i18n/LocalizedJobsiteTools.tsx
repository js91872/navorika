'use client';

import { useMemo, useState } from 'react';
import {
  Wind,
  DollarSign,
  Shovel,
  Ruler,
  Compass,
  HardHat,
  Sun,
  RotateCcw,
} from 'lucide-react';
import ResultActions from '@/components/ui/ResultActions';
import { resultActionMessages } from '@/lib/i18n/actionMessages';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';
import { fieldClass, buttonClass } from './ToolControls';
import { calculateAirCompressor } from '@/lib/calculations/airCompressor';
import { calculateEgressWindow } from '@/lib/calculations/egressWindow';
import { calculateLadderSafeReach } from '@/lib/calculations/ladderSafeReach';
import { calculateOshaPortableToilets } from '@/lib/calculations/oshaPortableToilet';
import { calculateExcavation } from '@/lib/calculations/constructionQuantities';
import { calculateSolarSystem } from '@/lib/calculations/energyElectrical';

export type JobsiteToolSlug =
  | 'air-compressor-cfm-calculator'
  | 'construction-cost-calculator'
  | 'egress-window-code-checker'
  | 'excavation-calculator'
  | 'ladder-safe-reach-calculator'
  | 'land-area-converter'
  | 'osha-portable-toilet-calculator'
  | 'solar-panel-calculator';

function safeCalc<T>(fn: () => T, defaultError: string) {
  try {
    return { data: fn(), error: '' };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : defaultError };
  }
}

export default function LocalizedJobsiteTools({
  slug,
  locale,
  dictionary,
}: {
  slug: JobsiteToolSlug;
  locale: Locale;
  dictionary: Dictionary;
}) {
  const d = dictionary;
  const ui = d.ui;
  const con = (d as unknown as { construction: Record<string, Record<string, string>> }).construction;
  const com = con.common;

  const format = (n: number, maxDigits = 2) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: maxDigits }).format(n);

  const formatCurrency = (n: number) =>
    `$${new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n)}`;

  // 1. Air Compressor Calculator State
  const [toolCfm, setToolCfm] = useState<number>(5);
  const [toolPsi, setToolPsi] = useState<number>(90);
  const [dutyCycle, setDutyCycle] = useState<number>(50);
  const [compressorScfm, setCompressorScfm] = useState<number>(6);
  const [compressorPsi, setCompressorPsi] = useState<number>(125);
  const [tankGallons, setTankGallons] = useState<number>(20);

  // 2. Construction Cost Calculator State
  const [costArea, setCostArea] = useState<number>(1000);
  const [costUnit, setCostUnit] = useState<'sqft' | 'sqm'>('sqft');
  const [costPerUnit, setCostPerUnit] = useState<number>(150);
  const [laborPct, setLaborPct] = useState<number>(30);
  const [materialPct, setMaterialPct] = useState<number>(50);
  const [overheadPct, setOverheadPct] = useState<number>(10);
  const [contingencyPct, setContingencyPct] = useState<number>(10);

  // 3. Egress Window Code Checker State
  const [egressWidth, setEgressWidth] = useState<number>(24);
  const [egressHeight, setEgressHeight] = useState<number>(36);
  const [sillHeight, setSillHeight] = useState<number>(42);
  const [gradeFloor, setGradeFloor] = useState<boolean>(false);

  // 4. Excavation Calculator State
  const [exLength, setExLength] = useState<number>(10);
  const [exWidth, setExWidth] = useState<number>(10);
  const [exDepth, setExDepth] = useState<number>(1);
  const [exUnit, setExUnit] = useState<'m' | 'ft'>('m');
  const [exSwell, setExSwell] = useState<number>(20);
  const [exDensity, setExDensity] = useState<number>(1600);
  const [exPayload, setExPayload] = useState<number>(15000);

  // 5. Ladder Safe Reach State
  const [ladderLen, setLadderLen] = useState<number>(20);
  const [userHt, setUserHt] = useState<number>(5.8);
  const [ladderType, setLadderType] = useState<'extension' | 'step'>('extension');

  // 6. Land Area Converter State
  const [landVal, setLandVal] = useState<number>(1);
  const [landFrom, setLandFrom] = useState<'sqft' | 'sqm' | 'acre' | 'hectare' | 'sqyd'>('acre');
  const [landTo, setLandTo] = useState<'sqft' | 'sqm' | 'acre' | 'hectare' | 'sqyd'>('sqft');

  // 7. OSHA Portable Toilet State
  const [workers, setWorkers] = useState<number>(25);

  // 8. Solar Panel Calculator State
  const [dailyKwh, setDailyKwh] = useState<number>(30);
  const [sunHours, setSunHours] = useState<number>(5);
  const [panelWatts, setPanelWatts] = useState<number>(400);
  const [solarLoss, setSolarLoss] = useState<number>(20);

  // Calculations
  const airCalc = useMemo(
    () =>
      safeCalc(
        () =>
          calculateAirCompressor({
            compressorScfm,
            compressorRatedPsi: compressorPsi,
            tankGallons,
            toolCfm,
            toolPsi,
            usagePercent: dutyCycle,
          }),
        com.errorCheck,
      ),
    [compressorScfm, compressorPsi, tankGallons, toolCfm, toolPsi, dutyCycle, com.errorCheck],
  );

  const costCalc = useMemo(() => {
    return safeCalc(() => {
      const areaInSqft = costUnit === 'sqft' ? costArea : costArea * 10.763910416709722;
      const baseCost = areaInSqft * costPerUnit;
      const allocationTotal = laborPct + materialPct;
      const labor = allocationTotal > 0 ? baseCost * (laborPct / allocationTotal) : 0;
      const materials = allocationTotal > 0 ? baseCost * (materialPct / allocationTotal) : 0;
      const overhead = baseCost * (overheadPct / 100);
      const subtotal = baseCost + overhead;
      const contingency = subtotal * (contingencyPct / 100);
      const total = subtotal + contingency;
      const perSqft = areaInSqft > 0 ? total / areaInSqft : 0;
      return { baseCost, labor, materials, overhead, contingency, total, perSqft, areaInSqft };
    }, com.errorCheck);
  }, [costArea, costUnit, costPerUnit, laborPct, materialPct, overheadPct, contingencyPct, com.errorCheck]);

  const egressCalc = useMemo(
    () =>
      safeCalc(
        () =>
          calculateEgressWindow({
            clearWidthInches: egressWidth,
            clearHeightInches: egressHeight,
            sillHeightInches: sillHeight,
            gradeFloorOpening: gradeFloor,
          }),
        com.errorCheck,
      ),
    [egressWidth, egressHeight, sillHeight, gradeFloor, com.errorCheck],
  );

  const excavationCalc = useMemo(
    () =>
      safeCalc(
        () =>
          calculateExcavation({
            length: exLength,
            width: exWidth,
            depth: exDepth,
            unit: exUnit,
            swellPercent: exSwell,
            looseDensityKgM3: exDensity,
            truckPayloadKg: exPayload,
          }),
        com.errorCheck,
      ),
    [exLength, exWidth, exDepth, exUnit, exSwell, exDensity, exPayload, com.errorCheck],
  );

  const ladderCalc = useMemo(
    () =>
      safeCalc(
        () =>
          calculateLadderSafeReach({
            ladderLengthFeet: ladderLen,
            userHeightFeet: userHt,
            ladderType,
          }),
        com.errorCheck,
      ),
    [ladderLen, userHt, ladderType, com.errorCheck],
  );

  const unitsMap: Record<string, string> = {
    sqft: con.landArea.sqft,
    sqm: con.landArea.sqm,
    acre: con.landArea.acre,
    hectare: con.landArea.hectare,
    sqyd: con.landArea.sqyd,
  };

  const landCalc = useMemo(() => {
    const factors: Record<string, number> = {
      sqft: 1,
      sqm: 10.763910416709722,
      acre: 43560,
      hectare: 107639.10416709722,
      sqyd: 9,
    };
    return safeCalc(() => {
      const inSqft = landVal * (factors[landFrom] || 1);
      const converted = inSqft / (factors[landTo] || 1);
      const equivalents = Object.entries(factors).map(([unitKey, factor]) => ({
        unit: unitKey,
        val: inSqft / factor,
      }));
      return { converted, equivalents };
    }, com.errorCheck);
  }, [landVal, landFrom, landTo, com.errorCheck]);

  const oshaCalc = useMemo(
    () => safeCalc(() => calculateOshaPortableToilets(workers), com.errorCheck),
    [workers, com.errorCheck],
  );

  const solarCalc = useMemo(
    () =>
      safeCalc(
        () =>
          calculateSolarSystem({
            dailyKwh,
            peakSunHours: sunHours,
            panelWatts,
            systemLossPercent: solarLoss,
          }),
        com.errorCheck,
      ),
    [dailyKwh, sunHours, panelWatts, solarLoss, com.errorCheck],
  );

  const handleReset = () => {
    if (slug === 'air-compressor-cfm-calculator') {
      setToolCfm(5);
      setToolPsi(90);
      setDutyCycle(50);
      setCompressorScfm(6);
      setCompressorPsi(125);
      setTankGallons(20);
    } else if (slug === 'construction-cost-calculator') {
      setCostArea(1000);
      setCostUnit('sqft');
      setCostPerUnit(150);
      setLaborPct(30);
      setMaterialPct(50);
      setOverheadPct(10);
      setContingencyPct(10);
    } else if (slug === 'egress-window-code-checker') {
      setEgressWidth(24);
      setEgressHeight(36);
      setSillHeight(42);
      setGradeFloor(false);
    } else if (slug === 'excavation-calculator') {
      setExLength(10);
      setExWidth(10);
      setExDepth(1);
      setExUnit('m');
      setExSwell(20);
      setExDensity(1600);
      setExPayload(15000);
    } else if (slug === 'ladder-safe-reach-calculator') {
      setLadderLen(20);
      setUserHt(5.8);
      setLadderType('extension');
    } else if (slug === 'land-area-converter') {
      setLandVal(1);
      setLandFrom('acre');
      setLandTo('sqft');
    } else if (slug === 'osha-portable-toilet-calculator') {
      setWorkers(25);
    } else if (slug === 'solar-panel-calculator') {
      setDailyKwh(30);
      setSunHours(5);
      setPanelWatts(400);
      setSolarLoss(20);
    }
  };

  // Compile active results for presentation and export
  let currentResults: Array<[string, string]> = [];
  let currentError = '';

  if (slug === 'air-compressor-cfm-calculator') {
    currentError = airCalc.error;
    const r = airCalc.data;
    if (r) {
      const statusLabel =
        r.status === 'comfortable'
          ? con.airCompressor.statusComfortable
          : r.status === 'borderline'
            ? con.airCompressor.statusBorderline
            : con.airCompressor.statusInsufficient;
      currentResults = [
        ['Status', statusLabel],
        [con.airCompressor.avgDemand, `${format(r.averageToolCfm, 1)} CFM`],
        [con.airCompressor.demandRatio, `${format(r.demandRatio * 100, 0)} %`],
        [con.airCompressor.continuousSurplus, `${r.continuousSurplusCfm >= 0 ? '+' : ''}${format(r.continuousSurplusCfm, 1)} CFM`],
        [con.airCompressor.approxRuntime, r.approximateRuntimeMinutes != null ? `${format(r.approximateRuntimeMinutes, 1)} min` : '—'],
        [con.airCompressor.recommendedScfm, `${format(r.recommendedScfm, 1)} SCFM`],
      ];
    }
  } else if (slug === 'construction-cost-calculator') {
    currentError = costCalc.error;
    const r = costCalc.data;
    if (r) {
      currentResults = [
        [con.constructionCost.totalCost, formatCurrency(r.total)],
        [con.constructionCost.baseCost, formatCurrency(r.baseCost)],
        [con.constructionCost.laborCost, formatCurrency(r.labor)],
        [con.constructionCost.materialCost, formatCurrency(r.materials)],
        [con.constructionCost.overheadCost, formatCurrency(r.overhead)],
        [con.constructionCost.contingencyCost, formatCurrency(r.contingency)],
        [con.constructionCost.costPerSqFt, `$${format(r.perSqft, 2)} / sq ft`],
      ];
    }
  } else if (slug === 'egress-window-code-checker') {
    currentError = egressCalc.error;
    const r = egressCalc.data;
    if (r) {
      currentResults = [
        ['Status', r.passed ? con.egressWindow.compliant : con.egressWindow.nonCompliant],
        [con.egressWindow.clearArea, `${format(r.clearAreaSqFt, 2)} sq ft`],
        [con.egressWindow.requiredArea, `${format(r.requiredAreaSqFt, 1)} sq ft`],
        ...r.criteria.map((c): [string, string] => [c.label, `${c.actual} (${c.passed ? '✓' : '✗'})`]),
      ];
    }
  } else if (slug === 'excavation-calculator') {
    currentError = excavationCalc.error;
    const r = excavationCalc.data;
    if (r) {
      currentResults = [
        [con.excavation.truckLoads, `${format(r.truckLoads, 0)}`],
        [con.excavation.bankVolume, `${format(r.bankVolumeM3, 2)} m³`],
        [con.excavation.looseVolume, `${format(r.looseVolumeM3, 2)} m³`],
        [con.excavation.looseWeight, `${format(r.looseWeightKg / 1000, 2)} t`],
      ];
    }
  } else if (slug === 'ladder-safe-reach-calculator') {
    currentError = ladderCalc.error;
    const r = ladderCalc.data;
    if (r) {
      currentResults = [
        [con.ladderSafeReach.approxReach, `${format(r.approximateReachFeet, 1)} ft`],
        [con.ladderSafeReach.baseDistance, `${format(r.baseDistanceFeet, 1)} ft`],
        [con.ladderSafeReach.verticalHeight, `${format(r.verticalHeightFeet, 1)} ft`],
        [con.ladderSafeReach.ladderAngle, `${format(r.ladderAngleDegrees, 0)}°`],
        [con.ladderSafeReach.roofExtension, `${format(r.recommendedRoofExtensionFeet, 0)} ft`],
      ];
    }
  } else if (slug === 'land-area-converter') {
    currentError = landCalc.error;
    const r = landCalc.data;
    if (r) {
      currentResults = [
        [con.landArea.convertedValue, `${format(r.converted, 4)} ${unitsMap[landTo]}`],
        ...r.equivalents.map((eq): [string, string] => [unitsMap[eq.unit], format(eq.val, 4)]),
      ];
    }
  } else if (slug === 'osha-portable-toilet-calculator') {
    currentError = oshaCalc.error;
    const r = oshaCalc.data;
    if (r) {
      currentResults = [
        [con.oshaToilet.facilities, `${format(r.toiletFacilities, 0)}`],
        [con.oshaToilet.toiletSeats, `${format(r.toiletSeats, 0)}`],
        [con.oshaToilet.urinals, `${format(r.urinals, 0)}`],
        [con.oshaToilet.fixtureRatio, r.workersPerFixtureSet ? `1 : ${r.workersPerFixtureSet}` : '≤ 20'],
      ];
    }
  } else if (slug === 'solar-panel-calculator') {
    currentError = solarCalc.error;
    const r = solarCalc.data;
    if (r) {
      currentResults = [
        [con.solarPanel.panelsCount, `${format(r.panelsNeeded, 0)}`],
        [con.solarPanel.requiredKw, `${format(r.requiredSystemKw, 2)} kW`],
        [con.solarPanel.actualKw, `${format(r.actualSystemSizeKw, 2)} kW`],
        [con.solarPanel.annualOutput, `${format(r.annualProductionKwh, 0)} kWh`],
      ];
    }
  }

  const toolTitle = d.tools[slug]?.title || slug;
  const activeSummary = `${toolTitle}\n${currentResults
    .map(([lbl, val]) => `${lbl}: ${val}`)
    .join('\n')}`;

  const csvRows = `\uFEFF${toolTitle}\nMetric,Value\n${currentResults
    .map(([lbl, val]) => `"${lbl.replace(/"/g, '""')}","${val.replace(/"/g, '""')}"`)
    .join('\n')}\n`;

  const csvName = `${slug}-${locale}.csv`;

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-2">
      {/* Controls Card */}
      <section className="min-w-0 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
        <div className="flex min-w-0 items-center gap-2">
          {slug === 'air-compressor-cfm-calculator' && <Wind className="size-5 shrink-0 text-cyan-500" />}
          {slug === 'construction-cost-calculator' && <DollarSign className="size-5 shrink-0 text-emerald-500" />}
          {slug === 'egress-window-code-checker' && <Ruler className="size-5 shrink-0 text-blue-500" />}
          {slug === 'excavation-calculator' && <Shovel className="size-5 shrink-0 text-amber-500" />}
          {slug === 'ladder-safe-reach-calculator' && <Compass className="size-5 shrink-0 text-indigo-500" />}
          {slug === 'land-area-converter' && <Ruler className="size-5 shrink-0 text-teal-500" />}
          {slug === 'osha-portable-toilet-calculator' && <HardHat className="size-5 shrink-0 text-orange-500" />}
          {slug === 'solar-panel-calculator' && <Sun className="size-5 shrink-0 text-amber-400" />}

          <h2 className="min-w-0 break-words text-xl font-bold">
            {slug === 'air-compressor-cfm-calculator' && con.airCompressor.heading}
            {slug === 'construction-cost-calculator' && con.constructionCost.heading}
            {slug === 'egress-window-code-checker' && con.egressWindow.heading}
            {slug === 'excavation-calculator' && con.excavation.heading}
            {slug === 'ladder-safe-reach-calculator' && con.ladderSafeReach.heading}
            {slug === 'land-area-converter' && con.landArea.heading}
            {slug === 'osha-portable-toilet-calculator' && con.oshaToilet.heading}
            {slug === 'solar-panel-calculator' && con.solarPanel.heading}
          </h2>
        </div>

        {/* Inputs */}
        <div className="mt-5 space-y-4">
          {slug === 'air-compressor-cfm-calculator' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                {con.airCompressor.toolCfm}
                <input
                  type="number"
                  min="0.1"
                  step="0.5"
                  value={toolCfm}
                  onChange={(e) => setToolCfm(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.airCompressor.toolPsi}
                <input
                  type="number"
                  min="1"
                  step="5"
                  value={toolPsi}
                  onChange={(e) => setToolPsi(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.airCompressor.dutyCycle}
                <input
                  type="number"
                  min="1"
                  max="100"
                  step="5"
                  value={dutyCycle}
                  onChange={(e) => setDutyCycle(Math.min(100, Math.max(1, Number(e.target.value))))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.airCompressor.compressorScfm}
                <input
                  type="number"
                  min="0.1"
                  step="0.5"
                  value={compressorScfm}
                  onChange={(e) => setCompressorScfm(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.airCompressor.compressorPsi}
                <input
                  type="number"
                  min="1"
                  step="5"
                  value={compressorPsi}
                  onChange={(e) => setCompressorPsi(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.airCompressor.tankGallons}
                <input
                  type="number"
                  min="1"
                  step="5"
                  value={tankGallons}
                  onChange={(e) => setTankGallons(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
            </div>
          )}

          {slug === 'construction-cost-calculator' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                {con.constructionCost.area}
                <input
                  type="number"
                  min="1"
                  step="50"
                  value={costArea}
                  onChange={(e) => setCostArea(Math.max(1, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.constructionCost.unit}
                <select
                  value={costUnit}
                  onChange={(e) => setCostUnit(e.target.value as 'sqft' | 'sqm')}
                  className={fieldClass}
                >
                  <option value="sqft">{con.constructionCost.sqft}</option>
                  <option value="sqm">{con.constructionCost.sqm}</option>
                </select>
              </label>
              <label className="text-sm font-semibold">
                {con.constructionCost.costPerUnit}
                <input
                  type="number"
                  min="1"
                  step="10"
                  value={costPerUnit}
                  onChange={(e) => setCostPerUnit(Math.max(1, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.constructionCost.laborPct}
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="5"
                  value={laborPct}
                  onChange={(e) => setLaborPct(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.constructionCost.materialPct}
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="5"
                  value={materialPct}
                  onChange={(e) => setMaterialPct(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.constructionCost.overheadPct}
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={overheadPct}
                  onChange={(e) => setOverheadPct(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.constructionCost.contingencyPct}
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={contingencyPct}
                  onChange={(e) => setContingencyPct(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
            </div>
          )}

          {slug === 'egress-window-code-checker' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                {con.egressWindow.clearWidth}
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={egressWidth}
                  onChange={(e) => setEgressWidth(Math.max(1, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.egressWindow.clearHeight}
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={egressHeight}
                  onChange={(e) => setEgressHeight(Math.max(1, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.egressWindow.sillHeight}
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={sillHeight}
                  onChange={(e) => setSillHeight(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="gradeFloorCheckbox"
                  checked={gradeFloor}
                  onChange={(e) => setGradeFloor(e.target.checked)}
                  className="size-5 rounded border-[var(--border)] text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="gradeFloorCheckbox" className="text-sm font-medium cursor-pointer">
                  {con.egressWindow.gradeFloor}
                </label>
              </div>
            </div>
          )}

          {slug === 'excavation-calculator' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                {con.excavation.length}
                <input
                  type="number"
                  min="0.1"
                  step="0.5"
                  value={exLength}
                  onChange={(e) => setExLength(Math.max(0.1, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.excavation.width}
                <input
                  type="number"
                  min="0.1"
                  step="0.5"
                  value={exWidth}
                  onChange={(e) => setExWidth(Math.max(0.1, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.excavation.depth}
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={exDepth}
                  onChange={(e) => setExDepth(Math.max(0.1, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.excavation.unit}
                <select
                  value={exUnit}
                  onChange={(e) => setExUnit(e.target.value as 'm' | 'ft')}
                  className={fieldClass}
                >
                  <option value="m">{con.excavation.meters}</option>
                  <option value="ft">{con.excavation.feet}</option>
                </select>
              </label>
              <label className="text-sm font-semibold">
                {con.excavation.swellPct}
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="5"
                  value={exSwell}
                  onChange={(e) => setExSwell(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.excavation.density}
                <input
                  type="number"
                  min="500"
                  step="50"
                  value={exDensity}
                  onChange={(e) => setExDensity(Math.max(100, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold sm:col-span-2">
                {con.excavation.truckPayload}
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  value={exPayload}
                  onChange={(e) => setExPayload(Math.max(500, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
            </div>
          )}

          {slug === 'ladder-safe-reach-calculator' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                {con.ladderSafeReach.ladderLength}
                <input
                  type="number"
                  min="4"
                  step="1"
                  value={ladderLen}
                  onChange={(e) => setLadderLen(Math.max(1, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.ladderSafeReach.userHeight}
                <input
                  type="number"
                  min="3"
                  step="0.1"
                  value={userHt}
                  onChange={(e) => setUserHt(Math.max(1, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold sm:col-span-2">
                {con.ladderSafeReach.ladderType}
                <select
                  value={ladderType}
                  onChange={(e) => setLadderType(e.target.value as 'extension' | 'step')}
                  className={fieldClass}
                >
                  <option value="extension">{con.ladderSafeReach.extension}</option>
                  <option value="step">{con.ladderSafeReach.step}</option>
                </select>
              </label>
            </div>
          )}

          {slug === 'land-area-converter' && (
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="text-sm font-semibold">
                {con.landArea.sourceValue}
                <input
                  type="number"
                  min="0.0001"
                  step="0.5"
                  value={landVal}
                  onChange={(e) => setLandVal(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.landArea.fromUnit}
                <select
                  value={landFrom}
                  onChange={(e) => setLandFrom(e.target.value as 'sqft' | 'sqm' | 'acre' | 'hectare' | 'sqyd')}
                  className={fieldClass}
                >
                  {Object.entries(unitsMap).map(([k, label]) => (
                    <option key={k} value={k}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-semibold">
                {con.landArea.toUnit}
                <select
                  value={landTo}
                  onChange={(e) => setLandTo(e.target.value as 'sqft' | 'sqm' | 'acre' | 'hectare' | 'sqyd')}
                  className={fieldClass}
                >
                  {Object.entries(unitsMap).map(([k, label]) => (
                    <option key={k} value={k}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {slug === 'osha-portable-toilet-calculator' && (
            <div className="grid gap-4">
              <label className="text-sm font-semibold">
                {con.oshaToilet.workers}
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={workers}
                  onChange={(e) => setWorkers(Math.max(1, Math.round(Number(e.target.value))))}
                  className={fieldClass}
                />
              </label>
            </div>
          )}

          {slug === 'solar-panel-calculator' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                {con.solarPanel.dailyUsage}
                <input
                  type="number"
                  min="0.5"
                  step="1"
                  value={dailyKwh}
                  onChange={(e) => setDailyKwh(Math.max(0.1, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.solarPanel.sunHours}
                <input
                  type="number"
                  min="1"
                  max="12"
                  step="0.5"
                  value={sunHours}
                  onChange={(e) => setSunHours(Math.max(0.5, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.solarPanel.panelWatts}
                <input
                  type="number"
                  min="50"
                  step="25"
                  value={panelWatts}
                  onChange={(e) => setPanelWatts(Math.max(10, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.solarPanel.systemLoss}
                <input
                  type="number"
                  min="0"
                  max="90"
                  step="1"
                  value={solarLoss}
                  onChange={(e) => setSolarLoss(Math.min(95, Math.max(0, Number(e.target.value))))}
                  className={fieldClass}
                />
              </label>
            </div>
          )}

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={handleReset}
              className={buttonClass}
            >
              <RotateCcw className="size-4" /> {ui.reset}
            </button>
          </div>
        </div>
      </section>

      {/* Results Card */}
      <section className="min-w-0 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
        <h3 className="text-lg font-bold">{com.results}</h3>

        {currentError && (
          <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
            {currentError}
          </p>
        )}

        {!currentError && currentResults.length > 0 && (
          <div className="mt-4 space-y-4">
            <dl className="grid min-w-0 gap-3 sm:grid-cols-2">
              {currentResults.map(([label, val]) => (
                <div
                  key={label}
                  className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-3"
                >
                  <dt className="truncate text-xs text-[var(--muted-foreground)]">{label}</dt>
                  <dd className="mt-1 break-words text-lg font-bold text-[var(--foreground)]">{val}</dd>
                </div>
              ))}
            </dl>

            <ResultActions
              messages={resultActionMessages[locale]}
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
            />
          </div>
        )}
      </section>
    </div>
  );
}
