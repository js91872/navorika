# Complete multilingual rollout

## Approved scope

The user selected a complete multilingual rollout on 19 October 2026, preserving the approved design and existing English URLs. All seven existing languages remain in scope: French, Italian, Portuguese, Spanish, Arabic, Russian and German. The user also selected **no added translation service**: content is prepared and checked in the repository over successive working sessions, with no translation API dependency or additional provider subscription.

This is a full-site project, not a declaration that the previous three small releases completed translation. Keep the larger work on `feat/full-multilingual-rollout`; use a draft PR and leave production on the approved release while the full rollout is incomplete. There is no automatic background worker: progress and checks are recorded in the repository so the next working session can resume the same project.

## Source inventory

`docs/i18n-coverage.json` is generated from the current tool registry, guide registry, English route files and published translation allowlists. Regenerate it rather than editing counts manually.

At the start of this project:

| Content | Inventory | Current translated coverage |
| --- | ---: | ---: |
| Registered tools | 319 | 10 tools in all seven languages |
| Other active tools awaiting translation | 303 | None published |
| Tools already under review | 6 | Keep excluded from indexing; resolve separately |
| Shared calculator definitions | 75 | Shared infrastructure is being prepared; this is not 75 translated tools |
| Guides | 57 | No translated guides published |
| Public/trust/reference pages in the initial list | 7 | No translated counterparts published |
| English page source files, including dynamic route templates | 349 | Every source template is listed in the generated report |

The 70 translated tool variants and seven directories remain the approved published coverage. Active tool coverage alone eventually requires 2,191 language variants, of which 70 are published. Guides add 399 variants and the initial public-page list adds 49. Additional directories, categories, toolkits, nested routes and global interface surfaces are also tracked. Do not treat the resulting page count as the same thing as English source-template count.

The source scan finds hundreds of thousands of candidate words across JSX, copy fields and long-form content. This includes duplicate or unused copy and is **not a billable word count, a timing estimate, or proof that extraction found every runtime message**. Candidate entries require editorial classification; source strings are not automatically rewritten.

## Work streams

1. **Shared calculators:** separate calculation definitions from the English renderer; prepare complete native configuration and result formatting for each supported tool. Preserve the calculation functions and machine identifiers. Financial, health, veterinary, construction and engineering assumptions need individual review. A French-language UK-tax page must still explain UK assumptions; translation does not turn it into French tax advice.
2. **Developer and data utilities:** translate controls, help, validation and human explanations. Leave programming keywords, CLI commands, protocol identifiers, generated JSON keys and code examples unchanged unless they are intentionally human labels.
3. **Image, PDF, audio and video tools:** translate chooser labels, loading, cancellation, validation, errors, selected-page/frame states, reports and downloads. Preserve filenames and user-entered text. Test corrupted and unsupported input, stale asynchronous results and download rejection.
4. **Server converters:** cover browser copy, API error contracts, queue/status messages, output downloads and processing/privacy disclosures together. Inspect all code paths; the inventory's source heuristics are a review aid, not proof that a tool is browser-only.
5. **Guides:** translate complete substantive articles, headings, tables, examples, FAQ answers, image alt text, source context and internal links. Preserve qualifications, units and country assumptions. Do not publish shortened placeholder articles under translated URLs.
6. **Public pages:** translate About, Contact, Privacy, Terms, Disclaimer, Methodology and Glossary, plus other page templates in the generated inventory. Preserve the actual English policy's meaning and factual statements; do not invent legal promises or change retention/processing claims while translating.
7. **Global surfaces:** complete directories, categories, toolkits, search, navigation, breadcrumbs, language switching, runtime feedback, metadata, structured data, sitemap and reciprocal language links across the entire inventory.

## Shared implementation prepared in this branch

