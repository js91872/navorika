export interface CurrencyOptions {
  locale?: string;
  currency?: string;
  maximumFractionDigits?: number;
}

export function formatCurrency(
  value: number,
  options: CurrencyOptions = {}
): string {
  const {
    locale = "en-IN",
    currency = "INR",
    maximumFractionDigits = 2,
  } = options;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits,
  }).format(value);
}

// Add a number formatter for non-currency values
export function formatNumber(
  value: number,
  options: { locale?: string; maximumFractionDigits?: number } = {}
): string {
  const {
    locale = "en-IN",
    maximumFractionDigits = 1,
  } = options;

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits,
  }).format(value);
}
