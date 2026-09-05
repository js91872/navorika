export type LengthUnit = 'mm' | 'cm' | 'in';

export interface PrintBleedInput {
  finishedWidth: number;
  finishedHeight: number;
  bleedPerEdge: number;
  unit?: LengthUnit | string;
}

export interface PrintBleedResult {
  valid: boolean;
  error?: string;
  finishedWidth: number;
  finishedHeight: number;
  bleedPerEdge: number;
  unit: LengthUnit;
  documentWidth: number;
  documentHeight: number;
  totalAddedWidth: number;
  totalAddedHeight: number;
  finishedArea: number;
  bleedInclusiveArea: number;
  addedBleedArea: number;
  dimensionsSummary: string;
  areaSummary: string;
  [key: string]: any;
}

function safeNumber(val: unknown): number | null {
  const num = Number(val);
  return Number.isFinite(num) ? num : null;
}

function roundTo(num: number, digits = 3): number {
  return Number(num.toFixed(digits));
}

export function calculatePrintBleed(input: PrintBleedInput): PrintBleedResult {
  const fw = safeNumber(input.finishedWidth);
  const fh = safeNumber(input.finishedHeight);
  const bleed = safeNumber(input.bleedPerEdge);

  const rawUnit = typeof input.unit === 'string' ? input.unit.trim().toLowerCase() : 'mm';
  const unit: LengthUnit = rawUnit === 'in' || rawUnit === 'inch' || rawUnit === 'inches' ? 'in' : rawUnit === 'cm' ? 'cm' : 'mm';

  if (fw === null || fh === null || bleed === null) {
    return {
      valid: false,
      error: 'Finished width, finished height, and bleed must be valid numerical values.',
      finishedWidth: 0,
      finishedHeight: 0,
      bleedPerEdge: 0,
      unit,
      documentWidth: 0,
      documentHeight: 0,
      totalAddedWidth: 0,
      totalAddedHeight: 0,
      finishedArea: 0,
      bleedInclusiveArea: 0,
      addedBleedArea: 0,
      dimensionsSummary: 'Invalid input',
      areaSummary: 'Invalid input',
    };
  }

  if (fw <= 0 || fh <= 0) {
    return {
      valid: false,
      error: 'Finished width and height must be positive numbers greater than 0.',
      finishedWidth: 0,
      finishedHeight: 0,
      bleedPerEdge: 0,
      unit,
      documentWidth: 0,
      documentHeight: 0,
      totalAddedWidth: 0,
      totalAddedHeight: 0,
      finishedArea: 0,
      bleedInclusiveArea: 0,
      addedBleedArea: 0,
      dimensionsSummary: 'Invalid dimensions',
      areaSummary: 'Invalid dimensions',
    };
  }

  if (bleed < 0) {
    return {
      valid: false,
      error: 'Bleed margin cannot be negative. Enter 0 or a positive bleed value.',
      finishedWidth: fw,
      finishedHeight: fh,
      bleedPerEdge: 0,
      unit,
      documentWidth: fw,
      documentHeight: fh,
      totalAddedWidth: 0,
      totalAddedHeight: 0,
      finishedArea: roundTo(fw * fh),
      bleedInclusiveArea: roundTo(fw * fh),
      addedBleedArea: 0,
      dimensionsSummary: 'Negative bleed not allowed',
      areaSummary: 'Negative bleed not allowed',
    };
  }

  const totalAddedWidth = roundTo(2 * bleed);
  const totalAddedHeight = roundTo(2 * bleed);
  const documentWidth = roundTo(fw + totalAddedWidth);
  const documentHeight = roundTo(fh + totalAddedHeight);

  const finishedArea = roundTo(fw * fh);
  const bleedInclusiveArea = roundTo(documentWidth * documentHeight);
  const addedBleedArea = roundTo(bleedInclusiveArea - finishedArea);

  const areaUnit = unit === 'in' ? 'sq in' : `${unit}²`;

  const dimensionsSummary = `${documentWidth} × ${documentHeight} ${unit} (finished trim: ${fw} × ${fh} ${unit} + ${bleed} ${unit} bleed per edge)`;
  const areaSummary = `${bleedInclusiveArea.toLocaleString()} ${areaUnit} (finished trim: ${finishedArea.toLocaleString()} ${areaUnit} + ${addedBleedArea.toLocaleString()} ${areaUnit} bleed allowance)`;

  return {
    valid: true,
    finishedWidth: fw,
    finishedHeight: fh,
    bleedPerEdge: bleed,
    unit,
    documentWidth,
    documentHeight,
    totalAddedWidth,
    totalAddedHeight,
    finishedArea,
    bleedInclusiveArea,
    addedBleedArea,
    dimensionsSummary,
    areaSummary,
  };
}
