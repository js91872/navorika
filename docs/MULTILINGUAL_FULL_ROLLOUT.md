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

These are foundations for the full project. They do not publish any additional localized routes or claim that the remaining tools are translated.

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

The full inventory, completion gate, calculator separation, strict localization helper and native action-feedback infrastructure are prepared. Remaining content translations are not complete. Test and CI results are recorded with the draft PR. The next working session should continue within this same branch, beginning with native copy and result adapters for the shared calculator family, rather than returning to separate three-tool production deployments.
