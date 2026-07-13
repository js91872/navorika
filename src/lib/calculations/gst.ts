export interface GSTResult {
  originalAmount: number;
  gstAmount: number;
  totalAmount: number;
}

export function calculateGST(
  amount: number,
  gstRate: number
): GSTResult {
  const gstAmount = (amount * gstRate) / 100;

  const totalAmount = amount + gstAmount;

  return {
    originalAmount: amount,
    gstAmount,
    totalAmount,
  };
}