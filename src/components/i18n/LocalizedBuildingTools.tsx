'use client';

import { useMemo, useState } from 'react';
import {
  Zap,
  PanelsTopLeft,
  CircleGauge,
  Home,
  FileSpreadsheet,
  Calculator,
  RotateCcw,
} from 'lucide-react';
import ResultActions from '@/components/ui/ResultActions';
import { resultActionMessages } from '@/lib/i18n/actionMessages';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';
import { fieldClass, buttonClass } from './ToolControls';
import {
  calculateVoltageDrop,
  recommendWireSize,
  COPPER_RESISTANCE_OHM_PER_M,
} from '@/lib/calculations/energyElectrical';
import {
  calculateTankCapacity,
  calculateHouseConstructionCost,
} from '@/lib/calculations/projectEstimators';
import { calculateGambrelRoof } from '@/lib/calculations/gambrelRoof';
import { calculateEstimate } from '@/lib/calculations/constructionEstimate';

export type BuildingToolSlug =
  | 'voltage-drop-calculator'
  | 'wallpaper-calculator'
  | 'water-tank-calculator'
  | 'wire-size-calculator'
  | '12-foot-gambrel-roof-truss-calculator'
  | 'construction-estimate-builder'
  | 'contractor-estimate-generator'
  | 'house-construction-cost-calculator';

function safeCalc<T>(fn: () => T, defaultError: string) {
  try {
    return { data: fn(), error: '' };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : defaultError };
  }
}

