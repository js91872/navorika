# Navorika Finance Correctness Report

Date: 2026-08-30  
Branch: `fix/finance-correctness`

## Executive Summary

This sprint confirmed and repaired three production defects:

1. **CONFIRMED DEFECT — EPF:** the previous page ignored its interest input, exposed no projection horizon or opening balance, treated a hard-coded 3.67% of the full entered wage as employer EPF, and did not separate EPS from the projected EPF balance.
2. **CONFIRMED DEFECT — NPS:** the previous page returned a zero corpus whenever expected return was 0%, even when contributions were positive. It also omitted opening corpus, annual contribution growth, configurable annuity allocation, annuity payout assumptions, and the promised pension breakdown.
3. **CONFIRMED DEFECT — finance routes:** all six dynamic finance-suite families used a client-side default calculator when an unknown child slug was requested. Arbitrary child URLs therefore rendered calculator content with HTTP 200 instead of a true 404.

EPF and NPS now use typed pure calculation functions with 17 deterministic tests. All 24 legitimate finance-suite child URLs are statically generated from the existing authoritative suite metadata, and a server layout guard calls `notFound()` for unknown child slugs. No tool slug, canonical legitimate URL, registry entry, sitemap rule, or indexation decision was changed.

No package dependency was added.

## Files Changed

- `package.json` — added `test:calculations` using Node's built-in test runner.
- `src/lib/calculations/retirementFinance.ts` — added pure typed EPF and NPS models with bounded input validation.
- `src/lib/calculations/retirementFinance.test.mjs` — added deterministic EPF/NPS fixtures.
- `src/app/tools/savings-retirement-hub/[suboption]/page.tsx` — connected the models to the UI and added accurate assumptions, breakdowns, validation, labels, and responsive behavior.
- `src/data/financeMeta.ts` — corrected only the EPF/NPS descriptions to match implemented outputs.
- `src/lib/seo/financeSuite.ts` — added shared finite-param and child-membership helpers.
- Six `[suboption]/layout.tsx` files under the finance suites — statically enumerate valid children and reject unknown children with `notFound()`.
- `CODEX_FINANCE_CORRECTNESS_REPORT.md` — this report.

`next.config.ts` was not modified.

## Defects Confirmed

### EPF

Classification: **CONFIRMED DEFECT**  
Severity: Critical

Previous formula:

```text
monthly result = contribution wage × (employee rate + 3.67%) / 100
```

The third UI input was labelled expected interest but was never passed into the calculation. With the previous defaults (`₹150,000`, `7.1%`, `15%`), the page displayed `₹16,155 Monthly EPF Addition`; changing the 15% interest input could not change the result. The page was not an EPF balance forecast despite its metadata and input labels.

Why it was incorrect or misleading:

- EPFO states that the default employee contribution is 12% and the employer also contributes 12%; the EPS component is diverted from the employer share.
- EPS is subject to the statutory wage ceiling rather than always being 8.33% of an unlimited entered wage.
- EPF interest is credited on monthly running balances. The previous page did not calculate interest at all.
- EPS is a pension-scheme allocation and should not be presented as part of the EPF account balance.

Authoritative evidence:

