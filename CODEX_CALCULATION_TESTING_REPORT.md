# Navorika Calculation Testing & Validation Infrastructure Report

## 1. Executive Summary

This sprint established a reusable, Node-native calculation test system and applied it to 17 production calculators across finance/property/business, construction, health, energy/electrical, AI/cloud, and shipping. The suite now runs 53 named tests from five domain test modules through one `npm run test:calculations` command.

Two confirmed defects were repaired:

1. `loan-emi-calculator` returned `NaN` for a valid 0% interest loan.
2. `wire-size-calculator` relied on JavaScript object-key enumeration for gauge order. Integer-like gauge keys were enumerated numerically rather than in the intended smallest-to-largest conductor order, so ordinary loads could be recommended 1/0 AWG before smaller valid sizes were considered.

Ten inline calculators now consume pure shared TypeScript modules. Existing shared modules for six additional tools gained reference, boundary, and invalid-input coverage, and BMI gained module-level finite/positive validation. No tool, route, registry entry, canonical URL, dependency, or `next.config.ts` setting was removed or renamed.

## 2. Calculation Inventory

| Inventory item | Count | Method / note |
|---|---:|---|
| Registered tools | 185 | Architecture validator / authoritative registry |
| Tool routes | 185 | Architecture validator |
| Pure calculation `.ts` modules | 37 | `src/lib/calculations`, excluding tests |
| Calculation test modules | 5 | Includes the existing retirement-finance suite |
| Named calculation tests | 53 | Final TAP result |
| Calculation-bearing tool route candidates | 66 | Unique union of direct calculation imports and broad inline-math signals; triage inventory, not a defect count |
| Route/shared-component files importing calculation modules | 43 | Static import search |
| Tool pages still matching a broad inline-math heuristic | 45 | Risk-triage signal only; includes benign display math and is not a defect count |
| Tools rehabilitated in this sprint | 17 | Selected table below |

The pre-existing product audit identified 61 route files with inline numerical logic and 31 route/shared implementations importing calculation modules. The current heuristic is intentionally broader/different and should be used for prioritization, not as an exact migration metric.

## 3. Risk Ranking

The table captures the top 30 highest-risk calculators that lacked dedicated coverage at inventory time. Risk combines consequence of a wrong answer, formula complexity, regulatory/code sensitivity, unit-conversion exposure, invalid-input behavior, and then-current test coverage. Entries completed during this sprint are marked accordingly.

| Rank | Tool / suite | Primary risk | Sprint status |
|---:|---|---|---|
| 1 | wire-size-calculator | Electrical safety, ampacity table, voltage drop, ordering | Repaired and tested |
| 2 | voltage-drop-calculator | Electrical safety, conductor resistance, units, phase | Extracted and tested |
| 3 | solar-panel-calculator | Loss denominator, irradiance assumption, sizing | Extracted and tested |
| 4 | loan-emi-calculator | Financial timing, 0% rate, amortization | Repaired and tested |
| 5 | tax-calculator | Jurisdiction/year-sensitive rules | Remaining |
| 6 | taxation-compliance-deck | Multiple statutory rule sets | Remaining |
| 7 | house-construction-cost-calculator | Unit conversion and cost inclusion boundaries | Extracted and tested |
| 8 | construction-estimate-builder | Multi-line aggregation and commercial totals | Remaining |
| 9 | contractor-estimate-generator | Labor/material/markup/tax semantics | Remaining |
| 10 | egress-window-code-checker | Safety and local code variation | Remaining |
| 11 | stair-stringer-calculator | Geometry and life-safety layout | Remaining |
| 12 | roof-pitch-calculator | Geometry and unit interpretation | Remaining |
| 13 | concrete-calculator | Geometry, waste, bag/yield assumptions | Remaining |
| 14 | rebar-calculator | Layout, spacing, laps, exclusions | Remaining |
| 15 | water-tank-calculator | Shape formula and cubic unit conversion | Extracted and tested |
| 16 | asphalt-calculator | Thickness conversion, density, waste, payload | Extracted and tested |
| 17 | roof-area-calculator | Pitch factor, overhang, waste | Extracted and tested |
| 18 | flooring-calculator | Area conversion and cost bases | Extracted and tested |
| 19 | bmi-calculator | Health thresholds and invalid measurements | Hardened and tested |
| 20 | heart-rate-calculator | Health language and population estimates | Tested |
| 21 | body-fat-calculator | Health formula selection and applicability | Remaining |
| 22 | calorie-calculator | Health model assumptions and ranges | Remaining |
| 23 | bmr-calculator | Health model selection and validation | Remaining |
| 24 | rental-property-cash-flow-calculator | NOI versus debt-service semantics | Tested |
| 25 | cap-rate-calculator | NOI/value denominator and expense scope | Tested |
| 26 | startup-runway-calculator | Cash timing and growth projection | Tested |
| 27 | llm-api-cost-calculator | Cached-token and unit pricing | Tested |
| 28 | dimensional-weight-calculator | Divisor/service assumptions and units | Extracted and tested |
| 29 | air-compressor-cfm-calculator | Engineering assumptions and unit safety | Remaining |
| 30 | aws-glacier-retrieval-calculator | Tier/request/data cost modeling | Remaining |

