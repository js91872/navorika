# Navorika SEO Architecture Baseline

Captured on 2026-08-28 from clean local `main` at `c54784b` before the SEO architecture upgrade. The implementation branch was created from this commit.

## Inventory

- Registered tools: **122**
- Top-level tool routes: **122**
- Categories: **6**
- Complete, published guides: **21**
- Dedicated legacy SEO records: **110**
- Tools temporarily excluded from indexing while under review: **31**
- Production-build static pages: **161**

Registered tools by category:

| Category | Tools | Existing category URL |
| --- | ---: | --- |
| PDF Tools | 22 | `/categories/pdf-tools` |
| Image Tools | 34 | `/categories/image-tools` |
| Finance Calculators | 14 | `/categories/finance-calculators` |
| Health Calculators | 15 | `/categories/health-calculators` |
| Developer Tools | 17 | `/categories/developer-tools` |
| Construction Calculators | 20 | `/categories/construction-calculators` |

The registry has a single category level. It does not formally represent subtopics/clusters, toolkit membership, or complementary workflows.

## Existing discovery and internal linking

- The homepage links to the six categories and a small manually selected popular-tool set.
- `/tools` exposes the indexable inventory and `/categories` exposes all categories.
- Category pages list indexable tools in the selected category. Only Health has substantial custom category copy, benefits, and FAQs; the other category pages mainly rely on registry title/description data.
- Rich tool SEO records include manually curated `relatedTools` and `relatedGuides`. This covers 110 tools but has no shared ranking/fallback model based on cluster, category, or workflow.
- Guides use a separate explicit guide-to-tool map and link to other guides in the same guide category.
- Search matches tool title, description, and registry keywords. It does not directly match category names, future cluster terminology, or toolkit intent, and it imports the full registry into a client route.
- There are no toolkit/collection landing pages.

## Crawl and indexation architecture

- `src/app/sitemap.ts` programmatically enumerates static pages, indexable tools, finance-suite subroutes, all categories, and all 21 guides. It excludes quarantined tools and selected duplicate finance-suite aliases.
- `src/app/robots.ts` allows the site, disallows `/api/`, and advertises the sitemap.
- A second static `public/robots.txt` also exists. It adds named AI crawler rules and advertises `/llms.txt`, creating two sources for the same public path.
- Canonicals are present in the root/tool/category/guide metadata abstractions inspected. Tool canonicals come from shared SEO helpers or route layouts; category canonicals come from the dynamic category layout; guide canonicals come from the guide route.
- Quarantined tools use `noindex,follow` metadata and are excluded from the sitemap.

## Structured data and breadcrumbs

- The root layout emits `Organization` and `WebSite` JSON-LD with a `SearchAction`.
- Rich tool pages emit `WebApplication` and `BreadcrumbList` JSON-LD through the shared tool-page helper.
- Guide pages emit visible content plus `Article` and `BreadcrumbList` JSON-LD.
- FAQ sections are visible where used, but the shared architecture deliberately does not emit `FAQPage` schema.
- A global, visible client breadcrumb derives labels and links from URL segments. Tool and guide structured breadcrumbs are generated separately. Category pages use the visible global breadcrumb but do not emit a category `BreadcrumbList`.
- There is no collection-page/ItemList schema because no toolkit architecture exists.

## Tool SEO content architecture

The newer shared tool-page model supports an intent-focused name and description, long-tail keywords, introduction, optional formula/methodology, steps, result interpretation, limitations, visible FAQs, related tools, related guides, canonical metadata, social metadata, `WebApplication`, and breadcrumb schema. It is a strong reusable standard, but it is not yet documented as the required authoring checklist and the relationships remain duplicated inside individual rich-content records.

## AI discovery

- `public/llms.txt` exists as a manually maintained summary with category, popular-tool, guide, and site links.
- It is not generated from the authoritative registry and can become stale.
- There is no public JSON tool catalog or equivalent structured inventory.

## Baseline validation

`npm run validate:architecture` passed:

```text
Architecture validation passed: 122 registered tools, 122 tool routes, 110 tool SEO records, 21 complete guides.
```

The standard `npm run build` reached compilation but Turbopack could not create its CSS worker because this execution environment prohibits binding its internal port (`Operation not permitted`). This is an environment restriction, not a source error. The documented Next.js fallback `next build --webpack` completed successfully, including TypeScript checking and generation of all 161 static pages.

## Obvious architectural gaps

- No formal `Category -> Cluster -> Tool` taxonomy.
- No intent-led toolkit/collection pages.
- Category presentation is mostly flat and inconsistent in depth.
- Related tools do not have a deterministic shared fallback or explicit complementary-workflow layer.
- Machine-readable AI discovery is manual and incomplete.
- No machine-readable public tool catalog.
- The validator does not check clusters, toolkits, broken taxonomy references, orphaned tool-to-cluster assignments, category/toolkit metadata, or discovery-route consistency.
- Category pages lack collection/breadcrumb structured data.
- Search does not use cluster, category-name, or toolkit terminology.
- Both a metadata route and a static file define robots behavior.
- The architecture needs a documented, repeatable quality bar for scaling beyond the current inventory.
