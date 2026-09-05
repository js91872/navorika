export interface MaterialWasteInput {
  netQuantity: number;
  wastePercent: number;
  unitCost: number;
}

export interface MaterialWasteResult {
  wasteQuantity: number;
  orderQuantity: number;
  netMaterialCost: number;
  wasteCost: number;
  totalMaterialCost: number;
  [key: string]: number;
}

function safeNumber(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function calculateMaterialWaste(input: MaterialWasteInput): MaterialWasteResult {
  const netQuantity = safeNumber(input.netQuantity);
  const wastePercent = Math.min(100, safeNumber(input.wastePercent));
  const unitCost = safeNumber(input.unitCost);

  const wasteQuantity = netQuantity * (wastePercent / 100);
  const orderQuantity = netQuantity + wasteQuantity;

  const netMaterialCost = netQuantity * unitCost;
  const wasteCost = wasteQuantity * unitCost;
  const totalMaterialCost = orderQuantity * unitCost;

  return {
    wasteQuantity: Number(wasteQuantity.toFixed(2)),
    orderQuantity: Number(orderQuantity.toFixed(2)),
    netMaterialCost: Number(netMaterialCost.toFixed(2)),
    wasteCost: Number(wasteCost.toFixed(2)),
    totalMaterialCost: Number(totalMaterialCost.toFixed(2)),
  };
}
