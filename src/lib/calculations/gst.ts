export interface GSTInputs {
  amount: number;
  rate: number;
  type: 'inclusive' | 'exclusive';
  isInterState?: boolean;
}

export interface GSTResult {
  baseAmount: number;
  gstAmount: number;
  totalAmount: number;
  cgst: number;
  sgst: number;
  igst?: number;
  breakdown: {
    cgstRate: number;
    sgstRate: number;
    igstRate?: number;
  };
}

export function calculateGST(inputs: GSTInputs): GSTResult {
  const { amount, rate, type, isInterState = false } = inputs;
  
  const gstRate = rate / 100;
  const halfRate = gstRate / 2;

  let baseAmount: number;
  let gstAmount: number;
  let totalAmount: number;

  if (type === 'exclusive') {
    baseAmount = amount;
    gstAmount = amount * gstRate;
    totalAmount = amount + gstAmount;
  } else {
    totalAmount = amount;
    baseAmount = amount / (1 + gstRate);
    gstAmount = totalAmount - baseAmount;
  }

  const cgst = isInterState ? 0 : gstAmount / 2;
  const sgst = isInterState ? 0 : gstAmount / 2;
  const igst = isInterState ? gstAmount : 0;

  return {
    baseAmount: Math.round(baseAmount * 100) / 100,
    gstAmount: Math.round(gstAmount * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    cgst: Math.round(cgst * 100) / 100,
    sgst: Math.round(sgst * 100) / 100,
    igst: Math.round(igst * 100) / 100,
    breakdown: {
      cgstRate: isInterState ? 0 : rate / 2,
      sgstRate: isInterState ? 0 : rate / 2,
      igstRate: isInterState ? rate : 0,
    },
  };
}

export const GST_RATES = [
  { value: 0, label: '0% - Essential Items' },
  { value: 0.25, label: '0.25% - Rough Diamonds' },
  { value: 3, label: '3% - Gold, Jewellery' },
  { value: 5, label: '5% - Basic Necessities' },
  { value: 12, label: '12% - Standard Items' },
  { value: 18, label: '18% - Most Goods & Services' },
  { value: 28, label: '28% - Luxury Items' },
];

export function reverseCalculateGST(totalAmount: number, rate: number): {
  baseAmount: number;
  gstAmount: number;
} {
  const gstRate = rate / 100;
  const baseAmount = totalAmount / (1 + gstRate);
  const gstAmount = totalAmount - baseAmount;
  
  return {
    baseAmount: Math.round(baseAmount * 100) / 100,
    gstAmount: Math.round(gstAmount * 100) / 100,
  };
}
