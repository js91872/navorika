# Navorika GSC Guide Enrichment Report

## 1. Starting branch

`feat/gsc-guide-enrichment`

## 2. Starting commit

`17a707a` — `merge: add AI SaaS real estate and finance tools`

## 3. Starting guide count

21 published guides.

## 4. Final guide count

31 complete guides: 21 existing routes plus 10 focused new routes.

## 5. Existing guides enriched

- `/guides/how-to-calculate-emi`
- `/guides/heart-rate-zones-guide`
- `/guides/base64-encoding-guide`
- `/guides/jwt-decoding-guide`
- `/guides/json-formatting-guide`

All five keep their existing slug and canonical URL. The GSC enrichment registry deliberately overrides their older thin content at render time; architecture validation checks the overlay and still rejects duplicate keys within an individual content registry.

## 6. New guides created

- `/guides/house-construction-cost-guide`
- `/guides/water-tank-size-capacity-guide`
- `/guides/how-to-calculate-roof-area`
- `/guides/flooring-calculation-guide`
- `/guides/asphalt-calculation-guide`
- `/guides/gravel-calculation-guide`
- `/guides/electricity-cost-calculation-guide`
- `/guides/brick-calculation-guide`
- `/guides/dimensional-weight-guide`
- `/guides/construction-estimate-quote-guide`

## 7. Topics intentionally not given a new route

Base64 encoding, JWT decoding, JSON formatting, heart-rate zones, and EMI/personal-loan intent were not assigned new routes because suitable indexed guide URLs already existed.

## 8. Cannibalization decisions

- EMI remains the primary informational authority for personal, car, and home loan EMI. No separate personal-loan EMI guide was created.
- Base64, JWT, and JSON preserve their original informational URLs and tool/action intent remains on their calculator/tool pages.
- Heart-rate zones preserves the existing health-guide URL and adds conservative limitations rather than competing with the Heart Rate Calculator.
- Construction estimate and house construction cost have separate intent: line-item commercial estimating versus early area/rate cost planning.
- Tool titles remain action-focused; new guide titles explain methods, assumptions, and examples.

## 9. Titles and slugs

| Slug | Guide title |
|---|---|
| `house-construction-cost-guide` | How to Estimate House Construction Cost |
| `water-tank-size-capacity-guide` | Water Tank Size & Capacity Calculation Guide |
| `how-to-calculate-roof-area` | How to Calculate Roof Area: Pitch, Measurements & Examples |
| `flooring-calculation-guide` | How to Calculate Flooring: Area, Packs & Waste |
| `asphalt-calculation-guide` | How to Calculate Asphalt Volume & Tonnage |
| `gravel-calculation-guide` | How to Calculate Gravel: Volume, Yards & Tonnes |
| `electricity-cost-calculation-guide` | How to Calculate Electricity Cost from Watts & kWh |
| `brick-calculation-guide` | How to Calculate Bricks for a Wall |
| `dimensional-weight-guide` | Dimensional Weight Guide: Calculate Billable Weight |
| `construction-estimate-quote-guide` | Construction Estimate & Quote Guide |
| `base64-encoding-guide` | Base64 Encoding Guide: What It Is and How to Use It |
| `jwt-decoding-guide` | JWT Decoding Guide: Understanding JSON Web Tokens |
| `json-formatting-guide` | JSON Formatting Guide: Working with JSON Data |
| `heart-rate-zones-guide` | Heart Rate Zones Guide: Train Smarter, Not Harder |
| `how-to-calculate-emi` | EMI Calculation Guide: Formula, Examples & Tips |

## 10. Primary tool mapped to each guide

