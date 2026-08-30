# Navorika Construction & Code-Sensitive Calculation Rehabilitation Report

## Executive Summary

This sprint inventoried all 40 registered construction calculators and performed a deeper source, formula, interface, and test review of the highest-risk code-sensitive and quantity tools. Ten public tools were repaired or clarified without adding, removing, or renaming any route. The main corrections were OSHA ladder geometry, invalid brick-volume arithmetic in a legacy shared helper, impossible rebar geometry, silent coercion of invalid compliance inputs, and non-finite estimate adjustments.

The calculation suite grew from 53 to 91 passing tests. Five existing inline calculation routes now have architecture-enforced pure-module ownership. The production webpack build completed all 275 static pages. No dependency, slug, canonical, category, or `next.config.ts` change was made.

Classification used during triage:

- **CONFIRMED DEFECT:** brick helper dimensional arithmetic; OSHA ladder working-length geometry; impossible rebar cover output.
- **OUTDATED RULE:** none confirmed in the selected federal OSHA, 2021 IRC reference, electrical follow-up, or AY 2026–27 tax source review.
- **JURISDICTION RISK:** egress criteria, stair limits, electrical design, sanitation rules beyond federal OSHA, tax treatment, lawful haul payloads, and structural reinforcement requirements.
- **UNSAFE WORDING:** concrete nominal ratio could be mistaken for a strength grade; rebar takeoff could be mistaken for reinforcement design; the egress reference edition and OSHA state-plan scope needed to be more explicit.
- **NUMERICAL SAFETY ISSUE:** non-finite estimate adjustments and invalid egress, OSHA, ladder, material, excavation, and rebar inputs.
- **ARCHITECTURE IMPROVEMENT:** shared typed construction-quantity module and route-to-module enforcement for five additional routes.
- **TEST COVERAGE ONLY:** stair/stringer, roof pitch, post-hole concrete, dumpster weight, air compressor demand, and saw kerf selected cases.

## Tools Audited

The authoritative registry contains 40 tools in `construction-calculators`:

`roof-pitch-calculator`, `stair-stringer-calculator`, `deck-board-calculator`, `fence-calculator`, `post-hole-concrete-calculator`, `drywall-calculator`, `paver-calculator`, `polymeric-sand-calculator`, `mulch-calculator`, `topsoil-calculator`, `air-compressor-cfm-calculator`, `ladder-safe-reach-calculator`, `saw-kerf-calculator`, `osha-portable-toilet-calculator`, `egress-window-code-checker`, `dumpster-weight-calculator`, `asphalt-calculator`, `brick-calculator`, `cement-calculator`, `concrete-calculator`, `construction-cost-calculator`, `excavation-calculator`, `flooring-calculator`, `gravel-calculator`, `house-construction-cost-calculator`, `land-area-converter`, `paint-calculator`, `rebar-calculator`, `roof-area-calculator`, `sand-calculator`, `solar-panel-calculator`, `steel-weight-calculator`, `tile-calculator`, `voltage-drop-calculator`, `water-tank-calculator`, `wire-size-calculator`, `wallpaper-calculator`, `board-foot-calculator`, `construction-estimate-builder`, and `contractor-estimate-generator`.

Deep formula/source/test review covered 20 high-risk or representative tools:

- Egress, OSHA sanitation, ladder reach, stair/stringer, and roof pitch.
- Concrete, brick, rebar, gravel, excavation, post-hole concrete, and dumpster weight.
- Construction estimate builder, contractor estimate generator, house construction cost, and asphalt.
- Air compressor demand and saw kerf.
- Voltage drop and wire size as the requested electrical follow-up.
- `tax-calculator` was additionally checked against the current official AY 2026–27 slab/rebate source; it was not counted among the 40 construction tools.

## Tools Changed