- `src/lib/calculations/businessConfigs.ts` holds the 75 existing calculator definitions independently of their React renderer. English rendering imports the same definitions and preserves their calculations, values and notes.
- `src/lib/i18n/businessLocalization.ts` validates exact field/result keys and requires native labels, help, placeholders, options and notes when the English definition contains them. It preserves dropdown values and calculation identity. Every text result must be explicitly classified as machine output or supplied with a native formatter. Missing or newly added source keys fail validation rather than falling back to English.
- `src/lib/i18n/actionMessages.ts` supplies common native copy/download/print feedback for all seven languages. `ResultActions` accepts these messages while keeping its existing English behavior by default. Localized feedback uses native failure text instead of exposing arbitrary English browser/provider errors. Callers must also provide native action labels.
- `src/lib/i18n/contentCoverage.ts` records guide/public-page coverage and full-inventory surface verification. Empty or pending entries are intentional and must not be marked ready merely because scaffolding exists.
- `scripts/audit-i18n.mjs` generates the inventory, reproducible copy candidates with stable source/text IDs, and an explicit full-completion check.

These foundations do not by themselves certify any tool as translated. The first implementation cohort below enables additional native routes only within the draft branch.

## Commands and completion gates

```bash
npm run i18n:audit:write
npm run i18n:audit
npm run test:i18n:audit
node --import tsx scripts/audit-i18n.mjs --write \
  --source-candidates /tmp/navorika-copy-candidates.json
npm test
npm run lint:baseline
npm run build
npm run test:i18n:browser
```

The generated copy-candidate export is reproducible work data and should not be committed as a giant catalogue. It distinguishes visible copy candidates from other literals. The extractor does not safely translate interpolated runtime messages or classify every machine token automatically; each family still requires a source and runtime review.

```bash
npm run i18n:complete
```

**This last command is expected to fail now.** It must pass before the project can be called a complete rollout. It checks remaining active tools, guide/public-page coverage, source route templates and global surface sign-offs. Under-review tools are explicitly listed rather than silently counted as translated. Routine CI checks inventory freshness and localization helpers; it does not force an unfinished draft project to pretend it is complete.

Before release, also require:

- Native copy for every supported language, with no English fallback in normal, empty, busy, success, failure or exported-report states.
- Successful build and calculation regression checks; realistic file and API-response fixtures for each tool family.
- Static native URLs, correct document language and Arabic direction, self canonicals, reciprocal hreflang and appropriate schema/sitemap coverage.
- Mobile and desktop workflows, numeric/code isolation, keyboard navigation, outside/Escape dismissal and approved branding.
- No translated copies of tools that remain under review or broken. No country-specific promise changed merely by changing the interface language.
- Clear editorial review status. Automated checks do not certify native-speaker quality or legal/medical accuracy.

## Current session checkpoint

The draft branch now includes native controls, metadata, explanatory copy, result labels, validation messages, clipboard summaries and UTF-8 CSV reports for one hundred forty-one additional calculators in all seven languages (151 tools total per locale, completing 100% of the 75 shared business calculators, 100% of the everyday calculators category, and 100% of the construction calculators category):

