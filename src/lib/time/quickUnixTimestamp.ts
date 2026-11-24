/**
 * Quick Unix timestamp interpretation. The sign is not counted as a digit.
 * Eleven and twelve-digit values are ambiguous; we default them to seconds
 * rather than silently treating valid far-future epoch seconds as milliseconds.
 * Advanced conversions with an explicit unit choice live on /tools/epoch-time-converter.
 */
export function quickUnixTimestamp(input: string): { local: string; utc: string; unit: 'seconds' | 'milliseconds' } | null {
  const value = input.trim();
  if (!/^-?\d+$/.test(value)) return null;
  const numeric = Number(value);
  if (!Number.isSafeInteger(numeric)) return null;
  const digits = value.startsWith('-') ? value.length - 1 : value.length;
  const unit = digits >= 13 ? 'milliseconds' : 'seconds';
  const date = new Date(unit === 'milliseconds' ? numeric : numeric * 1000);
  if (!Number.isFinite(date.getTime())) return null;
  return { local: date.toLocaleString(), utc: date.toISOString(), unit };
}