- `ladder-safe-reach-calculator`: corrected OSHA working-length geometry and associated copy; invalid values now produce an explicit error.
- `brick-calculator`: moved active takeoff math to a typed module with full three-axis unit conversion and validation.
- `rebar-calculator`: moved grid math to a typed module; impossible clear-cover geometry now fails clearly; output is explicitly a straight-bar takeoff using theoretical mass.
- `gravel-calculator`: moved math to a typed module and made density, allowance, and truck payload explicit/editable.
- `excavation-calculator`: moved bank/loose-volume and haul math to a typed module with validation.
- `concrete-calculator`: exact foot conversion, invalid-input handling, and safer nominal-mix wording.
- `egress-window-code-checker`: invalid values no longer silently become zero; the 2021 IRC reference edition/sections are stated near the result content.
- `osha-portable-toilet-calculator`: invalid workforce no longer silently becomes one; state-plan scope wording was clarified.
- `construction-estimate-builder` and `contractor-estimate-generator`: non-finite adjustments are rejected and markup is explicitly distinguished from implied pre-discount margin.

## Tools Verified Correct

- `stair-stringer-calculator`: whole-riser rounding, equal recomputed riser height, one-fewer-tread convention, run, angle, and hypotenuse are internally consistent. It remains planning geometry and makes no universal code claim.
- `roof-pitch-calculator`: rise/run, X:12, angle, percent slope, and rafter multiplier agree.
- `post-hole-concrete-calculator`: post displacement is subtracted before multiplying hole count and rounding bags.
- `dumpster-weight-calculator`: direct weight units bypass moisture multipliers; moisture-sensitive planning densities apply condition factors; allowance and overage stay separate.
- `air-compressor-cfm-calculator`: duty cycle is applied before capacity comparison; tank runtime is explicitly approximate.
- `saw-kerf-calculator`: exact-edge cases avoid charging an unnecessary last cut.
- `house-construction-cost-calculator`: prior pure-module tests still verify area conversion, land-cost separation, contingency, and cost-per-area behavior.
- `asphalt-calculator`: prior tests still verify density, waste, thickness units, and invalid inputs.
- `voltage-drop-calculator` and `wire-size-calculator`: prior tests still pass and the pages retain clear limitations against code-compliance or installation claims.
- `tax-calculator`: AY 2026–27 new-regime slabs, ₹60,000 Section 87A maximum rebate up to ₹12 lakh total income, and 4% cess matched the current Income Tax Department reference during source review. Specialized-rate income and full filing eligibility remain outside its stated scope.

## Confirmed Defects

### OSHA ladder base geometry

- **Previous behavior:** base offset was calculated as one-quarter of vertical height, giving about 4.85 ft for a 20 ft ladder.
- **Why wrong:** 29 CFR 1926.1053(b)(5)(i) states horizontal distance as approximately one-quarter of working length, not vertical rise.
- **Corrected behavior:** base offset is working length ÷ 4; vertical height is the remaining right-triangle leg. A 20 ft working length now gives a 5.00 ft base and about a 75.52° angle.
- **Independent verification:** OSHA regulation source plus an exact 20 ft boundary test.
- **User impact:** removes a small but safety-relevant under-offset in the displayed planning setup.

### Legacy brick helper dimensional error

- **Previous behavior:** total wall mortar volume was added to the volume of one brick before dividing wall volume, mixing project-scale and per-unit volumes.
- **Why wrong:** quantities with incompatible scale were added, causing severe under-counts.
- **Corrected behavior:** mortar volume is subtracted from wall volume, then remaining solid-brick volume is divided by one brick volume. The public brick route uses the clearer nominal brick-plus-joint model in the new module.
- **Independent verification:** a 1 m³ reference wall with 20% mortar and 0.001 m³ bricks returns 800 bricks.
- **User impact:** prevents materially understated masonry quantities if the shared helper is reused.

### Impossible rebar cover

- **Previous behavior:** cover equal to or greater than half a slab dimension could create negative usable dimensions, bar counts, lengths, and mass.
- **Why wrong:** a reinforcement grid cannot exist when twice the entered cover consumes a plan dimension.
- **Corrected behavior:** the module rejects the geometry and the route shows a clear error while preserving prior valid results behavior.
- **Independent verification:** boundary test with 1 m dimensions and 500 mm cover; browser test with excessive cover.
- **User impact:** prevents plausible-looking negative or nonsensical takeoffs.

### Silent compliance-input coercion

- **Previous behavior:** invalid/non-finite egress and ladder dimensions became zero, while invalid OSHA workforce became one.
- **Why wrong:** a user could receive a compliance-looking fail/result for data they never validly supplied.
- **Corrected behavior:** pure modules reject invalid values and client interfaces render explicit, non-crashing error states.
- **Independent verification:** zero/NaN/Infinity unit tests plus browser checks on egress, OSHA, and ladder routes.
- **User impact:** invalid input can no longer masquerade as an evaluated code or safety result.

