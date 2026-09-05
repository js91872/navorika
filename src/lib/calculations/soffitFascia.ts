export interface SoffitFasciaInput {
  eaveLength: number;
  soffitDepth: number;
  fasciaBoardLength: number;
  soffitPanelCoverage: number;
  wastePercent: number;
}

export interface SoffitFasciaResult {
  soffitArea: number;
  soffitAreaWithWaste: number;
  soffitPieces: number;
  fasciaLengthWithWaste: number;
  fasciaBoards: number;
  [key: string]: number;
}

function safeNumber(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function calculateSoffitFascia(input: SoffitFasciaInput): SoffitFasciaResult {
  const eaveLength = safeNumber(input.eaveLength);
  const soffitDepth = safeNumber(input.soffitDepth);
  const fasciaBoardLength = safeNumber(input.fasciaBoardLength);
  const soffitPanelCoverage = safeNumber(input.soffitPanelCoverage);
  const wastePercent = Math.min(100, safeNumber(input.wastePercent));

  const soffitArea = eaveLength * soffitDepth;
  const wasteMultiplier = 1 + wastePercent / 100;
  const soffitAreaWithWaste = soffitArea * wasteMultiplier;

  const soffitPieces =
    soffitPanelCoverage > 0 ? Math.ceil(soffitAreaWithWaste / soffitPanelCoverage) : 0;

  const fasciaLengthWithWaste = eaveLength * wasteMultiplier;
  const fasciaBoards =
    fasciaBoardLength > 0 ? Math.ceil(fasciaLengthWithWaste / fasciaBoardLength) : 0;

  return {
    soffitArea,
    soffitAreaWithWaste,
    soffitPieces,
    fasciaLengthWithWaste,
    fasciaBoards,
  };
}
