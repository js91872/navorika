# Navorika V2 — implementation brief (approved direction)

## Objective
Implement the approved clean utility UI across the real Next.js application, not as a static HTML mockup. The reference preview is `public/design-review/index.html` on this branch. This is a design reference only: do not copy its placeholder brand mark, invented URLs, sample data, or static navigation into production.

## Visual system
- iLovePDF-inspired restrained palette: red `#e5322d` for primary actions and active controls; white cards; `#f7f7f8` page background; dark neutral headings; subtle gray borders.
- Retain the EXISTING Navorika logo, brand text, and existing homepage H1/title semantics from the repository. Do not replace with a generated logo or change the homepage title solely to match the mockup.
- Native/system font stack, Lucide icons already installed, no emojis, stock imagery, decorative gradients, glows, animated marketing badges, or invented trust statistics.
- Clear, ordinary English. Replace jargon such as “100% client-side” with accurate plain-language explanations such as “Your file stays on your device” ONLY for tools where this is true. No blanket privacy promises.
- Real, functional tool search, category filters, working links from registry, accessible focus states, keyboard support, empty states, responsive layout.
- Mobile first; avoid horizontal overflow. Use existing theme and accessibility conventions.

## Architecture and preservation
- Inspect existing homepage route(s), localized route `src/app/[locale]/page.tsx`, `src/components/i18n/LocalizedCatalog`, global layout, nav/footer, tool registry, and actual tool pages before changing code.
- Keep ALL current tool routes, guides, metadata, structured data, canonical/hreflang, robots, sitemaps, existing localized dictionaries, tool calculations, and converter functionality.
- Do not replace a working localized UI with hardcoded English. Reuse existing dictionary keys or add translations across all 8 supported locales. Preserve `d.ui.title` as homepage H1 on localized routes; existing tests assert this.
- Avoid hardcoded tool counts (the localized homepage currently displays 319); derive from registry or remove the stat.
- Refactor shared components rather than bulk rewriting hundreds of individual pages. Ensure calculator, converter, PDF/image tool, and guide templates look coherent.
- Keep changes limited to the design branch `design/clean-red-utility-ui`. Do not merge or deploy without explicit approval.

## Delivery phases
1. Inventory routes and shared components. Write concise architecture notes and identify existing tests.
2. Implement design tokens, global header/nav/footer, home hero, working search/filter/catalog and tool cards. Use existing logo/title.
3. Apply consistent layouts to representative calculator, image/PDF converter and guide; refactor shared templates for scalable coverage.
4. Apply shared design across remaining page families without changing tool logic.
5. Accessibility, mobile, dark mode (if retained), localization and SEO regression tests. Remove unused static prototype when production implementation is approved.

## Acceptance
- Homepage and localized homepages render correct H1, brand and tool registry results.
- Search/filter and every visible navigation item work with actual routes.
- Representative tool pages run their existing calculations/conversions correctly.
- All eight locales preserve functioning content and navigation.
- No SEO route, canonical, hreflang, schema or sitemap regressions.
- Run `npm ci`, `npm run validate:architecture`, `npm run typecheck`, `npm run test:ux`, `npm run test:i18n`, `npm run test:i18n:audit`, `npm run lint:baseline`, `npm run build`. Fix failures caused by changes and report preexisting failures separately.
- Provide screenshots at desktop and mobile widths plus a draft PR for review; do not merge.

## Scope guardrails
Do not create new tools, change underlying calculations, redesign the logo, invent prices/ratings, introduce auth, or make unverified claims. No changes to production VPS.
