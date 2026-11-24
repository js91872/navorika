# Navorika AdSense Quality — URL Review Queue (Batch 1)

**Scope:** Page-level review candidates, not confirmed Google policy violations.
**Method:** Prior historical audit (September 2026), current route registry and representative code inspection (November 2026).
**Priority:** Check real tool output, user need, content uniqueness, internal links, mobile behavior and rendered HTML before changing indexing.

## Immediate improvement implemented in this branch

- `/tools/reverse-sales-tax-calculator`: Preserve the detailed original receipt guide. Suppress the second shared methodology/steps/limitations block while keeping shared FAQs, relevant tools and guides. Do not duplicate `FAQPage` markup.
- `scripts/audit-tool-page-quality.mjs`: Flag further pages that combine full original guides and shared SEO blocks without opting into concise supporting content.

## Next 25 review candidates

These are **inspection targets** and must not be automatically noindexed or consolidated.

| Priority | URL | Why inspect | Decision gate |
| --- | --- | --- | --- |
| P0 | /tools/developer-utils | Legacy multi-tool route flagged by historical audit | Verify interface and remove unrelated generic copy |
| P0 | /tools/webmaster-seo-builder | Historical audit found only outbound navigation | Verify standalone user value and navigation intent |
| P0 | /hubs/finance | Historical audit flagged dead guide links | Recheck every destination |
| P0 | /tools/json-to-yaml-converter | Canonical currently targets /tools/yaml-json-converter | Confirm intended canonical against page uniqueness |
| P0 | /tools/yaml-json-converter | Potential canonical overlap with directional converters | Confirm search intent and one preferred landing experience |
| P0 | /tools/yaml-to-json-converter | Potential overlap with combined converter | Verify user workflow and internal links |
| P0 | /tools/epoch-time-converter | Potential overlap with Unix timestamp route | Compare actual functionality |
| P0 | /tools/unix-timestamp-converter | Potential overlap with epoch route | Compare actual functionality |
| P0 | /tools/uuid-generator | Potential overlap with generator-validator | Compare actual functionality |
| P0 | /tools/uuid-generator-validator | Potential overlap with generator | Compare actual functionality |
| P1 | /tools/compress-image-to-20kb | Preset image-compression route | Assess distinctive use case vs main compressor |
| P1 | /tools/compress-image-to-50kb | Preset image-compression route | Assess distinctive use case vs main compressor |
| P1 | /tools/compress-image-to-100kb | Preset image-compression route | Assess distinctive use case vs main compressor |
| P1 | /tools/compress-image-to-200kb | Preset image-compression route | Assess distinctive use case vs main compressor |
| P1 | /tools/compress-jpg-to-100kb | Image format/size preset route | Check overlap and output fidelity |
| P1 | /tools/compress-png-to-100kb | Image format/size preset route | Check overlap and transparency behavior |
| P1 | /tools/loan-emi-calculator | Potential duplicate of amortization suite | Verify distinct inputs/output |
| P1 | /tools/loan-amortization-suite/emi-calculator | Finance suite subroute | Compare canonical and related links |
| P1 | /tools/image-dpi-converter | Previously quarantined | Confirm noindex and internal-link exclusion |
| P1 | /tools/blur-face | Previously quarantined | Confirm noindex and honest feature status |
| P1 | /tools/png-to-svg | Previously quarantined | Confirm output fidelity and indexing |
| P1 | /tools/protect-pdf | Previously quarantined | Confirm user-facing state and noindex |
| P1 | /tools/unlock-pdf | Previously quarantined | Confirm user-facing state and noindex |
| P1 | /tools/bioluminescent-reader | Previously quarantined | Confirm scientific claims and indexing |
| P1 | /tools/icloud-storage-calculator | Newer tool with privacy-sensitive workflow | Verify manual-input claims, warnings, output examples |

## Quality acceptance checklist for each reviewed URL

1. Functionality verified on valid and invalid representative input.
2. Unique benefit and search intent established (no arbitrary preset-only doorway).
3. Relevant method, verified example, interpretation and limitations available in server-readable HTML.
4. Privacy and upload disclosures reflect actual processing; no blanket browser-local claim.
5. Internal links go to working, relevant destinations.
6. One coherent editorial flow; no duplicated introduction/formula/steps.
7. Canonical, robots directives, localized paths and schema match intended page.
8. Mobile layout, keyboard accessibility and copy/download actions tested where applicable.

## Execution constraints

- Do not remove useful tools or noindex pages solely because they have zero impressions.
- Do not expand text merely to hit a word count.
- Do not change redirect/canonical destinations without assessing existing indexed URLs and incoming links.
- Keep all further changes in separate reviewable batches, test with `npm run check`, `npm run test:i18n:audit`, and `npm run test:i18n` before merging.
- Do not describe this queue as a completed live-site audit. GSC numbers and live functional tests have not been supplied.