- [EPFO FAQ — contribution rates, voluntary employee contribution, EPS diversion, and wage limits](https://www.epfindia.gov.in/site_en/FAQ.php)
- [EPFO employer information booklet — 12% employee/employer rates, 3.67%/8.33% split, and contribution rounding](https://www.epfindia.gov.in/site_docs/PDFs/MiscPDFs/Employer_Information_Booklet.pdf)
- [EPFO — paragraph 60 interest rules](https://www.epfindia.gov.in/site_docs/PDFs/MiscPDFs/InterestRate_OnPFAccumulationsSince1952.pdf)
- [Ministry of Labour — EPF coverage and ₹15,000 wage ceiling](https://www.labour.gov.in/static/uploads/2025/06/93561f36d5094b0cfe52570b4e8d2dc1.pdf)

Corrected behavior:

- Employee EPF contribution is calculated from the entered contribution wage and editable employee rate.
- Employer contribution defaults to 12%.
- EPS defaults to 8.33% of contribution wage up to ₹15,000 and is capped by the employer contribution; the remaining employer amount enters EPF.
- Contributions are rounded to rupees.
- Opening balance, annual contribution-wage growth, annual interest, and projection horizon are modelled.
- Existing balances earn interest each month. A month's new contribution starts earning in the following month. Interest is rounded and credited after each 12-month projection year; a final partial year's accrued estimate is included.
- EPF balance, employee EPF, employer EPF, EPS, and interest are shown separately.

Independent reference case:

```text
Contribution wage: ₹15,000/month
Employee rate: 12%
Employer rate: 12%
EPS rate/ceiling: 8.33% / ₹15,000
Interest: 0%
Horizon: 12 months

Employee EPF = ₹1,800 × 12 = ₹21,600
Employer total = ₹1,800/month
EPS = ₹1,250/month
Employer EPF = (₹1,800 − ₹1,250) × 12 = ₹6,600
Projected EPF balance = ₹21,600 + ₹6,600 = ₹28,200
EPS shown separately = ₹15,000
```

### NPS

Classification: **CONFIRMED DEFECT**  
Severity: High

Previous formula:

```text
monthly rate = annual return / 12
if monthly rate = 0, corpus = 0
otherwise corpus = contribution × (((1 + rate)^months − 1) / rate) × (1 + rate)
```

The explicit zero-rate branch discarded every contribution. For `₹1,000/month`, `0%`, and one year, the page returned `₹0`; the correct no-growth corpus is `₹12,000`.

Why it was incomplete or misleading:

- The page promised a corpus and annuity estimate but produced only one corpus number.
- It had no opening Tier I corpus or annual contribution increase.
- It did not distinguish expected NPS investment return from an annuity payout assumption.
- It did not show the annuity allocation, withdrawable component, or estimated monthly/annual pension.
- One hard-coded withdrawal split would be misleading because current exit options vary by sector, exit type, corpus, and effective rules.

Authoritative evidence:

- [NPS Trust pension calculator — opening corpus, monthly contributions, annual increase, corpus return, annuity ratio, and annuity rate are distinct inputs](https://npstrust.org.in/index.php/nps-calculator)
- [PFRDA All Citizen model — current normal/premature exit and corpus-dependent payout options](https://www.pfrda.org.in/en/schemes/national-pension-system/nps-for-all-citizen-models)
- [PFRDA corporate exit FAQ — demonstrates that annuity minimums can differ by exit context](https://pfrda.org.in/w/faqs/exits-for-nps-corporate-model)

Corrected behavior:

- Opening corpus compounds monthly.
- Monthly contributions are added at month end and can step up after each completed year.
- Zero expected return preserves all contributions.
- Investment return and annuity payout rate are separate assumptions.
- Corpus, new contributions, investment gain, withdrawable component, annuity allocation, annual pension estimate, and monthly pension estimate are separate outputs.
- Annuity allocation is editable from 0% to 100%; the UI tells users to apply the rule relevant to their sector and exit circumstances instead of claiming one universal split.
- Results explicitly state that market returns, annuity payouts, and retirement outcomes are not guaranteed.

Independent reference cases:

```text
₹1,000/month × 12 months at 0% = ₹12,000 corpus

₹1,000 end-of-month contributions at 12% nominal annual return for 12 months:
₹1,000 × (((1.01)^12 − 1) / 0.01) = ₹12,682.503013
```

## EPF Model

- User inputs: monthly contribution wage, employee contribution rate, assumed annual interest, opening balance, annual contribution-wage growth, and projection years.
- Statutory/default assumptions: employer rate 12%, EPS rate 8.33%, EPS wage ceiling ₹15,000.
- A selected employee rate above 12% is treated as an employee-side voluntary contribution. It does not increase the employer rate.
- The entered contribution wage is deliberately explicit. The model does not decide whether an employer restricts contributions to the statutory ceiling or contributes on higher wages.
- Salary/contribution-wage growth applies after each completed projection year.
- Contributions and credited interest are rounded to rupees.
- Withdrawals, service gaps, delayed remittances, employer-specific policy, historical rate changes, and individual EPS eligibility exceptions are outside the model.
- The output is an estimate and does not claim to reproduce an EPFO passbook.

## NPS Model

- User inputs: existing Tier I corpus, monthly contribution, annual contribution increase, expected corpus return, years to exit, annuity allocation, and expected annuity payout rate.
- Opening corpus compounds monthly at the selected expected return.
- Contributions occur at the end of each month and step up annually.
- The projection does not deduct intermediary/fund/annuity charges or model asset-allocation changes, taxes, inflation, partial withdrawals, systematic withdrawal/retirement-income products, or lifecycle schemes.
- Withdrawable component plus annuity allocation equals projected corpus, subject only to displayed rounding.
- Estimated pension is a simple annual annuity payout assumption divided by 12; it is not a quote from an annuity service provider.
- Users must choose an annuity allocation compatible with their applicable current exit rules.

## Route Defect

Classification: **CONFIRMED DEFECT**  
Severity: Critical

Exact cause:

- Six finite calculator families used a dynamic `[suboption]` segment.
- Their client pages selected `suiteMap[suboption] || suiteMap[default]` and their calculation configs used the same fallback pattern.
- No server render guard called `notFound()` for an unknown child.
- The metadata layer returned “Finance Tool Not Found”/noindex metadata, but metadata did not change the HTTP status or prevent the client fallback calculator from rendering.

Affected route structures:

- `/tools/cashflow-budget-architect/[suboption]`
- `/tools/investment-return-profiler/[suboption]`
- `/tools/loan-amortization-suite/[suboption]`
- `/tools/savings-retirement-hub/[suboption]`
- `/tools/taxation-compliance-deck/[suboption]`
- `/tools/wealth-inflation-matrix/[suboption]`

Correction:

- `generateStaticParams()` now enumerates every legitimate child from the existing suite metadata.
- Each server layout checks membership in that exact suite and calls Next.js `notFound()` before rendering unknown children.
- Legitimate URLs and canonicals are unchanged.
- Sitemap generation already enumerated only keys from this same finite metadata. It needed no change and continues to exclude the pre-existing duplicate/noindex variants.

Previous behavior: arbitrary child URL returned HTTP 200 and rendered a default calculator.  
Corrected behavior: arbitrary child URL returns HTTP 404 and no calculator content.

## Tests Added

Seventeen deterministic calculation tests were added.

EPF scenarios:

1. Constant wage with separated employee EPF, employer EPF, and EPS.
2. Opening balance.
3. Annual salary growth.
4. Zero salary growth.
5. Zero tenure.
6. EPS wage-ceiling boundary.
7. Custom employee contribution rate.
8. Opening-balance interest.
9. Invalid, negative, and non-finite input rejection.

NPS scenarios:

1. Monthly contributions with a fixed return.
2. Opening corpus.
3. Annual contribution increase.
4. Zero contribution growth and zero return.
5. Corpus identity: withdrawal plus annuity allocation.
6. Separate annuity payout-rate behavior.
7. One-month horizon and contribution timing.
8. Invalid annuity allocation and non-finite input rejection.

Browser/runtime checks at 320×568:

- EPF: 6/6 inputs programmatically labelled; no horizontal overflow (`scrollWidth = clientWidth = 314` after browser chrome); no console errors.
- NPS: 7/7 inputs programmatically labelled; no horizontal overflow; no console errors.
- EPF reference scenario rendered ₹28,200 with the correct four-part breakdown.
- NPS at 0% rendered ₹12,000 rather than zero.
- A 101% annuity input rendered a clear validation message rather than a plausible-looking result.

## Route Tests

Representative valid URLs returned HTTP 200:

- `/tools/cashflow-budget-architect/budget-planner`
- `/tools/investment-return-profiler/cagr-calculator`
- `/tools/loan-amortization-suite/home-loan-emi`
- `/tools/savings-retirement-hub/epf-calculator`
- `/tools/savings-retirement-hub/nps-calculator`
- `/tools/taxation-compliance-deck/hra-calculator`
- `/tools/wealth-inflation-matrix/inflation-calculator`

For each of the six suite roots, the child slugs `random`, `test`, and `abc123` returned HTTP 404 (18 checks total).

Additional 404 checks:

- `/tools/not-a-real-calculator`
- `/tools/savings-retirement-hub/epf-calculator/random`

The final server emitted no console/runtime errors during the route matrix.

## Validation Results

| Check | Result |
|---|---|
| `npm run test:calculations` | PASS — 17 tests, 17 passed |
| `npm run typecheck` | PASS |
| `npm run validate:architecture` | PASS — 185 tools, 185 routes, 45 clusters, 8 toolkits, 109 SEO records, 31 guides |
| `git diff --check` | PASS |
| `npm run lint:baseline` | PASS — 156 errors / 125 warnings, below maximum 182 / 197 |
| `rm -rf .next && npx next build --webpack` | PASS — Next 16.3.0, TypeScript passed, 275/275 static pages generated |
| Valid/invalid production HTTP matrix | PASS — 7 valid 200s; 20 invalid 404s |
| 320 px EPF/NPS runtime checks | PASS — no overflow, hydration, or console errors |
| `git diff -- next.config.ts` | CLEAN — no changes |

Build warnings were pre-existing framework warnings: the middleware convention is deprecated in Next 16.3, and Next's Edge-runtime bundle reported `process.cwd` compatibility warnings. Neither warning prevented compilation or generation, and no production workaround was added.

## Remaining Finance Risks

- **IMPROVEMENT, not part of this defect fix:** the broader legacy suite calculators still contain inline formulas and should receive the same pure-module/test treatment in a later sprint.
- **IMPROVEMENT:** EPF employer policy, higher-wage joint options, EPS membership exceptions, service gaps, withdrawals, fiscal-year alignment, and historical annual rates require more user inputs and policy modelling than this focused estimate provides.
- **IMPROVEMENT:** NPS charges, lifecycle/asset-allocation changes, systematic withdrawal or retirement-income products, inflation, taxes, and provider-specific annuity pricing are intentionally outside this model.
- **NOT ACTUALLY A DEFECT:** sitemap generation already used the finite finance metadata and did not generate arbitrary child slugs. It was inspected and left unchanged.
- **NOT ACTUALLY A DEFECT:** no registry slug, suite canonical, or legitimate public URL needed renaming for the 404 repair.

## Follow-up Recommendations

1. Move CAGR, SWP, credit-card payoff, amortization/prepayment, gratuity, HRA, income-tax, salary, and compound-interest suite formulas into typed modules with boundary fixtures.
2. Add a route-level automated status test that boots the production server and checks every declared finance child plus representative unknown children.
3. Add an effective-date/source manifest for all tax, EPF, NPS, PPF, and other regulatory assumptions.
4. Review the legacy suite-to-standalone duplication and canonical strategy with GSC data before consolidating any URL.
5. Consider a future EPF advanced mode for employer contribution basis, EPS eligibility, service interruptions, and fiscal-year start month; keep the default mode simple and explicit.
