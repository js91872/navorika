'use client';

import { useMemo, useState } from 'react';
import { Hammer } from 'lucide-react';
import ResultActions from '@/components/ui/ResultActions';
import { resultActionMessages } from '@/lib/i18n/actionMessages';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';
import { fieldClass, buttonClass } from './ToolControls';
import {
  calculateCementTakeoff,
  calculatePaintTakeoff,
  calculateSandTakeoff,
  calculateSteelWeight,
  calculateTileTakeoff,
  type CubicUnit,
  type LinearUnit,
  type SteelShape,
  type TileUnit,
} from '@/lib/calculations/supplierTakeoffs';

export type TakeoffToolSlug =
  | 'cement-calculator'
  | 'sand-calculator'
  | 'paint-calculator'
  | 'tile-calculator'
  | 'steel-weight-calculator';

export default function LocalizedTakeoffTools({
  slug,
  d,
  locale,
}: {
  slug: TakeoffToolSlug;
  d: Dictionary;
  locale: Locale;
}) {
  const ui = d.ui;
  const calcUi = d.calculatorUi;
  const t = d.takeoff;
  const actionCopy = resultActionMessages[locale];

  const format = (value: number, digits = 2) =>
    Number.isFinite(value)
      ? new Intl.NumberFormat(locale, { maximumFractionDigits: digits }).format(value)
      : '—';

  // 1. Cement Calculator State
  const [wetVolume, setWetVolume] = useState(1);
  const [cementUnit, setCementUnit] = useState<CubicUnit>('m3');
  const [cementRatio, setCementRatio] = useState<'1:2:3' | '1:1.5:3' | '1:3:6'>('1:2:3');
  const [cementBagKg, setCementBagKg] = useState(50);

  // 2. Sand Calculator State
  const [sandLength, setSandLength] = useState(10);
  const [sandWidth, setSandWidth] = useState(10);
  const [sandDepth, setSandDepth] = useState(0.5);
  const [sandUnit, setSandUnit] = useState<LinearUnit>('m');
  const [sandDensity, setSandDensity] = useState(1600);
  const [sandWaste, setSandWaste] = useState(0);
  const [sandBagKg, setSandBagKg] = useState(25);
  const [sandPayloadKg, setSandPayloadKg] = useState(15000);

  // 3. Paint Calculator State
  const [paintLength, setPaintLength] = useState(10);
  const [paintWidth, setPaintWidth] = useState(10);
  const [paintHeight, setPaintHeight] = useState(3);
  const [paintUnit, setPaintUnit] = useState<LinearUnit>('m');
  const [paintOpenings, setPaintOpenings] = useState(0);
  const [paintIncludeCeiling, setPaintIncludeCeiling] = useState(true);
  const [paintCoats, setPaintCoats] = useState(2);
  const [paintCoverage, setPaintCoverage] = useState(10);
  const [paintWaste, setPaintWaste] = useState(10);
  const [paintCanLitres, setPaintCanLitres] = useState(5);

  // 4. Tile Calculator State
  const [tileProjectLength, setTileProjectLength] = useState(10);
  const [tileProjectWidth, setTileProjectWidth] = useState(10);
  const [tileProjectUnit, setTileProjectUnit] = useState<LinearUnit>('m');
  const [tilePieceLength, setTilePieceLength] = useState(60);
  const [tilePieceWidth, setTilePieceWidth] = useState(60);
  const [tilePieceUnit, setTilePieceUnit] = useState<TileUnit>('cm');
  const [tileGapMm, setTileGapMm] = useState(3);
  const [tileWaste, setTileWaste] = useState(10);
  const [tilePiecesPerBox, setTilePiecesPerBox] = useState(4);

  // 5. Steel Weight Calculator State
  const [steelShape, setSteelShape] = useState<SteelShape>('round');
  const [steelDiameter, setSteelDiameter] = useState(12);
  const [steelWidth, setSteelWidth] = useState(100);
  const [steelHeight, setSteelHeight] = useState(200);
  const [steelThickness, setSteelThickness] = useState(5);
  const [steelLength, setSteelLength] = useState(12);
  const [steelQuantity, setSteelQuantity] = useState(1);
  const [steelDensity, setSteelDensity] = useState(7850);

  // Cement Calculation
  const cementResult = useMemo(() => {
    try {
      const ratios: Record<string, readonly [number, number, number]> = {
        '1:2:3': [1, 2, 3],
        '1:1.5:3': [1, 1.5, 3],
        '1:3:6': [1, 3, 6],
      };
      const res = calculateCementTakeoff({
        wetVolume,
        unit: cementUnit,
        ratio: ratios[cementRatio],
        bagKg: cementBagKg,
      });
      return { data: res, error: '' };
    } catch {
      return { data: null, error: t.common.checkValues };
    }
  }, [wetVolume, cementUnit, cementRatio, cementBagKg, t.common.checkValues]);

  // Sand Calculation
  const sandResult = useMemo(() => {
    try {
      const res = calculateSandTakeoff({
        length: sandLength,
        width: sandWidth,
        depth: sandDepth,
        unit: sandUnit,
        densityKgM3: sandDensity,
        wastePercent: sandWaste,
        bagKg: sandBagKg,
        payloadKg: sandPayloadKg,
      });
      return { data: res, error: '' };
    } catch {
      return { data: null, error: t.common.checkValues };
    }
  }, [sandLength, sandWidth, sandDepth, sandUnit, sandDensity, sandWaste, sandBagKg, sandPayloadKg, t.common.checkValues]);

  // Paint Calculation
  const paintResult = useMemo(() => {
    try {
      const res = calculatePaintTakeoff({
        length: paintLength,
        width: paintWidth,
        height: paintHeight,
        unit: paintUnit,
        openingsArea: paintOpenings,
        includeCeiling: paintIncludeCeiling,
        coats: paintCoats,
        coverageM2L: paintCoverage,
        wastePercent: paintWaste,
        canLitres: paintCanLitres,
      });
      return { data: res, error: '' };
    } catch {
      return { data: null, error: t.common.checkValues };
    }
  }, [paintLength, paintWidth, paintHeight, paintUnit, paintOpenings, paintIncludeCeiling, paintCoats, paintCoverage, paintWaste, paintCanLitres, t.common.checkValues]);

  // Tile Calculation
  const tileResult = useMemo(() => {
    try {
      const res = calculateTileTakeoff({
        length: tileProjectLength,
        width: tileProjectWidth,
        projectUnit: tileProjectUnit,
        tileLength: tilePieceLength,
        tileWidth: tilePieceWidth,
        tileUnit: tilePieceUnit,
        gapMm: tileGapMm,
        wastePercent: tileWaste,
        tilesPerBox: tilePiecesPerBox,
      });
      return { data: res, error: '' };
    } catch {
      return { data: null, error: t.common.checkValues };
    }
  }, [tileProjectLength, tileProjectWidth, tileProjectUnit, tilePieceLength, tilePieceWidth, tilePieceUnit, tileGapMm, tileWaste, tilePiecesPerBox, t.common.checkValues]);

  // Steel Calculation
  const steelResult = useMemo(() => {
    try {
      const res = calculateSteelWeight({
        shape: steelShape,
        diameterMm: steelDiameter,
        widthMm: steelWidth,
        heightMm: steelHeight,
        thicknessMm: steelThickness,
        lengthM: steelLength,
        quantity: steelQuantity,
        densityKgM3: steelDensity,
      });
      return { data: res, error: '' };
    } catch {
      return { data: null, error: t.common.checkValues };
    }
  }, [steelShape, steelDiameter, steelWidth, steelHeight, steelThickness, steelLength, steelQuantity, steelDensity, t.common.checkValues]);

  const handleReset = () => {
    if (slug === 'cement-calculator') {
      setWetVolume(1);
      setCementUnit('m3');
      setCementRatio('1:2:3');
      setCementBagKg(50);
    } else if (slug === 'sand-calculator') {
      setSandLength(10);
      setSandWidth(10);
      setSandDepth(0.5);
      setSandUnit('m');
      setSandDensity(1600);
      setSandWaste(0);
      setSandBagKg(25);
      setSandPayloadKg(15000);
    } else if (slug === 'paint-calculator') {
      setPaintLength(10);
      setPaintWidth(10);
      setPaintHeight(3);
      setPaintUnit('m');
      setPaintOpenings(0);
      setPaintIncludeCeiling(true);
      setPaintCoats(2);
      setPaintCoverage(10);
      setPaintWaste(10);
      setPaintCanLitres(5);
    } else if (slug === 'tile-calculator') {
      setTileProjectLength(10);
      setTileProjectWidth(10);
      setTileProjectUnit('m');
      setTilePieceLength(60);
      setTilePieceWidth(60);
      setTilePieceUnit('cm');
      setTileGapMm(3);
      setTileWaste(10);
      setTilePiecesPerBox(4);
    } else if (slug === 'steel-weight-calculator') {
      setSteelShape('round');
      setSteelDiameter(12);
      setSteelWidth(100);
      setSteelHeight(200);
      setSteelThickness(5);
      setSteelLength(12);
      setSteelQuantity(1);
      setSteelDensity(7850);
    }
  };

  // Compile Result Key-Values for Cards & Actions
  let resultRows: Array<[string, string]> = [];
  let resultNote = '';
  let activeError = '';
  const toolTitle = d.tools[slug]?.title ?? slug;

  if (slug === 'cement-calculator') {
    activeError = cementResult.error;
    resultNote = t.cement.note;
    const r = cementResult.data;
    if (r) {
      resultRows = [
        [t.cement.finishedWet, `${format(r.wetVolumeM3, 3)} m³`],
        [t.cement.nominalDry, `${format(r.dryVolumeM3, 3)} m³`],
        [t.cement.cementMass, `${format(r.cementKg, 2)} kg`],
        [t.cement.exactBags, format(r.exactBags, 3)],
        [t.cement.wholeBags, format(r.bagsToBuy, 0)],
        [t.cement.sandVolume, `${format(r.sandVolumeM3, 3)} m³`],
        [t.cement.aggregateVolume, `${format(r.aggregateVolumeM3, 3)} m³`],
      ];
    }
  } else if (slug === 'sand-calculator') {
    activeError = sandResult.error;
    resultNote = t.sand.note;
    const r = sandResult.data;
    if (r) {
      resultRows = [
        [t.sand.measuredVolume, `${format(r.baseVolumeM3, 3)} m³`],
        [t.sand.adjustedVolume, `${format(r.adjustedVolumeM3, 3)} m³`],
        [t.sand.measuredMass, `${format(r.baseWeightKg, 1)} kg`],
        [t.sand.adjustedMass, `${format(r.adjustedWeightKg, 1)} kg`],
        [t.sand.exactBags, format(r.exactBags, 2)],
        [t.sand.wholeBags, format(r.bagsToBuy, 0)],
        [t.sand.exactLoads, format(r.exactLoads, 3)],
        [t.sand.wholeLoads, format(r.loadsToPlan, 0)],
      ];
    }
  } else if (slug === 'paint-calculator') {
    activeError = paintResult.error;
    resultNote = t.paint.note;
    const r = paintResult.data;
    if (r) {
      resultRows = [
        [t.paint.grossWall, `${format(r.grossWallAreaM2, 2)} m²`],
        [t.paint.openingsDeducted, `${format(r.openingsM2, 2)} m²`],
        [t.paint.ceilingArea, `${format(r.ceilingAreaM2, 2)} m²`],
        [t.paint.netOneCoat, `${format(r.netOneCoatAreaM2, 2)} m²`],
        [t.paint.coatedArea, `${format(r.coatedAreaM2, 2)} m²`],
        [t.paint.baseLitres, `${format(r.baseLitres, 2)} L`],
        [t.paint.adjustedLitres, `${format(r.adjustedLitres, 2)} L`],
        [t.paint.wholeCans, format(r.cansToBuy, 0)],
      ];
    }
  } else if (slug === 'tile-calculator') {
    activeError = tileResult.error;
    resultNote = t.tile.note;
    const r = tileResult.data;
    if (r) {
      resultRows = [
        [t.tile.projectArea, `${format(r.projectAreaM2, 2)} m²`],
        [t.tile.tileFaceArea, `${format(r.tileAreaM2, 4)} m²`],
        [t.tile.gridLength, format(r.tilesAlongLength, 0)],
        [t.tile.gridWidth, format(r.tilesAlongWidth, 0)],
        [t.tile.fittedTiles, format(r.fittedGridTiles, 0)],
        [t.tile.adjustedTiles, format(r.adjustedTiles, 2)],
        [t.tile.wholeTiles, format(r.tilesToBuy, 0)],
        [t.tile.boxesToBuy, r.boxes != null ? format(r.boxes, 0) : calcUi.notApplicable],
      ];
    }
  } else if (slug === 'steel-weight-calculator') {
    activeError = steelResult.error;
    resultNote = t.steel.note;
    const r = steelResult.data;
    if (r) {
      resultRows = [
        [t.steel.crossSectionArea, `${format(r.areaM2 * 1_000_000, 2)} mm²`],
        [t.steel.massPerMetre, `${format(r.kgPerM, 3)} kg/m`],
        [t.steel.totalLength, `${format(r.totalLengthM, 2)} m`],
        [t.steel.totalMass, `${format(r.totalKg, 2)} kg`],
      ];
    }
  }

  const activeSummary = `${toolTitle}\n${resultRows.map(([k, v]) => `${k}: ${v}`).join('\n')}`;
  const csvRows = resultRows.length
    ? `\uFEFF${resultRows.map(([k, v]) => `"${k}","${v}"`).join('\n')}`
    : '';
  const csvName = `${slug}-takeoff.csv`;

  return (
    <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,.85fr)]">
      <section className="min-w-0 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7">
        <div className="flex items-center gap-3">
          <Hammer aria-hidden="true" className="size-6 text-indigo-600" />
          <h2 className="text-xl font-bold">{t.common.inputs}</h2>
        </div>

        {/* 1. Cement Calculator Inputs */}
        {slug === 'cement-calculator' && (
          <div className="mt-6 grid min-w-0 gap-4 sm:grid-cols-2">
            <label className="min-w-0 text-sm font-semibold">
              {t.cement.wetVolume}
              <input
                type="number"
                dir="ltr"
                min="0.001"
                step="0.1"
                className={fieldClass}
                value={wetVolume}
                onChange={(e) => setWetVolume(Number(e.target.value))}
              />
            </label>
            <label className="min-w-0 text-sm font-semibold">
              {t.cement.unit}
              <select
                className={fieldClass}
                value={cementUnit}
                onChange={(e) => setCementUnit(e.target.value as CubicUnit)}
              >
                <option value="m3">{t.cement.m3}</option>
                <option value="yd3">{t.cement.yd3}</option>
                <option value="ft3">{t.cement.ft3}</option>
              </select>
            </label>
            <label className="min-w-0 text-sm font-semibold sm:col-span-2">
              {t.cement.ratio}
              <select
                className={fieldClass}
                value={cementRatio}
                onChange={(e) => setCementRatio(e.target.value as '1:2:3' | '1:1.5:3' | '1:3:6')}
              >
                <option value="1:2:3">1:2:3</option>
                <option value="1:1.5:3">1:1.5:3</option>
                <option value="1:3:6">1:3:6</option>
              </select>
            </label>
            <label className="min-w-0 text-sm font-semibold sm:col-span-2">
              {t.cement.bagKg}
              <input
                type="number"
                dir="ltr"
                min="1"
                step="1"
                className={fieldClass}
                value={cementBagKg}
                onChange={(e) => setCementBagKg(Number(e.target.value))}
              />
            </label>
          </div>
        )}

        {/* 2. Sand Calculator Inputs */}
        {slug === 'sand-calculator' && (
          <div className="mt-6 grid min-w-0 gap-4 sm:grid-cols-2">
            <label className="min-w-0 text-sm font-semibold">
              {t.sand.length}
              <input
                type="number"
                dir="ltr"
                min="0.01"
                step="0.5"
                className={fieldClass}
                value={sandLength}
                onChange={(e) => setSandLength(Number(e.target.value))}
              />
            </label>
            <label className="min-w-0 text-sm font-semibold">
              {t.sand.width}
              <input
                type="number"
                dir="ltr"
                min="0.01"
                step="0.5"
                className={fieldClass}
                value={sandWidth}
                onChange={(e) => setSandWidth(Number(e.target.value))}
              />
            </label>
            <label className="min-w-0 text-sm font-semibold">
              {t.sand.depth}
              <input
                type="number"
                dir="ltr"
                min="0.001"
                step="0.1"
                className={fieldClass}
                value={sandDepth}
                onChange={(e) => setSandDepth(Number(e.target.value))}
              />
            </label>
            <label className="min-w-0 text-sm font-semibold">
              {t.sand.unit}
              <select
                className={fieldClass}
                value={sandUnit}
                onChange={(e) => setSandUnit(e.target.value as LinearUnit)}
              >
                <option value="m">{t.sand.m}</option>
                <option value="ft">{t.sand.ft}</option>
              </select>
            </label>
            <label className="min-w-0 text-sm font-semibold">
              {t.sand.density}
              <input
                type="number"
                dir="ltr"
                min="500"
                step="50"
                className={fieldClass}
                value={sandDensity}
                onChange={(e) => setSandDensity(Number(e.target.value))}
              />
            </label>
            <label className="min-w-0 text-sm font-semibold">
              {t.sand.waste}
              <input
                type="number"
                dir="ltr"
                min="0"
                max="100"
                step="1"
                className={fieldClass}
                value={sandWaste}
                onChange={(e) => setSandWaste(Number(e.target.value))}
              />
            </label>
            <label className="min-w-0 text-sm font-semibold">
              {t.sand.bagKg}
              <input
                type="number"
                dir="ltr"
                min="1"
                step="1"
                className={fieldClass}
                value={sandBagKg}
                onChange={(e) => setSandBagKg(Number(e.target.value))}
              />
            </label>
            <label className="min-w-0 text-sm font-semibold">
              {t.sand.payloadKg}
              <input
                type="number"
                dir="ltr"
                min="500"
                step="500"
                className={fieldClass}
                value={sandPayloadKg}
                onChange={(e) => setSandPayloadKg(Number(e.target.value))}
              />
            </label>
          </div>
        )}

        {/* 3. Paint Calculator Inputs */}
        {slug === 'paint-calculator' && (
          <div className="mt-6 grid min-w-0 gap-4 sm:grid-cols-2">
            <label className="min-w-0 text-sm font-semibold">
              {t.paint.length}
              <input
                type="number"
                dir="ltr"
                min="0.1"
                step="0.5"
                className={fieldClass}
                value={paintLength}
                onChange={(e) => setPaintLength(Number(e.target.value))}
              />
            </label>
            <label className="min-w-0 text-sm font-semibold">
              {t.paint.width}
              <input
                type="number"
                dir="ltr"
                min="0.1"
                step="0.5"
                className={fieldClass}
                value={paintWidth}
                onChange={(e) => setPaintWidth(Number(e.target.value))}
              />
            </label>
            <label className="min-w-0 text-sm font-semibold">
              {t.paint.height}
              <input
                type="number"
                dir="ltr"
                min="0.1"
                step="0.1"
                className={fieldClass}
                value={paintHeight}
                onChange={(e) => setPaintHeight(Number(e.target.value))}
              />
            </label>
            <label className="min-w-0 text-sm font-semibold">
              {t.paint.unit}
              <select
                className={fieldClass}
                value={paintUnit}
                onChange={(e) => setPaintUnit(e.target.value as LinearUnit)}
              >
                <option value="m">{t.paint.m}</option>
                <option value="ft">{t.paint.ft}</option>
              </select>
            </label>
            <label className="min-w-0 text-sm font-semibold">
              {t.paint.openings}
              <input
                type="number"
                dir="ltr"
                min="0"
                step="0.5"
                className={fieldClass}
                value={paintOpenings}
                onChange={(e) => setPaintOpenings(Number(e.target.value))}
              />
            </label>
            <label className="flex min-w-0 items-center gap-3 self-end rounded-xl border border-[var(--border)] p-3 text-sm font-semibold">
              <input
                type="checkbox"
                checked={paintIncludeCeiling}
                onChange={(e) => setPaintIncludeCeiling(e.target.checked)}
              />
              {t.paint.includeCeiling}
            </label>
            <label className="min-w-0 text-sm font-semibold">
              {t.paint.coats}
              <input
                type="number"
                dir="ltr"
                min="1"
                max="10"
                step="1"
                className={fieldClass}
                value={paintCoats}
                onChange={(e) => setPaintCoats(Number(e.target.value))}
              />
            </label>
            <label className="min-w-0 text-sm font-semibold">
              {t.paint.coverage}
              <input
                type="number"
                dir="ltr"
                min="1"
                step="0.5"
                className={fieldClass}
                value={paintCoverage}
                onChange={(e) => setPaintCoverage(Number(e.target.value))}
              />
            </label>
            <label className="min-w-0 text-sm font-semibold">
              {t.paint.waste}
              <input
                type="number"
                dir="ltr"
                min="0"
                max="100"
                step="1"
                className={fieldClass}
                value={paintWaste}
                onChange={(e) => setPaintWaste(Number(e.target.value))}
              />
            </label>
            <label className="min-w-0 text-sm font-semibold">
              {t.paint.canLitres}
              <input
                type="number"
                dir="ltr"
                min="0.25"
                step="0.5"
                className={fieldClass}
                value={paintCanLitres}
                onChange={(e) => setPaintCanLitres(Number(e.target.value))}
              />
            </label>
          </div>
        )}

        {/* 4. Tile Calculator Inputs */}
        {slug === 'tile-calculator' && (
          <div className="mt-6 grid min-w-0 gap-4 sm:grid-cols-2">
            <label className="min-w-0 text-sm font-semibold">
              {t.tile.projectLength}
              <input
                type="number"
                dir="ltr"
                min="0.1"
                step="0.5"
                className={fieldClass}
                value={tileProjectLength}
                onChange={(e) => setTileProjectLength(Number(e.target.value))}
              />
            </label>
            <label className="min-w-0 text-sm font-semibold">
              {t.tile.projectWidth}
              <input
                type="number"
                dir="ltr"
                min="0.1"
                step="0.5"
                className={fieldClass}
                value={tileProjectWidth}
                onChange={(e) => setTileProjectWidth(Number(e.target.value))}
              />
            </label>
            <label className="min-w-0 text-sm font-semibold sm:col-span-2">
              {t.tile.projectUnit}
              <select
                className={fieldClass}
                value={tileProjectUnit}
                onChange={(e) => setTileProjectUnit(e.target.value as LinearUnit)}
              >
                <option value="m">{t.tile.m}</option>
                <option value="ft">{t.tile.ft}</option>
              </select>
            </label>
            <label className="min-w-0 text-sm font-semibold">
              {t.tile.tileLength}
              <input
                type="number"
                dir="ltr"
                min="1"
                step="1"
                className={fieldClass}
                value={tilePieceLength}
                onChange={(e) => setTilePieceLength(Number(e.target.value))}
              />
            </label>
            <label className="min-w-0 text-sm font-semibold">
              {t.tile.tileWidth}
              <input
                type="number"
                dir="ltr"
                min="1"
                step="1"
                className={fieldClass}
                value={tilePieceWidth}
                onChange={(e) => setTilePieceWidth(Number(e.target.value))}
              />
            </label>
            <label className="min-w-0 text-sm font-semibold sm:col-span-2">
              {t.tile.tileUnit}
              <select
                className={fieldClass}
                value={tilePieceUnit}
                onChange={(e) => setTilePieceUnit(e.target.value as TileUnit)}
              >
                <option value="cm">{t.tile.cm}</option>
                <option value="in">{t.tile.in}</option>
              </select>
            </label>
            <label className="min-w-0 text-sm font-semibold">
              {t.tile.gapMm}
              <input
                type="number"
                dir="ltr"
                min="0"
                step="0.5"
                className={fieldClass}
                value={tileGapMm}
                onChange={(e) => setTileGapMm(Number(e.target.value))}
              />
            </label>
            <label className="min-w-0 text-sm font-semibold">
              {t.tile.waste}
              <input
                type="number"
                dir="ltr"
                min="0"
                max="100"
                step="1"
                className={fieldClass}
                value={tileWaste}
                onChange={(e) => setTileWaste(Number(e.target.value))}
              />
            </label>
            <label className="min-w-0 text-sm font-semibold sm:col-span-2">
              {t.tile.tilesPerBox}
              <input
                type="number"
                dir="ltr"
                min="1"
                step="1"
                className={fieldClass}
                value={tilePiecesPerBox}
                onChange={(e) => setTilePiecesPerBox(Number(e.target.value))}
              />
            </label>
          </div>
        )}

        {/* 5. Steel Weight Calculator Inputs */}
        {slug === 'steel-weight-calculator' && (
          <div className="mt-6 grid min-w-0 gap-4 sm:grid-cols-2">
            <label className="min-w-0 text-sm font-semibold sm:col-span-2">
              {t.steel.shape}
              <select
                className={fieldClass}
                value={steelShape}
                onChange={(e) => setSteelShape(e.target.value as SteelShape)}
              >
                <option value="round">{t.steel.round}</option>
                <option value="square">{t.steel.square}</option>
                <option value="rectangular">{t.steel.rectangular}</option>
                <option value="i-section">{t.steel.iSection}</option>
              </select>
            </label>
            {steelShape === 'round' && (
              <label className="min-w-0 text-sm font-semibold sm:col-span-2">
                {t.steel.diameter}
                <input
                  type="number"
                  dir="ltr"
                  min="0.1"
                  step="1"
                  className={fieldClass}
                  value={steelDiameter}
                  onChange={(e) => setSteelDiameter(Number(e.target.value))}
                />
              </label>
            )}
            {steelShape !== 'round' && (
              <label className="min-w-0 text-sm font-semibold">
                {steelShape === 'square' ? t.steel.width : t.steel.flangeWidth}
                <input
                  type="number"
                  dir="ltr"
                  min="0.1"
                  step="1"
                  className={fieldClass}
                  value={steelWidth}
                  onChange={(e) => setSteelWidth(Number(e.target.value))}
                />
              </label>
            )}
            {(steelShape === 'rectangular' || steelShape === 'i-section') && (
              <label className="min-w-0 text-sm font-semibold">
                {steelShape === 'i-section' ? t.steel.webHeight : t.steel.height}
                <input
                  type="number"
                  dir="ltr"
                  min="0.1"
                  step="1"
                  className={fieldClass}
                  value={steelHeight}
                  onChange={(e) => setSteelHeight(Number(e.target.value))}
                />
              </label>
            )}
            {steelShape === 'i-section' && (
              <label className="min-w-0 text-sm font-semibold sm:col-span-2">
                {t.steel.thickness}
                <input
                  type="number"
                  dir="ltr"
                  min="0.1"
                  step="0.5"
                  className={fieldClass}
                  value={steelThickness}
                  onChange={(e) => setSteelThickness(Number(e.target.value))}
                />
              </label>
            )}
            <label className="min-w-0 text-sm font-semibold">
              {t.steel.length}
              <input
                type="number"
                dir="ltr"
                min="0.1"
                step="0.5"
                className={fieldClass}
                value={steelLength}
                onChange={(e) => setSteelLength(Number(e.target.value))}
              />
            </label>
            <label className="min-w-0 text-sm font-semibold">
              {t.steel.quantity}
              <input
                type="number"
                dir="ltr"
                min="1"
                step="1"
                className={fieldClass}
                value={steelQuantity}
                onChange={(e) => setSteelQuantity(Number(e.target.value))}
              />
            </label>
            <label className="min-w-0 text-sm font-semibold sm:col-span-2">
              {t.steel.density}
              <input
                type="number"
                dir="ltr"
                min="1000"
                step="50"
                className={fieldClass}
                value={steelDensity}
                onChange={(e) => setSteelDensity(Number(e.target.value))}
              />
            </label>
          </div>
        )}

        <button type="button" className={`${buttonClass} mt-6`} onClick={handleReset}>
          {ui.reset}
        </button>
      </section>

      {/* Results Section */}
      <aside className="min-w-0 rounded-3xl border border-indigo-500/20 bg-indigo-500/5 p-5 sm:p-7">
        <h2 className="text-xl font-bold">{calcUi.results}</h2>

        <div aria-live="polite" aria-atomic="true" className="mt-5">
          {activeError ? (
            <p role="alert" className="text-sm font-semibold text-rose-500">
              {activeError}
            </p>
          ) : resultRows.length ? (
            <>
              <dl className="grid gap-3 sm:grid-cols-2">
                {resultRows.map(([label, val]) => (
                  <div
                    key={label}
                    className="min-w-0 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3.5"
                  >
                    <dt className="text-xs text-[var(--muted-foreground)]">{label}</dt>
                    <dd
                      suppressHydrationWarning
                      className="mt-1 break-words text-lg font-black"
                    >
                      <bdi>{val}</bdi>
                    </dd>
                  </div>
                ))}
              </dl>
              {resultNote && (
                <p className="mt-4 text-xs leading-relaxed text-[var(--muted-foreground)]">
                  {resultNote}
                </p>
              )}
            </>
          ) : null}
        </div>

        {resultRows.length > 0 && (
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
      </aside>
    </div>
  );
}
