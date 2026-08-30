# Navorika Supplier Takeoff Correctness Report

## Executive Summary

This sprint audited exactly ten existing supplier-facing construction estimators. All ten now use tested, React-free calculation modules as their production source of truth, report measured or base quantities separately from allowance-adjusted and whole-unit purchasing quantities where applicable, and reject non-finite or impossible inputs instead of returning plausible-looking results.

Five confirmed calculation defects were repaired: paver waste was applied after premature whole-unit rounding; paver floating-point noise could add a unit at an exact integer boundary; polymeric-sand joint volume used an inconsistent paver-face count and joint-length approximation; fence post logic failed to account for the additional fence run created by a gate; and drywall silently clamped openings that consumed the entire gross area.

The calculation suite increased from 91 to 135 passing tests. No dependency, slug, route, canonical, category, guide URL, registry inventory, or Next.js configuration change was made.

## Ten Target Tools

### 1. cement-calculator

- Previous architecture: all conversions, ratio splitting, assumed density, dry-volume factor, and bag rounding lived in the client page.
- Formula: wet volume is converted to m³, multiplied by the explicit 1.54 dry-volume factor, split by the selected cement:sand:aggregate ratio, and cement volume is multiplied by the explicit 1,440 kg/m³ bulk density. Only bag purchase count is rounded upward.
- Assumptions: nominal volumetric ratio, fixed dry-volume factor, bulk density, and selected bag mass; it is not a strength class or verified mix design.
- Classification: ARCHITECTURE IMPROVEMENT; HIDDEN ASSUMPTION; NUMERICAL SAFETY ISSUE.
- Action: moved the calculation to `supplierTakeoffs.ts`, removed unsafe ratio-to-strength labels, exposed exact bag equivalent and whole bags, and retained the nominal-mix warning.
- Tests: nominal reference case, cubic-yard unit invariance, zero-volume rejection.

### 2. sand-calculator

- Previous architecture: rectangular conversion and purchasing divisions were inline; 25 kg bags and 15,000 kg loads were hard-coded and no allowance stage existed.
- Formula: measured rectangular m³ → visible waste allowance → adjusted m³ → density-based kg → exact and whole bag/load equivalents.
- Assumptions: rectangular geometry, user-entered bulk density, bag mass, lawful payload, and waste; moisture, bulking, compaction, and irregular geometry are not inferred.
- Classification: HIDDEN ASSUMPTION; ARCHITECTURE IMPROVEMENT; NUMERICAL SAFETY ISSUE.
- Action: made bag mass, payload, density, and allowance visible and editable; separated measured and adjusted volume/mass.
- Tests: three-dimensional foot conversion, waste/mass/package reference case, non-finite density rejection.

### 3. paint-calculator

- Previous architecture: inline formula always included a ceiling, could not deduct openings, and assumed five-litre cans.
- Formula: gross wall area − wall openings + optional ceiling = net one-coat area; coats and product coverage produce base litres; allowance produces adjusted litres; entered can size produces whole cans.
- Assumptions: one rectangular room, uniform height, combined wall-opening area, one coverage rate, and one can size.
- Classification: HIDDEN ASSUMPTION; ARCHITECTURE IMPROVEMENT; NUMERICAL SAFETY ISSUE.
- Action: added optional ceiling, wall-opening deduction, editable can size, explicit stages, and impossible-opening validation.
- Tests: openings/ceiling reference case, ceiling exclusion, metric/imperial invariance, impossible openings, purchase-can rounding.

### 4. tile-calculator

- Previous architecture: fixed-orientation grid formula lived inline and stopped at whole tiles, leaving packaging as prose.
- Formula: each axis uses ceiling((project side + gap) ÷ (tile side + gap)); the fitted whole-position grid is the justified base layout; waste is applied once and then rounded to whole tiles; boxes round from entered tiles per box.
- Assumptions: fixed orientation, rectangular area, uniform joints, no pattern optimization or offcut reuse.
- Classification: ARCHITECTURE IMPROVEMENT; HIDDEN ASSUMPTION; TEST COVERAGE ONLY.
- Action: centralized the formula, added explicit adjusted quantity and supplier box quantity, and documented the layout boundary.
- Tests: joint-pitch grid, waste and box boundary, inch/cm invariance, negative-gap rejection.

### 5. steel-weight-calculator

- Previous architecture: separate shape formulas lived inline with a fixed density; the I-section used one thickness with limited visible explanation.
- Formula: supported cross-sectional area × entered density = kg/m; kg/m × length per piece × quantity = total theoretical mass.
- Assumptions: round, square, and rectangular shapes are solid; the I-section is sharp-edged, has two rectangular flanges, one clear-height web, and one uniform flange/web thickness.
- Classification: HIDDEN ASSUMPTION; ARCHITECTURE IMPROVEMENT; NUMERICAL SAFETY ISSUE.
- Action: verified each supported shape separately, made density editable, made the I-section geometry explicit, and retained supplier-table caveats.
- Tests: round, square, rectangular, and I-section reference areas plus invalid dimension rejection.

