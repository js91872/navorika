# Low-word-count page remediation — 11 November 2026

The supplied Ubersuggest export flagged 52 URLs with 101–199 reported words. All 52 now have route-specific support content rendered in the initial HTML below their primary task. The original audit rows are preserved in `low-word-count-audit.json`.

The additions explain how to choose tools on directories and category pages, how to sequence toolkit tasks, file-format trade-offs and troubleshooting, calculator inputs and worked examples, and paper-size printing details. The twelve flagged French and Italian pages receive French and Italian text respectively. Existing URLs, canonical metadata, calculators, and processing behavior are preserved.

Copy is based on the current implementations. In particular, the WebP-to-GIF route now correctly describes its single-frame export instead of promising animation preservation. The converter implementation is unchanged.

## Validation

- `npm run prepare:tool-pr`: passed, including regenerated multilingual inventory, architecture, TypeScript, lint baseline, and i18n tests.
- `npm test`: passed with `NAVORIKA_MIN_FREE_GB=1` for the mocked local deployment fixtures; this workspace has approximately 4 GiB available. No production disk safeguard changed.
- All 22 SEO/canonical/disclosure/editorial safeguard tests passed.
- Final production build passed for 2,776 generated pages.
- `node --import tsx scripts/verify-low-word-count-pages.mjs`: passed for every supplied URL. Checks initial HTML rather than JavaScript payloads, verifies one complete support article per audited route, and checks unrelated routes for parent-content leakage. Added to the Quality workflow after the production build.
- Local Chromium could not launch because the executor denies its Unix socket operation. The existing GitHub Quality workflow remains responsible for staging smoke and full multilingual browser checks.

The HTML verifier found at least 386 total words per audited page after removing script, style, and noscript content. That count includes other page text; it is not represented as a Ubersuggest re-crawl result or a Google ranking threshold. Re-run the audit after the reviewed changes are merged and deployed.