## 4. Tools Selected for This Sprint

| Tool | Domain | Risk | Previous architecture | Action |
|---|---|---|---|---|
| loan-emi-calculator | Finance | High | Inline route formula; untested shared EMI module | Reused/hardened module; fixed 0% defect; tested timing and invalid inputs |
| rental-property-cash-flow-calculator | Property | High | Existing pure module, no dedicated tests | Added NOI/debt-service and sanitization tests |
| cap-rate-calculator | Property | High | Existing pure module, no dedicated tests | Added NOI/value and zero-denominator tests |
| startup-runway-calculator | Business | High | Existing pure module, no dedicated tests | Added burn/profitable reference cases |
| llm-api-cost-calculator | AI/cloud | High | Existing pure module, no dedicated tests | Added cached/uncached/output and zero-request tests |
| bmi-calculator | Health | High | Existing pure module with UI-only validation | Added module validation and CDC reference/threshold tests |
| heart-rate-calculator | Health | High | Existing pure module, no dedicated tests | Added AHA zone and manual-pulse tests |
| electricity-cost-calculator | Energy | Medium-high | Inline `useMemo` formula | Extracted to energy/electrical module; tested normal/zero/invalid cases |
| solar-panel-calculator | Energy | High | Inline route formula | Extracted; guarded zero sun and total loss; added error UI and tests |
| voltage-drop-calculator | Electrical | Critical | Inline formula and local resistance table | Extracted with explicit resistance input/table; tested phases and invalid denominators |
| wire-size-calculator | Electrical | Critical | Inline table/loop dependent on object enumeration | Extracted; fixed gauge order; tested compliant and beyond-table cases |
| house-construction-cost-calculator | Construction | High | Inline route formula | Extracted; clarified cost bases; added conversion/invalid tests and error UI |
| water-tank-calculator | Construction | High | Inline shape formulas | Extracted; tested three shapes, unit conversion, and invalid dimensions |
| asphalt-calculator | Construction | High | Inline volume/density formula | Extracted; tested thickness units, density, waste, payload, and invalid inputs |
| roof-area-calculator | Construction | High | Inline simple-roof geometry | Extracted; tested pitch, overhang/waste behavior, and invalid dimensions |
| flooring-calculator | Construction | Medium-high | Inline area/cost formula | Extracted; tested material/labor bases, units, and invalid rates |
| dimensional-weight-calculator | Shipping | Medium-high | Inline `useMemo` formula | Extracted; tested divisor, billable-weight selection, and invalid inputs |

## 5. Confirmed Defects Repaired

### EMI at zero interest

The standard annuity expression divides by `(1 + r)^n - 1`. At `r = 0`, both numerator and denominator collapse to zero. The corrected branch uses `principal / months`, producing a valid zero-interest payment and zero total interest. The amortization schedule now covers the requested term rather than silently truncating at 360 months.

### Wire gauge enumeration order

The prior record used keys such as `'14'`, `'12'`, `'10'`, `'1'`, and `'0'`. ECMAScript enumerates integer-index keys in numeric order before other string keys, so insertion order was not the engineering order the loop assumed. The new module owns an explicit `WIRE_GAUGE_ORDER` from 14 AWG through 4/0 AWG. A regression test verifies that a normal 20 A planning case selects 10 AWG rather than 1/0 AWG.

## 6. Numerical Safety Improvements