- Image File Size Estimator
- Photo Storage Calculator
- Image Bandwidth Calculator
- Square Footage Calculator
- Cubic Yard Calculator
- Roofing Shingle Calculator
- Rafter Length Calculator
- Wall Stud Calculator
- Drywall Joint Compound Calculator
- Roof Ridge Height Calculator
- Fascia Replacement Cost Calculator
- Print PPI Calculator
- Shed Ramp Angle Calculator
- Construction Material Waste Calculator
- Soffit & Fascia Calculator
- Attic Insulation Payback Calculator
- Joist Deflection Calculator
- HVAC Duct CFM Calculator
- Mortar Calculator – Brick & Block Walls
- Concrete Block Calculator
- Rainwater Harvesting Calculator
- Dog Age (Breed-Specific) Calculator
- Puppy Growth Predictor
- Cat Calorie Calculator
- Caffeine Half-Life Calculator
- HRV Baseline Deviation Calculator
- Wilks & DOTS Powerlifting Calculator
- Macronutrient Calculator
- Running Pace Calculator
- Daily Hydration Calculator
- One Rep Max Calculator
- Rental Property Cash Flow Calculator
- Rental Yield Calculator
- Cap Rate Calculator
- Cash on Cash Return Calculator
- BRRRR Calculator
- Fix and Flip Profit Calculator
- Short-Term Rental Break-Even Calculator
- House Hacking Effective Rent Calculator
- AI Token Calculator
- LLM API Cost Calculator
- GPU Compute Cost Calculator
- Cloud Hosting Cost Calculator
- CDN Cost Calculator
- Startup Runway Calculator
- SaaS Burn Rate Calculator
- LTV:CAC Ratio Calculator
- CAC Payback Period Calculator
- Churn Impact Calculator
- Rule of 40 Calculator
- Net Revenue Retention (NRR) Calculator
- Drawdown & Recovery Calculator
- Meeting ROI Calculator
- Electric Vehicle vs Gas Break-Even Calculator
- Heat Pump vs Furnace Cost & Payback Calculator
- Job Offer Total Compensation Calculator
- Lump Sum Investment Calculator
- Savings Goal Calculator
- Mortgage Affordability Calculator
- Break-Even Analysis Calculator
- Profit Margin & Markup Calculator
- IPv6 Subnet Calculator
- TCP/UDP Port Range Calculator
- CIDR Summarization Calculator
- IP Address Classifier
- Common Port & Service Lookup
- URL Parser
- CorelDRAW Preflight Print Readiness Checker
- Responsive Srcset Generator
- YAML & JSON Converter
- UUID Generator & Validator
- Regex Tester
- Unix Timestamp Converter
- UTM Builder
- Meta Tag Generator
- Robots.txt Generator
- Cement Calculator
- Sand Calculator
- Paint Calculator
- Tile Calculator
- Steel Weight Calculator
- Roof Pitch Calculator
- Stair Stringer Calculator
- Deck Board Calculator
- Fence Calculator
- Post Hole Concrete Calculator
- Drywall Calculator
- Paver Calculator
- Polymeric Sand Calculator
- Mulch Calculator
- Topsoil Calculator
- BMI Calculator
- BMR Calculator
- Body Fat Calculator
- Calorie Calculator
- Calories Burned Calculator
- Healthy Weight Calculator
- Heart Rate Calculator
- Ideal Weight Calculator
- Lean Body Mass Calculator
- Running Calories Calculator
- TDEE Calculator
- Waist to Height Ratio Calculator
- Waist to Hip Ratio Calculator
- Walking Calories Calculator
- Aquarium Volume Calculator
- Barbell Plate Calculator
- Battery Charge Time Calculator
- Dimensional Weight Calculator
- Electricity Cost Calculator
- Fuel Cost Split Calculator
- Schengen 90/180-Day Calculator
- Tire Size Calculator
- Unit Price Calculator
- Website Worth Calculator
- Asphalt Calculator
- Board Foot Calculator
- Brick Calculator
- Concrete Calculator
- Dumpster Weight Calculator
- Flooring Calculator
- Gravel Calculator
- Rebar Calculator
- Roof Area Calculator
- Saw Kerf Calculator
- Air Compressor CFM & Tank Runtime Calculator
- Construction Cost Calculator
- Egress Window Code Checker
- Excavation Calculator
- Ladder Safe Reach & 4:1 Calculator
- Land Area Converter
- OSHA Portable Toilet Calculator
- Solar Panel Calculator
- Voltage Drop Calculator
- Wallpaper Calculator
- Water Tank Calculator
- Wire Size Calculator
- 12-Foot Gambrel Roof Truss Calculator
- Construction Estimate Builder
- Contractor Estimate Generator
- House Construction Cost Calculator
- Currency Converter
- UK VAT Calculator
- SIP Calculator
- PPF Calculator
- Fixed Deposit Calculator
- GST Calculator
- Loan EMI Calculator
- India Income Tax Calculator
- Debt Snowball vs Avalanche Calculator
- Retirement Calculator
- Cashflow & Budget Architecture Planner
- Investment Return & CAGR Profiler
- Loan Amortization & Accelerated Payoff Suite
- Savings Target & Wealth Accumulation Hub
- Tax Regime Comparison & Compliance Deck
- Wealth & Inflation Purchasing Power Matrix
- Merge PDF Online
- Split PDF Online
- Rotate PDF
- Reorder PDF
- Delete PDF Pages
- Extract PDF Pages
- Compress PDF Online
- PDF Page Size Checker
- PDF Metadata Editor
- PDF Word Counter
- Flatten PDF
- Interleave PDF
- Add Image to PDF
- Add Page Numbers to PDF
- Add Watermark to PDF
- Crop PDF
- Extract Text from PDF
- HEIC to PDF Converter
- JPG to PDF Converter
- Markdown to PDF Converter
- PDF to Image Converter
- PDF to JPG Converter
- Sign PDF
- WebP to PDF Converter
- Compress Image
- Compress Image to 20KB
- Compress Image to 50KB
- Compress Image to 100KB
- Compress Image to 200KB
- Compress JPG
- Compress JPG to 100KB
- Compress PNG
- Compress PNG to 100KB
- Compress WebP
- Resize Image
- Rotate Image
- Convert JPG to PNG
- Convert JPG to WebP
- Convert PNG to JPG
- Convert PNG to WebP
- Convert WebP to JPG
- WebP to PNG Converter
- Image Converter – JPG, PNG & WebP
- SVG to PNG Converter
- SVG to ICO Converter
- WebP to ICO Converter
- WebP to GIF Converter
- JFIF to PNG Converter
- Fertilizer Calculator
- Reverse Sales Tax Calculator
- Shopify Margin Calculator
- AVIF to PNG Converter
- HEIC to JPG Converter
- HEIC to PNG Converter
- Batch Image Converter
- Black and White Image Converter
- 1000x1000 Image Converter & Resizer
- Change Image Resolution
- Image to Base64 Converter
- Base64 to Image Converter
- Text to Image Converter
- HTML to Image
- HTML to JPG Converter
- HTML to PNG Converter
- Crop Image
- Icon Sticker Maker
- ID Photo Maker
- Color Picker from Image
- Image Metadata Viewer
- Image to PDF Converter
- Meme Generator
- Photo Collage Maker
- Photo Editor
- Social Media Resizer
- SVG Dimensions Checker
- Upscale Image
- Watermark Image
- Audio Bitrate Calculator
- Audio & Video Tools
- Extract Audio from Video
- M4A to MP3 Converter
- MOV to MP3 Converter
- MP3 to WAV Converter
- MP4 to MP3 Converter
- Video to Audio Converter
- Video to MP3 Converter
- WAV to MP3 Converter
- WEBM to MP3 Converter
- VCF to CSV Converter
- XML to CSV Converter
- CSV to vCard Converter
- Merge XML Files
- XML to Word Converter
- Word to XML Converter
- CSV to JSON Converter
- JSON to CSV Flattener
- JSON Formatter
- JSON Diff & Compare
- JSON Schema Validator
- JSON to YAML Converter
- YAML to JSON Converter
- JSON to TOML Converter
- TOML to JSON Converter
- YAML Validator

