import test from 'node:test';
import assert from 'node:assert/strict';
import { deckBoards, drywall, fence, pavers, polymericSand, withWaste } from './constructionExpansion.ts';

const close = (actual, expected, tolerance = 1e-9) => assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);

test('construction waste applies once without rounding', () => close(withWaste(3.4, 15), 3.91));
test('construction waste rejects NaN', () => assert.throws(() => withWaste(10, NaN), RangeError));
test('construction waste rejects a negative allowance', () => assert.throws(() => withWaste(10, -1), RangeError));
test('deck rows include gaps only between boards', () => { const r=deckBoards(10,1,5.5,10,.5,'length',0); assert.equal(r.rows,3); });
test('deck orientation swaps course and row-span dimensions', () => { const a=deckBoards(20,10,6,10,0,'length',0); const b=deckBoards(10,20,6,10,0,'width',0); assert.equal(a.rows,b.rows); assert.equal(a.piecesPerRow,b.piecesPerRow); });
test('deck distinguishes exact stock equivalent from row purchases', () => { const r=deckBoards(15,1,6,10,0,'length',10); close(r.exactStockEquivalent,3); assert.equal(r.base,4); close(r.adjustedBoards,4.4); assert.equal(r.required,5); });
test('deck rejects a negative gap', () => assert.throws(() => deckBoards(10,10,6,10,-.1,'length',0), RangeError));
test('drywall separates net area exact sheets and purchase sheets', () => { const r=drywall(300,100,40,4,8,10); assert.equal(r.net,360); close(r.exactBaseSheets,11.25); close(r.exactAdjustedSheets,12.375); assert.equal(r.base,12); assert.equal(r.sheets,13); });
test('drywall rejects openings equal to gross area', () => assert.throws(() => drywall(100,0,100,4,8,10), RangeError));
test('drywall rejects negative ceiling area', () => assert.throws(() => drywall(100,-1,0,4,8,10), RangeError));
test('drywall planning consumables follow documented heuristics', () => { const r=drywall(320,0,0,4,8,0); assert.equal(r.screws,320); assert.equal(r.tapeFt,87); assert.equal(r.compoundGallons,.8); });
test('pavers apply waste to exact requirement before whole-unit rounding', () => { const r=pavers(1,12,3.6,10); close(r.exactBase,10/3); close(r.adjustedCount,11/3); assert.equal(r.base,4); assert.equal(r.count,4); });
test('pavers calculate pallets from purchase quantity', () => { const r=pavers(100,8,4,10,100); assert.equal(r.count,495); assert.equal(r.pallets,5); });
test('pavers reject invalid optional pallet quantity', () => assert.throws(() => pavers(10,8,4,10,0), RangeError));
test('polymeric sand uses non-overlapping repeated-module joint area', () => { const r=polymericSand(100,8,4,.25,1.5,100,40,10); close(r.moduleAreaIn2,35.0625); close(r.jointPlanAreaIn2,3.0625); assert.ok(r.volumeFt3>0); assert.ok(r.adjustedWeight>r.baseWeight); assert.equal(r.bags,Math.ceil(r.exactBags)); });
test('polymeric sand responds proportionally to fill depth', () => { const a=polymericSand(100,8,4,.25,1,100,40,0); const b=polymericSand(100,8,4,.25,2,100,40,0); close(b.volumeFt3,2*a.volumeFt3); });
test('polymeric sand rejects zero joint width', () => assert.throws(() => polymericSand(100,8,4,0,1,100,40,0), RangeError));
test('fence removes gate openings before section count', () => { const r=fence(20,'panel',8,2,1,4,0,2); assert.equal(r.net,16); assert.equal(r.sections,2); });
test('fence counts a separate run on each side of one gate', () => { const r=fence(20,'panel',8,2,1,4,0,2); assert.equal(r.posts,4); assert.equal(r.cornerEnd,2); assert.equal(r.linePosts,2); });
test('fence separates adjusted panels from purchase panels', () => { const r=fence(100,'panel',8,2,0,0,10,2); assert.equal(r.sections,13); close(r.adjustedPanels,14.3); assert.equal(r.panels,15); });
test('fence spacing mode does not claim panel purchases', () => { const r=fence(100,'spacing',8,2,0,0,10,2); assert.equal(r.adjustedPanels,0); assert.equal(r.panels,0); });
test('fence rejects gates that consume the full run', () => assert.throws(() => fence(8,'panel',8,2,2,4,0,2), RangeError));
