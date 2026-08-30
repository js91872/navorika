import test from 'node:test';
import assert from 'node:assert/strict';
import { applyAllowance, calculateCementTakeoff, calculatePaintTakeoff, calculateSandTakeoff, calculateSteelWeight, calculateTileTakeoff } from './supplierTakeoffs.ts';

const close = (actual, expected, tolerance = 1e-9) => assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);

test('supplier allowance applies once without rounding', () => close(applyAllowance(10.25, 10), 11.275));
test('supplier allowance rejects negative percentages', () => assert.throws(() => applyAllowance(10, -1), RangeError));
test('cement takeoff splits a nominal ratio and rounds only bags', () => { const r=calculateCementTakeoff({wetVolume:1,unit:'m3',ratio:[1,2,3],bagKg:50}); close(r.dryVolumeM3,1.54); close(r.cementKg,369.6); close(r.exactBags,7.392); assert.equal(r.bagsToBuy,8); });
test('cement cubic-yard input is unit invariant', () => { const a=calculateCementTakeoff({wetVolume:1,unit:'m3',ratio:[1,2,3],bagKg:50}); const b=calculateCementTakeoff({wetVolume:1/0.764554857984,unit:'yd3',ratio:[1,2,3],bagKg:50}); close(a.cementKg,b.cementKg); });
test('cement rejects zero volume', () => assert.throws(() => calculateCementTakeoff({wetVolume:0,unit:'m3',ratio:[1,2,3],bagKg:50}), RangeError));
test('sand converts feet to metres in all three dimensions', () => { const r=calculateSandTakeoff({length:10,width:10,depth:1,unit:'ft',densityKgM3:1600}); close(r.baseVolumeM3,100*0.3048**3); });
test('sand separates base and waste-adjusted mass', () => { const r=calculateSandTakeoff({length:2,width:3,depth:.5,unit:'m',densityKgM3:1500,wastePercent:10,bagKg:25,payloadKg:1000}); close(r.baseWeightKg,4500); close(r.adjustedWeightKg,4950); assert.equal(r.bagsToBuy,198); assert.equal(r.loadsToPlan,5); });
test('sand rejects non-finite density', () => assert.throws(() => calculateSandTakeoff({length:1,width:1,depth:1,unit:'m',densityKgM3:NaN}), RangeError));
test('paint deducts openings from walls but not ceiling', () => { const r=calculatePaintTakeoff({length:5,width:4,height:3,unit:'m',openingsArea:6,includeCeiling:true,coats:2,coverageM2L:10}); close(r.netOneCoatAreaM2,68); close(r.baseLitres,13.6); });
test('paint can exclude a ceiling', () => { const r=calculatePaintTakeoff({length:5,width:4,height:3,unit:'m',includeCeiling:false,coats:1,coverageM2L:10}); assert.equal(r.ceilingAreaM2,0); });
test('paint foot and metre inputs are unit invariant', () => { const a=calculatePaintTakeoff({length:5,width:4,height:3,unit:'m',openingsArea:2,includeCeiling:true,coats:2,coverageM2L:10}); const b=calculatePaintTakeoff({length:5/0.3048,width:4/0.3048,height:3/0.3048,unit:'ft',openingsArea:2/0.3048**2,includeCeiling:true,coats:2,coverageM2L:10}); close(a.adjustedLitres,b.adjustedLitres); });
test('paint rejects openings larger than gross walls', () => assert.throws(() => calculatePaintTakeoff({length:1,width:1,height:1,unit:'m',openingsArea:5,includeCeiling:false,coats:1,coverageM2L:10}), RangeError));
test('paint rounds only purchase cans', () => { const r=calculatePaintTakeoff({length:1,width:1,height:1,unit:'m',includeCeiling:false,coats:1,coverageM2L:10,wastePercent:10,canLitres:.3}); close(r.adjustedLitres,.44); assert.equal(r.cansToBuy,2); });
test('tile grid includes joints in repeated pitch', () => { const r=calculateTileTakeoff({length:2,width:1,projectUnit:'m',tileLength:60,tileWidth:30,tileUnit:'cm',gapMm:5}); assert.equal(r.tilesAlongLength,4); assert.equal(r.tilesAlongWidth,4); assert.equal(r.fittedGridTiles,16); });
test('tile applies waste after fitted grid and rounds once', () => { const r=calculateTileTakeoff({length:1,width:1,projectUnit:'m',tileLength:50,tileWidth:50,tileUnit:'cm',gapMm:0,wastePercent:12.5,tilesPerBox:3}); assert.equal(r.fittedGridTiles,4); close(r.adjustedTiles,4.5); assert.equal(r.tilesToBuy,5); assert.equal(r.boxes,2); });
test('tile inch and centimetre sizes are unit invariant', () => { const a=calculateTileTakeoff({length:2,width:2,projectUnit:'m',tileLength:30.48,tileWidth:30.48,tileUnit:'cm',gapMm:0}); const b=calculateTileTakeoff({length:2,width:2,projectUnit:'m',tileLength:12,tileWidth:12,tileUnit:'in',gapMm:0}); assert.deepEqual([a.tilesAlongLength,a.tilesAlongWidth],[b.tilesAlongLength,b.tilesAlongWidth]); });
test('tile rejects a negative joint gap', () => assert.throws(() => calculateTileTakeoff({length:1,width:1,projectUnit:'m',tileLength:10,tileWidth:10,tileUnit:'cm',gapMm:-1}), RangeError));
test('steel round bar uses circular cross-section', () => { const r=calculateSteelWeight({shape:'round',diameterMm:10,lengthM:1,quantity:1}); close(r.kgPerM,Math.PI*.005**2*7850); });
test('steel square bar uses a square cross-section', () => { const r=calculateSteelWeight({shape:'square',widthMm:10,lengthM:2,quantity:3}); close(r.areaM2,.0001); close(r.totalLengthM,6); });
test('steel rectangular bar uses width times height', () => { const r=calculateSteelWeight({shape:'rectangular',widthMm:20,heightMm:10,lengthM:1,quantity:1}); close(r.areaM2,.0002); });
test('steel ideal I-section uses two flanges and a clear web', () => { const r=calculateSteelWeight({shape:'i-section',widthMm:100,heightMm:200,thicknessMm:5,lengthM:1,quantity:1}); close(r.areaM2,.002); });
test('steel rejects an unsupported zero dimension', () => assert.throws(() => calculateSteelWeight({shape:'round',diameterMm:0,lengthM:1,quantity:1}), RangeError));
