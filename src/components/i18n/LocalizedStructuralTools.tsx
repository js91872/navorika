'use client';

import { useMemo, useState } from 'react';
import {
  Layers,
  Trees,
  Boxes,
  Truck,
  Grid,
  Home,
  Mountain,
  Scissors,
  Hammer,
} from 'lucide-react';
import ResultActions from '@/components/ui/ResultActions';
import { resultActionMessages } from '@/lib/i18n/actionMessages';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';
import { fieldClass, buttonClass } from './ToolControls';
import {
  calculateAsphalt,
  calculateRoofArea,
  calculateFlooring,
} from '@/lib/calculations/projectEstimators';
import {
  calculateBrickQuantity,
  calculateRebarGrid,
  calculateBulkMaterial,
} from '@/lib/calculations/constructionQuantities';
import { calculateConcrete } from '@/lib/calculations/construction';
import {
  calculateDumpsterWeight,
  DEBRIS_MATERIALS,
  type DebrisUnit,
  type MaterialCondition,
} from '@/lib/calculations/dumpsterWeight';
import { calculateSawKerf } from '@/lib/calculations/sawKerf';

export type StructuralToolSlug =
  | 'asphalt-calculator'
  | 'board-foot-calculator'
  | 'brick-calculator'
  | 'concrete-calculator'
  | 'dumpster-weight-calculator'
  | 'flooring-calculator'
  | 'gravel-calculator'
  | 'rebar-calculator'
  | 'roof-area-calculator'
  | 'saw-kerf-calculator';

function safeCalc<T>(fn: () => T, defaultError: string) {
  try {
    return { data: fn(), error: '' };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : defaultError };
  }
}