| Topic | Action | Guide URL | Primary Tool | Reason |
|---|---|---|---|---|
| House Construction Cost | CREATED | `/guides/house-construction-cost-guide` | `/tools/house-construction-cost-calculator` | The tool existed, but no guide explained scope, area rates, quality, contingency, and quotation limits. |
| Water Tank Size & Capacity | CREATED | `/guides/water-tank-size-capacity-guide` | `/tools/water-tank-calculator` | Broad tank-volume and tank-sizing intent had no suitable guide. |
| Roof Area | CREATED | `/guides/how-to-calculate-roof-area` | `/tools/roof-area-calculator` | Informational pitch/footprint intent is distinct from calculator intent. |
| Flooring | CREATED | `/guides/flooring-calculation-guide` | `/tools/flooring-calculator` | No guide covered multiple rooms, packs, patterns, and waste. |
| Asphalt | CREATED | `/guides/asphalt-calculation-guide` | `/tools/asphalt-calculator` | No existing guide covered density-sensitive volume and tonnage planning. |
| Gravel | CREATED | `/guides/gravel-calculation-guide` | `/tools/gravel-calculator` | No existing guide covered loose/compacted volume, yards, density, and tonnes. |
| Electricity Cost | CREATED | `/guides/electricity-cost-calculation-guide` | `/tools/electricity-cost-calculator` | No guide addressed watts, runtime, kWh, tariffs, standby, and multiple appliances. |
| Brick | CREATED | `/guides/brick-calculation-guide` | `/tools/brick-calculator` | No guide addressed wall openings, variable brick sizes, mortar modules, and breakage. |
| Base64 Encoding | ENRICHED | `/guides/base64-encoding-guide` | `/tools/base64-encoder` | Preserved the established URL and replaced thin content; a new URL would cannibalize it. |
| JWT Decoding | ENRICHED | `/guides/jwt-decoding-guide` | `/tools/jwt-decoder` | Preserved the established URL and made decoding-versus-verification explicit. |
| JSON Formatting | ENRICHED | `/guides/json-formatting-guide` | `/tools/json-formatter` | Preserved the established URL and expanded the focused JSON workflow cluster. |
| Dimensional Weight | CREATED | `/guides/dimensional-weight-guide` | `/tools/dimensional-weight-calculator` | No guide covered divisor differences, actual weight, and billable weight. |
| Heart Rate Zones | ENRICHED | `/guides/heart-rate-zones-guide` | `/tools/heart-rate-calculator` | Existing health URL already matched the intent and authoritative-source pattern. |
| Construction Estimate & Quote | CREATED | `/guides/construction-estimate-quote-guide` | `/tools/construction-estimate-builder` | Distinct line-item, client-ready commercial intent had no guide. |
| EMI / Personal Loan | EXPANDED EXISTING | `/guides/how-to-calculate-emi` | `/tools/loan-emi-calculator` | The existing guide is the primary authority; a personal-loan route was intentionally avoided. |

No topic was `SKIPPED DUPLICATE` entirely: five duplicate-route opportunities were handled by enriching or expanding their existing URLs.

## 11. Internal links added

- Every guide maps to its primary tool plus relevant adjacent tools through `guideTools`.
- Primary construction, everyday, and developer tool SEO records link back to the corresponding guide.
- Roof area links to Roof Pitch; flooring links to Tile and area conversion; gravel links to Sand, Topsoil, Mulch, and Paver; JSON links to Formatter, Schema Validator, Diff, JSON-to-CSV, and CSV-to-JSON; construction estimate links to both estimate generators and both cost calculators; EMI links to the loan calculator, amortization suite, and cash-flow planner.
- A curated guide-to-guide relationship map was added for the 15-topic cluster, with existing same-category fallback preserved.
- Construction and everyday category pages now surface their matching guide categories.
- Architecture validation confirmed all related tool and guide slugs exist and are not quarantined.

## 12. Source/reference strategy

- Existing authoritative patterns were preserved: RFC 4648 for Base64, RFC 7519 for JWT, RFC 8259 for JSON, American Heart Association guidance for heart-rate zones, and RBI financial education for EMI.
- New technical references use NIST unit guidance, FHWA pavement resources, OSHA roofing safety, EIA electricity units, Brick Industry Association technical notes, UPS dimensional-weight guidance, and RICS measurement guidance.
- Reference URLs were checked during implementation; broken preliminary URLs were replaced before completion.
- Examples use explicitly illustrative rates, densities, divisors, tariffs, and allowances. No unsupported current construction prices or universal carrier/tariff assumptions were added.

## 13. Files added

- `src/lib/guideContentGsc.ts`
- `src/lib/guideRelations.ts`
- `CODEX_GSC_GUIDE_ENRICHMENT_REPORT.md`

## 14. Files modified

