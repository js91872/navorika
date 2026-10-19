# Multilingual release — first batch

## What is included

Seven additional languages: French (`fr`), Italian (`it`), Portuguese (`pt`), Spanish (`es`), Arabic (`ar`) and Russian (`ru`), plus German (`de`). English keeps its existing unprefixed URLs.

Each language has a tool directory at `/{locale}` and these five working tools at `/{locale}/tools/{slug}`:

- `aspect-ratio-padding-calculator`
- `css-flexbox-generator`
- `rgb-cmyk-image-checker`
- `image-megapixel-calculator`
- `print-bleed-calculator`

This is **42 new pages: seven directories and 35 tool pages**, not a claim that the entire English inventory has been translated. Navigation, search, tool controls, validation, results, clipboard feedback, instructions, limitations and FAQs are localized. Control labels use native descriptions. Generated CSS, file-format names and standard technical abbreviations retain their required syntax. The color checker reuses the existing original-file-header inspector and translates its displayed color-mode labels.

## URLs, rendering and search

- Existing English pages live physically under `src/app/(english)`. The route group does not appear in public URLs. A checked-in contract covers all 349 original English page files, including dynamic route templates.
- `src/app/[locale]/layout.tsx` is a separate root layout. It produces the correct document language and Arabic `dir="rtl"` without making English pages dynamically rendered or changing the existing security middleware.
- Translated pages are statically generated. Only supported language/tool combinations exist; unsupported combinations return 404 rather than English content under a translated URL.
- Each translated page has its own canonical URL and reciprocal language alternatives, including English and `x-default`. English counterparts contain the same language alternatives. Sitemap entries include all 42 translated URLs.
- Language switching preserves the current tool for these five tools. From an English page without a translated counterpart, the selector opens the selected language’s directory.
- Visitors choose their language. There are no redirects based on IP address or browser language.
- Site analytics and advertising script markup is shared with the English layout. Browser checks block outside requests to avoid sending test visits to analytics.
- Separate root layouts cause a full document navigation when switching between English and a translated version; navigation within a translated language remains client-side.

The installed Next.js documentation requires the experimental `globalNotFound` flag for a global 404 with these multiple root layouts. The release includes a small global 404 page. The existing middleware deprecation warning is unrelated to this change; middleware has not been renamed.

## Tool behavior

- Aspect-ratio results include localized numeric output and CSS declarations with machine-readable decimal points.
- Megapixel inputs require whole positive pixel dimensions; empty and invalid inputs clear results.
- Print-bleed calculations use equal bleed on all four edges. Switching millimeters/inches converts the entered values rather than relabeling them.
- Flexbox preview coordinates deliberately remain left-to-right, including in Arabic, so the generated CSS matches the preview’s stated coordinate system.
- Image inspection reads at most 128 KiB locally. Previous results are cleared before processing another file, and generation checks prevent an older file read from replacing a newer result. Unsupported files produce localized errors. This is not a color conversion or print certification tool.
- Clipboard rejection produces localized manual-copy instructions.

## Reproduce validation

Use the Node.js version in `.nvmrc` and the committed lockfile:

```bash
npm ci
npm test
npm run lint:baseline
npm run build
npx playwright install --with-deps chromium
npm run test:i18n:browser
```

The browser command starts and stops a local **production** server. To use an existing test server, set `I18N_BASE_URL`. To use an installed Chromium, set `CHROMIUM_EXECUTABLE`. To save desktop/mobile QA screenshots, set `I18N_SCREENSHOT_DIR` to a temporary output directory. Test-only screenshot files should not be committed.

Browser checks cover all 42 localized pages at desktop and mobile widths, metadata, Arabic direction, language links, local search, five tool workflows per language, successful/rejected clipboard writes, invalid inputs, unit conversion, image-header inspection, six English counterparts, unsupported routes and sitemap inclusion. They also fail on uncaught JavaScript errors. GitHub Actions runs these checks after building.

The two existing shared/image test scripts now use `node --import tsx --test` rather than the `tsx` CLI. This preserves their test runner while avoiding a CLI IPC socket requirement in restricted runners.

## Executed validation — 18 October 2026

