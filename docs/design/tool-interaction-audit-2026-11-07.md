# Tool interaction and logo audit — 2026-11-07

## Verified in repository
- `src/app/globals.css` already defines red primary tokens (`#e5322d` and `#c71f1e`) and scoped `[data-tool-interaction]` focus/input rules. It does **not** normalize all action-button colors or enforce the order of results and notices.
- `src/components/ui/Button.tsx` already has a red `primary` variant and neutral secondary/outline variants; the `success` variant is emerald for semantic success feedback.
- `src/components/tools/FocusedDeveloperTool.tsx` still had green primary Copy buttons, link accents and heading accents; this PR changes those action accents to brand red, leaving status badges and match highlights semantic green.
- `src/components/tools/ExpansionToolPage.tsx` renders tool children in `data-tool-interaction` and places `PrivacyBadges` after the tool interaction. This is a useful baseline, but it does not guarantee every nested tool shows its result before notices.
- `src/components/ui/Logo.tsx` and `public/logo.svg` had violet/pink gradient N marks; this PR changes them to solid red without changing the N silhouette or wordmark.

## Follow-up work required before claiming a site-wide button rollout
1. Inventory all action buttons across tool components and route pages; identify submit, calculate, convert, compare, generate, download, copy, reset, and destructive controls.
2. Make primary action buttons use the shared red Button component or a consistent semantic class; keep secondary actions neutral and errors/success states semantic.
3. Audit result placement per tool: inputs → primary action → result/preview → secondary actions → privacy notices/explanations. Preserve automatic-result tools and async progress states.
4. Add automated checks for disabled/loading/focus states, keyboard operation, mobile widths, and representative PDF, image, calculator, and developer tools.
5. Do not use blanket CSS to color every button red: it would obscure primary versus secondary/destructive actions.
6. Preserve existing routes, SEO metadata, formulas, conversion logic, and accessibility.

## Deployment
Review/merge this PR, run CI and production build in a separate release directory, smoke-test on an isolated port, then switch PM2 using the absolute `/usr/bin/npm` path. Retain the previous release for rollback.
