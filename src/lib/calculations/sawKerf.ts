export interface SawKerfInput {
  stockWidth: number;
  pieceWidth: number;
  kerfWidth: number;
}

export interface SawKerfResult {
  pieces: number;
  cuts: number;
  totalKerfLoss: number;
  materialUsed: number;
  offcut: number;
  efficiencyPercent: number;
}

function safe(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

const EPSILON = 1e-9;

export function calculateSawKerf(
  input: SawKerfInput,
): SawKerfResult {
  const stockWidth = safe(input.stockWidth);
  const pieceWidth = safe(input.pieceWidth);
  const kerfWidth = safe(input.kerfWidth);

  if (stockWidth <= 0 || pieceWidth <= 0) {
    return {
      pieces: 0,
      cuts: 0,
      totalKerfLoss: 0,
      materialUsed: 0,
      offcut: stockWidth,
      efficiencyPercent: 0,
    };
  }

  /*
   * Normally each finished strip requires a cut because the final strip
   * must also be separated from the remaining offcut.
   *
   * Exception:
   * If the stock ends exactly at the outer edge of the final piece,
   * that final existing stock edge eliminates one cut.
   */

  let pieces = Math.floor(stockWidth / (pieceWidth + kerfWidth));

  /*
   * Check whether one additional piece fits exactly against the existing
   * stock edge and therefore does not require a final kerf.
   */
  const exactEdgeCandidate = pieces + 1;

  const exactEdgeRequired =
    exactEdgeCandidate * pieceWidth +
    Math.max(0, exactEdgeCandidate - 1) * kerfWidth;

  if (
    exactEdgeCandidate > 0 &&
    Math.abs(stockWidth - exactEdgeRequired) <= EPSILON
  ) {
    pieces = exactEdgeCandidate;
  }

  let cuts = 0;
  let totalKerfLoss = 0;
  let materialUsed = 0;
  let offcut = stockWidth;

  if (pieces > 0) {
    const widthWithCutsForEveryPiece =
      pieces * pieceWidth + pieces * kerfWidth;

    const widthUsingExistingFinalEdge =
      pieces * pieceWidth + Math.max(0, pieces - 1) * kerfWidth;

    const usesExistingFinalEdge =
      Math.abs(stockWidth - widthUsingExistingFinalEdge) <= EPSILON;

    cuts = usesExistingFinalEdge
      ? Math.max(0, pieces - 1)
      : pieces;

    totalKerfLoss = cuts * kerfWidth;

    materialUsed = pieces * pieceWidth + totalKerfLoss;

    /*
     * Protect against tiny floating-point rounding artifacts.
     */
    offcut = Math.max(0, stockWidth - materialUsed);

    if (
      !usesExistingFinalEdge &&
      widthWithCutsForEveryPiece > stockWidth + EPSILON
    ) {
      pieces = Math.max(0, pieces - 1);
      cuts = pieces;
      totalKerfLoss = cuts * kerfWidth;
      materialUsed = pieces * pieceWidth + totalKerfLoss;
      offcut = Math.max(0, stockWidth - materialUsed);
    }
  }

  const efficiencyPercent =
    stockWidth > 0
      ? (pieces * pieceWidth / stockWidth) * 100
      : 0;

  return {
    pieces,
    cuts,
    totalKerfLoss,
    materialUsed,
    offcut,
    efficiencyPercent,
  };
}