### 6. drywall-calculator

- Previous architecture: shared pure function silently clamped impossible net area to zero and did not expose exact sheet equivalents.
- Formula: gross wall + ceiling − openings = net area; waste applies to net area; exact sheet equivalents divide by entered sheet area; only purchase sheets round upward.
- Assumptions: combined areas are entered in ft²; screws use 32 per purchased sheet, tape uses 0.27 ft per net ft², and compound uses 1 gallon per 450 net ft² as explicitly approximate planning allowances.
- Classification: CONFIRMED DEFECT; NUMERICAL SAFETY ISSUE; HIDDEN ASSUMPTION.
- Action: reject openings greater than or equal to gross area, validate all allowance inputs, expose exact base/adjusted sheets, and label consumable heuristics.
- Tests: net/adjusted/purchase reference case, impossible openings, negative ceiling, consumable heuristics.

### 7. paver-calculator

- Previous architecture: base pavers rounded upward before waste, which could inflate the order; floating-point noise could also turn an exact whole result into an extra paver.
- Formula: exact base pavers = area ÷ paver face area; waste applies to the exact value; whole pavers and pallets round only at their purchasing stages.
- Assumptions: paver face dimensions cover the project area; joints, patterns, cuts, breakage, and repairs are represented only by the visible allowance.
- Classification: CONFIRMED DEFECT; ROUNDING/PACKAGING DEFECT; NUMERICAL SAFETY ISSUE.
- Action: reordered waste and rounding, added tolerance-aware purchasing ceiling, exposed exact/base/adjusted/purchase values, and retained editable pallet quantity.
- Tests: premature-rounding regression, exact-integer floating boundary, pallet conversion, invalid pallet quantity.

### 8. polymeric-sand-calculator

- Previous architecture: estimated paver count from face area and multiplied by half-perimeter joint length, producing an internally inconsistent repeated-grid estimate.
- Formula: module area = (paver length + joint width) × (paver width + joint width); non-overlapping joint plan area = module area − paver face area; joint area × depth gives volume; density, allowance, and bag size produce purchasing output.
- Assumptions: repeating interior rectangular grid; edge joints, cuts, compaction, and product-specific coverage remain outside the model.
- Classification: CONFIRMED DEFECT; HIDDEN ASSUMPTION.
- Action: replaced the inconsistent length approximation with a dimensionally coherent non-overlapping module model and exposed base/adjusted mass and exact/whole bags.
- Tests: module/joint-area reference values, depth proportionality, zero-joint rejection.

### 9. deck-board-calculator

- Previous architecture: correct gap-aware row and stock-piece logic already lived in a shared pure module, but purchasing stages and offcut assumptions were not fully visible.
- Formula: rows satisfy rows × actual board width + (rows − 1) × gap; each row independently rounds stock pieces; waste applies to whole pre-waste stock pieces and the final purchase count rounds upward.
- Assumptions: fixed orientation, actual board width, uniform gap, one stock length, and no cross-row offcut reuse.
- Classification: TEST COVERAGE ONLY; ARCHITECTURE IMPROVEMENT; HIDDEN ASSUMPTION.
- Action: preserved the verified geometry, strengthened finite/negative validation, and exposed exact stock equivalent, pre-waste pieces, adjusted pieces, and whole purchase count.
- Tests: gap boundary, orientation invariance, exact versus row-based stock requirement, negative gap.

### 10. fence-calculator

- Previous architecture: gate widths were removed from panel length, but total posts remained effectively sections + 1 and did not add the additional fence run created by a gate; corner and gate layout capability was overstated.
- Formula: net fenced length subtracts gate openings; sections round upward; each gate creates another straight-run segment for the minimum post count; panel allowance applies before whole-panel rounding.
- Assumptions: preliminary straight-run lower bound only. Exact leg lengths, gate positions, corner geometry, bracing, and terrain are not modeled.
- Classification: CONFIRMED DEFECT; HIDDEN ASSUMPTION; ROUNDING/PACKAGING DEFECT.
- Action: corrected the gate-run post minimum, reject gates consuming the entire run, separated adjusted/whole panels, and replaced exact-layout claims with explicit lower-bound language.
- Tests: gate subtraction, gate-created run posts, panel allowance, spacing mode, impossible gate width.

## Confirmed Defects

