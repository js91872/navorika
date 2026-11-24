# Navorika — Consolidated Quality Workstream (Batches 3–7)

Date: 2026-11-05. Base: main after PR #51. Scope: keep all **329 existing published tool route slugs and URLs** intact, including previously established canonical relationships; never consolidate, delete, redirect, or noindex a page from keyword overlap alone.

## Batch 3 — Functional accuracy and distinct tool intent

- The quick `/tools/unix-timestamp-converter` previously chose milliseconds for any timestamp longer than ten digits. This misinterpreted valid 11–12-digit seconds and accepted unsafe numeric inputs. The shared parser now has tested 10/11-digit seconds, 13-digit milliseconds, negative timestamps, and invalid cases; the result includes UTC for comparison.
- The full `/tools/epoch-time-converter` keeps bidirectional date conversion, explicit units, timezone settings, and ticker. **Both routes stay untouched**; the existing canonical override remains unchanged pending separately approved indexing decisions.
- `/tools/uuid-generator` continues to provide high-volume generation/export; `/tools/uuid-generator-validator` retains inspection of existing UUIDs and structured outputs. Clarified v7 ordering limitations and added relevant internal links. No consolidation or URL change.
- Fixed compressed-image results remaining visible after changing format, PNG strategy, or dimensions. Keyboard users can now open the uploader.

## Batch 4 — Editorial accuracy and FAQs

- Reworked high-risk assertions in target-image-compression content: no universal government passport photo sizes, guarantees of under-budget files, guaranteed visual quality, or always-fast mobile performance.
- Added clear statements about portal-specific dimensions, formats, image complexity, achieved bytes, and visual checks.
- Revised the quick Unix converter's descriptions to match actual behavior.

## Batch 5 — Useful internal navigation

- Relevant links now point from the quick Unix converter to the full epoch converter and other related timing tools.
- The UUID inspection page links to the dedicated bulk UUID generator and ULID generator rather than unrelated utilities.
- Existing guide references and taxonomy relationships are preserved.

## Batch 6 — Transparency and usability

- Compression guidance states that results and file limits must be checked for the intended portal; it does not claim automatic government-form compliance.
- The image upload target responds to Enter/Space, and changes to settings clear previous outputs. Tool processing modes are otherwise unchanged.
- No claim that all 329 tools have been manually tried in every browser: real device/browser QA remains required before declaring full coverage.

## Batch 7 — Technical SEO and permanent safeguards

- Recorded the full baseline of 329 existing top-level English tool URL slugs in `docs/seo-tool-route-baseline.json`. CI fails if any disappears from the registry or its original page path.
- Preserved all existing slugs, pages, and canonical overrides.
- Include the already self-canonical JSON-to-YAML and YAML-to-JSON tools in the XML sitemap. They were excluded despite the PR #48 canonical correction. The bidirectional YAML/JSON URL remains.
- Removed duplicate sitemap entries (without changing their URLs).
- CI now checks the generated i18n inventory and executes preservation, sitemap, Unix calculation, and image result-state regression tests.

## Final approval gates (do not claim these are already complete)

1. GitHub Quality must pass for this exact PR head: architecture, TypeScript, lint baseline, multilingual inventory, unit tests, build, browser smoke and localized pages.
2. Inspect mobile and desktop views for `/tools/unix-timestamp-converter`, `/tools/epoch-time-converter`, `/tools/uuid-generator-validator`, and two compression presets. Confirm accessibility, output accuracy, no visual regressions.
3. Compare Search Console's indexed/canonical URL and sitemap reports before and after deployment. New sitemap discoverability does **not** guarantee indexing.
4. Review the separate candidate queue in `docs/adsense-quality-batch1-review-queue.md`. A code-based audit does not certify the quality of all 329 tool experiences.
5. Reapply to AdSense only after policy, indexation and human experience review. Passing these checks cannot guarantee approval.

This combined workstream covers the five planned areas in one development PR, not a promise that every possible flaw across hundreds of pages is resolved.
