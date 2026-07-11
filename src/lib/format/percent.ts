export function formatPercent(
  value: number,
  digits = 2
): string {
  return `${value.toFixed(digits)}%`;
}