export default function LocalizedBuildingTools({
  slug,
  locale,
  dictionary,
}: {
  slug: BuildingToolSlug;
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

  // 1. Voltage Drop State
  const [vdVoltage, setVdVoltage] = useState<number>(120);
  const [vdCurrent, setVdCurrent] = useState<number>(20);
  const [vdLength, setVdLength] = useState<number>(50);
  const [vdUnit, setVdUnit] = useState<'m' | 'ft'>('m');
  const [vdGauge, setVdGauge] = useState<string>('12');
  const [vdPhase, setVdPhase] = useState<'single' | 'three'>('single');
  const [vdMaxDrop, setVdMaxDrop] = useState<number>(3);

  // 2. Wallpaper State
  const [wpUnit, setWpUnit] = useState<'m' | 'ft'>('m');
  const [wpLength, setWpLength] = useState<number>(4);
  const [wpWidth, setWpWidth] = useState<number>(3);
  const [wpHeight, setWpHeight] = useState<number>(2.7);
  const [wpRollW, setWpRollW] = useState<number>(0.53);
  const [wpRollL, setWpRollL] = useState<number>(10);
  const [wpOpenings, setWpOpenings] = useState<number>(2);
  const [wpWaste, setWpWaste] = useState<number>(10);

  // 3. Water Tank State
  const [wtShape, setWtShape] = useState<'rectangular' | 'cylindrical' | 'spherical'>('rectangular');
  const [wtUnit, setWtUnit] = useState<'m' | 'ft'>('m');
  const [wtLength, setWtLength] = useState<number>(2);
  const [wtWidth, setWtWidth] = useState<number>(1.5);
  const [wtHeight, setWtHeight] = useState<number>(1.5);
  const [wtDiameter, setWtDiameter] = useState<number>(1.5);
  const [wtRadius, setWtRadius] = useState<number>(1);

  // 4. Wire Size State
  const [wsCurrent, setWsCurrent] = useState<number>(20);
  const [wsVoltage, setWsVoltage] = useState<number>(120);
  const [wsLength, setWsLength] = useState<number>(50);
  const [wsUnit, setWsUnit] = useState<'m' | 'ft'>('m');
  const [wsConductor, setWsConductor] = useState<'copper' | 'aluminum'>('copper');
  const [wsPhase, setWsPhase] = useState<'single' | 'three'>('single');
  const [wsLoadFactor, setWsLoadFactor] = useState<number>(125);
  const [wsMaxDrop, setWsMaxDrop] = useState<number>(3);

  // 5. Gambrel Roof State
  const [grSpan, setGrSpan] = useState<number>(12);
  const [grLength, setGrLength] = useState<number>(16);
  const [grOverhang, setGrOverhang] = useState<number>(0.5);
  const [grSpacing, setGrSpacing] = useState<number>(2);
  const [grLowerAngle, setGrLowerAngle] = useState<number>(60);
  const [grUpperAngle, setGrUpperAngle] = useState<number>(30);
  const [grBreakProp, setGrBreakProp] = useState<number>(0.5);
  const [grWaste, setGrWaste] = useState<number>(10);

  // 6. Construction Estimate Builder State
  const [ebMat, setEbMat] = useState<number>(12500);
  const [ebLab, setEbLab] = useState<number>(8500);
  const [ebEquip, setEbEquip] = useState<number>(1500);
  const [ebSubcon, setEbSubcon] = useState<number>(4000);
  const [ebOverhead, setEbOverhead] = useState<number>(10);
  const [ebContingency, setEbContingency] = useState<number>(10);
  const [ebMarkup, setEbMarkup] = useState<number>(15);
  const [ebTax, setEbTax] = useState<number>(8);
  const [ebDiscount, setEbDiscount] = useState<number>(0);

  // 7. Contractor Estimate Generator State
  const [ceMat, setCeMat] = useState<number>(15000);
  const [ceLab, setCeLab] = useState<number>(11000);
  const [ceEquip, setCeEquip] = useState<number>(2000);
  const [ceSubcon, setCeSubcon] = useState<number>(5000);
  const [ceOverhead, setCeOverhead] = useState<number>(12);
  const [ceContingency, setCeContingency] = useState<number>(5);
  const [ceMarkup, setCeMarkup] = useState<number>(20);
  const [ceTax, setCeTax] = useState<number>(8);
  const [ceDiscount, setCeDiscount] = useState<number>(0);

  // 8. House Construction Cost State
  const [hcArea, setHcArea] = useState<number>(2000);
  const [hcUnit, setHcUnit] = useState<'sqft' | 'sqm'>('sqft');
  const [hcFloors, setHcFloors] = useState<number>(1);
  const [hcRate, setHcRate] = useState<number>(150);
  const [hcSiteSoft, setHcSiteSoft] = useState<number>(25000);
  const [hcContingency, setHcContingency] = useState<number>(10);
  const [hcLandCost, setHcLandCost] = useState<number>(50000);

  // Calculations
  const vdCalc = useMemo(
    () =>
      safeCalc(
        () =>
          calculateVoltageDrop({
            voltage: vdVoltage,
            current: vdCurrent,
            length: vdLength,
            unit: vdUnit,
            resistanceOhmPerM: COPPER_RESISTANCE_OHM_PER_M[vdGauge] || 0.005211,
            phase: vdPhase,
            maxDropPercent: vdMaxDrop,
          }),
        com.errorCheck,
      ),
    [vdVoltage, vdCurrent, vdLength, vdUnit, vdGauge, vdPhase, vdMaxDrop, com.errorCheck],
  );

  const wpCalc = useMemo(() => {
    return safeCalc(() => {
      const FT_TO_M = 0.3048;
      const l = wpUnit === 'm' ? wpLength : wpLength * FT_TO_M;
      const w = wpUnit === 'm' ? wpWidth : wpWidth * FT_TO_M;
      const h = wpUnit === 'm' ? wpHeight : wpHeight * FT_TO_M;
      const rw = wpUnit === 'm' ? wpRollW : wpRollW * FT_TO_M;
      const rl = wpUnit === 'm' ? wpRollL : wpRollL * FT_TO_M;
      const perimeter = 2 * (l + w);
      const grossWallArea = perimeter * h;
      const openingsM2 = wpUnit === 'm' ? wpOpenings : wpOpenings * FT_TO_M * FT_TO_M;
      const netWallArea = Math.max(0, grossWallArea - openingsM2);
      const adjustedArea = netWallArea * (1 + wpWaste / 100);
      const stripsNeeded = Math.ceil(perimeter / rw);
      const stripsPerRoll = Math.floor(rl / h);
      if (stripsPerRoll < 1) {
        throw new RangeError('Roll length is shorter than wall height.');
      }
      const rollsByStrips = Math.ceil(stripsNeeded / stripsPerRoll);
      const rollArea = rw * rl;
      const rollsByArea = Math.ceil(adjustedArea / rollArea);
      const rolls = Math.max(rollsByStrips, rollsByArea);
      return { rolls, grossWallArea, netWallArea, adjustedArea, stripsNeeded, stripsPerRoll };
    }, com.errorCheck);
  }, [wpUnit, wpLength, wpWidth, wpHeight, wpRollW, wpRollL, wpOpenings, wpWaste, com.errorCheck]);

  const wtCalc = useMemo(
    () =>
      safeCalc(
        () =>
          calculateTankCapacity({
            shape: wtShape,
            unit: wtUnit,
            length: wtLength,
            width: wtWidth,
            height: wtHeight,
            diameter: wtDiameter,
            radius: wtRadius,
          }),
        com.errorCheck,
      ),
    [wtShape, wtUnit, wtLength, wtWidth, wtHeight, wtDiameter, wtRadius, com.errorCheck],
  );

  const wsCalc = useMemo(
    () =>
      safeCalc(
        () =>
          recommendWireSize({
            voltage: wsVoltage,
            current: wsCurrent,
            length: wsLength,
            unit: wsUnit,
            conductor: wsConductor,
            phase: wsPhase,
            loadFactorPercent: wsLoadFactor,
            maxDropPercent: wsMaxDrop,
          }),
        com.errorCheck,
      ),
    [wsVoltage, wsCurrent, wsLength, wsUnit, wsConductor, wsPhase, wsLoadFactor, wsMaxDrop, com.errorCheck],
  );

  const grCalc = useMemo(
    () =>
      safeCalc(
        () =>
          calculateGambrelRoof({
            spanFt: grSpan,
            buildingLengthFt: grLength,
            overhangFt: grOverhang,
            trussSpacingFt: grSpacing,
            lowerAngleDeg: grLowerAngle,
            upperAngleDeg: grUpperAngle,
            lowerRunProportion: grBreakProp,
            wastePercent: grWaste,
          }),
        com.errorCheck,
      ),
    [grSpan, grLength, grOverhang, grSpacing, grLowerAngle, grUpperAngle, grBreakProp, grWaste, com.errorCheck],
  );

  const ebCalc = useMemo(
    () =>
      safeCalc(
        () =>
          calculateEstimate(
            [
              { id: '1', category: 'Materials', description: 'Materials', quantity: 1, unit: 'ls', unitCost: ebMat },
              { id: '2', category: 'Labor', description: 'Labor', quantity: 1, unit: 'ls', unitCost: ebLab },
              { id: '3', category: 'Equipment', description: 'Equipment', quantity: 1, unit: 'ls', unitCost: ebEquip },
              { id: '4', category: 'Subcontractor', description: 'Subcontractors', quantity: 1, unit: 'ls', unitCost: ebSubcon },
            ],
            {
              overheadPercent: ebOverhead,
              contingencyPercent: ebContingency,
              markupPercent: ebMarkup,
              taxPercent: ebTax,
              discount: ebDiscount,
            },
          ),
        com.errorCheck,
      ),
    [ebMat, ebLab, ebEquip, ebSubcon, ebOverhead, ebContingency, ebMarkup, ebTax, ebDiscount, com.errorCheck],
  );

  const ceCalc = useMemo(
    () =>
      safeCalc(
        () =>
          calculateEstimate(
            [
              { id: '1', category: 'Materials', description: 'Materials', quantity: 1, unit: 'ls', unitCost: ceMat },
              { id: '2', category: 'Labor', description: 'Labor', quantity: 1, unit: 'ls', unitCost: ceLab },
              { id: '3', category: 'Equipment', description: 'Equipment', quantity: 1, unit: 'ls', unitCost: ceEquip },
              { id: '4', category: 'Subcontractor', description: 'Subcontractors', quantity: 1, unit: 'ls', unitCost: ceSubcon },
            ],
            {
              overheadPercent: ceOverhead,
              contingencyPercent: ceContingency,
              markupPercent: ceMarkup,
              taxPercent: ceTax,
              discount: ceDiscount,
            },
          ),
        com.errorCheck,
      ),
    [ceMat, ceLab, ceEquip, ceSubcon, ceOverhead, ceContingency, ceMarkup, ceTax, ceDiscount, com.errorCheck],
  );

  const hcCalc = useMemo(
    () =>
      safeCalc(
        () =>
          calculateHouseConstructionCost({
            area: hcArea,
            areaUnit: hcUnit,
            floors: hcFloors,
            ratePerSqft: hcRate,
            siteAndSoftCosts: hcSiteSoft,
            contingencyPercent: hcContingency,
            landCost: hcLandCost,
          }),
        com.errorCheck,
      ),
    [hcArea, hcUnit, hcFloors, hcRate, hcSiteSoft, hcContingency, hcLandCost, com.errorCheck],
  );

  const handleReset = () => {
    if (slug === 'voltage-drop-calculator') {
      setVdVoltage(120);
      setVdCurrent(20);
      setVdLength(50);
      setVdUnit('m');
      setVdGauge('12');
      setVdPhase('single');
      setVdMaxDrop(3);
    } else if (slug === 'wallpaper-calculator') {
      setWpUnit('m');
      setWpLength(4);
      setWpWidth(3);
      setWpHeight(2.7);
      setWpRollW(0.53);
      setWpRollL(10);
      setWpOpenings(2);
      setWpWaste(10);
    } else if (slug === 'water-tank-calculator') {
      setWtShape('rectangular');
      setWtUnit('m');
      setWtLength(2);
      setWtWidth(1.5);
      setWtHeight(1.5);
      setWtDiameter(1.5);
      setWtRadius(1);
    } else if (slug === 'wire-size-calculator') {
      setWsCurrent(20);
      setWsVoltage(120);
      setWsLength(50);
      setWsUnit('m');
      setWsConductor('copper');
      setWsPhase('single');
      setWsLoadFactor(125);
      setWsMaxDrop(3);
    } else if (slug === '12-foot-gambrel-roof-truss-calculator') {
      setGrSpan(12);
      setGrLength(16);
      setGrOverhang(0.5);
      setGrSpacing(2);
      setGrLowerAngle(60);
      setGrUpperAngle(30);
      setGrBreakProp(0.5);
      setGrWaste(10);
    } else if (slug === 'construction-estimate-builder') {
      setEbMat(12500);
      setEbLab(8500);
      setEbEquip(1500);
      setEbSubcon(4000);
      setEbOverhead(10);
      setEbContingency(10);
      setEbMarkup(15);
      setEbTax(8);
      setEbDiscount(0);
    } else if (slug === 'contractor-estimate-generator') {
      setCeMat(15000);
      setCeLab(11000);
      setCeEquip(2000);
      setCeSubcon(5000);
      setCeOverhead(12);
      setCeContingency(5);
      setCeMarkup(20);
      setCeTax(8);
      setCeDiscount(0);
    } else if (slug === 'house-construction-cost-calculator') {
      setHcArea(2000);
      setHcUnit('sqft');
      setHcFloors(1);
      setHcRate(150);
      setHcSiteSoft(25000);
      setHcContingency(10);
      setHcLandCost(50000);
    }
  };

  // Compile active results for presentation and export
  let currentResults: Array<[string, string]> = [];
  let currentError = '';

  if (slug === 'voltage-drop-calculator') {
    currentError = vdCalc.error;
    const r = vdCalc.data;
    if (r) {
      currentResults = [
        [con.voltageDrop.status, r.isAcceptable ? con.voltageDrop.acceptable : con.voltageDrop.excessive],
        [con.voltageDrop.voltageDrop, `${format(r.voltageDrop, 2)} V`],
        [con.voltageDrop.dropPercent, `${format(r.voltageDropPercent, 2)} %`],
        [con.voltageDrop.effectiveLength, `${format(r.lengthM, 1)} m`],
      ];
    }
  } else if (slug === 'wallpaper-calculator') {
    currentError = wpCalc.error;
    const r = wpCalc.data;
    if (r) {
      currentResults = [
        [con.wallpaper.recommendedRolls, `${format(r.rolls, 0)}`],
        [con.wallpaper.netArea, `${format(r.netWallArea, 1)} m²`],
        [con.wallpaper.grossArea, `${format(r.grossWallArea, 1)} m²`],
        [con.wallpaper.stripsNeeded, `${format(r.stripsNeeded, 0)}`],
        [con.wallpaper.stripsPerRoll, `${format(r.stripsPerRoll, 0)}`],
      ];
    }
  } else if (slug === 'water-tank-calculator') {
    currentError = wtCalc.error;
    const r = wtCalc.data;
    if (r) {
      currentResults = [
        [con.waterTank.liters, `${format(r.volumeLiters, 0)} L`],
        [con.waterTank.gallons, `${format(r.volumeGallons, 0)} gal`],
        [con.waterTank.cubicMeters, `${format(r.volumeM3, 2)} m³`],
      ];
    }
  } else if (slug === 'wire-size-calculator') {
    currentError = wsCalc.error;
    const r = wsCalc.data;
    if (r) {
      currentResults = [
        [con.wireSize.recommendedGauge, `${r.recommendedGauge} AWG`],
        [con.wireSize.ampacity, `${format(r.ampacity, 0)} A`],
        [con.wireSize.voltageDrop, `${format(r.voltageDrop, 2)} V (${format(r.voltageDropPercent, 2)} %)`],
        [con.wireSize.designCurrent, `${format(r.designCurrent, 1)} A`],
      ];
    }
  } else if (slug === '12-foot-gambrel-roof-truss-calculator') {
    currentError = grCalc.error;
    const r = grCalc.data;
    if (r) {
      currentResults = [
        [con.gambrelRoof.trussCount, `${format(r.trussCount, 0)}`],
        [con.gambrelRoof.totalRafterLength, `${format(r.totalRafterLength, 1)} ft`],
        [con.gambrelRoof.peakHeight, `${format(r.roofHeight, 2)} ft`],
        [con.gambrelRoof.breakHeight, `${format(r.breakPointHeight, 2)} ft`],
        [con.gambrelRoof.roofArea, `${format(r.roofAreaWithWaste, 1)} sq ft`],
        [con.gambrelRoof.roofingSquares, `${format(r.roofingSquares, 1)}`],
      ];
    }
  } else if (slug === 'construction-estimate-builder') {
    currentError = ebCalc.error;
    const r = ebCalc.data;
    if (r) {
      currentResults = [
        [con.constructionEstimate.grandTotal, formatCurrency(r.grandTotal)],
        [con.constructionEstimate.directCost, formatCurrency(r.directCost)],
        [con.constructionEstimate.overhead, formatCurrency(r.overhead)],
        [con.constructionEstimate.contingency, formatCurrency(r.contingency)],
        [con.constructionEstimate.markup, formatCurrency(r.markup)],
        [con.constructionEstimate.tax, formatCurrency(r.tax)],
        [con.constructionEstimate.impliedMargin, `${format(r.impliedMarginPercent, 1)} %`],
      ];
    }
  } else if (slug === 'contractor-estimate-generator') {
    currentError = ceCalc.error;
    const r = ceCalc.data;
    if (r) {
      currentResults = [
        [con.constructionEstimate.grandTotal, formatCurrency(r.grandTotal)],
        [con.constructionEstimate.directCost, formatCurrency(r.directCost)],
        [con.constructionEstimate.overhead, formatCurrency(r.overhead)],
        [con.constructionEstimate.contingency, formatCurrency(r.contingency)],
        [con.constructionEstimate.markup, formatCurrency(r.markup)],
        [con.constructionEstimate.tax, formatCurrency(r.tax)],
        [con.constructionEstimate.impliedMargin, `${format(r.impliedMarginPercent, 1)} %`],
      ];
    }
  } else if (slug === 'house-construction-cost-calculator') {
    currentError = hcCalc.error;
    const r = hcCalc.data;
    if (r) {
      currentResults = [
        [con.houseConstructionCost.totalWithLand, formatCurrency(r.totalCost)],
        [con.houseConstructionCost.buildingCost, formatCurrency(r.projectCostExcludingLand)],
        [con.houseConstructionCost.directCost, formatCurrency(r.directConstructionCost)],
        [con.houseConstructionCost.contingency, formatCurrency(r.contingency)],
        [con.houseConstructionCost.costPerSqFt, `$${format(r.constructionCostPerSqft, 2)} / sq ft`],
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
          {slug === 'voltage-drop-calculator' && <Zap className="size-5 shrink-0 text-amber-500" />}
          {slug === 'wallpaper-calculator' && <PanelsTopLeft className="size-5 shrink-0 text-indigo-500" />}
          {slug === 'water-tank-calculator' && <CircleGauge className="size-5 shrink-0 text-blue-500" />}
          {slug === 'wire-size-calculator' && <Zap className="size-5 shrink-0 text-cyan-500" />}
          {slug === '12-foot-gambrel-roof-truss-calculator' && <Home className="size-5 shrink-0 text-orange-500" />}
          {slug === 'construction-estimate-builder' && <FileSpreadsheet className="size-5 shrink-0 text-emerald-500" />}
          {slug === 'contractor-estimate-generator' && <Calculator className="size-5 shrink-0 text-teal-500" />}
          {slug === 'house-construction-cost-calculator' && <Home className="size-5 shrink-0 text-indigo-600" />}

          <h2 className="min-w-0 break-words text-xl font-bold">
            {slug === 'voltage-drop-calculator' && con.voltageDrop.heading}
            {slug === 'wallpaper-calculator' && con.wallpaper.heading}
            {slug === 'water-tank-calculator' && con.waterTank.heading}
            {slug === 'wire-size-calculator' && con.wireSize.heading}
            {slug === '12-foot-gambrel-roof-truss-calculator' && con.gambrelRoof.heading}
            {slug === 'construction-estimate-builder' && con.constructionEstimate.heading}
            {slug === 'contractor-estimate-generator' && con.constructionEstimate.heading}
            {slug === 'house-construction-cost-calculator' && con.houseConstructionCost.heading}
          </h2>
        </div>

        {/* Inputs */}
        <div className="mt-5 space-y-4">
          {slug === 'voltage-drop-calculator' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                {con.voltageDrop.voltage}
                <input
                  type="number"
                  min="1"
                  step="10"
                  value={vdVoltage}
                  onChange={(e) => setVdVoltage(Math.max(1, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.voltageDrop.current}
                <input
                  type="number"
                  min="0.1"
                  step="1"
                  value={vdCurrent}
                  onChange={(e) => setVdCurrent(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.voltageDrop.length}
                <input
                  type="number"
                  min="1"
                  step="5"
                  value={vdLength}
                  onChange={(e) => setVdLength(Math.max(1, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.voltageDrop.unit}
                <select
                  value={vdUnit}
                  onChange={(e) => setVdUnit(e.target.value as 'm' | 'ft')}
                  className={fieldClass}
                >
                  <option value="m">{con.voltageDrop.meters}</option>
                  <option value="ft">{con.voltageDrop.feet}</option>
                </select>
              </label>
              <label className="text-sm font-semibold">
                {con.voltageDrop.wireGauge}
                <select
                  value={vdGauge}
                  onChange={(e) => setVdGauge(e.target.value)}
                  className={fieldClass}
                >
                  {Object.keys(COPPER_RESISTANCE_OHM_PER_M).map((g) => (
                    <option key={g} value={g}>
                      {g} AWG
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-semibold">
                {con.voltageDrop.phase}
                <select
                  value={vdPhase}
                  onChange={(e) => setVdPhase(e.target.value as 'single' | 'three')}
                  className={fieldClass}
                >
                  <option value="single">{con.voltageDrop.singlePhase}</option>
                  <option value="three">{con.voltageDrop.threePhase}</option>
                </select>
              </label>
              <label className="text-sm font-semibold sm:col-span-2">
                {con.voltageDrop.maxDrop}
                <input
                  type="number"
                  min="0.5"
                  max="15"
                  step="0.5"
                  value={vdMaxDrop}
                  onChange={(e) => setVdMaxDrop(Math.max(0.1, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
            </div>
          )}

          {slug === 'wallpaper-calculator' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                {con.wallpaper.roomLength}
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={wpLength}
                  onChange={(e) => setWpLength(Math.max(0.1, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.wallpaper.roomWidth}
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={wpWidth}
                  onChange={(e) => setWpWidth(Math.max(0.1, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.wallpaper.wallHeight}
                <input
                  type="number"
                  min="0.5"
                  step="0.1"
                  value={wpHeight}
                  onChange={(e) => setWpHeight(Math.max(0.1, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.wallpaper.unit}
                <select
                  value={wpUnit}
                  onChange={(e) => setWpUnit(e.target.value as 'm' | 'ft')}
                  className={fieldClass}
                >
                  <option value="m">{con.wallpaper.meters}</option>
                  <option value="ft">{con.wallpaper.feet}</option>
                </select>
              </label>
              <label className="text-sm font-semibold">
                {con.wallpaper.rollWidth}
                <input
                  type="number"
                  min="0.1"
                  step="0.05"
                  value={wpRollW}
                  onChange={(e) => setWpRollW(Math.max(0.1, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.wallpaper.rollLength}
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={wpRollL}
                  onChange={(e) => setWpRollL(Math.max(0.5, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.wallpaper.openings}
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={wpOpenings}
                  onChange={(e) => setWpOpenings(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.wallpaper.waste}
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="5"
                  value={wpWaste}
                  onChange={(e) => setWpWaste(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
            </div>
          )}

          {slug === 'water-tank-calculator' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                {con.waterTank.shape}
                <select
                  value={wtShape}
                  onChange={(e) => setWtShape(e.target.value as 'rectangular' | 'cylindrical' | 'spherical')}
                  className={fieldClass}
                >
                  <option value="rectangular">{con.waterTank.rectangular}</option>
                  <option value="cylindrical">{con.waterTank.cylindrical}</option>
                  <option value="spherical">{con.waterTank.spherical}</option>
                </select>
              </label>
              <label className="text-sm font-semibold">
                {con.waterTank.unit}
                <select
                  value={wtUnit}
                  onChange={(e) => setWtUnit(e.target.value as 'm' | 'ft')}
                  className={fieldClass}
                >
                  <option value="m">{con.waterTank.meters}</option>
                  <option value="ft">{con.waterTank.feet}</option>
                </select>
              </label>
              {wtShape === 'rectangular' && (
                <>
                  <label className="text-sm font-semibold">
                    {con.waterTank.length}
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={wtLength}
                      onChange={(e) => setWtLength(Math.max(0.1, Number(e.target.value)))}
                      className={fieldClass}
                    />
                  </label>
                  <label className="text-sm font-semibold">
                    {con.waterTank.width}
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={wtWidth}
                      onChange={(e) => setWtWidth(Math.max(0.1, Number(e.target.value)))}
                      className={fieldClass}
                    />
                  </label>
                  <label className="text-sm font-semibold sm:col-span-2">
                    {con.waterTank.height}
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={wtHeight}
                      onChange={(e) => setWtHeight(Math.max(0.1, Number(e.target.value)))}
                      className={fieldClass}
                    />
                  </label>
                </>
              )}
              {wtShape === 'cylindrical' && (
                <>
                  <label className="text-sm font-semibold">
                    {con.waterTank.diameter}
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={wtDiameter}
                      onChange={(e) => setWtDiameter(Math.max(0.1, Number(e.target.value)))}
                      className={fieldClass}
                    />
                  </label>
                  <label className="text-sm font-semibold">
                    {con.waterTank.height}
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={wtHeight}
                      onChange={(e) => setWtHeight(Math.max(0.1, Number(e.target.value)))}
                      className={fieldClass}
                    />
                  </label>
                </>
              )}
              {wtShape === 'spherical' && (
                <label className="text-sm font-semibold sm:col-span-2">
                  {con.waterTank.radius}
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={wtRadius}
                    onChange={(e) => setWtRadius(Math.max(0.1, Number(e.target.value)))}
                    className={fieldClass}
                  />
                </label>
              )}
            </div>
          )}

          {slug === 'wire-size-calculator' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                {con.wireSize.current}
                <input
                  type="number"
                  min="0.1"
                  step="1"
                  value={wsCurrent}
                  onChange={(e) => setWsCurrent(Math.max(0.1, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.wireSize.voltage}
                <input
                  type="number"
                  min="1"
                  step="10"
                  value={wsVoltage}
                  onChange={(e) => setWsVoltage(Math.max(1, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.wireSize.length}
                <input
                  type="number"
                  min="1"
                  step="5"
                  value={wsLength}
                  onChange={(e) => setWsLength(Math.max(1, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.wireSize.unit}
                <select
                  value={wsUnit}
                  onChange={(e) => setWsUnit(e.target.value as 'm' | 'ft')}
                  className={fieldClass}
                >
                  <option value="m">{con.wireSize.meters}</option>
                  <option value="ft">{con.wireSize.feet}</option>
                </select>
              </label>
              <label className="text-sm font-semibold">
                {con.wireSize.conductor}
                <select
                  value={wsConductor}
                  onChange={(e) => setWsConductor(e.target.value as 'copper' | 'aluminum')}
                  className={fieldClass}
                >
                  <option value="copper">{con.wireSize.copper}</option>
                  <option value="aluminum">{con.wireSize.aluminum}</option>
                </select>
              </label>
              <label className="text-sm font-semibold">
                {con.wireSize.phase}
                <select
                  value={wsPhase}
                  onChange={(e) => setWsPhase(e.target.value as 'single' | 'three')}
                  className={fieldClass}
                >
                  <option value="single">{con.wireSize.singlePhase}</option>
                  <option value="three">{con.wireSize.threePhase}</option>
                </select>
              </label>
              <label className="text-sm font-semibold">
                {con.wireSize.loadFactor}
                <input
                  type="number"
                  min="100"
                  max="150"
                  step="5"
                  value={wsLoadFactor}
                  onChange={(e) => setWsLoadFactor(Math.max(100, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.wireSize.maxDrop}
                <input
                  type="number"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={wsMaxDrop}
                  onChange={(e) => setWsMaxDrop(Math.max(0.1, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
            </div>
          )}

          {slug === '12-foot-gambrel-roof-truss-calculator' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                {con.gambrelRoof.span}
                <input
                  type="number"
                  min="4"
                  max="80"
                  step="1"
                  value={grSpan}
                  onChange={(e) => setGrSpan(Math.max(4, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.gambrelRoof.buildingLength}
                <input
                  type="number"
                  min="4"
                  max="300"
                  step="1"
                  value={grLength}
                  onChange={(e) => setGrLength(Math.max(4, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.gambrelRoof.overhang}
                <input
                  type="number"
                  min="0"
                  max="6"
                  step="0.25"
                  value={grOverhang}
                  onChange={(e) => setGrOverhang(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.gambrelRoof.trussSpacing}
                <input
                  type="number"
                  min="0.5"
                  max="4"
                  step="0.5"
                  value={grSpacing}
                  onChange={(e) => setGrSpacing(Math.max(0.5, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.gambrelRoof.lowerAngle}
                <input
                  type="number"
                  min="5"
                  max="85"
                  step="1"
                  value={grLowerAngle}
                  onChange={(e) => setGrLowerAngle(Math.max(5, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.gambrelRoof.upperAngle}
                <input
                  type="number"
                  min="5"
                  max="85"
                  step="1"
                  value={grUpperAngle}
                  onChange={(e) => setGrUpperAngle(Math.max(5, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.gambrelRoof.breakProportion}
                <input
                  type="number"
                  min="0.1"
                  max="0.9"
                  step="0.05"
                  value={grBreakProp}
                  onChange={(e) => setGrBreakProp(Math.max(0.1, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.gambrelRoof.waste}
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="5"
                  value={grWaste}
                  onChange={(e) => setGrWaste(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
            </div>
          )}

          {(slug === 'construction-estimate-builder' || slug === 'contractor-estimate-generator') && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                {con.constructionEstimate.materials}
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={slug === 'construction-estimate-builder' ? ebMat : ceMat}
                  onChange={(e) =>
                    slug === 'construction-estimate-builder'
                      ? setEbMat(Math.max(0, Number(e.target.value)))
                      : setCeMat(Math.max(0, Number(e.target.value)))
                  }
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.constructionEstimate.labor}
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={slug === 'construction-estimate-builder' ? ebLab : ceLab}
                  onChange={(e) =>
                    slug === 'construction-estimate-builder'
                      ? setEbLab(Math.max(0, Number(e.target.value)))
                      : setCeLab(Math.max(0, Number(e.target.value)))
                  }
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.constructionEstimate.equipment}
                <input
                  type="number"
                  min="0"
                  step="250"
                  value={slug === 'construction-estimate-builder' ? ebEquip : ceEquip}
                  onChange={(e) =>
                    slug === 'construction-estimate-builder'
                      ? setEbEquip(Math.max(0, Number(e.target.value)))
                      : setCeEquip(Math.max(0, Number(e.target.value)))
                  }
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.constructionEstimate.subcontractor}
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={slug === 'construction-estimate-builder' ? ebSubcon : ceSubcon}
                  onChange={(e) =>
                    slug === 'construction-estimate-builder'
                      ? setEbSubcon(Math.max(0, Number(e.target.value)))
                      : setCeSubcon(Math.max(0, Number(e.target.value)))
                  }
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.constructionEstimate.overhead}
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="1"
                  value={slug === 'construction-estimate-builder' ? ebOverhead : ceOverhead}
                  onChange={(e) =>
                    slug === 'construction-estimate-builder'
                      ? setEbOverhead(Math.max(0, Number(e.target.value)))
                      : setCeOverhead(Math.max(0, Number(e.target.value)))
                  }
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.constructionEstimate.contingency}
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="1"
                  value={slug === 'construction-estimate-builder' ? ebContingency : ceContingency}
                  onChange={(e) =>
                    slug === 'construction-estimate-builder'
                      ? setEbContingency(Math.max(0, Number(e.target.value)))
                      : setCeContingency(Math.max(0, Number(e.target.value)))
                  }
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.constructionEstimate.markup}
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={slug === 'construction-estimate-builder' ? ebMarkup : ceMarkup}
                  onChange={(e) =>
                    slug === 'construction-estimate-builder'
                      ? setEbMarkup(Math.max(0, Number(e.target.value)))
                      : setCeMarkup(Math.max(0, Number(e.target.value)))
                  }
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.constructionEstimate.tax}
                <input
                  type="number"
                  min="0"
                  max="30"
                  step="0.5"
                  value={slug === 'construction-estimate-builder' ? ebTax : ceTax}
                  onChange={(e) =>
                    slug === 'construction-estimate-builder'
                      ? setEbTax(Math.max(0, Number(e.target.value)))
                      : setCeTax(Math.max(0, Number(e.target.value)))
                  }
                  className={fieldClass}
                />
              </label>
            </div>
          )}

          {slug === 'house-construction-cost-calculator' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                {con.houseConstructionCost.area}
                <input
                  type="number"
                  min="100"
                  step="100"
                  value={hcArea}
                  onChange={(e) => setHcArea(Math.max(10, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.houseConstructionCost.unit}
                <select
                  value={hcUnit}
                  onChange={(e) => setHcUnit(e.target.value as 'sqft' | 'sqm')}
                  className={fieldClass}
                >
                  <option value="sqft">{con.houseConstructionCost.sqft}</option>
                  <option value="sqm">{con.houseConstructionCost.sqm}</option>
                </select>
              </label>
              <label className="text-sm font-semibold">
                {con.houseConstructionCost.floors}
                <input
                  type="number"
                  min="1"
                  max="10"
                  step="1"
                  value={hcFloors}
                  onChange={(e) => setHcFloors(Math.max(1, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.houseConstructionCost.rate}
                <input
                  type="number"
                  min="10"
                  step="10"
                  value={hcRate}
                  onChange={(e) => setHcRate(Math.max(1, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.houseConstructionCost.siteAndSoft}
                <input
                  type="number"
                  min="0"
                  step="5000"
                  value={hcSiteSoft}
                  onChange={(e) => setHcSiteSoft(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {con.houseConstructionCost.contingency}
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="1"
                  value={hcContingency}
                  onChange={(e) => setHcContingency(Math.max(0, Number(e.target.value)))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold sm:col-span-2">
                {con.houseConstructionCost.landCost}
                <input
                  type="number"
                  min="0"
                  step="10000"
                  value={hcLandCost}
                  onChange={(e) => setHcLandCost(Math.max(0, Number(e.target.value)))}
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
