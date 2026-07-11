export function formatNumber(
  value: number,
  locale = "en-IN"
): string {
  return new Intl.NumberFormat(locale).format(value);
}