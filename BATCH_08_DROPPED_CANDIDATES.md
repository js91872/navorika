# Navorika Batch 08 — Dropped & Deferred Candidates Log

**Date:** 2026-09-07  
**Purpose:** Maintain a permanent, immutable record of rejected, deferred, or absorbed tool concepts so they are not mistakenly reconsidered as new candidate routes in future batches.

---

## 1. Upgraded / Absorbed into Existing Routes (Do Not Build Duplicate Routes)

| Proposed Candidate | Category | Absorbed By Existing Route / Subtool | Justification / Reason |
|---|---|---|---|
| **CAGR Calculator** (`cagr-calculator`) | Finance | `/tools/investment-return-profiler/cagr-calculator` | Exists as an active, indexable subtool in `src/data/financeMeta.ts`. Spawning a new root `/tools/cagr-calculator` would cause severe canonical cannibalization. |
| **Compound Interest Calculator** (`compound-interest-calculator`) | Finance | `/tools/wealth-inflation-matrix/compound-interest-calculator` | Exists as an indexable subtool under `wealth-inflation-matrix`. Reused and enriched within existing structure. |
| **Credit Card Payoff Calculator** (`credit-card-payoff-calculator`) | Finance | `/tools/cashflow-budget-architect/credit-card-payoff` & `debt-snowball-vs-avalanche-calculator` | Revolving card payoff is already served by existing subtool and the multi-debt snowball/avalanche engine. |
| **Emergency Fund Calculator** (`emergency-fund-calculator`) | Finance | `/tools/cashflow-budget-architect/emergency-fund-calculator` | Exists as an indexable subtool in `financeMeta.ts`. |
| **Inflation-Adjusted Return Calculator** (`inflation-adjusted-return-calculator`) | Finance | `/tools/wealth-inflation-matrix` | Purchasing power decay and inflation modeling is the core intent of `wealth-inflation-matrix`. |
| **Aspect Ratio Calculator** (`aspect-ratio-calculator`) | Image | `aspect-ratio-padding-calculator` & `image-scaling-calculator` | High similarity (0.75) with `aspect-ratio-padding-calculator` and direct functional overlap with `image-scaling-calculator`. |
| **Hash Generator & Checksum Tool** (`hash-generator-checksum-tool`) | Developer | `web-crypto-studio` | `web-crypto-studio` already calculates SHA-256 client-side using Web Crypto. |
| **SQL Formatter** (`sql-formatter`) | Developer | `markup-formatter` | Standard SQL, Postgres, MySQL, SQLite, T-SQL, and BigQuery formatting already exist inside `markup-formatter`. |
| **XML Formatter** (`xml-formatter`) | Developer | `markup-formatter` | XML validation and indentation formatting already exist inside `markup-formatter`. |
| **Tax Regime Comparison** (`tax-regime-comparison`) | Finance | `tax-calculator` & `taxation-compliance-deck` | Old vs New regime tax slab comparison is already implemented in `tax-calculator`. |
| **Solar Payback Estimator** (`solar-payback-estimator`) | Construction | `solar-panel-calculator` | Sizing, generation, and energy offset already exist in `solar-panel-calculator`. |

---

## 2. Dropped Duplicates (Already Implemented in Previous Expansions)