- Denominators now reject zero where zero has no coherent meaning: voltage, peak sun hours, dimensional divisor, dimensions, and loan term.
- Negative costs, rates, waste allowances, energy use, dimensions, and principal are rejected or sanitized according to each existing module's contract.
- Solar losses must remain below 100%.
- Electricity use cannot exceed 24 hours per day.
- BMI rejects non-finite or non-positive measurements at the module boundary, not only in the UI.
- Wire sizing returns the largest table entry with `meetsCriteria: false` when no listed conductor satisfies the simplified planning criteria; it does not present that entry as compliant.
- Construction calculations keep explicit cost bases: land is excluded from construction cost per square foot, flooring waste applies to material order area, and labor applies to measured floor area.

## 7. Calculation Modules Added

New pure modules:

- `src/lib/calculations/energyElectrical.ts`: electricity cost, preliminary solar sizing, voltage drop, and simplified wire recommendation.
- `src/lib/calculations/projectEstimators.ts`: house cost, tank capacity, asphalt quantity, simple roof area, flooring cost, and dimensional shipping weight.

Hardened modules:

- `src/lib/calculations/emi.ts`
- `src/lib/calculations/bmi.ts`

The modules import no React or browser APIs and can execute under Node's TypeScript stripping support.

## 8. Test Infrastructure and Coverage

`scripts/run-calculation-tests.mjs` discovers every `src/lib/calculations/*.test.mjs` file, sorts the list, and imports all suites. This makes `npm run test:calculations` the single project command for current and future calculation tests without maintaining a hand-written file list.

Domain suites:

- `energyElectrical.test.mjs`: 9 tests
- `financeBusiness.test.mjs`: 9 tests
- `health.test.mjs`: 6 tests
- `projectEstimators.test.mjs`: 12 tests
- existing `retirementFinance.test.mjs`: 17 tests

Final total: **53 passed, 0 failed**.

## 9. Architecture Changes

`scripts/validate-architecture.mjs` now verifies that:

- `package.json` exposes the standard calculation runner;
- the runner exists;
- at least one calculation test module exists;
- every test module imports a real calculation `.ts` module;
- calculation modules do not import React;
- calculation test names are unique;
- the 11 selected route-level migrations import their required shared module.

These are static, durable checks and do not execute tests inside architecture validation. Formula assertions remain owned by `npm run test:calculations`.

## 10. Validation Improvements

