'use client';

import { useMemo, useState } from 'react';
import { Hammer } from 'lucide-react';
import ResultActions from '@/components/ui/ResultActions';
import { resultActionMessages } from '@/lib/i18n/actionMessages';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';
import { fieldClass, buttonClass } from './ToolControls';
import {
  deckBoards,
  drywall,
  fence,
  landscapeVolume,
  pavers,
  polymericSand,
  postHoleConcrete,
  roofPitch,
  stairs,
} from '@/lib/calculations/constructionExpansion';
import {
  calculateFertilizer,
  type FertilizerAreaUnit,
  type FertilizerNutrient,
  type FertilizerRateUnit,
} from '@/lib/calculations/fertilizer';

export type ConstructionToolSlug =
  | 'roof-pitch-calculator'
  | 'stair-stringer-calculator'
  | 'deck-board-calculator'
  | 'fence-calculator'
  | 'post-hole-concrete-calculator'
  | 'drywall-calculator'
  | 'paver-calculator'
  | 'polymeric-sand-calculator'
  | 'mulch-calculator'
  | 'topsoil-calculator'
  | 'fertilizer-calculator';

function safeCalc<T>(fn: () => T, defaultError: string) {
  try {
    return { data: fn(), error: '' };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : defaultError };
  }
}

export default function LocalizedConstructionTools({
  slug,
  d,
  locale,
}: {
  slug: ConstructionToolSlug;
  d: Dictionary;
  locale: Locale;
}) {
  const ui = d.ui;
  const calcUi = d.calculatorUi;
  const c = d.construction;
  const com = c.common;
  const actionCopy = resultActionMessages[locale];

  const format = (value: number, digits = 2) =>
    Number.isFinite(value)
      ? new Intl.NumberFormat(locale, { maximumFractionDigits: digits }).format(value)
      : '—';

  // 1. Roof Pitch
  const [pitchRise, setPitchRise] = useState(6);
  const [pitchRun, setPitchRun] = useState(12);
  const [pitchSpan, setPitchSpan] = useState(12);

  // 2. Stair Stringer
  const [stairRise, setStairRise] = useState(108);
  const [stairMax, setStairMax] = useState(7.75);
  const [stairTread, setStairTread] = useState(10);
  const [stairWidth, setStairWidth] = useState(36);

  // 3. Deck Board
  const [deckLength, setDeckLength] = useState(20);
  const [deckWidth, setDeckWidth] = useState(12);
  const [deckBoardWidth, setDeckBoardWidth] = useState(5.5);
  const [deckBoardLength, setDeckBoardLength] = useState(12);
  const [deckGap, setDeckGap] = useState(0.25);
  const [deckWaste, setDeckWaste] = useState(10);
  const [deckOrientation, setDeckOrientation] = useState<'length' | 'width'>('length');

  // 4. Fence
  const [fenceLength, setFenceLength] = useState(150);
  const [fenceSection, setFenceSection] = useState(8);
  const [fenceCorners, setFenceCorners] = useState(2);
  const [fenceGates, setFenceGates] = useState(1);
  const [fenceGateWidth, setFenceGateWidth] = useState(4);
  const [fenceWaste, setFenceWaste] = useState(5);
  const [fenceRails, setFenceRails] = useState(2);
  const [fenceMode, setFenceMode] = useState<'panel' | 'spacing'>('panel');

  // 5. Post Hole Concrete
  const [postHoleDiameter, setPostHoleDiameter] = useState(12);
  const [postHoleDepth, setPostHoleDepth] = useState(36);
  const [postHoleCount, setPostHoleCount] = useState(8);
  const [postHoleShape, setPostHoleShape] = useState<'round' | 'rectangle'>('round');
  const [postHoleA, setPostHoleA] = useState(4);
  const [postHoleB, setPostHoleB] = useState(4);
  const [postHoleYield, setPostHoleYield] = useState(0.6);

  // 6. Drywall
  const [drywallMode, setDrywallMode] = useState<'dimensions' | 'area'>('dimensions');
  const [drywallLength, setDrywallLength] = useState(40);
  const [drywallHeight, setDrywallHeight] = useState(8);
  const [drywallArea, setDrywallArea] = useState(320);
  const [drywallCeiling, setDrywallCeiling] = useState(0);
  const [drywallOpenings, setDrywallOpenings] = useState(40);
  const [drywallSheetW, setDrywallSheetW] = useState(4);
  const [drywallSheetH, setDrywallSheetH] = useState(8);
  const [drywallWaste, setDrywallWaste] = useState(10);

  // 7. Pavers
  const [paverMode, setPaverMode] = useState<'dimensions' | 'area'>('dimensions');
  const [paverLength, setPaverLength] = useState(10);
  const [paverWidth, setPaverWidth] = useState(10);
  const [paverArea, setPaverArea] = useState(100);
  const [paverL, setPaverL] = useState(8);
  const [paverW, setPaverW] = useState(4);
  const [paverWaste, setPaverWaste] = useState(10);
  const [paverPallet, setPaverPallet] = useState(480);

  // 8. Polymeric Sand
  const [polyMode, setPolyMode] = useState<'dimensions' | 'area'>('dimensions');
  const [polyLength, setPolyLength] = useState(10);
  const [polyWidth, setPolyWidth] = useState(10);
  const [polyArea, setPolyArea] = useState(100);
  const [polyPaverL, setPolyPaverL] = useState(8);
  const [polyPaverW, setPolyPaverW] = useState(4);
  const [polyJointW, setPolyJointW] = useState(0.25);
  const [polyDepth, setPolyDepth] = useState(1.5);
  const [polyDensity, setPolyDensity] = useState(100);
  const [polyBag, setPolyBag] = useState(40);
  const [polyWaste, setPolyWaste] = useState(10);

  // 9. Mulch
  const [mulchMode, setMulchMode] = useState<'dimensions' | 'area'>('dimensions');
  const [mulchLength, setMulchLength] = useState(10);
  const [mulchWidth, setMulchWidth] = useState(10);
  const [mulchArea, setMulchArea] = useState(100);
  const [mulchShape, setMulchShape] = useState<'rectangle' | 'circle'>('rectangle');
  const [mulchDepth, setMulchDepth] = useState(3);
  const [mulchBag, setMulchBag] = useState(2);

  // 10. Topsoil
  const [topsoilMode, setTopsoilMode] = useState<'dimensions' | 'area'>('dimensions');
  const [topsoilLength, setTopsoilLength] = useState(10);
  const [topsoilWidth, setTopsoilWidth] = useState(10);
  const [topsoilArea, setTopsoilArea] = useState(100);
  const [topsoilDepth, setTopsoilDepth] = useState(3);
  const [topsoilDensity, setTopsoilDensity] = useState(75);

  // 11. Fertilizer
  const [fertArea, setFertArea] = useState(5000);
  const [fertAreaUnit, setFertAreaUnit] = useState<FertilizerAreaUnit>('sqft');
  const [fertRate, setFertRate] = useState(1);
  const [fertRateUnit, setFertRateUnit] = useState<FertilizerRateUnit>('per-1000-sqft');
  const [fertNutrient, setFertNutrient] = useState<FertilizerNutrient>('n');
  const [fertN, setFertN] = useState(26);
  const [fertP, setFertP] = useState(5);
  const [fertK, setFertK] = useState(10);
  const [fertBag, setFertBag] = useState(40);

  // Computations
  const pitchResult = useMemo(
    () => safeCalc(() => roofPitch(pitchRise, pitchRun, pitchSpan), com.errorCheck),
    [pitchRise, pitchRun, pitchSpan, com.errorCheck]
  );

  const stairResult = useMemo(
    () => safeCalc(() => stairs(stairRise, stairMax, stairTread, stairWidth), com.errorCheck),
    [stairRise, stairMax, stairTread, stairWidth, com.errorCheck]
  );

  const deckResult = useMemo(
    () =>
      safeCalc(
        () =>
          deckBoards(
            deckLength,
            deckWidth,
            deckBoardWidth,
            deckBoardLength,
            deckGap,
            deckOrientation,
            deckWaste
          ),
        com.errorCheck
      ),
    [deckLength, deckWidth, deckBoardWidth, deckBoardLength, deckGap, deckOrientation, deckWaste, com.errorCheck]
  );

  const fenceResult = useMemo(
    () =>
      safeCalc(
        () =>
          fence(
            fenceLength,
            fenceMode,
            fenceSection,
            fenceCorners,
            fenceGates,
            fenceGateWidth,
            fenceWaste,
            fenceRails
          ),
        com.errorCheck
      ),
    [fenceLength, fenceMode, fenceSection, fenceCorners, fenceGates, fenceGateWidth, fenceWaste, fenceRails, com.errorCheck]
  );

  const postHoleResult = useMemo(
    () =>
      safeCalc(
        () =>
          postHoleConcrete(
            postHoleDiameter,
            postHoleDepth,
            postHoleCount,
            postHoleShape,
            postHoleA,
            postHoleB,
            postHoleYield
          ),
        com.errorCheck
      ),
    [postHoleDiameter, postHoleDepth, postHoleCount, postHoleShape, postHoleA, postHoleB, postHoleYield, com.errorCheck]
  );

  const drywallWallArea = drywallMode === 'dimensions' ? drywallLength * drywallHeight : drywallArea;
  const drywallResult = useMemo(
    () =>
      safeCalc(
        () => drywall(drywallWallArea, drywallCeiling, drywallOpenings, drywallSheetW, drywallSheetH, drywallWaste),
        com.errorCheck
      ),
    [drywallWallArea, drywallCeiling, drywallOpenings, drywallSheetW, drywallSheetH, drywallWaste, com.errorCheck]
  );

  const paverBaseArea = paverMode === 'dimensions' ? paverLength * paverWidth : paverArea;
  const paverResult = useMemo(
    () => safeCalc(() => pavers(paverBaseArea, paverL, paverW, paverWaste, paverPallet), com.errorCheck),
    [paverBaseArea, paverL, paverW, paverWaste, paverPallet, com.errorCheck]
  );

  const polyBaseArea = polyMode === 'dimensions' ? polyLength * polyWidth : polyArea;
  const polyResult = useMemo(
    () =>
      safeCalc(
        () =>
          polymericSand(
            polyBaseArea,
            polyPaverL,
            polyPaverW,
            polyJointW,
            polyDepth,
            polyDensity,
            polyBag,
            polyWaste
          ),
        com.errorCheck
      ),
    [polyBaseArea, polyPaverL, polyPaverW, polyJointW, polyDepth, polyDensity, polyBag, polyWaste, com.errorCheck]
  );

  const mulchBaseArea =
    mulchShape === 'circle' && mulchMode === 'dimensions'
      ? Math.PI * (mulchLength / 2) ** 2
      : mulchMode === 'dimensions'
      ? mulchLength * mulchWidth
      : mulchArea;
  const mulchResult = useMemo(
    () => safeCalc(() => landscapeVolume(mulchBaseArea, mulchDepth), com.errorCheck),
    [mulchBaseArea, mulchDepth, com.errorCheck]
  );

  const topsoilBaseArea = topsoilMode === 'dimensions' ? topsoilLength * topsoilWidth : topsoilArea;
  const topsoilResult = useMemo(
    () => safeCalc(() => landscapeVolume(topsoilBaseArea, topsoilDepth), com.errorCheck),
    [topsoilBaseArea, topsoilDepth, com.errorCheck]
  );

  const fertilizerResult = useMemo(
    () =>
      safeCalc(
        () =>
          calculateFertilizer({
            area: fertArea,
            areaUnit: fertAreaUnit,
            rate: fertRate,
            rateUnit: fertRateUnit,
            nutrient: fertNutrient,
            npk: { n: fertN, p2o5: fertP, k2o: fertK },
            ...(fertBag ? { bagWeightLb: fertBag } : {}),
          }),
        com.errorCheck
      ),
    [fertArea, fertAreaUnit, fertRate, fertRateUnit, fertNutrient, fertN, fertP, fertK, fertBag, com.errorCheck]
  );

  // Reset handlers
  const handleReset = () => {
    switch (slug) {
      case 'roof-pitch-calculator':
        setPitchRise(6);
        setPitchRun(12);
        setPitchSpan(12);
        break;
      case 'stair-stringer-calculator':
        setStairRise(108);
        setStairMax(7.75);
        setStairTread(10);
        setStairWidth(36);
        break;
      case 'deck-board-calculator':
        setDeckLength(20);
        setDeckWidth(12);
        setDeckBoardWidth(5.5);
        setDeckBoardLength(12);
        setDeckGap(0.25);
        setDeckWaste(10);
        setDeckOrientation('length');
        break;
      case 'fence-calculator':
        setFenceLength(150);
        setFenceSection(8);
        setFenceCorners(2);
        setFenceGates(1);
        setFenceGateWidth(4);
        setFenceWaste(5);
        setFenceRails(2);
        setFenceMode('panel');
        break;
      case 'post-hole-concrete-calculator':
        setPostHoleDiameter(12);
        setPostHoleDepth(36);
        setPostHoleCount(8);
        setPostHoleShape('round');
        setPostHoleA(4);
        setPostHoleB(4);
        setPostHoleYield(0.6);
        break;
      case 'drywall-calculator':
        setDrywallMode('dimensions');
        setDrywallLength(40);
        setDrywallHeight(8);
        setDrywallArea(320);
        setDrywallCeiling(0);
        setDrywallOpenings(40);
        setDrywallSheetW(4);
        setDrywallSheetH(8);
        setDrywallWaste(10);
        break;
      case 'paver-calculator':
        setPaverMode('dimensions');
        setPaverLength(10);
        setPaverWidth(10);
        setPaverArea(100);
        setPaverL(8);
        setPaverW(4);
        setPaverWaste(10);
        setPaverPallet(480);
        break;
      case 'polymeric-sand-calculator':
        setPolyMode('dimensions');
        setPolyLength(10);
        setPolyWidth(10);
        setPolyArea(100);
        setPolyPaverL(8);
        setPolyPaverW(4);
        setPolyJointW(0.25);
        setPolyDepth(1.5);
        setPolyDensity(100);
        setPolyBag(40);
        setPolyWaste(10);
        break;
      case 'mulch-calculator':
        setMulchMode('dimensions');
        setMulchLength(10);
        setMulchWidth(10);
        setMulchArea(100);
        setMulchShape('rectangle');
        setMulchDepth(3);
        setMulchBag(2);
        break;
      case 'topsoil-calculator':
        setTopsoilMode('dimensions');
        setTopsoilLength(10);
        setTopsoilWidth(10);
        setTopsoilArea(100);
        setTopsoilDepth(3);
        setTopsoilDensity(75);
        break;
      case 'fertilizer-calculator':
        setFertArea(5000);
        setFertAreaUnit('sqft');
        setFertRate(1);
        setFertRateUnit('per-1000-sqft');
        setFertNutrient('n');
        setFertN(26);
        setFertP(5);
        setFertK(10);
        setFertBag(40);
        break;
    }
  };

  // Build Results Array for current tool
  let currentResults: Array<[string, string]> = [];
  let currentError = '';

  if (slug === 'roof-pitch-calculator') {
    currentError = pitchResult.error;
    const r = pitchResult.data;
    if (r) {
      currentResults = [
        [c.roofPitch.pitch, `${format(r.pitch12)}:12`],
        [c.roofPitch.angle, `${format(r.angle, 3)}°`],
        [c.roofPitch.slope, `${format(r.percent)}%`],
        [c.roofPitch.multiplier, format(r.multiplier, 4)],
        [c.roofPitch.rafterLength, `${format(r.rafterLength ?? 0)} ft`],
      ];
    }
  } else if (slug === 'stair-stringer-calculator') {
    currentError = stairResult.error;
    const r = stairResult.data;
    if (r) {
      currentResults = [
        [c.stairStringer.risers, format(r.risers, 0)],
        [c.stairStringer.actualRiser, `${format(r.actualRiser)} in`],
        [c.stairStringer.treads, format(r.treads, 0)],
        [c.stairStringer.totalRun, `${format(r.totalRun)} in`],
        [c.stairStringer.stringerLength, `${format(r.stringerLength)} in`],
        [c.stairStringer.angle, `${format(r.angle)}°`],
      ];
    }
  } else if (slug === 'deck-board-calculator') {
    currentError = deckResult.error;
    const r = deckResult.data;
    if (r) {
      currentResults = [
        [c.deckBoard.rows, format(r.rows, 0)],
        [c.deckBoard.exactStockEquivalent, format(r.exactStockEquivalent)],
        [c.deckBoard.piecesPerRow, format(r.piecesPerRow, 0)],
        [c.deckBoard.base, format(r.base, 0)],
        [c.deckBoard.adjustedBoards, format(r.adjustedBoards)],
        [c.deckBoard.required, format(r.required, 0)],
        [c.deckBoard.linearFeet, format(r.linearFeet)],
        [c.deckBoard.coverage, `${format(r.coverage)} ft²`],
      ];
    }
  } else if (slug === 'fence-calculator') {
    currentError = fenceResult.error;
    const r = fenceResult.data;
    if (r) {
      currentResults = [
        [c.fence.net, `${format(r.net)} ft`],
        [c.fence.sections, format(r.sections, 0)],
        [c.fence.adjustedPanels, fenceMode === 'panel' ? format(r.adjustedPanels) : '—'],
        [c.fence.panels, fenceMode === 'panel' ? format(r.panels, 0) : '—'],
        [c.fence.posts, format(r.posts, 0)],
        [c.fence.linePosts, format(r.linePosts, 0)],
        [c.fence.cornerEnd, format(r.cornerEnd, 0)],
        [c.fence.railsResult, format(r.rails, 0)],
      ];
    }
  } else if (slug === 'post-hole-concrete-calculator') {
    currentError = postHoleResult.error;
    const r = postHoleResult.data;
    if (r) {
      currentResults = [
        [c.postHole.perHole, `${format(r.perHole, 3)} ft³`],
        [c.postHole.displacement, `${format(r.displacement, 3)} ft³`],
        [c.postHole.ft3, `${format(r.ft3, 3)} ft³`],
        [c.postHole.yd3, `${format(r.yd3, 3)} yd³`],
        [c.postHole.bags, format(r.bags, 0)],
      ];
    }
  } else if (slug === 'drywall-calculator') {
    currentError = drywallResult.error;
    const r = drywallResult.data;
    if (r) {
      currentResults = [
        [c.drywall.gross, `${format(r.gross)} ft²`],
        [c.drywall.net, `${format(r.net)} ft²`],
        [c.drywall.adjusted, `${format(r.adjusted)} ft²`],
        [c.drywall.exactBaseSheets, format(r.exactBaseSheets)],
        [c.drywall.exactAdjustedSheets, format(r.exactAdjustedSheets)],
        [c.drywall.sheets, format(r.sheets, 0)],
        [c.drywall.screws, format(r.screws, 0)],
        [c.drywall.tapeFt, `${format(r.tapeFt, 0)} ft`],
        [c.drywall.compoundGallons, `${format(r.compoundGallons)} gal`],
      ];
    }
  } else if (slug === 'paver-calculator') {
    currentError = paverResult.error;
    const r = paverResult.data;
    if (r) {
      currentResults = [
        [c.paver.netArea, `${format(r.areaFt2)} ft²`],
        [c.paver.each, `${format(r.each, 4)} ft²`],
        [c.paver.exactBase, format(r.exactBase)],
        [c.paver.base, format(r.base, 0)],
        [c.paver.adjustedCount, format(r.adjustedCount)],
        [c.paver.count, format(r.count, 0)],
        [c.paver.wastePavers, format(r.wastePavers, 0)],
        [c.paver.pallets, r.pallets != null ? format(r.pallets, 0) : '—'],
      ];
    }
  } else if (slug === 'polymeric-sand-calculator') {
    currentError = polyResult.error;
    const r = polyResult.data;
    if (r) {
      currentResults = [
        [c.polymericSand.volumeFt3, `${format(r.volumeFt3, 3)} ft³`],
        [c.polymericSand.baseWeight, `${format(r.baseWeight)} lb`],
        [c.polymericSand.adjustedWeight, `${format(r.adjustedWeight)} lb`],
        [c.polymericSand.exactBags, format(r.exactBags)],
        [c.polymericSand.bags, format(r.bags, 0)],
      ];
    }
  } else if (slug === 'mulch-calculator') {
    currentError = mulchResult.error;
    const r = mulchResult.data;
    if (r) {
      currentResults = [
        [c.mulch.bedArea, `${format(mulchBaseArea)} ft²`],
        [c.mulch.volume, `${format(r.ft3)} ft³`],
        [c.mulch.yd3, `${format(r.yd3, 3)} yd³`],
        [c.mulch.liters, `${format(r.liters)} L`],
        [c.mulch.bags, format(Math.ceil(r.ft3 / mulchBag), 0)],
      ];
    }
  } else if (slug === 'topsoil-calculator') {
    currentError = topsoilResult.error;
    const r = topsoilResult.data;
    if (r) {
      currentResults = [
        [c.topsoil.volume, `${format(r.ft3)} ft³`],
        [c.topsoil.yd3, `${format(r.yd3, 3)} yd³`],
        [c.topsoil.m3, `${format(r.m3, 3)} m³`],
        [c.topsoil.tons, `${format((r.ft3 * topsoilDensity) / 2000)} t`],
      ];
    }
  } else if (slug === 'fertilizer-calculator') {
    currentError = fertilizerResult.error;
    const r = fertilizerResult.data;
    if (r) {
      currentResults = [
        [c.fertilizer.productFullArea, `${format(r.totalProductLb)} lb`],
        [c.fertilizer.nitrogenFullArea, `${format(r.nutrientsForArea.n)} lb`],
        [c.fertilizer.phosphateFullArea, `${format(r.nutrientsForArea.p2o5)} lb`],
        [c.fertilizer.potashFullArea, `${format(r.nutrientsForArea.k2o)} lb`],
        ...(r.bagCoverageSqFt !== null
          ? [[c.fertilizer.coveragePerBag, `${format(r.bagCoverageSqFt)} sq ft`] as [string, string]]
          : []),
        ...(r.exactBags !== null && r.wholeBags !== null
          ? [[c.fertilizer.bagsForArea, `${format(r.exactBags)} ${c.fertilizer.exactBags} · ${r.wholeBags} ${c.fertilizer.wholeBags}`] as [string, string]]
          : []),
      ];
    }
  }

  const activeSummary = `${d.tools[slug].title}\n${currentResults.map(([k, v]) => `${k}: ${v}`).join('\n')}`;
  const csvRows = currentResults.length
    ? `\uFEFF${currentResults.map(([k, v]) => `"${k}","${v}"`).join('\n')}`
    : '';
  const csvName = `${slug}-materials.csv`;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Controls Card */}
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
        <div className="flex items-center gap-2">
          <Hammer className="size-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl font-bold">
            {slug === 'roof-pitch-calculator' && c.roofPitch.heading}
            {slug === 'stair-stringer-calculator' && c.stairStringer.heading}
            {slug === 'deck-board-calculator' && c.deckBoard.heading}
            {slug === 'fence-calculator' && c.fence.heading}
            {slug === 'post-hole-concrete-calculator' && c.postHole.heading}
            {slug === 'drywall-calculator' && c.drywall.heading}
            {slug === 'paver-calculator' && c.paver.heading}
            {slug === 'polymeric-sand-calculator' && c.polymericSand.heading}
            {slug === 'mulch-calculator' && c.mulch.heading}
            {slug === 'topsoil-calculator' && c.topsoil.heading}
            {slug === 'fertilizer-calculator' && c.fertilizer.heading}
          </h2>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {/* 1. Roof Pitch Inputs */}
          {slug === 'roof-pitch-calculator' && (
            <>
              <label className="text-sm font-semibold">
                {c.roofPitch.rise}
                <input
                  aria-label={c.roofPitch.rise}
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={pitchRise}
                  onChange={(e) => setPitchRise(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {c.roofPitch.run}
                <input
                  aria-label={c.roofPitch.run}
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={pitchRun}
                  onChange={(e) => setPitchRun(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold sm:col-span-2">
                {c.roofPitch.span}
                <input
                  aria-label={c.roofPitch.span}
                  type="number"
                  min="0"
                  step="0.1"
                  value={pitchSpan}
                  onChange={(e) => setPitchSpan(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
            </>
          )}

          {/* 2. Stair Stringer Inputs */}
          {slug === 'stair-stringer-calculator' && (
            <>
              <label className="text-sm font-semibold">
                {c.stairStringer.rise}
                <input
                  aria-label={c.stairStringer.rise}
                  type="number"
                  min="1"
                  step="0.1"
                  value={stairRise}
                  onChange={(e) => setStairRise(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {c.stairStringer.max}
                <input
                  aria-label={c.stairStringer.max}
                  type="number"
                  min="1"
                  step="0.1"
                  value={stairMax}
                  onChange={(e) => setStairMax(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {c.stairStringer.tread}
                <input
                  aria-label={c.stairStringer.tread}
                  type="number"
                  min="1"
                  step="0.1"
                  value={stairTread}
                  onChange={(e) => setStairTread(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {c.stairStringer.width}
                <input
                  aria-label={c.stairStringer.width}
                  type="number"
                  min="0"
                  step="0.1"
                  value={stairWidth}
                  onChange={(e) => setStairWidth(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
            </>
          )}

          {/* 3. Deck Board Inputs */}
          {slug === 'deck-board-calculator' && (
            <>
              <label className="text-sm font-semibold">
                {c.deckBoard.length}
                <input
                  aria-label={c.deckBoard.length}
                  type="number"
                  min="1"
                  step="0.1"
                  value={deckLength}
                  onChange={(e) => setDeckLength(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {c.deckBoard.width}
                <input
                  aria-label={c.deckBoard.width}
                  type="number"
                  min="1"
                  step="0.1"
                  value={deckWidth}
                  onChange={(e) => setDeckWidth(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {c.deckBoard.boardWidth}
                <input
                  aria-label={c.deckBoard.boardWidth}
                  type="number"
                  min="0.5"
                  step="0.1"
                  value={deckBoardWidth}
                  onChange={(e) => setDeckBoardWidth(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {c.deckBoard.boardLength}
                <input
                  aria-label={c.deckBoard.boardLength}
                  type="number"
                  min="1"
                  step="0.1"
                  value={deckBoardLength}
                  onChange={(e) => setDeckBoardLength(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {c.deckBoard.gap}
                <input
                  aria-label={c.deckBoard.gap}
                  type="number"
                  min="0"
                  step="0.05"
                  value={deckGap}
                  onChange={(e) => setDeckGap(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {c.deckBoard.waste}
                <input
                  aria-label={c.deckBoard.waste}
                  type="number"
                  min="0"
                  step="1"
                  value={deckWaste}
                  onChange={(e) => setDeckWaste(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold sm:col-span-2">
                {c.deckBoard.orientation}
                <select
                  value={deckOrientation}
                  onChange={(e) => setDeckOrientation(e.target.value as 'length' | 'width')}
                  className={fieldClass}
                >
                  <option value="length">{c.deckBoard.orientationLength}</option>
                  <option value="width">{c.deckBoard.orientationWidth}</option>
                </select>
              </label>
            </>
          )}

          {/* 4. Fence Inputs */}
          {slug === 'fence-calculator' && (
            <>
              <label className="text-sm font-semibold sm:col-span-2">
                {c.fence.length}
                <input
                  aria-label={c.fence.length}
                  type="number"
                  min="1"
                  step="1"
                  value={fenceLength}
                  onChange={(e) => setFenceLength(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold sm:col-span-2">
                {c.fence.mode}
                <select
                  value={fenceMode}
                  onChange={(e) => setFenceMode(e.target.value as 'panel' | 'spacing')}
                  className={fieldClass}
                >
                  <option value="panel">{c.fence.modePanel}</option>
                  <option value="spacing">{c.fence.modeSpacing}</option>
                </select>
              </label>
              <label className="text-sm font-semibold">
                {fenceMode === 'panel' ? c.fence.sectionPanel : c.fence.sectionSpacing}
                <input
                  aria-label={fenceMode === 'panel' ? c.fence.sectionPanel : c.fence.sectionSpacing}
                  type="number"
                  min="1"
                  step="0.5"
                  value={fenceSection}
                  onChange={(e) => setFenceSection(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {c.fence.corners}
                <input
                  aria-label={c.fence.corners}
                  type="number"
                  min="0"
                  step="1"
                  value={fenceCorners}
                  onChange={(e) => setFenceCorners(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {c.fence.gates}
                <input
                  aria-label={c.fence.gates}
                  type="number"
                  min="0"
                  step="1"
                  value={fenceGates}
                  onChange={(e) => setFenceGates(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {c.fence.gateWidth}
                <input
                  aria-label={c.fence.gateWidth}
                  type="number"
                  min="0"
                  step="0.5"
                  value={fenceGateWidth}
                  onChange={(e) => setFenceGateWidth(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {c.fence.waste}
                <input
                  aria-label={c.fence.waste}
                  type="number"
                  min="0"
                  step="1"
                  value={fenceWaste}
                  onChange={(e) => setFenceWaste(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {c.fence.rails}
                <input
                  aria-label={c.fence.rails}
                  type="number"
                  min="0"
                  step="1"
                  value={fenceRails}
                  onChange={(e) => setFenceRails(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
            </>
          )}

          {/* 5. Post Hole Concrete Inputs */}
          {slug === 'post-hole-concrete-calculator' && (
            <>
              <label className="text-sm font-semibold">
                {c.postHole.diameter}
                <input
                  aria-label={c.postHole.diameter}
                  type="number"
                  min="1"
                  step="0.5"
                  value={postHoleDiameter}
                  onChange={(e) => setPostHoleDiameter(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {c.postHole.depth}
                <input
                  aria-label={c.postHole.depth}
                  type="number"
                  min="1"
                  step="1"
                  value={postHoleDepth}
                  onChange={(e) => setPostHoleDepth(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {c.postHole.count}
                <input
                  aria-label={c.postHole.count}
                  type="number"
                  min="1"
                  step="1"
                  value={postHoleCount}
                  onChange={(e) => setPostHoleCount(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {c.postHole.shape}
                <select
                  value={postHoleShape}
                  onChange={(e) => setPostHoleShape(e.target.value as 'round' | 'rectangle')}
                  className={fieldClass}
                >
                  <option value="round">{c.postHole.shapeRound}</option>
                  <option value="rectangle">{c.postHole.shapeRect}</option>
                </select>
              </label>
              <label className="text-sm font-semibold">
                {postHoleShape === 'round' ? c.postHole.postDiameter : c.postHole.postWidth}
                <input
                  aria-label={postHoleShape === 'round' ? c.postHole.postDiameter : c.postHole.postWidth}
                  type="number"
                  min="0.1"
                  step="0.5"
                  value={postHoleA}
                  onChange={(e) => setPostHoleA(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              {postHoleShape === 'rectangle' && (
                <label className="text-sm font-semibold">
                  {c.postHole.postThickness}
                  <input
                    aria-label={c.postHole.postThickness}
                    type="number"
                    min="0.1"
                    step="0.5"
                    value={postHoleB}
                    onChange={(e) => setPostHoleB(Number(e.target.value))}
                    className={fieldClass}
                  />
                </label>
              )}
              <label className="text-sm font-semibold sm:col-span-2">
                {c.postHole.yieldFt}
                <input
                  aria-label={c.postHole.yieldFt}
                  type="number"
                  min="0.1"
                  step="0.05"
                  value={postHoleYield}
                  onChange={(e) => setPostHoleYield(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
            </>
          )}

          {/* 6. Drywall Inputs */}
          {slug === 'drywall-calculator' && (
            <>
              <label className="text-sm font-semibold sm:col-span-2">
                {c.drywall.mode}
                <select
                  value={drywallMode}
                  onChange={(e) => setDrywallMode(e.target.value as 'dimensions' | 'area')}
                  className={fieldClass}
                >
                  <option value="dimensions">{c.drywall.modeDimensions}</option>
                  <option value="area">{c.drywall.modeArea}</option>
                </select>
              </label>
              {drywallMode === 'dimensions' ? (
                <>
                  <label className="text-sm font-semibold">
                    {c.drywall.length}
                    <input
                      aria-label={c.drywall.length}
                      type="number"
                      min="1"
                      step="1"
                      value={drywallLength}
                      onChange={(e) => setDrywallLength(Number(e.target.value))}
                      className={fieldClass}
                    />
                  </label>
                  <label className="text-sm font-semibold">
                    {c.drywall.height}
                    <input
                      aria-label={c.drywall.height}
                      type="number"
                      min="1"
                      step="0.5"
                      value={drywallHeight}
                      onChange={(e) => setDrywallHeight(Number(e.target.value))}
                      className={fieldClass}
                    />
                  </label>
                </>
              ) : (
                <label className="text-sm font-semibold sm:col-span-2">
                  {c.drywall.area}
                  <input
                    aria-label={c.drywall.area}
                    type="number"
                    min="1"
                    step="1"
                    value={drywallArea}
                    onChange={(e) => setDrywallArea(Number(e.target.value))}
                    className={fieldClass}
                  />
                </label>
              )}
              <label className="text-sm font-semibold">
                {c.drywall.ceiling}
                <input
                  aria-label={c.drywall.ceiling}
                  type="number"
                  min="0"
                  step="1"
                  value={drywallCeiling}
                  onChange={(e) => setDrywallCeiling(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {c.drywall.openings}
                <input
                  aria-label={c.drywall.openings}
                  type="number"
                  min="0"
                  step="1"
                  value={drywallOpenings}
                  onChange={(e) => setDrywallOpenings(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {c.drywall.sheetW}
                <input
                  aria-label={c.drywall.sheetW}
                  type="number"
                  min="1"
                  step="0.5"
                  value={drywallSheetW}
                  onChange={(e) => setDrywallSheetW(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {c.drywall.sheetH}
                <input
                  aria-label={c.drywall.sheetH}
                  type="number"
                  min="1"
                  step="0.5"
                  value={drywallSheetH}
                  onChange={(e) => setDrywallSheetH(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold sm:col-span-2">
                {c.drywall.waste}
                <input
                  aria-label={c.drywall.waste}
                  type="number"
                  min="0"
                  step="1"
                  value={drywallWaste}
                  onChange={(e) => setDrywallWaste(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
            </>
          )}

          {/* 7. Paver Inputs */}
          {slug === 'paver-calculator' && (
            <>
              <label className="text-sm font-semibold sm:col-span-2">
                {com.projectInput}
                <select
                  value={paverMode}
                  onChange={(e) => setPaverMode(e.target.value as 'dimensions' | 'area')}
                  className={fieldClass}
                >
                  <option value="dimensions">{com.modeDimensions}</option>
                  <option value="area">{com.modeArea}</option>
                </select>
              </label>
              {paverMode === 'dimensions' ? (
                <>
                  <label className="text-sm font-semibold">
                    {c.paver.length}
                    <input
                      aria-label={c.paver.length}
                      type="number"
                      min="1"
                      step="0.5"
                      value={paverLength}
                      onChange={(e) => setPaverLength(Number(e.target.value))}
                      className={fieldClass}
                    />
                  </label>
                  <label className="text-sm font-semibold">
                    {c.paver.width}
                    <input
                      aria-label={c.paver.width}
                      type="number"
                      min="1"
                      step="0.5"
                      value={paverWidth}
                      onChange={(e) => setPaverWidth(Number(e.target.value))}
                      className={fieldClass}
                    />
                  </label>
                </>
              ) : (
                <label className="text-sm font-semibold sm:col-span-2">
                  {c.paver.area}
                  <input
                    aria-label={c.paver.area}
                    type="number"
                    min="1"
                    step="1"
                    value={paverArea}
                    onChange={(e) => setPaverArea(Number(e.target.value))}
                    className={fieldClass}
                  />
                </label>
              )}
              <label className="text-sm font-semibold">
                {c.paver.paverL}
                <input
                  aria-label={c.paver.paverL}
                  type="number"
                  min="1"
                  step="0.5"
                  value={paverL}
                  onChange={(e) => setPaverL(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {c.paver.paverW}
                <input
                  aria-label={c.paver.paverW}
                  type="number"
                  min="1"
                  step="0.5"
                  value={paverW}
                  onChange={(e) => setPaverW(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {c.paver.waste}
                <input
                  aria-label={c.paver.waste}
                  type="number"
                  min="0"
                  step="1"
                  value={paverWaste}
                  onChange={(e) => setPaverWaste(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {c.paver.pallet}
                <input
                  aria-label={c.paver.pallet}
                  type="number"
                  min="1"
                  step="1"
                  value={paverPallet}
                  onChange={(e) => setPaverPallet(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
            </>
          )}

          {/* 8. Polymeric Sand Inputs */}
          {slug === 'polymeric-sand-calculator' && (
            <>
              <label className="text-sm font-semibold sm:col-span-2">
                {com.projectInput}
                <select
                  value={polyMode}
                  onChange={(e) => setPolyMode(e.target.value as 'dimensions' | 'area')}
                  className={fieldClass}
                >
                  <option value="dimensions">{com.modeDimensions}</option>
                  <option value="area">{com.modeArea}</option>
                </select>
              </label>
              {polyMode === 'dimensions' ? (
                <>
                  <label className="text-sm font-semibold">
                    {c.polymericSand.length}
                    <input
                      aria-label={c.polymericSand.length}
                      type="number"
                      min="1"
                      step="0.5"
                      value={polyLength}
                      onChange={(e) => setPolyLength(Number(e.target.value))}
                      className={fieldClass}
                    />
                  </label>
                  <label className="text-sm font-semibold">
                    {c.polymericSand.width}
                    <input
                      aria-label={c.polymericSand.width}
                      type="number"
                      min="1"
                      step="0.5"
                      value={polyWidth}
                      onChange={(e) => setPolyWidth(Number(e.target.value))}
                      className={fieldClass}
                    />
                  </label>
                </>
              ) : (
                <label className="text-sm font-semibold sm:col-span-2">
                  {c.polymericSand.area}
                  <input
                    aria-label={c.polymericSand.area}
                    type="number"
                    min="1"
                    step="1"
                    value={polyArea}
                    onChange={(e) => setPolyArea(Number(e.target.value))}
                    className={fieldClass}
                  />
                </label>
              )}
              <label className="text-sm font-semibold">
                {c.polymericSand.paverL}
                <input
                  aria-label={c.polymericSand.paverL}
                  type="number"
                  min="1"
                  step="0.5"
                  value={polyPaverL}
                  onChange={(e) => setPolyPaverL(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {c.polymericSand.paverW}
                <input
                  aria-label={c.polymericSand.paverW}
                  type="number"
                  min="1"
                  step="0.5"
                  value={polyPaverW}
                  onChange={(e) => setPolyPaverW(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {c.polymericSand.jointW}
                <input
                  aria-label={c.polymericSand.jointW}
                  type="number"
                  min="0.05"
                  step="0.05"
                  value={polyJointW}
                  onChange={(e) => setPolyJointW(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {c.polymericSand.depth}
                <input
                  aria-label={c.polymericSand.depth}
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={polyDepth}
                  onChange={(e) => setPolyDepth(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {c.polymericSand.density}
                <input
                  aria-label={c.polymericSand.density}
                  type="number"
                  min="1"
                  step="1"
                  value={polyDensity}
                  onChange={(e) => setPolyDensity(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {c.polymericSand.bag}
                <input
                  aria-label={c.polymericSand.bag}
                  type="number"
                  min="1"
                  step="1"
                  value={polyBag}
                  onChange={(e) => setPolyBag(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold sm:col-span-2">
                {c.polymericSand.waste}
                <input
                  aria-label={c.polymericSand.waste}
                  type="number"
                  min="0"
                  step="1"
                  value={polyWaste}
                  onChange={(e) => setPolyWaste(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
            </>
          )}

          {/* 9. Mulch Inputs */}
          {slug === 'mulch-calculator' && (
            <>
              <label className="text-sm font-semibold sm:col-span-2">
                {c.mulch.shape}
                <select
                  value={mulchShape}
                  onChange={(e) => setMulchShape(e.target.value as 'rectangle' | 'circle')}
                  className={fieldClass}
                >
                  <option value="rectangle">{c.mulch.shapeRectangle}</option>
                  <option value="circle">{c.mulch.shapeCircle}</option>
                </select>
              </label>
              <label className="text-sm font-semibold sm:col-span-2">
                {com.projectInput}
                <select
                  value={mulchMode}
                  onChange={(e) => setMulchMode(e.target.value as 'dimensions' | 'area')}
                  className={fieldClass}
                >
                  <option value="dimensions">{com.modeDimensions}</option>
                  <option value="area">{com.modeArea}</option>
                </select>
              </label>
              {mulchMode === 'dimensions' ? (
                <>
                  <label className="text-sm font-semibold">
                    {c.mulch.length}
                    <input
                      aria-label={c.mulch.length}
                      type="number"
                      min="1"
                      step="0.5"
                      value={mulchLength}
                      onChange={(e) => setMulchLength(Number(e.target.value))}
                      className={fieldClass}
                    />
                  </label>
                  {mulchShape === 'rectangle' && (
                    <label className="text-sm font-semibold">
                      {c.mulch.width}
                      <input
                        aria-label={c.mulch.width}
                        type="number"
                        min="1"
                        step="0.5"
                        value={mulchWidth}
                        onChange={(e) => setMulchWidth(Number(e.target.value))}
                        className={fieldClass}
                      />
                    </label>
                  )}
                </>
              ) : (
                <label className="text-sm font-semibold sm:col-span-2">
                  {c.mulch.area}
                  <input
                    aria-label={c.mulch.area}
                    type="number"
                    min="1"
                    step="1"
                    value={mulchArea}
                    onChange={(e) => setMulchArea(Number(e.target.value))}
                    className={fieldClass}
                  />
                </label>
              )}
              <label className="text-sm font-semibold">
                {c.mulch.depth}
                <input
                  aria-label={c.mulch.depth}
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={mulchDepth}
                  onChange={(e) => setMulchDepth(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {c.mulch.bag}
                <input
                  aria-label={c.mulch.bag}
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={mulchBag}
                  onChange={(e) => setMulchBag(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
            </>
          )}

          {/* 10. Topsoil Inputs */}
          {slug === 'topsoil-calculator' && (
            <>
              <label className="text-sm font-semibold sm:col-span-2">
                {com.projectInput}
                <select
                  value={topsoilMode}
                  onChange={(e) => setTopsoilMode(e.target.value as 'dimensions' | 'area')}
                  className={fieldClass}
                >
                  <option value="dimensions">{com.modeDimensions}</option>
                  <option value="area">{com.modeArea}</option>
                </select>
              </label>
              {topsoilMode === 'dimensions' ? (
                <>
                  <label className="text-sm font-semibold">
                    {c.topsoil.length}
                    <input
                      aria-label={c.topsoil.length}
                      type="number"
                      min="1"
                      step="0.5"
                      value={topsoilLength}
                      onChange={(e) => setTopsoilLength(Number(e.target.value))}
                      className={fieldClass}
                    />
                  </label>
                  <label className="text-sm font-semibold">
                    {c.topsoil.width}
                    <input
                      aria-label={c.topsoil.width}
                      type="number"
                      min="1"
                      step="0.5"
                      value={topsoilWidth}
                      onChange={(e) => setTopsoilWidth(Number(e.target.value))}
                      className={fieldClass}
                    />
                  </label>
                </>
              ) : (
                <label className="text-sm font-semibold sm:col-span-2">
                  {c.topsoil.area}
                  <input
                    aria-label={c.topsoil.area}
                    type="number"
                    min="1"
                    step="1"
                    value={topsoilArea}
                    onChange={(e) => setTopsoilArea(Number(e.target.value))}
                    className={fieldClass}
                  />
                </label>
              )}
              <label className="text-sm font-semibold">
                {c.topsoil.depth}
                <input
                  aria-label={c.topsoil.depth}
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={topsoilDepth}
                  onChange={(e) => setTopsoilDepth(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {c.topsoil.density}
                <input
                  aria-label={c.topsoil.density}
                  type="number"
                  min="1"
                  step="1"
                  value={topsoilDensity}
                  onChange={(e) => setTopsoilDensity(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
            </>
          )}

          {/* 11. Fertilizer Inputs */}
          {slug === 'fertilizer-calculator' && (
            <>
              <label className="text-sm font-semibold">
                {c.fertilizer.areaLabel}
                <input
                  aria-label={c.fertilizer.areaLabel}
                  type="number"
                  min="1"
                  step="any"
                  value={fertArea}
                  onChange={(e) => setFertArea(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {c.fertilizer.areaUnitLabel}
                <select
                  aria-label={c.fertilizer.areaUnitLabel}
                  value={fertAreaUnit}
                  onChange={(e) => setFertAreaUnit(e.target.value as FertilizerAreaUnit)}
                  className={fieldClass}
                >
                  <option value="sqft">{c.fertilizer.unitSqFt}</option>
                  <option value="acre">{c.fertilizer.unitAcre}</option>
                </select>
              </label>
              <label className="text-sm font-semibold">
                {c.fertilizer.rateLabel}
                <input
                  aria-label={c.fertilizer.rateLabel}
                  type="number"
                  min="0.01"
                  step="any"
                  value={fertRate}
                  onChange={(e) => setFertRate(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                {c.fertilizer.rateUnitLabel}
                <select
                  aria-label={c.fertilizer.rateUnitLabel}
                  value={fertRateUnit}
                  onChange={(e) => setFertRateUnit(e.target.value as FertilizerRateUnit)}
                  className={fieldClass}
                >
                  <option value="per-1000-sqft">{c.fertilizer.ratePer1000}</option>
                  <option value="per-acre">{c.fertilizer.ratePerAcre}</option>
                </select>
              </label>
              <label className="text-sm font-semibold">
                {c.fertilizer.nutrientLabel}
                <select
                  aria-label={c.fertilizer.nutrientLabel}
                  value={fertNutrient}
                  onChange={(e) => setFertNutrient(e.target.value as FertilizerNutrient)}
                  className={fieldClass}
                >
                  <option value="n">{c.fertilizer.nutrientN}</option>
                  <option value="p2o5">{c.fertilizer.nutrientP}</option>
                  <option value="k2o">{c.fertilizer.nutrientK}</option>
                </select>
              </label>
              <label className="text-sm font-semibold">
                {c.fertilizer.bagWeightLabel}
                <input
                  aria-label={c.fertilizer.bagWeightLabel}
                  type="number"
                  min="0"
                  step="any"
                  value={fertBag}
                  onChange={(e) => setFertBag(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
              <div className="sm:col-span-2 rounded-2xl border border-[var(--border)] p-4">
                <p className="text-sm font-bold">{c.fertilizer.npkLegend}</p>
                <p className="text-xs text-[var(--muted-foreground)] mb-3">{c.fertilizer.npkHint}</p>
                <div className="grid grid-cols-3 gap-3">
                  <label className="text-xs font-semibold">
                    {c.fertilizer.nitrogenLabel}
                    <input
                      aria-label={c.fertilizer.nitrogenLabel}
                      type="number"
                      min="0"
                      max="100"
                      step="any"
                      value={fertN}
                      onChange={(e) => setFertN(Number(e.target.value))}
                      className={fieldClass}
                    />
                  </label>
                  <label className="text-xs font-semibold">
                    {c.fertilizer.phosphateLabel}
                    <input
                      aria-label={c.fertilizer.phosphateLabel}
                      type="number"
                      min="0"
                      max="100"
                      step="any"
                      value={fertP}
                      onChange={(e) => setFertP(Number(e.target.value))}
                      className={fieldClass}
                    />
                  </label>
                  <label className="text-xs font-semibold">
                    {c.fertilizer.potashLabel}
                    <input
                      aria-label={c.fertilizer.potashLabel}
                      type="number"
                      min="0"
                      max="100"
                      step="any"
                      value={fertK}
                      onChange={(e) => setFertK(Number(e.target.value))}
                      className={fieldClass}
                    />
                  </label>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={handleReset} className={buttonClass}>
            {ui.reset}
          </button>
        </div>

        {/* Informational Notes */}
        <p className="mt-4 text-xs text-[var(--muted-foreground)]">
          {slug === 'roof-pitch-calculator' && c.roofPitch.note}
          {slug === 'stair-stringer-calculator' && c.stairStringer.note}
          {slug === 'deck-board-calculator' && c.deckBoard.note}
          {slug === 'fence-calculator' && c.fence.note}
          {slug === 'drywall-calculator' && c.drywall.note}
          {slug === 'polymeric-sand-calculator' && c.polymericSand.note}
          {slug === 'topsoil-calculator' && c.topsoil.note}
          {slug === 'fertilizer-calculator' && c.fertilizer.checkBeforeApplying}
        </p>
      </section>

      {/* Results Card */}
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
        <h2 className="text-xl font-bold">{com.results}</h2>

        {currentError ? (
          <p role="alert" className="mt-4 text-sm font-semibold text-red-600">
            {currentError}
          </p>
        ) : (
          <>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {currentResults.map(([label, val]) => (
                <div key={label} className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
                  <dt className="text-xs font-semibold text-[var(--muted-foreground)]">{label}</dt>
                  <dd suppressHydrationWarning className="mt-1 text-2xl font-black">
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