Local environment: Linux, Node.js 24.19.0. The repository declares Node.js >=22.13.0; GitHub Actions uses `.nvmrc` (22.13.0). The local results below are separate from GitHub Actions results on the review pull request.

| Check | Executed result |
| --- | --- |
| `npm test` | Passed: 546 tests, zero failures (15 UX, 443 calculations, 27 shared utilities, 54 image utilities, seven multilingual tests) |
| Architecture validator | Passed: 319 registered tools and 319 English tool routes, 55 clusters, eight toolkits, 111 tool SEO records, 57 complete guides |
| TypeScript | Passed standalone and during the final production build |
| `npm run build` | Passed; 486 static-generation entries completed, including all translated pages |
| Existing lint-baseline check | Passed: 125 existing errors / 168 warnings, below the inherited 182 / 197 limits |
| Scoped multilingual and Navbar lint | Passed: zero errors, zero warnings |
| Production browser checks | Passed: 42 translated pages, 35 tool workflows, six English counterparts, five invalid-route checks |
| Responsive layout | Desktop and 390px mobile overflow checks passed for all translated pages and six English counterparts |
| Language switching | English → Arabic → English preserves the tool; document direction changes correctly |
| Arabic examples and numbers | Numeric expressions use bidirectional isolation; width × height examples and CSS retain their intended order |
| Browser JavaScript | Zero uncaught page errors |
| Visual QA | French desktop and Arabic mobile screenshots inspected; desktop/mobile screenshots also captured for both languages |
| Patch whitespace | `git diff --check` passed |

The default Playwright Chromium download returned an invalid archive in this execution environment. Browser tests were actually executed using a locally installed Chromium 153 executable via `CHROMIUM_EXECUTABLE`, with Playwright 1.62.1. This changes only the QA environment, not application dependencies or browser behavior on the live site.

## Release status and remaining work

The user authorized publishing the tested branch to the public `js91872/navorika` repository and opening a review pull request on 18 October 2026. This release remains a branch for review; it does not merge into `main` or deploy changes to the production website. GitHub Actions results must be checked on the pull request separately from the local validation recorded above.

All original English page paths remain covered by the route contract. Changes to existing English tool pages beyond moving them into the route group replace internal navigation anchors with Next.js links; a previously unused incorrect Link import in the Rotate PDF page was removed. The English mobile language selector lives in the expanded navigation menu to avoid crowding the header.

- Native-speaker editorial review has not been completed. Technical consistency and dictionary completeness checks do not replace it.
- Portuguese uses one general `/pt` version with Brazilian wording. A separate Portugal version can be added if regional demand warrants maintaining distinct content.
- Other tools, long guides and legal pages are still in English. English destinations are labelled in translated footers. No untranslated fallback copies are added to the sitemap.
- Translation does not change a tool’s country-specific tax, legal, health or engineering assumptions. Such tools need a separate localization review before translation is released.
- The inherited lint baseline allows existing repository debt; passing its threshold does not mean the entire repository has zero lint findings. New multilingual implementation files are also linted separately.

## Next batch

Extend coverage using the latest Search Console query/page data. Candidates include the PDF Bleed & Trim Checker and suitable image/PDF utilities. Keep STEP and CorelDRAW server-conversion paths in English until their interface, server error responses and documentation can be localized together. Expand substantive guides and legal pages alongside tool batches. Only publish an additional translated route when its controls, results, validation and explanatory content are complete.

No paid translation service, subscription or runtime translation API is required by this implementation.


## Translation correction after the first deployment

The first pass missed visible English in CSS option labels, the literal footer suffix, inch-unit labels and native browser file-input chrome. Several explanatory paragraphs also used English technical terms in the surrounding prose. These are corrected across the seven translated languages:

- Native Flexbox option labels map to unchanged CSS values; generated CSS is still valid.
- Footer language notices and destination-language labels are translated.
- Unit labels and results use localized unit names; French color results use RVB/CMJN.
- A styled, keyboard-accessible file selector replaces the visible native browser control, and displays the selected filename.
- French, Italian, Portuguese, Spanish, Russian and German descriptions use natural-language spacing and layout terminology. Arabic controls use the same complete label mapping.
- Regression checks audit dictionaries and rendered page copy for the previously missed English fragments. Generated code and language-picker names are handled separately.