### Non-finite estimate adjustments

- **Previous behavior:** `NaN` percentages could propagate through totals; the UI also did not quantify the distinction between markup and margin.
- **Why wrong:** non-finite totals are not usable, and markup on cost is not equal to profit margin on selling price.
- **Corrected behavior:** adjustment percentages and discount must be finite/non-negative; the summary reports implied pre-discount margin. A 25% markup correctly shows 20% implied margin.
- **Independent verification:** sequencing, markup/margin, and non-finite-input tests; rendered 10% markup case shows 9.09% implied margin.
- **User impact:** prevents corrupted totals and reduces pricing interpretation risk.

## Outdated Rules

No selected rule was confirmed outdated. The egress calculator deliberately names the 2021 IRC dimensional reference rather than presenting it as a universal current local code. Federal OSHA sanitation and ladder regulation pages were checked during this sprint. The AY 2026–27 tax calculator also matched the current Income Tax Department page at review time.

Rule currency is not the same as local adoption. The egress reference can still differ from local amendments or a jurisdiction’s adopted edition, and OSHA-approved state plans can impose different or additional requirements.

## Jurisdiction Risks

- Egress: local adoption, amendments, opening operation, wells, drainage, path to a public way, replacement-window exceptions, alarms, permits, and bedroom rules remain outside the four checked dimensions.
- Stairs: riser/tread limits, headroom, landings, nosings, handrails, guards, stringer capacity, and configuration vary.
- OSHA: state-plan and local sanitation rules, servicing, accessibility, reasonable access, and actual fixture configuration can require more than the numeric federal table result.
- Rebar/concrete: structural design, cover, spacing, development, durability, strength, batch yield, and approved mix requirements must come from project documents and applicable codes.
- Hauling: density and swell are site-specific; truck payload must be lawful for the vehicle, road, axle, and jurisdiction.
- Electrical: simplified copper resistance/ampacity planning cannot establish a code-compliant conductor installation.
- Tax: eligibility, special-rate income, deductions, surcharge, residence, filing status, and future assessment years require separate current-law review.

## Unsafe Compliance Wording

- Concrete now says the 1:1.5:3 result is a nominal volumetric planning ratio and does not establish a strength grade.
- Rebar now says it is a straight-bar quantity takeoff, not reinforcement design, and directs users to structural drawings.
- Egress now states the 2021 IRC R310.2.1–R310.2.3 reference near the code disclaimer.
- OSHA wording now distinguishes federal OSHA from OSHA-approved state-plan requirements.
- Estimates explain that entered markup is applied to the cost base and is not a target profit margin.

## Calculation Modules Added/Changed

- Added `src/lib/calculations/constructionQuantities.ts` with typed, React-free functions for brick quantity, rebar grids, bulk materials/gravel, and excavation/haul calculations.
- Changed `construction.ts` for exact foot conversion, validation, safer nominal concrete semantics, and dimensionally valid legacy brick arithmetic.
- Changed `ladderSafeReach.ts`, `egressWindow.ts`, and `oshaPortableToilet.ts` to reject invalid inputs instead of manufacturing defaults.
- Changed `constructionEstimate.ts` to validate adjustments and return `impliedMarginPercent`.
- Extended the existing architecture validator so concrete, brick, rebar, gravel, and excavation routes cannot silently bypass their designated calculation modules.

## Tests Added

Added `constructionCorrectness.test.mjs` with 38 named tests. The total calculation suite is now 91 tests, all passing.

The new suite covers 16 public construction tools/routes: concrete, brick, rebar, gravel, excavation, egress, OSHA sanitation, ladder reach, stair/stringer, roof pitch, post-hole concrete, dumpster weight, air compressor, saw kerf, construction estimate builder, and contractor estimate generator.

Coverage includes normal cases, exact thresholds, invalid/non-finite inputs, metric/imperial conversion, independent criteria, rounding direction, density/allowance ordering, bank-versus-loose volume, markup/margin, and cross-field invariants.

## Reference Sources

