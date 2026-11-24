# Navorika page-quality recovery — first implementation batch

Date: 2026-11-02  
Branch: `feat/adsense-quality-standard-nov02`  
Scope: Page-level editorial patterns and repeatable static triage. No deployment or merge.

## Current architecture (verified in repository)

- `src/components/tools/ExpansionToolPage.tsx` provides the tool-first page header and privacy badges.
- `src/components/seo/ToolPageContent.tsx` renders per-tool introductions, methods, steps, interpretations, limitations, FAQs, related tools and guides from `src/data/tool-pages/*.ts`.
- `src/components/ToolSEOWrapper.tsx` was an older client-side wrapper that injected repeated generic claims, including assertions about browser-local processing and verified algorithms regardless of the tool.
- `src/app/(english)/categories/[slug]/page.tsx` already provides short category introductions, task-based toolkits, clusters and related guides.
- `ADSENSE_CONTENT_QUALITY_AUDIT.md` is a historical audit dated 2026-09-27. Its findings and counts must be revalidated rather than treated as current site facts.

## Initial code changes

1. Remove unsupported generic processing/accuracy claims and boilerplate editorial cards from the legacy tool wrapper.
2. Replace arbitrary same-category related links with taxonomy-based related tools.
3. Do not render the shared FAQ section when a tool has no specific questions.
4. Add `scripts/audit-tool-page-quality.mjs` to inventory explicit English tool routes and flag possible missing unique content, legacy wrappers, privacy assertions, and canonical overrides.

## How to run

```bash
node scripts/audit-tool-page-quality.mjs --write
npm run validate:architecture
npm run typecheck
npm run test:ux
npm run test:i18n
npm run build
```

Then manually check pages in each of the calculator, file, developer, image, and health/finance families. The audit script is *triage only*, not a verdict about Google policy compliance. A clean static report does not verify that a calculator works correctly.

## Subsequent content batch — acceptance criteria

For each prioritized tool: verified input/output example; genuine method or conversion explanation; failure behavior and limitations; accurate processing/privacy disclosure; relevant guide/tool links; responsive layout; no invented sources, ratings, authors or word-count padding.

Select the first 20–30 pages using recent GSC opportunity data when accessible, combined with reproducible static findings and user value. Prioritize false functionality/privacy assertions and broken paths above text length.

## Known follow-up investigations

- Verify how often the legacy `ToolSEOWrapper` still renders and whether all affected pages have enough distinctive information after generic filler removal.
- Inspect the canonical override on `json-to-yaml-converter` versus `yaml-json-converter`; do not change without confirming preferred URL and duplication.
- Check referenced quarantined routes against current behavior and link graph.
- Verify translated page content and actual processing architecture separately.

## Not yet completed

A full crawl, individual functionality tests for 20–30 pages, GSC-based prioritization, multilingual review, CI/test execution, and production deployment have **not** been performed as part of this initial GitHub-only batch.
