export function round(value: number, digits = 2): number {
  return Number(value.toFixed(digits));
}

export function percentage(value: number): string {
  return `${round(value)}%`;
}

export function decimal(value: number): number {
  return round(value, 2);
}