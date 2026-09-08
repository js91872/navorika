# Navorika Batch 08 — Master Candidate Discovery & Audit

**Date:** 2026-09-07  
**Current Baseline Inventory:**
- Registered root tools: **259**
- Root tool routes: **259**
- Topical clusters: **50**
- Toolkits: **8**
- Tool SEO records: **108**
- Complete guides: **39**
- Finance subtools: **24**

---

## Executive Summary

A comprehensive, repository-wide discovery was conducted across all planning documents, architecture roadmaps, opportunity maps, test reports, package configurations, and manifests:
- `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tiers 1, 2, and 3)
- `NAVORIKA_LONGTAIL_OPPORTUNITIES.md`
- `CODEX_NAVORIKA_PRODUCT_SEO_AUDIT.md`
- `CODEX_CONSTRUCTION_CODE_CORRECTNESS_REPORT.md`
- `CODEX_SUPPLIER_TAKEOFF_CORRECTNESS_REPORT.md`
- `CODEX_FINANCE_CORRECTNESS_REPORT.md`
- `CODEX_CALCULATION_TESTING_REPORT.md`
- `CODEX_GSC_GUIDE_ENRICHMENT_REPORT.md`
- `FFMPEG_BROWSER_ARCHITECTURE_REPORT.txt`
- `STEP_3D_PDF_CONVERTER_REPORT.txt`
- `docs/CORELDRAW_CONVERTER_DEPLOYMENT.md`
- `docs/STEP_3D_PDF_CONVERTER_DEPLOYMENT.md`
- `tool-manifests/` (batches 01–07 and root manifests)
- `package.json` declared dependencies (`yaml`, `sql-formatter`, `xml-formatter`)

### Candidate Summary by Decision

| Decision | Count | Description |
|---|---:|---|
| **BUILD** | **16** | Approved, distinct, high-utility backlog tools to implement in Batch 08 |
| **UPGRADE EXISTING** | **10** | Pre-existing routes or subtools that should absorb the intent rather than duplicate |
| **DROP DUPLICATE** | **37** | Already fully implemented in prior expansions (batches 01–07, 20-tool expansions) |
| **DROP WEAK** | **3** | Thin, high-liability, or non-deterministic concepts rejected from roadmap |
| **DEFER COMPLEX** | **10** | Requiring external servers, SSRF proxies, heavy WASM, or legal/medical review |
| **Total Audited Candidates** | **76** | Exhaustive catalog of prospective tools |

---

## Full Candidate Audit Records

### 1. Mortar Calculator
- **Proposed Name:** Mortar Calculator
- **Proposed Slug:** `mortar-calculator`
- **Category:** `construction-calculators`
- **Likely Cluster:** `construction-concrete`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 1: Construction materials and estimating)
- **Intended Functionality:** Calculate masonry mortar volume, cement bags, and masonry sand requirements for brick or block wall construction based on joint thickness and unit count.
- **Intended Search Intent:** Estimate mortar mix, pre-mixed mortar bags, and sand required for laying brick or concrete block masonry.
- **Closest Existing Tools:** `brick-calculator`, `cement-calculator`, `sand-calculator`
- **Exact Duplicate Result:** None.
- **Semantic-Overlap Assessment:** Clean. Existing tools calculate bricks, bulk concrete, or loose sand, but none calculate masonry mortar joint volume or mix ratios.
- **Decision:** **BUILD**
- **Justification:** High-priority construction estimating utility that connects brick and block masonry workflows.

### 2. Concrete Block Calculator
- **Proposed Name:** Concrete Block Calculator
- **Proposed Slug:** `concrete-block-calculator`
- **Category:** `construction-calculators`
- **Likely Cluster:** `construction-concrete`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 1: Construction materials and estimating)
- **Intended Functionality:** Calculate standard CMU (8x8x16 in / 200x200x400 mm) block count, waste allowance, mortar bags, and core fill grout volume for block walls.
- **Intended Search Intent:** Estimate concrete masonry units (CMU), cinder blocks, and mortar for foundations, retaining walls, and partition walls.
- **Closest Existing Tools:** `brick-calculator`, `concrete-calculator`
- **Exact Duplicate Result:** None.
- **Semantic-Overlap Assessment:** 0.73 slug similarity to `concrete-calculator`, but completely distinct trade intent (structural CMU masonry wall units vs poured wet concrete slabs/footings).
- **Decision:** **BUILD**
- **Justification:** Core contractor estimating gap; complements brick calculator with standard CMU blocks.

### 3. Drywall / Sheetrock Calculator
- **Proposed Name:** Drywall Calculator
- **Proposed Slug:** `drywall-calculator`
- **Category:** `construction-calculators`
- **Likely Cluster:** `construction-finishes`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 1)
- **Intended Functionality:** Drywall sheet count, area, screws, tape, and joint compound.
- **Intended Search Intent:** Calculate sheetrock sheets needed for rooms and ceilings.
- **Closest Existing Tools:** `drywall-calculator`
- **Exact Duplicate Result:** EXISTS at `/tools/drywall-calculator`.
- **Semantic-Overlap Assessment:** 100% duplicate.
- **Decision:** **DROP DUPLICATE**
- **Justification:** Already implemented in the 20-tool expansion.

### 4. Decking Board Calculator
- **Proposed Name:** Deck Board Calculator
- **Proposed Slug:** `deck-board-calculator`
- **Category:** `construction-calculators`
- **Likely Cluster:** `construction-outdoor-projects`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 1)
- **Intended Functionality:** Calculate deck boards, gaps, linear footage, and waste.
- **Intended Search Intent:** How many deck boards do I need for a patio deck.
- **Closest Existing Tools:** `deck-board-calculator`
- **Exact Duplicate Result:** EXISTS at `/tools/deck-board-calculator`.
- **Semantic-Overlap Assessment:** 100% duplicate.
- **Decision:** **DROP DUPLICATE**
- **Justification:** Already implemented in the 20-tool expansion.

### 5. Mulch & Topsoil Calculators
- **Proposed Name:** Mulch Calculator / Topsoil Calculator
- **Proposed Slug:** `mulch-calculator`, `topsoil-calculator`
- **Category:** `construction-calculators`
- **Likely Cluster:** `construction-landscaping`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 1)
- **Intended Functionality:** Calculate cubic yards, liters, and bags for landscape mulch and topsoil.
- **Intended Search Intent:** Mulch and topsoil volume estimation.
- **Closest Existing Tools:** `mulch-calculator`, `topsoil-calculator`
- **Exact Duplicate Result:** EXISTS at `/tools/mulch-calculator` and `/tools/topsoil-calculator`.
- **Semantic-Overlap Assessment:** 100% duplicate.
- **Decision:** **DROP DUPLICATE**
- **Justification:** Already implemented in the 20-tool expansion.

### 6. Construction Waste / Dumpster Estimator
- **Proposed Name:** Construction Material Waste Calculator
- **Proposed Slug:** `construction-material-waste-calculator`
- **Category:** `construction-calculators`
- **Likely Cluster:** `construction-estimating`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 1)
- **Intended Functionality:** Model waste percentages and dumpster container sizing.
- **Intended Search Intent:** Construction waste and dumpster tonnage.
- **Closest Existing Tools:** `construction-material-waste-calculator`, `dumpster-weight-calculator`
- **Exact Duplicate Result:** EXISTS at `/tools/construction-material-waste-calculator` and `/tools/dumpster-weight-calculator`.
- **Semantic-Overlap Assessment:** 100% duplicate.
- **Decision:** **DROP DUPLICATE**
- **Justification:** Implemented in Batch 04 and prior expansions.

### 7. Lumpsum Investment Calculator
- **Proposed Name:** Lumpsum Investment Calculator
- **Proposed Slug:** `lumpsum-investment-calculator`
- **Category:** `finance-calculators`
- **Likely Cluster:** `finance-invest`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 1: Finance planning)
- **Intended Functionality:** Calculate compound growth of a one-time lump-sum capital investment over an investment horizon with customizable compounding frequency, annualized returns, and inflation adjustments.
- **Intended Search Intent:** Calculate maturity value of a one-time lump sum mutual fund or stock market investment.
- **Closest Existing Tools:** `sip-calculator`, `investment-return-profiler`
- **Exact Duplicate Result:** None.
- **Semantic-Overlap Assessment:** Clean. `sip-calculator` models recurring monthly deposits; lumpsum investment models a single capital allocation compounding over time.
- **Decision:** **BUILD**
- **Justification:** Essential pair to `sip-calculator` in wealth/investing workflows; major standalone search intent.

### 8. CAGR Calculator
- **Proposed Name:** CAGR Calculator
- **Proposed Slug:** `cagr-calculator`
- **Category:** `finance-calculators`
- **Likely Cluster:** `finance-invest`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 1: Finance planning)
- **Intended Functionality:** Compound Annual Growth Rate formula.
- **Intended Search Intent:** Calculate annualized rate of return across years.
- **Closest Existing Tools:** `/tools/investment-return-profiler/cagr-calculator`
- **Exact Duplicate Result:** Exists as an indexable subtool in `src/data/financeMeta.ts`.
- **Semantic-Overlap Assessment:** Complete overlap. Spawning `/tools/cagr-calculator` at root creates canonical cannibalization with the existing subtool.
- **Decision:** **UPGRADE EXISTING**
- **Justification:** Maintain the existing subtool route rather than introducing competing canonical URLs.

### 9. Compound Interest Calculator
- **Proposed Name:** Compound Interest Calculator
- **Proposed Slug:** `compound-interest-calculator`
- **Category:** `finance-calculators`
- **Likely Cluster:** `finance-invest`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 1: Finance planning)
- **Intended Functionality:** Exponential capital compounding over time.
- **Intended Search Intent:** Calculate compound interest with recurring additions.
- **Closest Existing Tools:** `/tools/wealth-inflation-matrix/compound-interest-calculator`
- **Exact Duplicate Result:** Exists as an indexable subtool in `src/data/financeMeta.ts`.
- **Semantic-Overlap Assessment:** Complete overlap with active subtool.
- **Decision:** **UPGRADE EXISTING**
- **Justification:** Enhance the existing subtool; do not create duplicate canonical paths.

### 10. Savings Goal Calculator
- **Proposed Name:** Savings Goal Calculator
- **Proposed Slug:** `savings-goal-calculator`
- **Category:** `finance-calculators`
- **Likely Cluster:** `finance-budget`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 1: Finance planning)
- **Intended Functionality:** Calculate the required recurring monthly/annual savings amount needed to reach a target goal corpus by a target date, given starting savings and expected interest.
- **Intended Search Intent:** How much do I need to save each month to reach my savings target.
- **Closest Existing Tools:** `cashflow-budget-architect`, `savings-retirement-hub`
- **Exact Duplicate Result:** None.
- **Semantic-Overlap Assessment:** Clean. Existing tools calculate future corpus from fixed payments; savings goal works backwards from target amount.
- **Decision:** **BUILD**
- **Justification:** High-intent planning tool bridging monthly cash flow budgeting and long-term targets.

### 11. Mortgage Affordability Calculator
- **Proposed Name:** Mortgage Affordability Calculator
- **Proposed Slug:** `mortgage-affordability-calculator`
- **Category:** `finance-calculators`
- **Likely Cluster:** `finance-loans`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 1: Finance planning)
- **Intended Functionality:** Calculate maximum affordable home purchase price and maximum mortgage borrowing capacity based on gross household income, front-end and back-end debt-to-income (DTI) thresholds (e.g. 28/36 rule), down payment, interest rate, property taxes, homeowner insurance, and monthly non-mortgage obligations.
- **Intended Search Intent:** How much house can I afford calculator, maximum mortgage qualification calculator.
- **Closest Existing Tools:** `loan-emi-calculator`, `home-loan-emi`
- **Exact Duplicate Result:** None.
- **Semantic-Overlap Assessment:** Clean. Loan EMI calculators determine payments from a known loan; affordability determines the maximum borrowing qualification from income and debt underwriting ratios.
- **Decision:** **BUILD**
- **Justification:** High-value property and financing underwriting utility.

### 12. Aspect Ratio Calculator
- **Proposed Name:** Aspect Ratio Calculator
- **Proposed Slug:** `aspect-ratio-calculator`
- **Category:** `image-tools`
- **Likely Cluster:** `image-optimize`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 1: Image optimization)
- **Intended Functionality:** Scale width and height while maintaining aspect ratios, calculate GCD simplifications, crop dimensions.
- **Intended Search Intent:** Find missing image dimensions from aspect ratio.
- **Closest Existing Tools:** `aspect-ratio-padding-calculator`, `image-scaling-calculator`
- **Exact Duplicate Result:** None as direct slug, but 0.75 similarity with `aspect-ratio-padding-calculator` and direct functional overlap with `image-scaling-calculator`.
- **Semantic-Overlap Assessment:** High cannibalization risk. Spawning a third tool between `aspect-ratio-padding-calculator` and `image-scaling-calculator` dilutes query authority.
- **Decision:** **UPGRADE EXISTING**
- **Justification:** Enrich `aspect-ratio-padding-calculator` and `image-scaling-calculator` with image preset ratios.

### 13. Image File-Size Estimator
- **Proposed Name:** Image File Size Estimator
- **Proposed Slug:** `image-file-size-estimator`
- **Category:** `image-tools`
- **Likely Cluster:** `image-optimize`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 1)
- **Intended Functionality:** Estimate file size based on dimensions, bit depth, format, and compression.
- **Intended Search Intent:** Estimate image file weight before saving.
- **Closest Existing Tools:** `image-file-size-estimator`
- **Exact Duplicate Result:** EXISTS at `/tools/image-file-size-estimator`.
- **Semantic-Overlap Assessment:** 100% duplicate.
- **Decision:** **DROP DUPLICATE**
- **Justification:** Implemented in Batch 05.

### 14. Responsive Srcset Generator
- **Proposed Name:** Responsive Srcset Generator
- **Proposed Slug:** `responsive-srcset-generator`
- **Category:** `image-tools`
- **Likely Cluster:** `image-create`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 1: Image optimization)
- **Intended Functionality:** Generate modern HTML responsive `<img>` `srcset`, `<picture>` tags with media queries, `sizes` attributes, WebP/AVIF fallback sources, and DPR (1x, 2x, 3x) scaling rules.
- **Intended Search Intent:** Generate responsive image srcset and picture HTML tags for web design.
- **Closest Existing Tools:** `social-media-resizer`, `change-image-resolution`
- **Exact Duplicate Result:** None.
- **Semantic-Overlap Assessment:** Clean developer markup generator.
- **Decision:** **BUILD**
- **Justification:** Fills a key technical gap linking image optimization to web development.

### 15. URL Encoder / Decoder
- **Proposed Name:** URL Encoder & Decoder
- **Proposed Slug:** `url-encoder-decoder`
- **Category:** `developer-tools`
- **Likely Cluster:** `developer-encoding`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 1)
- **Intended Functionality:** RFC 3986 percent encoding and decoding.
- **Intended Search Intent:** Encode or decode URL strings and query parameters.
- **Closest Existing Tools:** `url-encoder-decoder`
- **Exact Duplicate Result:** EXISTS at `/tools/url-encoder-decoder`.
- **Semantic-Overlap Assessment:** 100% duplicate.
- **Decision:** **DROP DUPLICATE**
- **Justification:** Implemented in the 20-tool expansion.

### 16. UUID Generator & Validator
- **Proposed Name:** UUID Generator & Validator
- **Proposed Slug:** `uuid-generator-validator`
- **Category:** `developer-tools`
- **Likely Cluster:** `developer-security`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 1: Developer data workflows)
- **Intended Functionality:** Generate cryptographically secure v4 (and v7 timestamp-ordered) UUIDs using `crypto.randomUUID()`, validate existing UUID syntax, extract version/variant, and format bulk batches (hyphens, braces, uppercase/lowercase, array/JSON/SQL).
- **Intended Search Intent:** Generate random UUID online, validate UUID v4/v7 strings.
- **Closest Existing Tools:** `mac-address-generator`, `web-crypto-studio`
- **Exact Duplicate Result:** None.
- **Semantic-Overlap Assessment:** Clean. `web-crypto-studio` has a basic one-shot `crypto.randomUUID()` call embedded in a multi-tool page; a dedicated UUID generator provides bulk generation, version checking, and developer formatting options.
- **Decision:** **BUILD**
- **Justification:** Standard, high-volume developer utility.

### 17. Hash Generator & Checksum Tool
- **Proposed Name:** Hash Generator & Checksum Tool
- **Proposed Slug:** `hash-generator-checksum-tool`
- **Category:** `developer-tools`
- **Likely Cluster:** `developer-security`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 1)
- **Intended Functionality:** Generate SHA-256 digests and compare checksums.
- **Intended Search Intent:** Generate SHA-256 hash or verify file checksum.
- **Closest Existing Tools:** `web-crypto-studio`
- **Exact Duplicate Result:** None as standalone route, but `web-crypto-studio` already computes SHA-256 digests client-side.
- **Semantic-Overlap Assessment:** High functional overlap with `web-crypto-studio`.
- **Decision:** **UPGRADE EXISTING**
- **Justification:** Enhance `web-crypto-studio` with SHA-512, SHA-384, and verification mode instead of creating a competing page.

### 18. YAML to JSON Converter
- **Proposed Name:** YAML to JSON Converter
- **Proposed Slug:** `yaml-to-json-converter`
- **Category:** `developer-tools`
- **Likely Cluster:** `developer-json`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 1), `package.json` (`yaml` dependency)
- **Intended Functionality:** Parse YAML structures client-side with syntax validation, line/column error reporting, and export formatted JSON with configurable indentation.
- **Intended Search Intent:** Convert YAML configuration to JSON online.
- **Closest Existing Tools:** `csv-to-json-converter`, `universal-json-studio`, `markup-formatter`
- **Exact Duplicate Result:** None.
- **Semantic-Overlap Assessment:** Clean. `markup-formatter` formats YAML text, but does not convert YAML to JSON.
- **Decision:** **BUILD**
- **Justification:** High-intent developer conversion tool; `yaml` package is already in `dependencies`.

### 19. JSON to YAML Converter
- **Proposed Name:** JSON to YAML Converter
- **Proposed Slug:** `json-to-yaml-converter`
- **Category:** `developer-tools`
- **Likely Cluster:** `developer-json`
- **Source:** Complementary pair to `yaml-to-json-converter` (matches `csv-to-json` / `json-to-csv` architecture)
- **Intended Functionality:** Parse JSON structures and emit clean, valid YAML configurations with configurable indent, flow style, and quote handling.
- **Intended Search Intent:** Convert JSON payload to YAML file online.
- **Closest Existing Tools:** `json-to-csv-flattener`, `universal-json-studio`, `markup-formatter`
- **Exact Duplicate Result:** None.
- **Semantic-Overlap Assessment:** Clean reverse transformation.
- **Decision:** **BUILD**
- **Justification:** Essential counterpart to YAML-to-JSON for configuration conversion workflows.

### 20. Stair & Stringer Calculator
- **Proposed Name:** Stair & Stringer Calculator
- **Proposed Slug:** `stair-stringer-calculator`
- **Category:** `construction-calculators`
- **Likely Cluster:** `construction-carpentry`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 2)
- **Intended Functionality:** Calculate risers, treads, run, stringer length, and incline angle.
- **Intended Search Intent:** Calculate stair stringers and rise/run.
- **Closest Existing Tools:** `stair-stringer-calculator`
- **Exact Duplicate Result:** EXISTS at `/tools/stair-stringer-calculator`.
- **Semantic-Overlap Assessment:** 100% duplicate.
- **Decision:** **DROP DUPLICATE**
- **Justification:** Implemented in the 20-tool expansion.

### 21. Ramp Slope Calculator
- **Proposed Name:** Shed Ramp Angle Calculator
- **Proposed Slug:** `shed-ramp-angle-calculator`
- **Category:** `construction-calculators`
- **Likely Cluster:** `construction-carpentry`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 2)
- **Intended Functionality:** Calculate ramp slope, rise, run, and angle.
- **Intended Search Intent:** Ramp slope and stringer angle calculator.
- **Closest Existing Tools:** `shed-ramp-angle-calculator`
- **Exact Duplicate Result:** EXISTS at `/tools/shed-ramp-angle-calculator`.
- **Semantic-Overlap Assessment:** 100% duplicate.
- **Decision:** **DROP DUPLICATE**
- **Justification:** Implemented in Batch 04.

### 22. Lumber Board Foot Calculator
- **Proposed Name:** Board Foot Calculator
- **Proposed Slug:** `board-foot-calculator`
- **Category:** `construction-calculators`
- **Likely Cluster:** `construction-carpentry`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 2)
- **Intended Functionality:** Calculate board feet from thickness, width, length, and piece count.
- **Intended Search Intent:** Board foot lumber volume and cost.
- **Closest Existing Tools:** `board-foot-calculator`
- **Exact Duplicate Result:** EXISTS at `/tools/board-foot-calculator`.
- **Semantic-Overlap Assessment:** 100% duplicate.
- **Decision:** **DROP DUPLICATE**
- **Justification:** Already registered and implemented.

### 23. Attic Insulation Payback Calculator
- **Proposed Name:** Attic Insulation Payback Calculator
- **Proposed Slug:** `attic-insulation-payback-calculator`
- **Category:** `construction-calculators`
- **Likely Cluster:** `construction-structural`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 2)
- **Intended Functionality:** Calculate R-value increase, annual heating/cooling energy savings, and payback period.
- **Intended Search Intent:** Attic insulation cost and payback calculator.
- **Closest Existing Tools:** `attic-insulation-payback-calculator`
- **Exact Duplicate Result:** EXISTS at `/tools/attic-insulation-payback-calculator`.
- **Semantic-Overlap Assessment:** 100% duplicate.
- **Decision:** **DROP DUPLICATE**
- **Justification:** Implemented in Batch 04.

### 24. HVAC Room-Load / Duct CFM Calculator
- **Proposed Name:** HVAC Duct CFM Calculator
- **Proposed Slug:** `hvac-duct-cfm-calculator`
- **Category:** `construction-calculators`
- **Likely Cluster:** `construction-structural`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 2)
- **Intended Functionality:** Calculate airflow CFM, duct dimensions, and air velocity.
- **Intended Search Intent:** Duct CFM and velocity sizing.
- **Closest Existing Tools:** `hvac-duct-cfm-calculator`
- **Exact Duplicate Result:** EXISTS at `/tools/hvac-duct-cfm-calculator`.
- **Semantic-Overlap Assessment:** 100% duplicate.
- **Decision:** **DROP DUPLICATE**
- **Justification:** Implemented in Batch 04.

### 25. Rainwater Harvesting Calculator
- **Proposed Name:** Rainwater Harvesting Calculator
- **Proposed Slug:** `rainwater-harvesting-calculator`
- **Category:** `construction-calculators`
- **Likely Cluster:** `construction-site`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 2: Construction)
- **Intended Functionality:** Calculate harvestable rainwater volume (gallons and liters) from roof catchment footprint, rainfall depth (inches/mm), catchment efficiency / roof runoff coefficient (metal, tile, asphalt, membrane), and recommend storage cistern / tank sizing.
- **Intended Search Intent:** Rainwater collection calculator, roof runoff tank sizing calculator.
- **Closest Existing Tools:** `roof-area-calculator`, `water-tank-calculator`
- **Exact Duplicate Result:** None.
- **Semantic-Overlap Assessment:** Clean workflow synergy. Connects roof area calculations directly to water storage tank sizing.
- **Decision:** **BUILD**
- **Justification:** Deepens the `construction-site` and `everyday-home-utilities` clusters with a practical sustainability calculator.

### 26. Debt Snowball vs Avalanche Calculator
- **Proposed Name:** Debt Snowball vs Avalanche Calculator
- **Proposed Slug:** `debt-snowball-vs-avalanche-calculator`
- **Category:** `finance-calculators`
- **Likely Cluster:** `investment-decisions`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 2: Finance)
- **Intended Functionality:** Compare debt payoff timelines and total interest between snowball and avalanche strategies.
- **Intended Search Intent:** Debt snowball vs avalanche calculator.
- **Closest Existing Tools:** `debt-snowball-vs-avalanche-calculator`
- **Exact Duplicate Result:** EXISTS at `/tools/debt-snowball-vs-avalanche-calculator`.
- **Semantic-Overlap Assessment:** 100% duplicate.
- **Decision:** **DROP DUPLICATE**
- **Justification:** Implemented in the 20-tool expansion.

### 27. Credit Card Payoff Calculator
- **Proposed Name:** Credit Card Payoff Calculator
- **Proposed Slug:** `credit-card-payoff-calculator`
- **Category:** `finance-calculators`
- **Likely Cluster:** `finance-loans`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 2: Finance)
- **Intended Functionality:** Time and interest to pay off revolving card debt.
- **Intended Search Intent:** Credit card payoff calculator.
- **Closest Existing Tools:** `/tools/cashflow-budget-architect/credit-card-payoff`, `debt-snowball-vs-avalanche-calculator`
- **Exact Duplicate Result:** Exists as subtool in `financeMeta.ts`.
- **Semantic-Overlap Assessment:** High overlap with existing subtool and snowball/avalanche tool.
- **Decision:** **UPGRADE EXISTING**
- **Justification:** Avoid spawning a third competing debt payoff page.

### 28. Emergency Fund Calculator
- **Proposed Name:** Emergency Fund Calculator
- **Proposed Slug:** `emergency-fund-calculator`
- **Category:** `finance-calculators`
- **Likely Cluster:** `finance-budget`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 2: Finance)
- **Intended Functionality:** Calculate recommended liquid emergency savings based on monthly expenses and runway months.
- **Intended Search Intent:** How much emergency fund do I need.
- **Closest Existing Tools:** `/tools/cashflow-budget-architect/emergency-fund-calculator`
- **Exact Duplicate Result:** Exists as subtool in `financeMeta.ts`.
- **Semantic-Overlap Assessment:** High overlap with existing subtool.
- **Decision:** **UPGRADE EXISTING**
- **Justification:** Enhance the existing subtool.

### 29. Break-Even Calculator
- **Proposed Name:** Break-Even Calculator
- **Proposed Slug:** `break-even-calculator`
- **Category:** `finance-calculators`
- **Likely Cluster:** `finance-tax`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 2: Finance)
- **Intended Functionality:** Calculate break-even production units, break-even sales revenue, contribution margin per unit, contribution margin ratio, and margin of safety from fixed operating costs, variable cost per unit, and selling price.
- **Intended Search Intent:** Business break-even point calculator, units and revenue break-even.
- **Closest Existing Tools:** `short-term-rental-break-even-calculator`, `ev-vs-gas-break-even-calculator`
- **Exact Duplicate Result:** None.
- **Semantic-Overlap Assessment:** Existing tools are narrow niche automotive/vacation rental calculators; no general business/startup break-even calculator exists.
- **Decision:** **BUILD**
- **Justification:** Core foundational corporate finance and small business economics tool.

### 30. Profit Margin & Markup Calculator
- **Proposed Name:** Profit Margin & Markup Calculator
- **Proposed Slug:** `profit-margin-markup-calculator`
- **Category:** `finance-calculators`
- **Likely Cluster:** `finance-tax`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 2: Finance)
- **Intended Functionality:** Calculate gross profit, gross margin percentage, markup percentage, and revenue given cost and selling price (or solve for required selling price given target markup or margin).
- **Intended Search Intent:** Margin vs markup calculator, calculate profit margin and selling price.
- **Closest Existing Tools:** `contractor-estimate-generator`, `construction-estimate-builder`
- **Exact Duplicate Result:** None.
- **Semantic-Overlap Assessment:** Clean. Existing estimate builders apply markups internally to line items, but no dedicated commercial margin vs markup calculator exists.
- **Decision:** **BUILD**
- **Justification:** High-volume commercial and pricing utility.

### 31. Inflation-Adjusted Return Calculator
- **Proposed Name:** Inflation-Adjusted Return Calculator
- **Proposed Slug:** `inflation-adjusted-return-calculator`
- **Category:** `finance-calculators`
- **Likely Cluster:** `finance-invest`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 2: Finance)
- **Intended Functionality:** Real rate of return after inflation (Fisher equation).
- **Intended Search Intent:** Inflation adjusted investment returns calculator.
- **Closest Existing Tools:** `wealth-inflation-matrix`, `/tools/wealth-inflation-matrix/inflation-calculator`
- **Exact Duplicate Result:** Exists under `wealth-inflation-matrix`.
- **Semantic-Overlap Assessment:** High overlap with existing inflation tools.
- **Decision:** **UPGRADE EXISTING**
- **Justification:** Avoid cannibalizing `wealth-inflation-matrix`.

### 32–34. CIDR Subnet, IPv4 Subnet Mask, Wildcard Mask Calculators
- **Proposed Slugs:** `cidr-subnet-wildcard-calculator`, etc.
- **Category:** `developer-tools`
- **Likely Cluster:** `developer-networking`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 2)
- **Closest Existing Tools:** `cidr-subnet-wildcard-calculator`, `vlsm-subnet-calculator`, `ip-range-calculator`
- **Exact Duplicate Result:** EXISTS at `/tools/cidr-subnet-wildcard-calculator`.
- **Decision:** **DROP DUPLICATE**
- **Justification:** Fully covered by the existing CIDR/wildcard calculator.

### 35. IP Address Converter / Classifier
- **Proposed Slug:** `ip-address-classifier`
- **Category:** `developer-tools`
- **Likely Cluster:** `developer-networking`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 2)
- **Closest Existing Tools:** `ip-address-classifier`
- **Exact Duplicate Result:** EXISTS at `/tools/ip-address-classifier`.
- **Decision:** **DROP DUPLICATE**
- **Justification:** Implemented in Batch 06.

### 36. DNS Record Lookup
- **Proposed Name:** DNS Record Lookup
- **Proposed Slug:** `dns-record-lookup`
- **Category:** `developer-tools`
- **Likely Cluster:** `developer-networking`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 2)
- **Intended Functionality:** Query external DNS resolvers (A, AAAA, MX, CNAME, TXT).
- **Semantic-Overlap Assessment:** Requires external network requests, external DNS resolver APIs, caching, and rate limiting. Violates serverless/browser privacy boundaries without server infrastructure.
- **Decision:** **DEFER COMPLEX**
- **Justification:** External network dependent and requires dedicated DNS caching infrastructure.

### 37. Cron Expression Explainer
- **Proposed Slug:** `cron-expression-humanizer`
- **Category:** `developer-tools`
- **Likely Cluster:** `developer-scheduling`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 2)
- **Closest Existing Tools:** `cron-expression-humanizer`, `cron-next-run-calculator`
- **Exact Duplicate Result:** EXISTS at `/tools/cron-expression-humanizer`.
- **Decision:** **DROP DUPLICATE**
- **Justification:** Implemented.

### 38. Macronutrient Calculator
- **Proposed Name:** Macronutrient Calculator
- **Proposed Slug:** `macronutrient-calculator`
- **Category:** `health-calculators`
- **Likely Cluster:** `health-energy`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 2: Health and fitness)
- **Intended Functionality:** Split daily calorie target into grams and calories of protein, fat, and carbohydrates based on fitness goals (maintenance, fat loss, muscle building, high-protein, ketogenic, endurance) and body weight.
- **Intended Search Intent:** Calculate daily macros (protein, carbs, fat) in grams.
- **Closest Existing Tools:** `calorie-calculator`, `tdee-calculator`
- **Exact Duplicate Result:** None.
- **Semantic-Overlap Assessment:** Clean. Calories tools estimate total energy; macronutrients determine the nutritional composition breakdown in grams.
- **Decision:** **BUILD**
- **Justification:** Standard, non-diagnostic sports nutrition calculator connecting calories and TDEE.

### 39. Running Pace Calculator
- **Proposed Name:** Running Pace Calculator
- **Proposed Slug:** `running-pace-calculator`
- **Category:** `health-calculators`
- **Likely Cluster:** `health-activity`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 2: Health and fitness)
- **Intended Functionality:** Solve the time-distance-pace triangle for running and walking: calculate pace (min/km, min/mile), target time for standard races (5K, 10K, Half Marathon, Marathon), and kilometer/mile split schedules.
- **Intended Search Intent:** Running pace calculator, calculate race finish time and splits.
- **Closest Existing Tools:** `running-calories-calculator`, `walking-calories-calculator`
- **Exact Duplicate Result:** None.
- **Semantic-Overlap Assessment:** Clean. Existing tools calculate energy expenditure (calories burned); pace calculator calculates race pacing, split times, and speed.
- **Decision:** **BUILD**
- **Justification:** Essential running and athletic training utility.

### 40. One-Rep Max Calculator
- **Proposed Name:** One-Rep Max Calculator
- **Proposed Slug:** `one-rep-max-calculator`
- **Category:** `everyday-calculators` (or `health-calculators`)
- **Likely Cluster:** `everyday-strength-training`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 2: Health and fitness)
- **Intended Functionality:** Estimate 1RM maximum lifting capacity using validated empirical formulas (Brzycki, Epley, Lander, Lombardi, Mayhew, O'Conner, Wathan) from weight lifted and repetitions, displaying a 1RM to 10RM percentage breakdown table.
- **Intended Search Intent:** Calculate one rep max bench press, squat, deadlift.
- **Closest Existing Tools:** `wilks-dots-powerlifting-calculator`
- **Exact Duplicate Result:** None.
- **Semantic-Overlap Assessment:** Clean. Wilks/DOTS normalizes competition totals across bodyweight; 1RM calculates individual exercise single-rep training maximums.
- **Decision:** **BUILD**
- **Justification:** Standard strength training utility with safe, deterministic formulas.

### 41. Hydration Calculator
- **Proposed Name:** Hydration Calculator
- **Proposed Slug:** `hydration-calculator`
- **Category:** `health-calculators`
- **Likely Cluster:** `health-energy`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 2: Health and fitness)
- **Intended Functionality:** Estimate daily baseline water intake requirements (liters, fluid ounces, cups) based on body weight, activity duration, climate temperature/humidity, and sweat loss.
- **Intended Search Intent:** Daily water intake calculator, how much water should I drink.
- **Closest Existing Tools:** `tdee-calculator`, `calories-burned-calculator`
- **Exact Duplicate Result:** None.
- **Semantic-Overlap Assessment:** Clean. Safe non-diagnostic wellness utility.
- **Decision:** **BUILD**
- **Justification:** Popular wellness utility completing the `health-energy` cluster.

### 42. PDF Page-Size Inspector
- **Proposed Slug:** `pdf-page-size-checker`
- **Category:** `pdf-tools`
- **Likely Cluster:** `pdf-edit`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 2)
- **Closest Existing Tools:** `pdf-page-size-checker`
- **Exact Duplicate Result:** EXISTS at `/tools/pdf-page-size-checker`.
- **Decision:** **DROP DUPLICATE**
- **Justification:** Implemented in Batch 07.

### 43. PDF/A Readiness Checker
- **Proposed Slug:** `pdfa-readiness-checker`
- **Category:** `pdf-tools`
- **Likely Cluster:** `pdf-edit`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 2)
- **Intended Functionality:** Validate PDF/A conformance levels (A-1b, A-2b) client-side.
- **Semantic-Overlap Assessment:** ISO 19005 compliance verification in-browser without emitting false positives requires complex native font/color-profile parsers.
- **Decision:** **DEFER COMPLEX**
- **Justification:** High false-validation liability in browser-only JavaScript.

### 44. Scan Page Cleanup Tool
- **Proposed Slug:** `scan-page-cleanup`
- **Category:** `pdf-tools`
- **Likely Cluster:** `pdf-edit`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 2)
- **Intended Functionality:** Browser canvas thresholding, deskew, and contrast cleanup.
- **Decision:** **DEFER COMPLEX**
- **Justification:** Requires heavy computer vision libraries (OpenCV.js) that exceed client performance budgets.

### 45. Solar Payback Estimator
- **Proposed Slug:** `solar-payback-estimator`
- **Category:** `construction-calculators`
- **Likely Cluster:** `construction-structural`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 3)
- **Closest Existing Tools:** `solar-panel-calculator`
- **Exact Duplicate Result:** Substantially covered by `solar-panel-calculator`.
- **Decision:** **UPGRADE EXISTING**
- **Justification:** Enhance `solar-panel-calculator` rather than creating a competing page.

### 46. Building-Code Lookup Assistant
- **Proposed Slug:** `building-code-lookup`
- **Category:** `construction-calculators`
- **Likely Cluster:** `construction-structural`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 3)
- **Semantic-Overlap Assessment:** High liability risk; local municipal building codes change frequently and cannot be authoritatively served without continual legal verification.
- **Decision:** **DROP WEAK**
- **Justification:** Regulatory risk and high liability.

### 47. Portfolio Allocation Visualizer
- **Proposed Slug:** `portfolio-allocation-visualizer`
- **Category:** `finance-calculators`
- **Likely Cluster:** `finance-invest`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 3)
- **Semantic-Overlap Assessment:** High suitability and regulatory risk regarding investment advice.
- **Decision:** **DEFER COMPLEX**
- **Justification:** Requires financial compliance review.

### 48. Tax Regime Comparison Tool
- **Proposed Slug:** `tax-regime-comparison`
- **Category:** `finance-calculators`
- **Likely Cluster:** `finance-tax`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 3)
- **Closest Existing Tools:** `tax-calculator`, `/tools/taxation-compliance-deck/income-tax-calculator`
- **Exact Duplicate Result:** Old vs New regime comparison is already built into `tax-calculator`.
- **Decision:** **UPGRADE EXISTING**
- **Justification:** Prevent duplicate tax routes.

### 49. Nutrition Label Analyzer
- **Proposed Slug:** `nutrition-label-analyzer`
- **Category:** `health-calculators`
- **Likely Cluster:** `health-energy`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 3)
- **Semantic-Overlap Assessment:** High error rate when parsing arbitrary food labels; risk of misleading health/allergen claims.
- **Decision:** **DROP WEAK**
- **Justification:** Misleading output and high liability.

### 50. OCR Document Extractor
- **Proposed Slug:** `ocr-document-extractor`
- **Category:** `pdf-tools`
- **Likely Cluster:** `pdf-convert`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 3)
- **Semantic-Overlap Assessment:** Requires client-side Tesseract.js (30+ MB WASM payload) which severely impairs mobile performance.
- **Decision:** **DEFER COMPLEX**
- **Justification:** Violates client bundle performance boundaries.

### 51. Color-Accessibility Simulator
- **Proposed Slug:** `color-accessibility-simulator`
- **Category:** `developer-tools`
- **Likely Cluster:** `developer-web`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 3)
- **Semantic-Overlap Assessment:** Deterministic WCAG contrast is already covered; subjective visual simulation is non-standard.
- **Decision:** **DROP WEAK**
- **Justification:** Thin utility with weak programmatic verification.

### 52. Security Header Scanner
- **Proposed Slug:** `security-header-scanner`
- **Category:** `developer-tools`
- **Likely Cluster:** `developer-web`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 3)
- **Semantic-Overlap Assessment:** Requires outbound HTTP requests to user-specified domains, introducing SSRF vulnerabilities.
- **Decision:** **DEFER COMPLEX**
- **Justification:** SSRF and security sandbox restrictions.

### 53. Cloud Cost Calculators
- **Proposed Slugs:** `cloud-hosting-cost-calculator`, `cdn-cost-calculator`, `gpu-compute-cost-calculator`
- **Category:** `developer-tools`
- **Likely Cluster:** `ai-cloud-costs`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 3)
- **Closest Existing Tools:** `cloud-hosting-cost-calculator`, `cdn-cost-calculator`, `gpu-compute-cost-calculator`
- **Exact Duplicate Result:** ALL implemented in 20-tool AI/SaaS expansion.
- **Decision:** **DROP DUPLICATE**
- **Justification:** Implemented.

### 54. AI-Assisted Document Transformations
- **Proposed Slug:** `ai-document-transformer`
- **Category:** `pdf-tools`
- **Likely Cluster:** `pdf-edit`
- **Source:** `NAVORIKA_TOOL_OPPORTUNITY_MAP.md` (Tier 3)
- **Semantic-Overlap Assessment:** Requires third-party cloud LLM APIs, external data transmission, and ongoing subscription costs.
- **Decision:** **DEFER COMPLEX**
- **Justification:** Privacy and remote API dependency.

### 55. Meeting ROI Calculator
- **Proposed Slug:** `meeting-roi-calculator`
- **Category:** `finance-calculators`
- **Likely Cluster:** `saas-metrics`
- **Source:** `tool-manifests/meeting-roi-calculator.json`
- **Closest Existing Tools:** `meeting-roi-calculator`
- **Exact Duplicate Result:** EXISTS at `/tools/meeting-roi-calculator`.
- **Decision:** **DROP DUPLICATE**
- **Justification:** Implemented.

### 56–57. SQL & XML Formatters
- **Proposed Slugs:** `sql-formatter`, `xml-formatter`
- **Category:** `developer-tools`
- **Likely Cluster:** `developer-code-formatting`
- **Source:** `package.json` (`sql-formatter`, `xml-formatter`)
- **Closest Existing Tools:** `markup-formatter`
- **Exact Duplicate Result:** Both languages are supported inside `markup-formatter`.
- **Decision:** **UPGRADE EXISTING**
- **Justification:** Enrich `markup-formatter` options rather than splitting into fragmented thin routes.

### 58–74. Batch 04 to Batch 07 Tool Manifests
- **Proposed Slugs:**
  - `joist-deflection-calculator`
  - `soffit-fascia-calculator`
  - `image-megapixel-calculator`
  - `image-print-size-calculator`
  - `image-scaling-calculator`
  - `photo-storage-calculator`
  - `image-bandwidth-calculator`
  - `ipv6-subnet-calculator`
  - `tcp-udp-port-range-calculator`
  - `cidr-summarization-calculator`
  - `common-port-service-lookup`
  - `url-parser`
  - `pdf-bleed-trim-checker`
  - `cdr-print-readiness-checker`
  - `svg-dimensions-checker`
  - `rgb-cmyk-image-checker`
  - `print-bleed-calculator`
- **Source:** `tool-manifests/batch-04/`, `batch-05/`, `batch-06/`, `batch-07/`
- **Exact Duplicate Result:** ALL 17 tools are already registered and have live routes under `src/app/tools/`.
- **Decision:** **DROP DUPLICATE**
- **Justification:** Already fully implemented in previous development batches.

### 75. STEP to 3D PDF Converter
- **Proposed Slug:** `step-to-3d-pdf-converter`
- **Category:** `developer-tools`
- **Likely Cluster:** `cad-engineering-tools`
- **Source:** `STEP_3D_PDF_CONVERTER_REPORT.txt`
- **Closest Existing Tools:** `step-to-3d-pdf-converter`
- **Exact Duplicate Result:** EXISTS at `/tools/step-to-3d-pdf-converter`.
- **Decision:** **DROP DUPLICATE**
- **Justification:** Fully implemented with native C++ Open CASCADE pipeline.

### 76. FFmpeg Video-to-Audio / MP3 Converters
- **Proposed Slugs:** `video-to-mp3-converter`, `mp4-to-mp3-converter`, `webm-to-mp3-converter`, `mov-to-mp3-converter`, `m4a-to-mp3-converter`, `wav-to-mp3-converter`, `mp3-to-wav-converter`, `audio-bitrate-calculator`
- **Category:** `developer-tools`
- **Likely Cluster:** `audio-video-tools`
- **Source:** `FFMPEG_BROWSER_ARCHITECTURE_REPORT.txt`
- **Closest Existing Tools:** `audio-video-tools`
- **Exact Duplicate Result:** ALL 11 audio/video tools are already registered and have live routes.
- **Decision:** **DROP DUPLICATE**
- **Justification:** Fully implemented on the audio-video branch.

---

## Final Decision Matrix for Batch 08

### 16 Approved Candidates to BUILD:
1. `mortar-calculator` (Construction: `construction-concrete`)
2. `concrete-block-calculator` (Construction: `construction-concrete`)
3. `rainwater-harvesting-calculator` (Construction: `construction-site`)
4. `lumpsum-investment-calculator` (Finance: `finance-invest`)
5. `savings-goal-calculator` (Finance: `finance-budget`)
6. `mortgage-affordability-calculator` (Finance: `finance-loans`)
7. `break-even-calculator` (Finance: `finance-tax`)
8. `profit-margin-markup-calculator` (Finance: `finance-tax`)
9. `responsive-srcset-generator` (Image: `image-create`)
10. `yaml-to-json-converter` (Developer: `developer-json`)
11. `json-to-yaml-converter` (Developer: `developer-json`)
12. `uuid-generator-validator` (Developer: `developer-security`)
13. `macronutrient-calculator` (Health: `health-energy`)
14. `running-pace-calculator` (Health: `health-activity`)
15. `one-rep-max-calculator` (Everyday/Strength: `everyday-strength-training`)
16. `hydration-calculator` (Health: `health-energy`)

### Planned Internal Waves for Implementation:
- **Wave A (Construction & Contractor):**
  - `mortar-calculator`
  - `concrete-block-calculator`
  - `rainwater-harvesting-calculator`
- **Wave B (Finance & Business Economics):**
  - `lumpsum-investment-calculator`
  - `savings-goal-calculator`
  - `mortgage-affordability-calculator`
  - `break-even-calculator`
  - `profit-margin-markup-calculator`
- **Wave C (Developer & Image Utilities):**
  - `responsive-srcset-generator`
  - `yaml-to-json-converter`
  - `json-to-yaml-converter`
  - `uuid-generator-validator`
- **Wave D (Health, Fitness & Activity):**
  - `macronutrient-calculator`
  - `running-pace-calculator`
  - `one-rep-max-calculator`
  - `hydration-calculator`