| Slug | Prior Batch / Source | Status in Active Repository |
|---|---|---|
| `drywall-calculator` | 20-Tool Expansion | Live route at `/tools/drywall-calculator` |
| `deck-board-calculator` | 20-Tool Expansion | Live route at `/tools/deck-board-calculator` |
| `mulch-calculator` | 20-Tool Expansion | Live route at `/tools/mulch-calculator` |
| `topsoil-calculator` | 20-Tool Expansion | Live route at `/tools/topsoil-calculator` |
| `stair-stringer-calculator` | 20-Tool Expansion | Live route at `/tools/stair-stringer-calculator` |
| `url-encoder-decoder` | 20-Tool Expansion | Live route at `/tools/url-encoder-decoder` |
| `debt-snowball-vs-avalanche-calculator` | 20-Tool AI/SaaS/Real Estate | Live route at `/tools/debt-snowball-vs-avalanche-calculator` |
| `cloud-hosting-cost-calculator` | 20-Tool AI/SaaS/Real Estate | Live route at `/tools/cloud-hosting-cost-calculator` |
| `cdn-cost-calculator` | 20-Tool AI/SaaS/Real Estate | Live route at `/tools/cdn-cost-calculator` |
| `gpu-compute-cost-calculator` | 20-Tool AI/SaaS/Real Estate | Live route at `/tools/gpu-compute-cost-calculator` |
| `board-foot-calculator` | Earlier Inventory | Live route at `/tools/board-foot-calculator` |
| `cidr-subnet-wildcard-calculator` | Earlier Inventory | Live route at `/tools/cidr-subnet-wildcard-calculator` |
| `cron-expression-humanizer` | Earlier Inventory | Live route at `/tools/cron-expression-humanizer` |
| `meeting-roi-calculator` | Standalone Manifest | Live route at `/tools/meeting-roi-calculator` |
| `soffit-fascia-calculator` | Batch 04 | Live route at `/tools/soffit-fascia-calculator` |
| `attic-insulation-payback-calculator` | Batch 04 | Live route at `/tools/attic-insulation-payback-calculator` |
| `joist-deflection-calculator` | Batch 04 | Live route at `/tools/joist-deflection-calculator` |
| `hvac-duct-cfm-calculator` | Batch 04 | Live route at `/tools/hvac-duct-cfm-calculator` |
| `shed-ramp-angle-calculator` | Batch 04 | Live route at `/tools/shed-ramp-angle-calculator` |
| `construction-material-waste-calculator` | Batch 04 | Live route at `/tools/construction-material-waste-calculator` |
| `image-megapixel-calculator` | Batch 05 | Live route at `/tools/image-megapixel-calculator` |
| `image-print-size-calculator` | Batch 05 | Live route at `/tools/image-print-size-calculator` |
| `image-file-size-estimator` | Batch 05 | Live route at `/tools/image-file-size-estimator` |
| `image-scaling-calculator` | Batch 05 | Live route at `/tools/image-scaling-calculator` |
| `photo-storage-calculator` | Batch 05 | Live route at `/tools/photo-storage-calculator` |
| `image-bandwidth-calculator` | Batch 05 | Live route at `/tools/image-bandwidth-calculator` |
| `ipv6-subnet-calculator` | Batch 06 | Live route at `/tools/ipv6-subnet-calculator` |
| `tcp-udp-port-range-calculator` | Batch 06 | Live route at `/tools/tcp-udp-port-range-calculator` |
| `cidr-summarization-calculator` | Batch 06 | Live route at `/tools/cidr-summarization-calculator` |
| `ip-address-classifier` | Batch 06 | Live route at `/tools/ip-address-classifier` |
| `common-port-service-lookup` | Batch 06 | Live route at `/tools/common-port-service-lookup` |
| `url-parser` | Batch 06 | Live route at `/tools/url-parser` |
| `pdf-bleed-trim-checker` | Batch 07 | Live route at `/tools/pdf-bleed-trim-checker` |
| `cdr-print-readiness-checker` | Batch 07 | Live route at `/tools/cdr-print-readiness-checker` |
| `svg-dimensions-checker` | Batch 07 | Live route at `/tools/svg-dimensions-checker` |
| `pdf-page-size-checker` | Batch 07 | Live route at `/tools/pdf-page-size-checker` |
| `rgb-cmyk-image-checker` | Batch 07 | Live route at `/tools/rgb-cmyk-image-checker` |
| `print-bleed-calculator` | Batch 07 | Live route at `/tools/print-bleed-calculator` |
| `step-to-3d-pdf-converter` | CAD Suite | Live route at `/tools/step-to-3d-pdf-converter` |
| `video-to-mp3-converter` & 10 audio tools | Audio/Video Suite | Live routes under `/tools/` |

---

## 3. Dropped Weak Candidates (Thin, High-Liability, or Non-Deterministic)

| Proposed Candidate | Category | Specific Reason for Rejection |
|---|---|---|
| **Building-Code Lookup Assistant** (`building-code-lookup`) | Construction | Local municipal and county building codes vary by jurisdiction and update continuously. Serving legal code determinations without guaranteed updates creates unacceptable engineering and regulatory liability. |
| **Nutrition Label Analyzer** (`nutrition-label-analyzer`) | Health | OCR extraction of complex consumer packaging labels produces unacceptable error rates and risks misleading users regarding allergen or nutritional safety. |
| **Color-Accessibility Simulator** (`color-accessibility-simulator`) | Developer | Subjective visual filters do not provide deterministic, testable compliance results beyond the existing WCAG contrast ratio calculations. |

---

## 4. Deferred Complex Candidates (External Backend / Heavy Payload Dependencies)

| Proposed Candidate | Category | Technical Blocker / Justification |
|---|---|---|
| **DNS Record Lookup** (`dns-record-lookup`) | Developer | Browser JavaScript cannot issue arbitrary UDP/TCP DNS queries without external resolver endpoints. Introducing public server-side DNS lookups creates SSRF, abuse, and rate-limiting infrastructure requirements. |
| **Security Header Scanner** (`security-header-scanner`) | Developer | Scanning external domains requires outbound HTTP requests from server infrastructure, creating significant SSRF risks and violating client-side zero-telemetry architecture. |
| **PDF/A Readiness Checker** (`pdfa-readiness-checker`) | PDF | Validating ISO 19005 (embedded glyph sets, color profiles, structural tree metadata) reliably inside browser JavaScript without false positives requires native verification engines. |
| **Scan Page Cleanup Tool** (`scan-page-cleanup`) | PDF / Image | Document deskew, thresholding, and binarization require heavy CV libraries (e.g., OpenCV.js) that exceed client performance and memory thresholds. |
| **OCR Document Extractor** (`ocr-document-extractor`) | PDF | Requires 30+ MB WASM language traineddata packages (Tesseract.js) which violate the lightweight browser performance standard. |
| **Portfolio Allocation Visualizer** (`portfolio-allocation-visualizer`) | Finance | Requires extensive compliance review regarding suitability, risk profiling, and non-individualized financial advice boundaries. |
| **AI-Assisted Document Transformations** (`ai-document-transformer`) | PDF / Image | Requires third-party cloud API credentials, paid inference tokens, and transmission of user documents over external networks, violating Navorika's local-processing privacy standard. |
