export type EstimateCategory =
  | 'Materials'
  | 'Labor'
  | 'Equipment'
  | 'Subcontractor'
  | 'Other';

export interface EstimateItem {
  id: string;
  category: EstimateCategory;
  description: string;
  quantity: number;
  unit: string;
  unitCost: number;
}

export interface EstimateAdjustments {
  overheadPercent: number;
  contingencyPercent: number;
  markupPercent: number;
  taxPercent: number;
  discount: number;
}

export interface EstimateTotals {
  directCost: number;
  overhead: number;
  contingency: number;
  markup: number;
  subtotalBeforeTax: number;
  discount: number;
  taxableAmount: number;
  tax: number;
  grandTotal: number;
  impliedMarginPercent: number;
  categoryTotals: Record<EstimateCategory, number>;
}

export function calculateEstimate(
  items: EstimateItem[],
  adjustments: EstimateAdjustments
): EstimateTotals {
  const categoryTotals: Record<EstimateCategory, number> = {
    Materials: 0,
    Labor: 0,
    Equipment: 0,
    Subcontractor: 0,
    Other: 0,
  };

  for (const item of items) {
    if (!(item.category in categoryTotals)) throw new RangeError(`Unknown estimate category: ${item.category}`);
    const quantity = Number.isFinite(item.quantity) ? Math.max(0, item.quantity) : 0;
    const unitCost = Number.isFinite(item.unitCost) ? Math.max(0, item.unitCost) : 0;
    categoryTotals[item.category] += quantity * unitCost;
  }

  const directCost = Object.values(categoryTotals).reduce(
    (sum, value) => sum + value,
    0
  );

  const percent = (value: number, name: string) => {
    if (!Number.isFinite(value) || value < 0) throw new RangeError(`${name} cannot be negative or non-finite.`);
    return value / 100;
  };
  if (!Number.isFinite(adjustments.discount) || adjustments.discount < 0) throw new RangeError('Discount cannot be negative or non-finite.');

  const overhead = directCost * percent(adjustments.overheadPercent, 'Overhead');

  const contingency =
    (directCost + overhead) *
    percent(adjustments.contingencyPercent, 'Contingency');

  const markupBase = directCost + overhead + contingency;

  const markup =
    markupBase * percent(adjustments.markupPercent, 'Markup');

  const subtotalBeforeTax = markupBase + markup;

  const discount = Math.min(
    Math.max(0, adjustments.discount),
    subtotalBeforeTax
  );

  const taxableAmount = Math.max(0, subtotalBeforeTax - discount);

  const tax =
    taxableAmount * percent(adjustments.taxPercent, 'Tax');

  return {
    directCost,
    overhead,
    contingency,
    markup,
    subtotalBeforeTax,
    discount,
    taxableAmount,
    tax,
    grandTotal: taxableAmount + tax,
    impliedMarginPercent: subtotalBeforeTax > 0 ? markup / subtotalBeforeTax * 100 : 0,
    categoryTotals,
  };
}
