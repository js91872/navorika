/** Single tax rate on one taxable base; amounts rounded in cents using integer arithmetic. */
function cents(value: number) {
  if (!Number.isFinite(value) || value < 0 || value > 1e9) throw new RangeError('Enter an amount from 0 to 1,000,000,000.');
  return Math.round((value + Number.EPSILON) * 100);
}
export function reverseSalesTax(total: number, rate: number) {
  if (!Number.isFinite(rate) || rate < 0 || rate > 100 || Math.abs(rate * 10000 - Math.round(rate * 10000)) > 1e-6) throw new RangeError('Enter a tax rate from 0 to 100%, with up to four decimal places.');
  const gross = cents(total);
  const units = BigInt(Math.round(rate * 10000));
  const divisor = BigInt(1000000) + units;
  const numerator = BigInt(gross) * BigInt(1000000);
  const net = Number((numerator * BigInt(2) + divisor) / (BigInt(2) * divisor));
  return { total: gross / 100, beforeTax: net / 100, tax: (gross - net) / 100, rate };
}
export function salesTaxRate(total: number, beforeTax: number) {
  const gross = cents(total), net = cents(beforeTax);
  if (net <= 0 || gross < net) throw new RangeError('Price before tax must be greater than zero and no higher than the total.');
  return { total: gross / 100, beforeTax: net / 100, tax: (gross - net) / 100, rate: (gross - net) / net * 100 };
}