- Adult BMI formula/categories: [CDC Adult BMI Calculator](https://www.cdc.gov/bmi/adult-calculator/)
- Age-predicted maximum and exercise percentages: [American Heart Association Target Heart Rates](https://www.heart.org/en/healthy-living/exercise-and-physical-activity/fitness-basics/target-heart-rates)
- Solar system-loss interpretation and production-model limitations: [NREL PVWatts Calculator](https://pvwatts.nrel.gov/) and [PVWatts V5 Manual](https://pvwatts.nrel.gov/downloads/pvwattsv5.pdf)
- Copper conductor resistance and round-trip voltage-drop reference: [Copper Development Association Recommended Practices](https://www.copper.org/applications/electrical/building/pdf/copper-wire-install-standard.pdf)
- AC voltage-drop complexity and phase equations: [Southwire Power Cable Installation Guide](https://www.southwire.com/medias/Power-Cable-Installation-Guide-Southwire.pdf)
- Asphalt volume/density relationship: [FHWA Superpave background](https://www.fhwa.dot.gov/pavement/pubs/013177.pdf)

Electrical outputs remain explicitly preliminary. The tool does not claim code compliance; conductor temperature, insulation, termination ratings, installation method, bundling, ambient correction, fault protection, power factor/reactance, and local rules still require qualified design review.

## 11. Validation Results

| Command | Result |
|---|---|
| `npm run test:calculations` | PASS — 53 tests, 53 passed, 0 failed |
| `npm run typecheck` | PASS |
| `npm run validate:architecture` | PASS — 185 tools, 185 routes, 45 clusters, 8 toolkits, 109 SEO records, 31 guides |
| `git diff --check` | PASS |
| `npm run lint:baseline` | PASS — 155 errors / 125 warnings, within maximum 182 / 197 |
| `rm -rf .next && npx next build --webpack` | PASS — 275/275 static pages generated |

Build warnings retained for follow-up, not caused by this sprint:

- Next.js warns that the `middleware` convention is deprecated in favor of `proxy`.
- Next.js reports `process.cwd` use in its own dynamic-rendering import trace for the Edge runtime.
- Node emits a typeless-package warning while directly importing stripped TypeScript test targets. Adding `"type": "module"` was intentionally avoided because that is a broader package-level behavior change.

## 12. Browser Checks

### BROWSER VERIFIED

Representative tools were exercised in the in-app browser against the local development build:

- `loan-emi-calculator`: 0% rate produced ₹0 interest and a finite payment.
- `wire-size-calculator`: produced a finite gauge result using the new ordered module.
- `solar-panel-calculator`: zero peak-sun hours produced a clear validation message.
- `water-tank-calculator`: default rectangular case produced 4,500 L.
- `bmi-calculator`: default metric case produced 22.9.

All five were checked at 320px and 375px. For every page, document `scrollWidth` equaled `clientWidth`; no horizontal overflow or browser console errors were observed.

### SOURCE REVIEW ONLY

The remaining selected tools were verified through source review, pure-module reference cases, TypeScript, architecture checks, and the production build, but were not individually exercised in the browser. This distinction is intentional and no browser claim is made for those routes.

## 13. Remaining Top 20 Calculation Risks

1. `tax-calculator` — verify jurisdiction/year model and encode versioned statutory references.
2. `taxation-compliance-deck` — split and test income-tax, GST, HRA, and compliance assumptions.
3. `egress-window-code-checker` — jurisdiction-specific life-safety rules need explicit scope/versioning.
4. `stair-stringer-calculator` — test rise/run rounding, total rise, tread count, and code disclaimers.
5. `roof-pitch-calculator` — reconcile with the newer roof-area module and test all unit presentations.
6. `concrete-calculator` — test shapes, waste, density/yield assumptions, and bag conversions.
7. `rebar-calculator` — test spacing, edge cover, laps, intersections, and exclusions.
8. `construction-estimate-builder` — verify line aggregation, unit costs, overhead, tax, and exports.
9. `contractor-estimate-generator` — verify markup versus margin and taxable cost semantics.
10. `excavation-calculator` — test cut volume, swell/shrink factors, slopes, and haul units.
11. `air-compressor-cfm-calculator` — verify pressure/flow assumptions and equipment safety language.
12. `ladder-safe-reach-calculator` — verify geometry and keep safety claims conservative.
13. `saw-kerf-calculator` — test repeated cuts, stock loss, and unit boundaries.
14. `body-fat-calculator` — validate formula applicability and health-language boundaries.
15. `calorie-calculator` — verify model selection, activity factors, and safe output language.
16. `bmr-calculator` — test Mifflin-St Jeor inputs, units, and population limitations.
17. `healthy-weight-calculator` — align thresholds and limitations with the tested BMI module.
18. `cloud-hosting-cost-calculator` — test all cost components, zero use, and pricing units.
19. `gpu-compute-cost-calculator` — review utilization semantics and scheduled versus billed hours.
20. `aws-glacier-retrieval-calculator` — verify tier timing, request counts, data units, and user-entered pricing.

## 14. Future Calculator Standard

Every new or materially changed calculator should:

1. Put formulas in a pure `src/lib/calculations/<domain>.ts` module.
2. Accept a typed input object and return a typed result object.
3. Define behavior for empty, non-finite, zero, negative, and denominator inputs.
4. Keep unit conversion at a named boundary and test both unit systems.
5. Distinguish user assumptions, authoritative constants, estimates, and regulatory rules.
6. Link authoritative sources when a public-health, engineering, tax, or code rule matters.
7. Add normal, boundary, invalid, and independently computed reference cases to a focused domain test file.
8. Use unique, descriptive test names.
9. Make the route/component consume the tested module; do not duplicate the formula in UI code.
10. Preserve conservative language for health, finance, electrical, structural, legal, and regulatory outputs.
11. Verify mobile overflow and one valid/invalid interaction in a browser for changed UI.
12. Pass the full project validation and production webpack build before release.

## 15. Follow-Up Recommendation

Prioritize **additional calculation rehabilitation**, specifically a **Construction and Code-Sensitive Calculator Sprint** focused on the first 10 items in the remaining list. This should come before file-tool infrastructure, content consolidation, or new construction tools because existing safety/code-sensitive calculators already carry higher correctness risk. Reuse `projectEstimators.ts` only where the concepts genuinely share units and validation; create focused modules for stair geometry, concrete/rebar takeoff, and jurisdiction-scoped code checks. The acceptance bar should include independent reference calculations, explicit rule versions, mobile browser checks, and no claims of code compliance without jurisdiction and edition context.