- Pavers: waste applied after premature whole-unit rounding.
- Pavers: binary floating-point residue could add an unnecessary whole unit at an exact purchasing boundary.
- Polymeric sand: inconsistent face-area paver count and half-perimeter joint model overstated repeated-grid joint quantity.
- Fence: gates did not increase the minimum post count for the additional fence run.
- Drywall: impossible openings silently collapsed net area to zero.

## Unit / Dimensional Issues

- Added explicit cubic-yard/cubic-foot and metric/imperial invariance coverage.
- Ensured all three sand dimensions convert before multiplication.
- Kept paint opening area conversion squared and independent from optional ceiling logic.
- Verified all steel section formulas use m² cross-sectional area before density multiplication.
- Replaced the polymeric-sand joint approximation with a non-overlapping area × depth volume model.

## Rounding / Package Issues

- Whole-unit ceiling is restricted to bags, loads, cans, tiles, boxes, sheets, pavers, pallets, panels, and boards where indivisible purchasing justifies it.
- Intermediate volume, area, mass, and allowance values remain unrounded.
- Paver allowance now precedes whole-unit rounding.
- A centralized tolerance-aware purchasing ceiling avoids floating-point over-ordering at exact integer boundaries.

## Hidden Assumptions

- Cement remains a nominal material split, not a strength design.
- Sand density, bag mass, and truck payload must be supplier/project values.
- Paint models one rectangular room and combined wall openings.
- Tile models one fixed orientation and does not optimize cuts.
- Steel I-sections are idealized rather than catalog profiles.
- Drywall accessory quantities are approximate heuristics.
- Polymeric sand models repeating interior joints, not perimeter/cut geometry.
- Deck stock calculation assumes no cross-row offcut reuse.
- Fence output is a straight-run lower bound, not an exact segmented layout.

## Pure Modules Added or Changed

- Added `src/lib/calculations/supplierTakeoffs.ts` for cement, sand, paint, tile, and steel.
- Rehabilitated `src/lib/calculations/constructionExpansion.ts` for deck, fence, drywall, pavers, polymeric sand, shared waste validation, and purchasing rounding.
- Both modules are typed, React-free, deterministic, and directly imported by production client components.

## Architecture Enforcement

`scripts/validate-architecture.mjs` now verifies all ten target pages use their expected shared implementation, verifies bridge components where routes re-export a shared calculator, and verifies each shared implementation imports its pure calculation module. Existing direct-route enforcement remains intact.

## Tests Added

- Added 22 supplier takeoff tests in `supplierTakeoffs.test.mjs`.
- Added 22 shared construction expansion tests in `supplierExpansion.test.mjs`.
- Coverage includes normal, boundary, invalid, non-finite, unit-invariance, waste sequencing, package rounding, geometry, and reference cases.

## Total Test Suite

135 tests pass: the original 91 plus 44 new tests. No existing test was removed or weakened.

## Browser/Mobile Verification

- Tested all ten routes at a 320 px viewport: no horizontal overflow, no initial error, and planning results rendered.
- Tested representative flows at 375 px and 768 px.
- Verified paver exact/base/adjusted/purchase output after multiple edits in one session.
- Verified paint ceiling toggle and impossible-opening error.
- Verified drywall impossible-opening error.
- Verified polymeric-sand base/adjusted mass and exact/whole bag display.
- Verified deck exact/adjusted purchasing stages and fence lower-bound/adjusted-panel language.
- Browser console warnings/errors: none.

## Validation Results

- `npm run test:calculations`: PASS, 135/135.
- `npm run typecheck`: PASS.
- `npm run validate:architecture`: PASS — 185 tools, 185 routes, 45 clusters, 8 toolkits, 109 SEO records, 31 complete guides.
- `git diff --check`: PASS.
- `npm run lint:baseline`: PASS.
- `rm -rf .next && npx next build --webpack`: PASS; production `BUILD_ID` generated. Existing Next.js middleware deprecation warning remains informational.

## Remaining Construction Risks

- Supplier density, coverage, pack size, payload, and product yield are project-specific and can dominate formula precision.
- Fence corners and gates need segmented leg positions for exact post/panel layout.
- Tile patterns, rotation, obstacles, and reusable offcuts need a layout optimizer rather than a rectangular grid.
- Deck picture frames, diagonals, mixed stock, and offcut optimization remain outside scope.
- Polymeric-sand manufacturer coverage tables should override geometric estimates when available.
- Cement nominal ratios must not be used as structural strength or durability designs.

## Recommended Next Sprint

Build a segmented-layout takeoff layer for fences, decks, and tiled surfaces: explicit legs/zones, gate and obstacle positions, orientation/pattern choices, and optional offcut reuse. Keep supplier packaging and coverage as user-entered data, then add golden reference fixtures from manufacturer technical sheets without embedding market prices.