export default function LocalizedStructuralTools({
  slug,
  locale,
  dictionary,
}: {
  slug: StructuralToolSlug;
  locale: Locale;
  dictionary: Dictionary;
}) {
  const d = dictionary;
  const ui = d.ui;
  const con = (d as unknown as { construction: Record<string, Record<string, string>> }).construction;
  const com = con.common;
  const actionCopy = resultActionMessages[locale];

  const format = (n: number, maxDigits = 2) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: maxDigits }).format(n);

  const formatCurrency = (n: number) =>
    `$${new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n)}`;

  // 1. Asphalt Calculator State
  const [asphUnit, setAsphUnit] = useState<'m' | 'ft'>('m');
  const [asphLength, setAsphLength] = useState(20);
  const [asphWidth, setAsphWidth] = useState(10);
  const [asphThickness, setAsphThickness] = useState(75);
  const [asphDensity, setAsphDensity] = useState(2240);
  const [asphWaste, setAsphWaste] = useState(5);
  const [asphTruckCap, setAsphTruckCap] = useState(20);

  const asphaltResult = useMemo(
    () =>
      safeCalc(() => {
        return calculateAsphalt({
          length: asphLength,
          width: asphWidth,
          unit: asphUnit,
          thickness: asphThickness,
          thicknessUnit: asphUnit === 'm' ? 'mm' : 'inch',
          densityKgM3: asphDensity,
          wastePercent: asphWaste,
          truckCapacityTonnes: asphTruckCap,
        });
      }, com.errorCheck),
    [asphLength, asphWidth, asphUnit, asphThickness, asphDensity, asphWaste, asphTruckCap, com.errorCheck]
  );

  // 2. Board Foot Calculator State
  const [bfUnit, setBfUnit] = useState<'imperial' | 'metric'>('imperial');
  const [bfThickness, setBfThickness] = useState(1);
  const [bfWidth, setBfWidth] = useState(8);
  const [bfLength, setBfLength] = useState(8);
  const [bfQuantity, setBfQuantity] = useState(10);
  const [bfPrice, setBfPrice] = useState(4.5);

  const boardFootResult = useMemo(
    () =>
      safeCalc(() => {
        if (
          !Number.isFinite(bfThickness) ||
          bfThickness <= 0 ||
          !Number.isFinite(bfWidth) ||
          bfWidth <= 0 ||
          !Number.isFinite(bfLength) ||
          bfLength <= 0 ||
          !Number.isFinite(bfQuantity) ||
          bfQuantity <= 0 ||
          !Number.isFinite(bfPrice) ||
          bfPrice < 0
        ) {
          throw new RangeError(com.errorCheck);
        }
        let boardFeetEach = 0;
        if (bfUnit === 'imperial') {
          boardFeetEach = (bfThickness * bfWidth * bfLength) / 12;
        } else {
          const cubicMetresEach = (bfThickness / 1000) * (bfWidth / 1000) * bfLength;
          boardFeetEach = cubicMetresEach / 0.002359737216;
        }
        const totalBoardFeet = boardFeetEach * bfQuantity;
        const totalCost = totalBoardFeet * bfPrice;
        return { boardFeetEach, totalBoardFeet, totalCost };
      }, com.errorCheck),
    [bfUnit, bfThickness, bfWidth, bfLength, bfQuantity, bfPrice, com.errorCheck]
  );

  // 3. Brick Calculator State
  const [brickUnit, setBrickUnit] = useState<'m' | 'ft'>('m');
  const [brickWallLength, setBrickWallLength] = useState(10);
  const [brickWallThickness, setBrickWallThickness] = useState(0.11);
  const [brickWallHeight, setBrickWallHeight] = useState(3);
  const [brickSize, setBrickSize] = useState<'standard' | 'modular'>('standard');
  const [brickMortar, setBrickMortar] = useState(10);
  const [brickWaste, setBrickWaste] = useState(5);

  const brickResult = useMemo(
    () =>
      safeCalc(() => {
        const brickDimensions = {
          standard: { length: 0.23, width: 0.11, height: 0.07 },
          modular: { length: 0.19, width: 0.09, height: 0.09 },
        };
        const dims = brickDimensions[brickSize];
        return calculateBrickQuantity({
          wallLength: brickWallLength,
          wallThickness: brickWallThickness,
          wallHeight: brickWallHeight,
          unit: brickUnit,
          brickLengthM: dims.length,
          brickWidthM: dims.width,
          brickHeightM: dims.height,
          mortarJointMm: brickMortar,
          wastePercent: brickWaste,
        });
      }, com.errorCheck),
    [brickWallLength, brickWallThickness, brickWallHeight, brickUnit, brickSize, brickMortar, brickWaste, com.errorCheck]
  );

  // 4. Concrete Calculator State
  const [concLength, setConcLength] = useState(10);
  const [concWidth, setConcWidth] = useState(10);
  const [concHeight, setConcHeight] = useState(0.15);
  const [concUnit, setConcUnit] = useState<'meters' | 'feet'>('meters');
  const [concWaste, setConcWaste] = useState(5);

  const concreteResult = useMemo(
    () =>
      safeCalc(() => {
        return calculateConcrete({
          length: concLength,
          width: concWidth,
          height: concHeight,
          unit: concUnit,
          wastage: concWaste,
        });
      }, com.errorCheck),
    [concLength, concWidth, concHeight, concUnit, concWaste, com.errorCheck]
  );

  // 5. Dumpster Weight State
  const [dumpMaterial, setDumpMaterial] = useState('mixed-construction');
  const [dumpQty, setDumpQty] = useState(10);
  const [dumpUnit, setDumpUnit] = useState<DebrisUnit>('cubicYards');
  const [dumpCondition, setDumpCondition] = useState<MaterialCondition>('typical');
  const [dumpAllowance, setDumpAllowance] = useState(2);
  const [dumpRate, setDumpRate] = useState(80);

  const dumpsterResult = useMemo(
    () =>
      safeCalc(() => {
        return calculateDumpsterWeight(
          [{ materialId: dumpMaterial, quantity: dumpQty, unit: dumpUnit }],
          dumpAllowance,
          dumpRate,
          dumpCondition
        );
      }, com.errorCheck),
    [dumpMaterial, dumpQty, dumpUnit, dumpCondition, dumpAllowance, dumpRate, com.errorCheck]
  );

  // 6. Flooring State
  const [floorUnit, setFloorUnit] = useState<'m' | 'ft'>('m');
  const [floorLength, setFloorLength] = useState(6);
  const [floorWidth, setFloorWidth] = useState(5);
  const [floorMaterialRate, setFloorMaterialRate] = useState(35);
  const [floorLaborRate, setFloorLaborRate] = useState(20);
  const [floorWaste, setFloorWaste] = useState(10);

  const flooringResult = useMemo(
    () =>
      safeCalc(() => {
        return calculateFlooring({
          length: floorLength,
          width: floorWidth,
          unit: floorUnit,
          materialRateSqft: floorMaterialRate,
          laborRateSqft: floorLaborRate,
          wastePercent: floorWaste,
        });
      }, com.errorCheck),
    [floorLength, floorWidth, floorUnit, floorMaterialRate, floorLaborRate, floorWaste, com.errorCheck]
  );

  // 7. Gravel State
  const [gravelUnit, setGravelUnit] = useState<'m' | 'ft'>('m');
  const [gravelLength, setGravelLength] = useState(10);
  const [gravelWidth, setGravelWidth] = useState(10);
  const [gravelDepth, setGravelDepth] = useState(0.15);
  const [gravelType, setGravelType] = useState<'pea' | 'crushed' | 'river'>('crushed');
  const [gravelWaste, setGravelWaste] = useState(5);
  const [gravelTruckPayload, setGravelTruckPayload] = useState(15000);

  const gravelResult = useMemo(
    () =>
      safeCalc(() => {
        const densities = { pea: 1600, crushed: 1750, river: 1800 };
        return calculateBulkMaterial({
          length: gravelLength,
          width: gravelWidth,
          depth: gravelDepth,
          unit: gravelUnit,
          densityKgM3: densities[gravelType],
          wastePercent: gravelWaste,
          truckPayloadKg: gravelTruckPayload,
        });
      }, com.errorCheck),
    [gravelLength, gravelWidth, gravelDepth, gravelUnit, gravelType, gravelWaste, gravelTruckPayload, com.errorCheck]
  );

  // 8. Rebar State
  const [rebarLength, setRebarLength] = useState(10);
  const [rebarWidth, setRebarWidth] = useState(10);
  const [rebarSize, setRebarSize] = useState(12);
  const [rebarSpacing, setRebarSpacing] = useState(150);
  const [rebarCover, setRebarCover] = useState(25);
  const [rebarDirection, setRebarDirection] = useState<'both' | 'lengthwise' | 'widthwise'>('both');

  const rebarResult = useMemo(
    () =>
      safeCalc(() => {
        return calculateRebarGrid({
          slabLengthM: rebarLength,
          slabWidthM: rebarWidth,
          barDiameterMm: rebarSize,
          maximumSpacingMm: rebarSpacing,
          clearCoverMm: rebarCover,
          direction: rebarDirection,
        });
      }, com.errorCheck),
    [rebarLength, rebarWidth, rebarSize, rebarSpacing, rebarCover, rebarDirection, com.errorCheck]
  );

  // 9. Roof Area State
  const [roofUnit, setRoofUnit] = useState<'m' | 'ft'>('m');
  const [roofLength, setRoofLength] = useState(12);
  const [roofWidth, setRoofWidth] = useState(8);
  const [roofPitchRise, setRoofPitchRise] = useState(6);
  const [roofOverhang, setRoofOverhang] = useState(0.3);
  const [roofWaste, setRoofWaste] = useState(10);

  const roofAreaResult = useMemo(
    () =>
      safeCalc(() => {
        return calculateRoofArea({
          length: roofLength,
          width: roofWidth,
          unit: roofUnit,
          pitchRisePer12: roofPitchRise,
          overhang: roofOverhang,
          wastePercent: roofWaste,
        });
      }, com.errorCheck),
    [roofLength, roofWidth, roofUnit, roofPitchRise, roofOverhang, roofWaste, com.errorCheck]
  );

  // 10. Saw Kerf State
  const [kerfUnit, setKerfUnit] = useState<'mm' | 'in'>('mm');
  const [kerfStockWidth, setKerfStockWidth] = useState(300);
  const [kerfPieceWidth, setKerfPieceWidth] = useState(40);
  const [kerfWidth, setKerfWidth] = useState(3);

  const sawKerfResult = useMemo(
    () =>
      safeCalc(() => {
        return calculateSawKerf({
          stockWidth: kerfStockWidth,
          pieceWidth: kerfPieceWidth,
          kerfWidth: kerfWidth,
        });
      }, com.errorCheck),
    [kerfStockWidth, kerfPieceWidth, kerfWidth, com.errorCheck]
  );

  // Reset Handlers
  const handleReset = () => {
    if (slug === 'asphalt-calculator') {
      setAsphUnit('m');
      setAsphLength(20);
      setAsphWidth(10);
      setAsphThickness(75);
      setAsphDensity(2240);
      setAsphWaste(5);
      setAsphTruckCap(20);
    } else if (slug === 'board-foot-calculator') {
      setBfUnit('imperial');
      setBfThickness(1);
      setBfWidth(8);
      setBfLength(8);
      setBfQuantity(10);
      setBfPrice(4.5);
    } else if (slug === 'brick-calculator') {
      setBrickUnit('m');
      setBrickWallLength(10);
      setBrickWallThickness(0.11);
      setBrickWallHeight(3);
      setBrickSize('standard');
      setBrickMortar(10);
      setBrickWaste(5);
    } else if (slug === 'concrete-calculator') {
      setConcLength(10);
      setConcWidth(10);
      setConcHeight(0.15);
      setConcUnit('meters');
      setConcWaste(5);
    } else if (slug === 'dumpster-weight-calculator') {
      setDumpMaterial('mixed-construction');
      setDumpQty(10);
      setDumpUnit('cubicYards');
      setDumpCondition('typical');
      setDumpAllowance(2);
      setDumpRate(80);
    } else if (slug === 'flooring-calculator') {
      setFloorUnit('m');
      setFloorLength(6);
      setFloorWidth(5);
      setFloorMaterialRate(35);
      setFloorLaborRate(20);
      setFloorWaste(10);
    } else if (slug === 'gravel-calculator') {
      setGravelUnit('m');
      setGravelLength(10);
      setGravelWidth(10);
      setGravelDepth(0.15);
      setGravelType('crushed');
      setGravelWaste(5);
      setGravelTruckPayload(15000);
    } else if (slug === 'rebar-calculator') {
      setRebarLength(10);
      setRebarWidth(10);
      setRebarSize(12);
      setRebarSpacing(150);
      setRebarCover(25);
      setRebarDirection('both');
    } else if (slug === 'roof-area-calculator') {
      setRoofUnit('m');
      setRoofLength(12);
      setRoofWidth(8);
      setRoofPitchRise(6);
      setRoofOverhang(0.3);
      setRoofWaste(10);
    } else if (slug === 'saw-kerf-calculator') {
      setKerfUnit('mm');
      setKerfStockWidth(300);
      setKerfPieceWidth(40);
      setKerfWidth(3);
    }
  };

  // Compile active results for presentation and export
  let currentResults: Array<[string, string]> = [];
  let currentError = '';

  if (slug === 'asphalt-calculator') {
    currentError = asphaltResult.error;
    const r = asphaltResult.data;
    if (r) {
      currentResults = [
        [con.asphalt.tonnes, `${format(r.tonnes, 2)} t`],
        [con.asphalt.volume, `${format(r.volumeM3, 2)} m³`],
        [con.asphalt.weight, `${format(r.weightKg, 0)} kg`],
        [con.asphalt.area, `${format(r.areaM2, 1)} m²`],
        [con.asphalt.truckLoads, `${format(r.truckLoads, 0)}`],
      ];
    }
  } else if (slug === 'board-foot-calculator') {
    currentError = boardFootResult.error;
    const r = boardFootResult.data;
    if (r) {
      currentResults = [
        [con.boardFoot.totalBoardFeet, `${format(r.totalBoardFeet, 2)} FBM`],
        [con.boardFoot.boardFeetEach, `${format(r.boardFeetEach, 2)} FBM`],
        [con.boardFoot.totalCost, formatCurrency(r.totalCost)],
      ];
    }
  } else if (slug === 'brick-calculator') {
    currentError = brickResult.error;
    const r = brickResult.data;
    if (r) {
      currentResults = [
        [con.brick.totalBricks, `${format(r.totalBricks, 0)}`],
        [con.brick.baseBricks, `${format(r.baseBricks, 0)}`],
        [con.brick.wallArea, `${format(r.wallAreaM2, 2)} m²`],
        [con.brick.wallVolume, `${format(r.wallVolumeM3, 2)} m³`],
      ];
    }
  } else if (slug === 'concrete-calculator') {
    currentError = concreteResult.error;
    const r = concreteResult.data;
    if (r) {
      currentResults = [
        [con.concrete.volume, `${format(r.volume, 2)} m³`],
        [con.concrete.cement, `${format(r.cement, 2)} m³`],
        [con.concrete.sand, `${format(r.sand, 2)} m³`],
        [con.concrete.aggregate, `${format(r.aggregate, 2)} m³`],
        [con.concrete.water, `${format(r.water, 2)} m³`],
      ];
    }
  } else if (slug === 'dumpster-weight-calculator') {
    currentError = dumpsterResult.error;
    const r = dumpsterResult.data;
    if (r) {
      currentResults = [
        [con.dumpster.totalWeight, `${format(r.totalTons, 2)} t`],
        [con.dumpster.totalPounds, `${format(r.totalPounds, 0)} lb`],
        [con.dumpster.overageTons, `${format(r.overageTons, 2)} t`],
        [con.dumpster.overageFee, formatCurrency(r.overageFee)],
      ];
    }
  } else if (slug === 'flooring-calculator') {
    currentError = flooringResult.error;
    const r = flooringResult.data;
    if (r) {
      currentResults = [
        [con.flooring.totalCost, formatCurrency(r.totalCost)],
        [con.flooring.orderArea, `${format(r.orderAreaSqft, 1)} sq ft`],
        [con.flooring.netArea, `${format(r.areaSqft, 1)} sq ft`],
        [con.flooring.materialCost, formatCurrency(r.materialCost)],
        [con.flooring.laborCost, formatCurrency(r.laborCost)],
      ];
    }
  } else if (slug === 'gravel-calculator') {
    currentError = gravelResult.error;
    const r = gravelResult.data;
    if (r) {
      currentResults = [
        [con.gravel.tonnes, `${format(r.tonnes, 2)} t`],
        [con.gravel.volume, `${format(r.orderVolumeM3, 2)} m³`],
        [con.gravel.weight, `${format(r.weightKg, 0)} kg`],
        [con.gravel.area, `${format(r.areaM2, 1)} m²`],
        [con.gravel.truckLoads, `${format(r.truckLoads, 0)}`],
      ];
    }
  } else if (slug === 'rebar-calculator') {
    currentError = rebarResult.error;
    const r = rebarResult.data;
    if (r) {
      currentResults = [
        [con.rebar.totalBars, `${format(r.totalBars, 0)}`],
        [con.rebar.totalLength, `${format(r.totalLengthM, 1)} m`],
        [con.rebar.totalWeight, `${format(r.totalWeightKg, 1)} kg`],
        [con.rebar.theoreticalWeight, `${format(r.theoreticalWeightKgPerM, 2)} kg/m`],
      ];
    }
  } else if (slug === 'roof-area-calculator') {
    currentError = roofAreaResult.error;
    const r = roofAreaResult.data;
    if (r) {
      currentResults = [
        [con.roofArea.roofArea, `${format(r.roofArea, 1)} m²`],
        [con.roofArea.roofingArea, `${format(r.roofingArea, 1)} m²`],
        [con.roofArea.flatArea, `${format(r.flatArea, 1)} m²`],
        [con.roofArea.pitchFactor, `${format(r.pitchFactor, 3)}`],
        [con.roofArea.squaresNeeded, `${format(r.squaresNeeded, 1)}`],
      ];
    }
  } else if (slug === 'saw-kerf-calculator') {
    currentError = sawKerfResult.error;
    const r = sawKerfResult.data;
    if (r) {
      currentResults = [
        [con.sawKerf.pieces, `${format(r.pieces, 0)}`],
        [con.sawKerf.cuts, `${format(r.cuts, 0)}`],
        [con.sawKerf.totalKerfLoss, `${format(r.totalKerfLoss, 1)} ${kerfUnit}`],
        [con.sawKerf.materialUsed, `${format(r.materialUsed, 1)} ${kerfUnit}`],
        [con.sawKerf.offcut, `${format(r.offcut, 1)} ${kerfUnit}`],
        [con.sawKerf.efficiency, `${format(r.efficiencyPercent, 1)} %`],
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
          {slug === 'asphalt-calculator' && <Truck className="size-5 shrink-0 text-amber-500" />}
          {slug === 'board-foot-calculator' && <Trees className="size-5 shrink-0 text-emerald-500" />}
          {slug === 'brick-calculator' && <Boxes className="size-5 shrink-0 text-orange-500" />}
          {slug === 'concrete-calculator' && <Layers className="size-5 shrink-0 text-slate-500" />}
          {slug === 'dumpster-weight-calculator' && <Truck className="size-5 shrink-0 text-red-500" />}
          {slug === 'flooring-calculator' && <Grid className="size-5 shrink-0 text-indigo-500" />}
          {slug === 'gravel-calculator' && <Mountain className="size-5 shrink-0 text-stone-500" />}
          {slug === 'rebar-calculator' && <Hammer className="size-5 shrink-0 text-blue-500" />}
          {slug === 'roof-area-calculator' && <Home className="size-5 shrink-0 text-indigo-500" />}
          {slug === 'saw-kerf-calculator' && <Scissors className="size-5 shrink-0 text-amber-600" />}

          <h2 className="min-w-0 break-words text-xl font-bold">
            {slug === 'asphalt-calculator' && con.asphalt.heading}
            {slug === 'board-foot-calculator' && con.boardFoot.heading}
            {slug === 'brick-calculator' && con.brick.heading}
            {slug === 'concrete-calculator' && con.concrete.heading}
            {slug === 'dumpster-weight-calculator' && con.dumpster.heading}
            {slug === 'flooring-calculator' && con.flooring.heading}
            {slug === 'gravel-calculator' && con.gravel.heading}
            {slug === 'rebar-calculator' && con.rebar.heading}
            {slug === 'roof-area-calculator' && con.roofArea.heading}
            {slug === 'saw-kerf-calculator' && con.sawKerf.heading}
          </h2>
        </div>

        <div className="mt-5 grid min-w-0 gap-4 sm:grid-cols-2">
          {/* 1. Asphalt Inputs */}
          {slug === 'asphalt-calculator' && (
            <>
              <label className="min-w-0 text-sm font-semibold">
                {con.asphalt.unitSystem}
                <select
                  value={asphUnit}
                  onChange={(e) => setAsphUnit(e.target.value as 'm' | 'ft')}
                  className={fieldClass}
                >
                  <option value="m">{con.asphalt.metric}</option>
                  <option value="ft">{con.asphalt.imperial}</option>
                </select>
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.asphalt.length} ({asphUnit})
                <input
                  type="number"
                  min="0.1"
                  step="0.5"
                  value={asphLength}
                  onChange={(e) => setAsphLength(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.asphalt.width} ({asphUnit})
                <input
                  type="number"
                  min="0.1"
                  step="0.5"
                  value={asphWidth}
                  onChange={(e) => setAsphWidth(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.asphalt.thickness} ({asphUnit === 'm' ? 'mm' : 'in'})
                <input
                  type="number"
                  min="10"
                  step="5"
                  value={asphThickness}
                  onChange={(e) => setAsphThickness(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.asphalt.density}
                <input
                  type="number"
                  min="1500"
                  max="3000"
                  value={asphDensity}
                  onChange={(e) => setAsphDensity(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.asphalt.waste}
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={asphWaste}
                  onChange={(e) => setAsphWaste(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
            </>
          )}

          {/* 2. Board Foot Inputs */}
          {slug === 'board-foot-calculator' && (
            <>
              <label className="min-w-0 text-sm font-semibold sm:col-span-2">
                {con.boardFoot.unitSystem}
                <select
                  value={bfUnit}
                  onChange={(e) => {
                    const next = e.target.value as 'imperial' | 'metric';
                    setBfUnit(next);
                    if (next === 'metric') {
                      setBfThickness(25);
                      setBfWidth(200);
                      setBfLength(2.4);
                    } else {
                      setBfThickness(1);
                      setBfWidth(8);
                      setBfLength(8);
                    }
                  }}
                  className={fieldClass}
                >
                  <option value="imperial">{con.boardFoot.imperial}</option>
                  <option value="metric">{con.boardFoot.metric}</option>
                </select>
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.boardFoot.thickness} ({bfUnit === 'imperial' ? 'in' : 'mm'})
                <input
                  type="number"
                  min="0.1"
                  step="0.25"
                  value={bfThickness}
                  onChange={(e) => setBfThickness(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.boardFoot.width} ({bfUnit === 'imperial' ? 'in' : 'mm'})
                <input
                  type="number"
                  min="0.1"
                  step="0.5"
                  value={bfWidth}
                  onChange={(e) => setBfWidth(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.boardFoot.length} ({bfUnit === 'imperial' ? 'ft' : 'm'})
                <input
                  type="number"
                  min="0.1"
                  step="0.5"
                  value={bfLength}
                  onChange={(e) => setBfLength(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.boardFoot.quantity}
                <input
                  type="number"
                  min="1"
                  value={bfQuantity}
                  onChange={(e) => setBfQuantity(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold sm:col-span-2">
                {con.boardFoot.pricePerFbm}
                <input
                  type="number"
                  min="0"
                  step="0.25"
                  value={bfPrice}
                  onChange={(e) => setBfPrice(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
            </>
          )}

          {/* 3. Brick Inputs */}
          {slug === 'brick-calculator' && (
            <>
              <label className="min-w-0 text-sm font-semibold">
                {con.brick.unitSystem}
                <select
                  value={brickUnit}
                  onChange={(e) => setBrickUnit(e.target.value as 'm' | 'ft')}
                  className={fieldClass}
                >
                  <option value="m">{con.brick.metric}</option>
                  <option value="ft">{con.brick.imperial}</option>
                </select>
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.brick.brickSize}
                <select
                  value={brickSize}
                  onChange={(e) => setBrickSize(e.target.value as 'standard' | 'modular')}
                  className={fieldClass}
                >
                  <option value="standard">{con.brick.standard}</option>
                  <option value="modular">{con.brick.modular}</option>
                </select>
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.brick.wallLength} ({brickUnit})
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={brickWallLength}
                  onChange={(e) => setBrickWallLength(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.brick.wallThickness} ({brickUnit})
                <input
                  type="number"
                  min="0.05"
                  step="0.05"
                  value={brickWallThickness}
                  onChange={(e) => setBrickWallThickness(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.brick.wallHeight} ({brickUnit})
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={brickWallHeight}
                  onChange={(e) => setBrickWallHeight(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.brick.mortarJoint}
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={brickMortar}
                  onChange={(e) => setBrickMortar(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold sm:col-span-2">
                {con.brick.waste}
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={brickWaste}
                  onChange={(e) => setBrickWaste(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
            </>
          )}

          {/* 4. Concrete Inputs */}
          {slug === 'concrete-calculator' && (
            <>
              <label className="min-w-0 text-sm font-semibold sm:col-span-2">
                {con.concrete.unitSystem}
                <select
                  value={concUnit}
                  onChange={(e) => setConcUnit(e.target.value as 'meters' | 'feet')}
                  className={fieldClass}
                >
                  <option value="meters">{con.concrete.metric}</option>
                  <option value="feet">{con.concrete.imperial}</option>
                </select>
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.concrete.length}
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={concLength}
                  onChange={(e) => setConcLength(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.concrete.width}
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={concWidth}
                  onChange={(e) => setConcWidth(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.concrete.thickness}
                <input
                  type="number"
                  min="0.05"
                  step="0.01"
                  value={concHeight}
                  onChange={(e) => setConcHeight(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.concrete.waste}
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={concWaste}
                  onChange={(e) => setConcWaste(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
            </>
          )}

          {/* 5. Dumpster Weight Inputs */}
          {slug === 'dumpster-weight-calculator' && (
            <>
              <label className="min-w-0 text-sm font-semibold sm:col-span-2">
                {con.dumpster.material}
                <select
                  value={dumpMaterial}
                  onChange={(e) => setDumpMaterial(e.target.value)}
                  className={fieldClass}
                >
                  {DEBRIS_MATERIALS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.dumpster.quantity}
                <input
                  type="number"
                  min="0.1"
                  step="1"
                  value={dumpQty}
                  onChange={(e) => setDumpQty(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.dumpster.unit}
                <select
                  value={dumpUnit}
                  onChange={(e) => setDumpUnit(e.target.value as DebrisUnit)}
                  className={fieldClass}
                >
                  <option value="cubicYards">{con.dumpster.cubicYards}</option>
                  <option value="cubicFeet">{con.dumpster.cubicFeet}</option>
                  <option value="squareFeet">{con.dumpster.squareFeet}</option>
                  <option value="tons">{con.dumpster.tons}</option>
                  <option value="pounds">{con.dumpster.pounds}</option>
                </select>
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.dumpster.condition}
                <select
                  value={dumpCondition}
                  onChange={(e) => setDumpCondition(e.target.value as MaterialCondition)}
                  className={fieldClass}
                >
                  <option value="dry">{con.dumpster.dry}</option>
                  <option value="typical">{con.dumpster.typical}</option>
                  <option value="wet">{con.dumpster.wet}</option>
                </select>
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.dumpster.allowanceTons}
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={dumpAllowance}
                  onChange={(e) => setDumpAllowance(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold sm:col-span-2">
                {con.dumpster.overageRate}
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={dumpRate}
                  onChange={(e) => setDumpRate(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
            </>
          )}

          {/* 6. Flooring Inputs */}
          {slug === 'flooring-calculator' && (
            <>
              <label className="min-w-0 text-sm font-semibold sm:col-span-2">
                {con.flooring.unitSystem}
                <select
                  value={floorUnit}
                  onChange={(e) => {
                    const next = e.target.value as 'm' | 'ft';
                    setFloorUnit(next);
                    if (next === 'ft') {
                      setFloorLength(20);
                      setFloorWidth(15);
                      setFloorMaterialRate(3.5);
                      setFloorLaborRate(2.0);
                    } else {
                      setFloorLength(6);
                      setFloorWidth(5);
                      setFloorMaterialRate(35);
                      setFloorLaborRate(20);
                    }
                  }}
                  className={fieldClass}
                >
                  <option value="m">{con.flooring.metric}</option>
                  <option value="ft">{con.flooring.imperial}</option>
                </select>
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.flooring.length} ({floorUnit})
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={floorLength}
                  onChange={(e) => setFloorLength(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.flooring.width} ({floorUnit})
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={floorWidth}
                  onChange={(e) => setFloorWidth(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.flooring.materialRate}
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={floorMaterialRate}
                  onChange={(e) => setFloorMaterialRate(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.flooring.laborRate}
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={floorLaborRate}
                  onChange={(e) => setFloorLaborRate(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold sm:col-span-2">
                {con.flooring.waste}
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={floorWaste}
                  onChange={(e) => setFloorWaste(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
            </>
          )}

          {/* 7. Gravel Inputs */}
          {slug === 'gravel-calculator' && (
            <>
              <label className="min-w-0 text-sm font-semibold">
                {con.gravel.unitSystem}
                <select
                  value={gravelUnit}
                  onChange={(e) => setGravelUnit(e.target.value as 'm' | 'ft')}
                  className={fieldClass}
                >
                  <option value="m">{con.gravel.metric}</option>
                  <option value="ft">{con.gravel.imperial}</option>
                </select>
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.gravel.gravelType}
                <select
                  value={gravelType}
                  onChange={(e) => setGravelType(e.target.value as 'pea' | 'crushed' | 'river')}
                  className={fieldClass}
                >
                  <option value="pea">{con.gravel.pea}</option>
                  <option value="crushed">{con.gravel.crushed}</option>
                  <option value="river">{con.gravel.river}</option>
                </select>
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.gravel.length} ({gravelUnit})
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={gravelLength}
                  onChange={(e) => setGravelLength(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.gravel.width} ({gravelUnit})
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={gravelWidth}
                  onChange={(e) => setGravelWidth(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.gravel.depth} ({gravelUnit})
                <input
                  type="number"
                  min="0.02"
                  step="0.02"
                  value={gravelDepth}
                  onChange={(e) => setGravelDepth(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.gravel.waste}
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={gravelWaste}
                  onChange={(e) => setGravelWaste(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
            </>
          )}

          {/* 8. Rebar Inputs */}
          {slug === 'rebar-calculator' && (
            <>
              <label className="min-w-0 text-sm font-semibold">
                {con.rebar.slabLength}
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={rebarLength}
                  onChange={(e) => setRebarLength(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.rebar.slabWidth}
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={rebarWidth}
                  onChange={(e) => setRebarWidth(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.rebar.barSize}
                <input
                  type="number"
                  min="6"
                  max="40"
                  step="2"
                  value={rebarSize}
                  onChange={(e) => setRebarSize(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.rebar.spacing}
                <input
                  type="number"
                  min="50"
                  max="500"
                  step="25"
                  value={rebarSpacing}
                  onChange={(e) => setRebarSpacing(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.rebar.cover}
                <input
                  type="number"
                  min="10"
                  max="100"
                  step="5"
                  value={rebarCover}
                  onChange={(e) => setRebarCover(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.rebar.direction}
                <select
                  value={rebarDirection}
                  onChange={(e) => setRebarDirection(e.target.value as 'both' | 'lengthwise' | 'widthwise')}
                  className={fieldClass}
                >
                  <option value="both">{con.rebar.both}</option>
                  <option value="lengthwise">{con.rebar.lengthwise}</option>
                  <option value="widthwise">{con.rebar.widthwise}</option>
                </select>
              </label>
            </>
          )}

          {/* 9. Roof Area Inputs */}
          {slug === 'roof-area-calculator' && (
            <>
              <label className="min-w-0 text-sm font-semibold sm:col-span-2">
                {con.roofArea.unitSystem}
                <select
                  value={roofUnit}
                  onChange={(e) => {
                    const next = e.target.value as 'm' | 'ft';
                    setRoofUnit(next);
                    if (next === 'ft') {
                      setRoofLength(40);
                      setRoofWidth(30);
                      setRoofOverhang(1);
                    } else {
                      setRoofLength(12);
                      setRoofWidth(8);
                      setRoofOverhang(0.3);
                    }
                  }}
                  className={fieldClass}
                >
                  <option value="m">{con.roofArea.metric}</option>
                  <option value="ft">{con.roofArea.imperial}</option>
                </select>
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.roofArea.length} ({roofUnit})
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={roofLength}
                  onChange={(e) => setRoofLength(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.roofArea.width} ({roofUnit})
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={roofWidth}
                  onChange={(e) => setRoofWidth(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.roofArea.pitchRise}
                <input
                  type="number"
                  min="1"
                  max="24"
                  step="0.5"
                  value={roofPitchRise}
                  onChange={(e) => setRoofPitchRise(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.roofArea.overhang} ({roofUnit})
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={roofOverhang}
                  onChange={(e) => setRoofOverhang(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold sm:col-span-2">
                {con.roofArea.waste}
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={roofWaste}
                  onChange={(e) => setRoofWaste(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
            </>
          )}

          {/* 10. Saw Kerf Inputs */}
          {slug === 'saw-kerf-calculator' && (
            <>
              <label className="min-w-0 text-sm font-semibold sm:col-span-2">
                {con.sawKerf.unit}
                <select
                  value={kerfUnit}
                  onChange={(e) => {
                    const next = e.target.value as 'mm' | 'in';
                    setKerfUnit(next);
                    if (next === 'in') {
                      setKerfStockWidth(11.25);
                      setKerfPieceWidth(3.5);
                      setKerfWidth(0.125);
                    } else {
                      setKerfStockWidth(300);
                      setKerfPieceWidth(40);
                      setKerfWidth(3);
                    }
                  }}
                  className={fieldClass}
                >
                  <option value="mm">{con.sawKerf.mm}</option>
                  <option value="in">{con.sawKerf.in}</option>
                </select>
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.sawKerf.stockWidth} ({kerfUnit})
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={kerfStockWidth}
                  onChange={(e) => setKerfStockWidth(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold">
                {con.sawKerf.pieceWidth} ({kerfUnit})
                <input
                  type="number"
                  min="0.1"
                  step="0.25"
                  value={kerfPieceWidth}
                  onChange={(e) => setKerfPieceWidth(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="min-w-0 text-sm font-semibold sm:col-span-2">
                {con.sawKerf.kerfWidth} ({kerfUnit})
                <input
                  type="number"
                  min="0.01"
                  step="0.1"
                  value={kerfWidth}
                  onChange={(e) => setKerfWidth(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
            </>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={handleReset} className={buttonClass}>
            {ui.reset}
          </button>
        </div>

        {/* Informational Notes */}
        <p className="mt-4 min-w-0 break-words text-xs text-[var(--muted-foreground)]">
          {slug === 'asphalt-calculator' && con.asphalt.note}
          {slug === 'board-foot-calculator' && con.boardFoot.note}
          {slug === 'brick-calculator' && con.brick.note}
          {slug === 'concrete-calculator' && con.concrete.note}
          {slug === 'dumpster-weight-calculator' && con.dumpster.note}
          {slug === 'flooring-calculator' && con.flooring.note}
          {slug === 'gravel-calculator' && con.gravel.note}
          {slug === 'rebar-calculator' && con.rebar.note}
          {slug === 'roof-area-calculator' && con.roofArea.note}
          {slug === 'saw-kerf-calculator' && con.sawKerf.note}
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
                  <dd suppressHydrationWarning className="mt-1 min-w-0 break-words text-2xl font-black">
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
