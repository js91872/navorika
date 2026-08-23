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
    const quantity = Number.isFinite(item.quantity) ? Math.max(0, item.quantity) : 0;
    const unitCost = Number.isFinite(item.unitCost) ? Math.max(0, item.unitCost) : 0;
    categoryTotals[item.category] += quantity * unitCost;
  }

  const directCost = Object.values(categoryTotals).reduce(
    (sum, value) => sum + value,
    0
  );

  const overhead =
    directCost * (Math.max(0, adjustments.overheadPercent) / 100);

  const contingency =
    (directCost + overhead) *
    (Math.max(0, adjustments.contingencyPercent) / 100);

  const markupBase = directCost + overhead + contingency;

  const markup =
    markupBase * (Math.max(0, adjustments.markupPercent) / 100);

  const subtotalBeforeTax = markupBase + markup;

  const discount = Math.min(
    Math.max(0, adjustments.discount),
    subtotalBeforeTax
  );

  const taxableAmount = Math.max(0, subtotalBeforeTax - discount);

  const tax =
    taxableAmount * (Math.max(0, adjustments.taxPercent) / 100);

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
    categoryTotals,
  };
}
