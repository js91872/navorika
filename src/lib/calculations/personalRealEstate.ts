const n = (value: number | undefined) => (typeof value === 'number' && Number.isFinite(value) ? Math.max(0, value) : 0);

export interface ShortTermRentalInput {
  nightlyRate: number;
  availableNights: number;
  occupancy: number;
  variableCost: number;
  fixedCosts: number;
  platformFee: number;
}

export interface ShortTermRentalResult {
  [key: string]: number | null;
  occupiedNights: number;
  grossRevenue: number;
  platformFees: number;
  totalCosts: number;
  monthlyProfit: number;
  breakEvenOccupancy: number | null;
}

export function calculateShortTermRental(input: ShortTermRentalInput): ShortTermRentalResult {
  const nightlyRate = n(input.nightlyRate);
  const availableNights = Math.max(1, Math.min(31, Math.floor(n(input.availableNights))));
  const occupancyPercent = Math.min(100, n(input.occupancy));
  const variableCost = n(input.variableCost);
  const fixedCosts = n(input.fixedCosts);
  const platformFeePercent = Math.min(100, n(input.platformFee));

  const occupiedNights = availableNights * (occupancyPercent / 100);
  const grossRevenue = occupiedNights * nightlyRate;
  const platformFees = grossRevenue * (platformFeePercent / 100);
  const variableCostsTotal = occupiedNights * variableCost;
  const totalCosts = platformFees + variableCostsTotal + fixedCosts;
  const monthlyProfit = grossRevenue - totalCosts;

  const contributionPerNight = nightlyRate * (1 - platformFeePercent / 100) - variableCost;
  let breakEvenOccupancy: number | null = null;

  if (contributionPerNight > 0 && availableNights > 0) {
    const breakEvenNights = fixedCosts / contributionPerNight;
    breakEvenOccupancy = (breakEvenNights / availableNights) * 100;
  }

  return {
    occupiedNights,
    grossRevenue,
    platformFees,
    totalCosts,
    monthlyProfit,
    breakEvenOccupancy,
  };
}

export interface HouseHackingInput {
  mortgage: number;
  taxInsurance: number;
  hoa?: number;
  utilities?: number;
  maintenance?: number;
  other?: number;
  rentReceived: number;
  vacancy?: number;
}

export interface HouseHackingResult {
  [key: string]: number | null;
  grossHousingCost: number;
  effectiveRentIncome: number;
  effectiveHousingCost: number;
  annualEffectiveCost: number;
  costOffsetPercent: number | null;
}

export function calculateHouseHacking(input: HouseHackingInput): HouseHackingResult {
  const mortgage = n(input.mortgage);
  const taxInsurance = n(input.taxInsurance);
  const hoa = n(input.hoa);
  const utilities = n(input.utilities);
  const maintenance = n(input.maintenance);
  const other = n(input.other);
  const rentReceived = n(input.rentReceived);
  const vacancyPercent = Math.min(100, n(input.vacancy));

  const grossHousingCost = mortgage + taxInsurance + hoa + utilities + maintenance + other;
  const effectiveRentIncome = rentReceived * (1 - vacancyPercent / 100);
  const effectiveHousingCost = grossHousingCost - effectiveRentIncome;
  const annualEffectiveCost = effectiveHousingCost * 12;
  const costOffsetPercent = grossHousingCost > 0 ? (effectiveRentIncome / grossHousingCost) * 100 : null;

  return {
    grossHousingCost,
    effectiveRentIncome,
    effectiveHousingCost,
    annualEffectiveCost,
    costOffsetPercent,
  };
}