Validation of this correction: 547 Node tests passed, plus three deployment-safety fixture tests; production build passed; all 42 translated pages and 35 tool workflows passed production-browser checks at desktop and mobile sizes. Scoped multilingual lint passed with no findings. Public live-page requests returned HTTP 403 from this environment, so these results describe the checked source and local production build, rather than a claim of live-site verification.

A reusable `scripts/deploy-vps.sh` accepts a full reviewed commit SHA. It builds in a separate worktree, copies local environment files with restricted permissions, preserves the previous build and dependencies, swaps the release, and attempts rollback on startup/health failure. Three offline tests use temporary Git repositories and mocked npm/PM2/HTTP commands to verify successful deployment, an untouched live release after build failure, and restoration of source/build/dependencies after a failed health check. They do not claim to test the user's actual VPS or PM2 service.

Run the helper only for the reviewed release commit. The deployment instructions accompanying this fix load that script from the exact Git commit before running it, so production source is not pulled forward before the separate build succeeds. A failed health-check rollback leaves Git detached at the previous commit for inspection. Untranslated tools and legal-page destinations remain English and are clearly labelled.

## Phase 2 — PDF inspection and photo print dimensions (19 October 2026)

This batch adds `pdf-bleed-trim-checker` and `image-print-size-calculator` in all seven existing translated languages. Coverage is now **seven tools per language: 49 translated tool pages plus seven directories (56 translated pages)**. These are 14 additional tool pages; other English tools, long guides and legal destinations remain outside this batch. No new languages are added.

Both tools include native titles, descriptions, instructions, limitations, FAQ answers, controls, validation, results and clipboard feedback. The existing directory, search, related links, language preservation, static routes, reciprocal hreflang, self canonicals, schema and sitemap derive their coverage from the explicit tool allowlist. Existing English URLs and the Phase 1 mobile navigation are preserved, including the subsequent logo restoration.

### PDF behavior

- Reads a selected PDF locally, up to 20 MiB. The PDF parsing library loads on demand, rather than on unrelated tool pages.
- Shows the physical sheet, visible area, finished cut and bleed area in millimeters, the three explicit-declaration flags, and **all four** margins for the selected page. It does not present the top margin as though it applied to every edge.
- Explains five distinct states in each language: neither area declared, trim only, bleed only, declared positive bleed, and both declared without positive bleed.
- Missing page boxes follow the existing parser's PDF defaults; no visual print-readiness guarantee is inferred from geometry. Unusual or malformed page dictionaries still require specialist review.
- Copies a native report for every inspected page. CSV exports have native headers, native values and interpretations, escaped cells, and a UTF-8 BOM. The standard CSV extension is unchanged. Print opens the browser print dialog for the current view.
- Rejects encrypted documents through an opt-in parser option. The existing English parser behavior is preserved by default. Raw parser error strings are never rendered by the translated interface.
- Clears previous results before a new file and ignores stale asynchronous reads. Invalid and oversized files receive native errors.

### Photo print behavior

- Reuses the English print-size calculation for inches and centimeters, including its three-decimal rounding behavior.
- Accepts positive whole-pixel dimensions up to one billion and PPI from 0.000001 to one million. Empty, fractional-pixel, non-finite or out-of-range inputs clear results.
- Explains image PPI versus printer DPI; changing the entered resolution does not alter an actual image.
- Formats displayed and copied numbers for the selected language, with numeric isolation in Arabic.

### Validation and release notes

The browser suite now covers 56 translated pages, 49 tool workflows, eight English counterparts, five unsupported routes, and the sitemap. Added workflows use a genuine five-page PDF with different box configurations, verify each interpretation and the four margins, inspect clipboard text and downloaded CSV content, reject invalid/oversized files, exercise print-resolution changes and invalid inputs, and check results on mobile. Unit coverage includes localized report columns and parser encryption rejection while preserving the original default behavior. The deployment helper's post-swap health checks include both new tools.

Local release validation and GitHub CI results are reported separately with the release. Native-speaker editorial review remains outstanding. STEP/CorelDRAW server conversions, other tools and translated long-form/legal pages still require later batches; this release does not claim site-wide translation completion.