- ICC, 2021 IRC Chapter 3, R310 emergency escape and rescue openings: https://codes.iccsafe.org/content/IRC2021P1/chapter-3-building-planning
- OSHA, 29 CFR 1926.51 sanitation and Table D-1: https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.51
- OSHA interpretation on sanitary/available construction toilets: https://www.osha.gov/laws-regs/standardinterpretations/2006-05-17-0
- OSHA, 29 CFR 1926.1053 ladder setup and upper-landing extension: https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1053
- NIST, international foot conversion (`1 ft = 0.3048 m` exactly): https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors
- Income Tax Department, salaried individuals for AY 2026–27: https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-1

## Unit-Conversion Verification

- Feet are converted as linear units using exactly 0.3048 m before area/volume multiplication.
- A 1 ft × 1 ft × 1 ft volume test produces 0.028316846592 m³ for brick, gravel/bulk-material, and excavation paths.
- Millimetres convert to metres by 1,000 for rebar spacing/cover and mortar joints.
- Egress area converts square inches to square feet by 144; 34.2 in × 24 in is exactly 5.7 ft².
- Rebar mass uses the displayed theoretical `d²/162 kg/m` approximation; it is not a fabrication weight guarantee.
- Tons in changed construction outputs are labeled metric tonnes where the underlying mass is kilograms.

## Browser/Mobile Verification

**BROWSER VERIFIED** using the local rendered Next.js application:

- 320 px: egress calculator and rebar calculator. No horizontal overflow; valid boundary result and explicit invalid-width/cover messages rendered.
- 375 px: OSHA portable-toilet calculator and gravel calculator. No horizontal overflow; 200-worker fixture-set result, zero-worker error, editable allowance output, and results rendered.
- 768 px: ladder calculator and construction estimate builder. No horizontal overflow; corrected 20 ft ladder base showed 5.00 ft, zero-length error rendered, and 10% markup showed 9.09% implied margin.
- No browser console errors were observed on the six representative pages.

**SOURCE REVIEW ONLY** for the remaining inventory tools not listed above. Their route presence, registry/category placement, claims, and available pure-module/test coverage were reviewed, but this report does not claim interactive browser exercise of every construction calculator.

## Validation Results

- `npm run test:calculations`: PASS — 91/91 tests.
- `npm run typecheck`: PASS.
- `npm run validate:architecture`: PASS — 185 registered tools, 185 routes, 45 clusters, 8 toolkits, 109 tool SEO records, 31 complete guides.
- `git diff --check`: PASS.
- `npm run lint:baseline`: PASS — 150 errors/125 warnings against maximum 182/197.
- `npx next build --webpack`: PASS — compiled successfully, TypeScript passed, 275/275 static pages generated.
- Build warnings: existing Next.js middleware deprecation and Next internal Edge Runtime `process.cwd` warning; neither failed the build and neither was bypassed.

## Remaining High-Risk Construction Tools

- `deck-board-calculator`, `fence-calculator`, `drywall-calculator`, `paver-calculator`, and `polymeric-sand-calculator`: validate quantity heuristics, boundary geometry, and waste application with dedicated tests.
- `cement-calculator`, `sand-calculator`, `paint-calculator`, `tile-calculator`, and `steel-weight-calculator`: migrate remaining inline/legacy arithmetic to validated typed modules.
- `construction-cost-calculator`: distinguish it more clearly from the tested house-cost and detailed estimate tools; verify every cost assumption.
- `wire-size-calculator` and `voltage-drop-calculator`: keep as planning screens and consider edition/jurisdiction-specific source metadata without making code-compliance claims.
- `egress-window-code-checker`: future work may add separately scoped checks for wells and operational constraints, but should not combine jurisdictions or editions into a false universal pass.
- `taxation-compliance-deck`: perform a dedicated current-law sprint before expanding its compliance claims or subtools.

## Recommended Next Sprint

Rehabilitate the remaining material/finish estimators as a coherent “supplier takeoff” group: extract cement, sand, paint, tile, steel, drywall, paver, polymeric-sand, deck, and fence formulas; make density, package yield, waste, openings, stock length, and rounding assumptions explicit; add supplier-pack rounding and unit-invariant tests; then browser-test the group at the same three responsive widths. Keep electrical and tax/legal maintenance in separate source-dated sprints so construction quantity work does not blur into jurisdiction-specific compliance advice.