This brings branch coverage to 271 tools per language (1,897 tool variants plus seven directories, 1,904 localized pages total), advancing published coverage across the platform. Exactly 45 active tools (Developer Tools), 57 guides, seven public pages and full-inventory surface reviews remain pending. Keep this PR in draft.

The localized calculator renderer preserves the approved panels and uses the existing calculation engines. It rejects blank, nonfinite, negative, fractional count and out-of-range inputs before engines can silently normalize them. English calculator behavior is unchanged. Native number formatting is used in displayed and exported results; Arabic inputs and numeric results retain explicit direction isolation. Storage conversion assumptions remain explicit (the existing engines use binary conversions despite GB/MB labels).

The renderer now supports native select dropdowns, percentages and USD amounts without currency conversion. PPI match/mismatch, ramp flat/vertical/ratio and joist span/deflection ratio states derive from numeric inputs rather than parsing English engine strings. A vertical ramp keeps its null percentage as native “not applicable” in the screen, clipboard and CSV. Count fields require whole values; measured dimensions, quantity areas and percentages accept decimals. Invalid serialized text-output classifications fail validation.

The next family can reuse strict native configuration validation and the calculator renderer. Further text-result calculators still require explicit native adapters; they must not be enabled by copying raw English engine output. Continue in this branch until the full-completion gate and runtime/editorial review pass.