- `next.config.ts`
- `scripts/validate-architecture.mjs`
- `src/app/categories/[slug]/page.tsx`
- `src/app/guides/[slug]/page.tsx`
- `src/app/guides/page.tsx`
- `src/data/tool-pages/construction.ts`
- `src/data/tool-pages/developer.ts`
- `src/data/tool-pages/everyday.ts`
- `src/lib/guideContent.ts`
- `src/lib/guideSources.ts`
- `src/lib/guideTools.ts`
- `src/lib/guidesMetadata.ts`

No tool calculation implementation was modified.

## 15. Typecheck result

PASS — `npm run typecheck` (`tsc --noEmit`).

## 16. Architecture validation

PASS — 185 registered tools, 185 tool routes, 45 clusters, 8 toolkits, 109 tool SEO records, and 31 complete guides.

The validator was extended to scan the focused GSC content registry and to allow an explicit cross-registry enrichment overlay while still rejecting duplicate keys inside any individual registry.

## 17. Lint baseline

PASS — 159 errors / 126 warnings, below the configured maximum of 182 errors / 197 warnings.

## 18. git diff --check

PASS.

## 19. Production build

PASS — `rm -rf .next && npx next build --webpack` using Next.js 16.3.0. Webpack compilation, TypeScript, page-data collection, and 251 static pages completed. Build output listed `/guides/[slug]` with 31 generated guide paths (three displayed plus 28 additional paths).

The initial build exposed a Next.js 16 CLI-output capture failure before compilation. Per the installed Next.js 16 documentation, `experimental.useTypeScriptCli: false` selects the TypeScript 5 JavaScript compiler API; the clean build then completed. Standalone typecheck also passes. The pre-existing middleware deprecation warning remains.

## 20. Mobile audit

- Source-level responsive audit completed for 320px, 375px, and 768px behavior: guide content remains one column; page padding is 16px at the narrowest width and increases at `sm`; tool cards switch from one to two and then three columns; related-guide cards remain one column until `md`; images are fluid width.
- Formula content is plain wrapping text rather than fixed-width code or tables. Defensive `break-words` and `min-w-0` rules were added to article text and related-tool flex cards.
- No tables or non-wrapping code blocks were introduced in the 15 guides.
- Interactive screenshot inspection could not be performed because the in-app browser runtime reported no available browser instances. This should be repeated during human review at the three requested widths.

## 21. Known limitations

- Interactive viewport screenshots are outstanding because no browser instance was available in the session.
- Construction and Everyday guides reuse existing generic guide artwork because the established architecture has category-level images and no new visual asset was required.
- Area, density, cost, shipping, health, and finance outputs remain planning or educational estimates; the guides explicitly direct users to current supplier, carrier, lender, utility, manufacturer, or professional information where appropriate.
- The repository still emits the pre-existing Next.js warning that the `middleware` convention is deprecated in favor of `proxy`; it is outside this content task.

## 22. Git status

The working tree contains the implementation changes and this report on `feat/gsc-guide-enrichment`. No push, merge, deployment, rebase, tag, or branch switch was performed.

## 23. Commits created / Git limitation

No commits could be created because Git metadata is read-only. `git add` and `git commit` both failed safely with:

`fatal: Unable to create '/home/jaspal/navorika/.git/index.lock': Read-only file system`

No unsafe workaround was attempted.

## 24. Recommended manual review pages

- `/guides/water-tank-size-capacity-guide` — priority semantic breadth, units, and mobile formula wrapping.
- `/guides/house-construction-cost-guide` — scope language and illustrative price treatment.
- `/guides/construction-estimate-quote-guide` — estimate/quote terminology and commercial disclaimers.
- `/guides/how-to-calculate-roof-area` — geometry limits and Roof Pitch cross-link.
- `/guides/gravel-calculation-guide` and `/guides/asphalt-calculation-guide` — density and compaction caveats.
- `/guides/heart-rate-zones-guide` — YMYL language and AHA attribution.
- `/guides/jwt-decoding-guide` — decoding-versus-verification distinction.
- `/guides/json-formatting-guide` — developer-tool cluster links.
- `/guides/how-to-calculate-emi` — personal/car/home loan intent consolidation.
- Corresponding primary tool pages to confirm reciprocal guide cards.

READY FOR HUMAN REVIEW
