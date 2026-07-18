export function validateAmount(value: number): number {
  if (Number.isNaN(value) || value < 0) {
    return 0;
  }

  return value;
}

export function validateRate(value: number): number {
  if (Number.isNaN(value) || value < 0) {
    return 0;
  }

  return value;
}

export function validateYears(value: number): number {
  if (Number.isNaN(value) || value <= 0) {
    return 1;
  }

  return value;
}

export function safeDivide(
  numerator: number,
  denominator: number
): number {
  if (denominator === 0) {
    return 0;
  }

  return numerator / denominator;
}