// ==================== CONCRETE CALCULATOR ====================
export function calculateConcrete(inputs: {
  length: number;
  width: number;
  height: number;
  unit: 'feet' | 'meters';
  wastage?: number;
}): { volume: number; cement: number; sand: number; aggregate: number; water: number } {
  const { length, width, height, unit, wastage = 5 } = inputs;
  
  // Convert to meters if feet
  const l = unit === 'feet' ? length / 3.281 : length;
  const w = unit === 'feet' ? width / 3.281 : width;
  const h = unit === 'feet' ? height / 3.281 : height;
  
  const volume = l * w * h;
  const withWastage = volume * (1 + wastage / 100);
  const dryVolume = withWastage * 1.54;
  
  // M20 mix ratio (1:1.5:3) - Cement: Sand: Aggregate
  const totalParts = 1 + 1.5 + 3;
  const cement = (dryVolume * 1) / totalParts;
  const sand = (dryVolume * 1.5) / totalParts;
  const aggregate = (dryVolume * 3) / totalParts;
  const cementMassKg = cement * 1440;
  const water = (cementMassKg * 0.45) / 1000;
  
  return {
    volume: Math.round(withWastage * 100) / 100,
    cement: Math.round(cement * 100) / 100,
    sand: Math.round(sand * 100) / 100,
    aggregate: Math.round(aggregate * 100) / 100,
    water: Math.round(water * 100) / 100,
  };
}

// ==================== BRICK CALCULATOR ====================
export function calculateBricks(inputs: {
  wallLength: number;
  wallHeight: number;
  wallThickness: number;
  brickLength: number;
  brickHeight: number;
  brickWidth: number;
  mortar: number;
}): { bricks: number; mortar: number } {
  const { wallLength, wallHeight, wallThickness, brickLength, brickHeight, brickWidth, mortar } = inputs;
  
  const wallVolume = wallLength * wallHeight * wallThickness;
  const brickVolume = (brickLength / 100) * (brickHeight / 100) * (brickWidth / 100);
  const mortarVolume = (wallVolume * mortar) / 100;
  const effectiveBrickVolume = brickVolume + mortarVolume;
  
  const bricks = Math.ceil(wallVolume / effectiveBrickVolume);
  
  return {
    bricks: bricks,
    mortar: Math.round(mortarVolume * 100) / 100,
  };
}

// ==================== STEEL WEIGHT CALCULATOR ====================
export function calculateSteelWeight(inputs: {
  diameter: number;
  length: number;
  quantity: number;
}): { weightPerMeter: number; totalWeight: number } {
  const { diameter, length, quantity } = inputs;
  
  // Weight per meter = d²/162 (where d is in mm)
  const weightPerMeter = (diameter * diameter) / 162;
  const totalWeight = weightPerMeter * length * quantity;
  
  return {
    weightPerMeter: Math.round(weightPerMeter * 100) / 100,
    totalWeight: Math.round(totalWeight * 100) / 100,
  };
}

// ==================== PAINT CALCULATOR ====================
export function calculatePaint(inputs: {
  wallLength: number;
  wallHeight: number;
  doors: number;
  windows: number;
  coats: number;
  coverage: number;
}): { area: number; paint: number } {
  const { wallLength, wallHeight, doors, windows, coats, coverage } = inputs;
  
  const wallArea = 2 * wallLength * wallHeight;
  const doorArea = doors * 1.68; // Standard door: 2.1m x 0.8m
  const windowArea = windows * 1.2; // Standard window: 1.2m x 1m
  const paintableArea = wallArea - doorArea - windowArea;
  const totalArea = paintableArea * coats;
  const paint = totalArea / coverage;
  
  return {
    area: Math.round(paintableArea * 100) / 100,
    paint: Math.round(paint * 100) / 100,
  };
}

// ==================== TILE CALCULATOR ====================
export function calculateTiles(inputs: {
  floorLength: number;
  floorWidth: number;
  tileLength: number;
  tileWidth: number;
  wastage?: number;
}): { tiles: number; area: number } {
  const { floorLength, floorWidth, tileLength, tileWidth, wastage = 10 } = inputs;
  
  const floorArea = floorLength * floorWidth;
  const tileArea = (tileLength / 100) * (tileWidth / 100);
  const tiles = Math.ceil(floorArea / tileArea * (1 + wastage / 100));
  
  return {
    tiles: tiles,
    area: Math.round(floorArea * 100) / 100,
  };
}
