export interface CAGRResult {
  beginningValue: number;
  endingValue: number;
  years: number;
  cagr: number;
}

export function calculateCAGR(
  beginningValue: number,
  endingValue: number,
  years: number
): CAGRResult {
  if (
    beginningValue <= 0 ||
    endingValue <= 0 ||
    years <= 0
  ) {
    return {
      beginningValue,
      endingValue,
      years,
      cagr: 0,
    };
  }

  const cagr =
    (Math.pow(endingValue / beginningValue, 1 / years) - 1) * 100;

  return {
    beginningValue,
    endingValue,
    years,
    cagr,
  };
}