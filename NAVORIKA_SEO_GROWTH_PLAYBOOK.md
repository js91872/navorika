# Navorika SEO Growth Playbook

## Principle

Navorika grows by solving useful tasks more completely and by deepening coherent topic clusters—not by maximizing URL count. The authoritative tool registry, typed taxonomy, route implementation, SEO content, discovery files, sitemap, and validator must agree before a tool is considered ready.

## 1. Select a tool worth building

Prefer ideas with:

- a clear user task and a result that can be checked;
- strong fit with an existing cluster or a deliberate new cluster supported by several real tools;
- useful complementary workflows and internal-link destinations;
- specific long-tail intent that one comprehensive canonical page can satisfy;
- a defensible implementation in the browser or a clearly disclosed external-data source;
- manageable safety, maintenance, and authoritative-source requirements.

Treat weak SERPs, search demand, and competitive gaps as hypotheses until measured data is available. Do not invent volume or difficulty figures. Reject a proposed tool if it merely rephrases an existing route, cannot deliver its advertised result, depends on stale facts without an update process, or would be thin without fabricated copy.

## 2. Design the task before the page

Define inputs, units, validation, method, result, edge cases, limitations, privacy behavior, mobile interaction, and accessibility. For calculators, document the formula and rounding. For converters, document accepted and emitted formats. For security, health, finance, tax, construction, and other consequential topics, identify authoritative references and the boundary between an estimate and professional advice.

## 3. Register the tool once

Add the tool to `src/data/registry.ts` with a unique stable slug, clear title, concise intent-led description, valid category, useful terminology, and accurate hero copy. Avoid changing an existing URL. If a rename is necessary, preserve one canonical destination and add only the minimum required redirect.

Then update `src/data/taxonomy.ts`:

- assign exactly one primary cluster;
- add toolkit membership only when the tool materially improves that collection;
- add a complementary relationship only when there is a genuine next/previous workflow step;
- avoid promoting a tool that remains under review.

The architecture validator rejects missing and broken references.

## 4. Meet the tool-page quality standard

A strong page can support the following, but sections should be included only when useful:

- one clear H1 matching the real task;
- a short introduction that confirms intent and scope;
- the working interactive tool before long explanatory content;
- understandable result labels and an explanation of what they mean;
- concise steps;
- formula, methodology, or processing behavior;
- a worked example when it reduces ambiguity;
- assumptions, limits, units, rounding, and failure states;
- visible FAQs for genuine recurring questions;
- authoritative references for material technical, financial, health, tax, or regulatory claims;
- related tools selected from curated, complementary, cluster, then category relationships;
- relevant guides and workflow toolkits.

Do not pad pages to a word count, add invisible FAQ schema, promise accuracy without qualification, or repeat boilerplate claims that do not match the implementation.

## 5. Complete technical SEO

Before release, verify:

- unique title and description;
- one self-referencing canonical;
- index/follow status matches availability;
- social metadata describes the actual tool;
- `WebApplication` schema makes no unsupported pricing, rating, or feature claims;
- structured and visible breadcrumbs describe the same hierarchy;
- visible FAQs are the only FAQs eligible for `FAQPage` schema;
- the registry-backed sitemap includes the canonical route and excludes aliases, redirects, quarantined tools, and utilities;
- `/llms.txt` and `/tools.json` reflect the registry automatically;
- internal links resolve and do not point to quarantined tools.

## 6. Validate usability and performance

Test the actual task with normal, boundary, invalid, and empty inputs. Check keyboard use, labels, error recovery, small screens (at least 320, 375, and 768 CSS pixels), no horizontal scrolling, card readability, and breadcrumb wrapping/scrolling.

Keep calculation and registry work server-side or statically generated where possible. Do not add a library for a small calculation or presentation effect. Avoid shipping the full registry to a client component unless the feature genuinely needs client-side search/filtering. Measure bundle impact when introducing a substantial client dependency.

Run:

```text
npm run validate:architecture
npm run typecheck
npm run lint:baseline
npm run build
```

Use the documented Webpack build fallback only when the execution environment prevents Turbopack from creating its worker; production CI should still exercise the repository’s normal build command.

## 7. Review generated output

Inspect the homepage, parent category, relevant toolkit, tool page, related guide, sitemap, robots response, `llms.txt`, and `tools.json`. Confirm canonical URLs, visible and structured breadcrumbs, mobile layout, no duplicate H1, no accidental `noindex`, and no broken links.

## 8. Scale through release gates

### 122 to 250 tools

- Deepen the strongest current clusters first.
- Require a primary cluster for every tool.
- Keep toolkit pages selective and useful.
- Establish completion and error analytics without collecting sensitive input values.

### 250 to 300 tools

- Review cluster balance and split only clusters that have distinct intent and sufficient inventory.
- Audit orphan risk, metadata duplication, indexation, crawl paths, and under-review inventory every release.
- Refresh guides and time-sensitive references on an explicit schedule.

### 300 to 500 tools

- Generate catalog, discovery, sitemap, and collection structures only from typed sources.
- Add sitemap indexes only when operational limits or deployment architecture justify them; the protocol limit is not a reason to fragment prematurely.
- Use quality cohorts and staged indexation rather than releasing hundreds of unreviewed routes at once.

### 500 to 1,000 tools

- Require ownership and maintenance status for every cluster.
- Monitor thin pages, duplicates, crawl errors, performance budgets, and tools with no meaningful usage.
- Consolidate overlapping tools instead of preserving weak synonyms.
- Keep homepage links hierarchical; route users through categories, selected toolkits, and search rather than exposing the entire inventory.

At every stage, stop expansion when validation, content review, maintenance, or user-task quality cannot keep pace.
