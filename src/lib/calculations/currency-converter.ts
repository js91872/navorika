export interface CurrencyResult {
  fromAmount: number;
  fromCurrency: string;
  toAmount: number;
  toCurrency: string;
  rate: number;
  date: string;
  inverseRate: number;
  lastUpdated: string;
}

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>
): CurrencyResult {
  const fromRate = rates[fromCurrency];
  const toRate = rates[toCurrency];
  
  if (!fromRate || !toRate) {
    throw new Error("Invalid currency code");
  }

  // Convert amount from base currency (USD) to target currency
  const convertedAmount = (amount / fromRate) * toRate;
  
  return {
    fromAmount: amount,
    fromCurrency,
    toAmount: convertedAmount,
    toCurrency,
    rate: toRate / fromRate,
    inverseRate: fromRate / toRate,
    date: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toLocaleString(),
  };
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getCurrencySymbol(currencyCode: string): string {
  const symbols: Record<string, string> = {
    'USD': '$', 'EUR': '€', 'GBP': '£', 'INR': '₹', 'JPY': '¥',
    'CAD': 'C$', 'AUD': 'A$', 'CHF': 'Fr', 'CNY': '¥', 'SGD': 'S$',
    'AED': 'د.إ', 'BRL': 'R$', 'RUB': '₽', 'KRW': '₩', 'TRY': '₺',
    'ZAR': 'R', 'MXN': 'Mex$', 'NZD': 'NZ$', 'SEK': 'kr', 'NOK': 'kr',
    'DKK': 'kr', 'PLN': 'zł', 'HUF': 'Ft', 'CZK': 'Kč', 'ILS': '₪',
  };
  return symbols[currencyCode] || currencyCode;
}
