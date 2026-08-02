export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag?: string;
}

export const CURRENCIES: Record<string, Currency> = {
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  CHF: { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭' },
  CNY: { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  SGD: { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  HKD: { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' },
  KRW: { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
  RUB: { code: 'RUB', name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺' },
  BRL: { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  ZAR: { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
};

const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.73,
  JPY: 110.5,
  INR: 74.5,
  CAD: 1.25,
  AUD: 1.35,
  CHF: 0.92,
  CNY: 6.45,
  SGD: 1.35,
  HKD: 7.8,
  KRW: 1200,
  RUB: 75,
  BRL: 5.2,
  ZAR: 15.5,
};

export function convertCurrency(
  amount: number,
  from: string,
  to: string
): number {
  const fromRate = EXCHANGE_RATES[from] || 1;
  const toRate = EXCHANGE_RATES[to] || 1;
  return Number(((amount / fromRate) * toRate).toFixed(2));
}

export function getExchangeRate(from: string, to: string): number {
  const fromRate = EXCHANGE_RATES[from] || 1;
  const toRate = EXCHANGE_RATES[to] || 1;
  return Number((toRate / fromRate).toFixed(4));
}

export function formatCurrency(amount: number, currency: string): string {
  const currencyInfo = CURRENCIES[currency];
  const symbol = currencyInfo?.symbol || currency;
  return `${symbol} ${amount.toFixed(2)}`;
}

export function getCurrencyList(): Currency[] {
  return Object.values(CURRENCIES);
}

export function getPopularCurrencies(): Currency[] {
  return ['USD', 'EUR', 'GBP', 'JPY', 'INR', 'CAD', 'AUD']
    .map(code => CURRENCIES[code])
    .filter(Boolean);
}
