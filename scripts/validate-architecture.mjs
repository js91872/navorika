import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const toolsRoot = join(root, 'src/app/tools');
const registryPath = join(root, 'src/data/registry.ts');
const seoPath = join(root, 'src/data/seo-content.ts');
const reviewPath = join(root, 'src/lib/seo/toolReview.ts');
const toolPagesRoot = join(root, 'src/data/tool-pages');
const guidesPath = join(root, 'src/lib/guidesMetadata.ts');
const guideContentPath = join(root, 'src/lib/guideContent.ts');
const additionalGuideContentPath = join(root, 'src/lib/guideContentAdditional.ts');
const guideEnhancementsPath = join(root, 'src/lib/guideContentEnhancements.ts');
const guideToolsPath = join(root, 'src/lib/guideTools.ts');
const guideSourcesPath = join(root, 'src/lib/guideSources.ts');
const guidePagePath = join(root, 'src/app/guides/[slug]/page.tsx');
const sitemapPath = join(root, 'src/app/sitemap.ts');
const llmsPath = join(root, 'public/llms.txt');
const toolPageLibraryPath = join(root, 'src/lib/seo/toolPage.ts');
const failures = [];
const warnings = [];

const read = (path) => readFileSync(path, 'utf8');
const unique = (values) => [...new Set(values)];
const duplicates = (values) => unique(values.filter((value, index) => values.indexOf(value) !== index));

const registrySource = read(registryPath);
const reviewSource = read(reviewPath);
const reviewBlock = reviewSource.match(/new Set\(\[([\s\S]*?)\]\)/)?.[1] ?? '';
const reviewedSlugs = [...reviewBlock.matchAll(/'([^']+)'/g)].map((match) => match[1]);
const toolsDeclaration = registrySource.indexOf('export const tools');
const toolRegistrySource = registrySource.slice(toolsDeclaration);
const toolSlugs = [...toolRegistrySource.matchAll(/\bslug:\s*'([^']+)'/g)].map((match) => match[1]);
const toolTitles = [...toolRegistrySource.matchAll(/\btitle:\s*'([^']*)'/g)].map((match) => match[1].trim());
const categoryRegistrySource = registrySource.slice(0, toolsDeclaration);
const categorySlugs = [...categoryRegistrySource.matchAll(/\bslug:\s*'([^']+)'/g)].map((match) => match[1]);
const guideSlugs = [...read(guidesPath).matchAll(/\bslug:\s*'([^']+)'/g)].map((match) => match[1]);

for (const slug of duplicates(guideSlugs)) failures.push(`Duplicate guide metadata slug: ${slug}`);

const guideContentSources = [read(guideContentPath), read(additionalGuideContentPath)];
const guideContentSlugs = guideContentSources.flatMap((source) => [...source.matchAll(/^\s{2}'([^']+)':\s*(?:\{|article\()/gm)].map((match) => match[1]));
const enhancedGuideSlugs = [...read(guideEnhancementsPath).matchAll(/^\s{2}'([^']+)':\s*\{/gm)].map((match) => match[1]);
const sourcedGuideSlugs = [...read(guideSourcesPath).matchAll(/^\s{2}'([^']+)':\s*\[/gm)].map((match) => match[1]);
for (const slug of duplicates(guideContentSlugs)) failures.push(`Duplicate guide content slug: ${slug}`);
for (const slug of guideSlugs.filter((slug) => !guideContentSlugs.includes(slug))) failures.push(`Published guide has no article content: ${slug}`);
for (const slug of guideContentSlugs.filter((slug) => !guideSlugs.includes(slug))) failures.push(`Guide content has no metadata entry: ${slug}`);
for (const slug of enhancedGuideSlugs.filter((slug) => !guideSlugs.includes(slug))) failures.push(`Guide enhancement has no metadata entry: ${slug}`);
for (const slug of guideSlugs.filter((slug) => !sourcedGuideSlugs.includes(slug))) failures.push(`Published guide has no authoritative source list: ${slug}`);
for (const slug of sourcedGuideSlugs.filter((slug) => !guideSlugs.includes(slug))) failures.push(`Guide source list has no metadata entry: ${slug}`);

const guideMetadataSource = read(guidesPath);
for (const signal of ['datePublished:', 'dateModified:', 'keywords:', 'featuredImage:', 'width: 1200', 'height: 630', 'alt:', 'caption:']) {
  if (!guideMetadataSource.includes(signal)) failures.push(`Guide metadata is missing required image/SEO signal: ${signal}`);
}

for (const image of ['finance-guides.webp', 'health-guides.webp', 'pdf-guides.webp', 'image-guides.webp', 'developer-guides.webp']) {
  if (!existsSync(join(root, 'public/images/guides', image))) failures.push(`Missing guide feature image: ${image}`);
}

const guidePageSource = read(guidePagePath);
for (const signal of ['generateStaticParams', 'generateMetadata', "'@type': 'Article'", "'@type': 'BreadcrumbList'", "'@type': 'FAQPage'", 'featuredImage.alt', 'citation:', 'Sources and further reading']) {
  if (!guidePageSource.includes(signal)) failures.push(`Guide route is missing required crawl/SEO signal: ${signal}`);
}

if (!read(sitemapPath).includes('guidesMetadata.map')) failures.push('XML sitemap does not enumerate individual guides');
if (!read(llmsPath).includes('## Guides and Articles')) failures.push('llms.txt does not expose the guide library');

const guideToolReferences = [...read(guideToolsPath).matchAll(/:\s*\[([^\]]*)\]/g)].flatMap((match) => [...match[1].matchAll(/'([^']+)'/g)].map((tool) => tool[1]));

for (const slug of duplicates(toolSlugs)) {
  failures.push(`Duplicate registry slug: ${slug}`);
}

for (const slug of guideToolReferences.filter((slug) => !toolSlugs.includes(slug))) {
  failures.push(`Guide references an unknown related tool: ${slug}`);
}

if (toolTitles.length !== toolSlugs.length || toolTitles.some((title) => !title)) {
  failures.push('Every registry tool must have a non-empty title');
}

for (const signal of [
  "heroTitle: tool.heroTitle?.trim() || tool.title",
  "heroDescription: tool.heroDescription?.trim() || tool.description",
]) {
  if (!toolRegistrySource.includes(signal)) failures.push(`Registry is missing display metadata fallback: ${signal}`);
}

const pageSlugs = readdirSync(toolsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(join(toolsRoot, entry.name, 'page.tsx')))
  .map((entry) => entry.name);

for (const slug of toolSlugs.filter((slug) => !pageSlugs.includes(slug))) {
  failures.push(`Registry entry has no route: ${slug}`);
}

for (const slug of pageSlugs.filter((slug) => !toolSlugs.includes(slug))) {
  failures.push(`Tool route has no registry entry: ${slug}`);
}

for (const slug of pageSlugs) {
  const pagePath = join(toolsRoot, slug, 'page.tsx');
  const source = read(pagePath);
  const defaultFunction = source.match(/export\s+default\s+function\s+([A-Za-z_$][\w$]*)\s*\(/);

  if (defaultFunction) {
    const componentName = defaultFunction[1];
    const declarationEnd = defaultFunction.index + defaultFunction[0].length;
    const body = source.slice(declarationEnd);
    const selfRender = new RegExp(`<${componentName}(?:\\s|/|>)`);
    if (selfRender.test(body)) {
      failures.push(`Recursive default component in src/app/tools/${slug}/page.tsx: ${componentName}`);
    }
  }

  const defaultExports = source.match(/export\s+default\b/g) ?? [];
  if (defaultExports.length > 1) {
    failures.push(`Multiple default exports in src/app/tools/${slug}/page.tsx`);
  }

  const knownPlaceholder = source.includes('ImageConverterEngine')
    || /placeholder[^\n]*(?:implementation|coming soon)|saved without encryption|encryption is not fully supported|\$\(basename/i.test(source);
  if (knownPlaceholder && !reviewedSlugs.includes(slug)) {
    failures.push(`Known placeholder tool is not quarantined: ${slug}`);
  }

  if (source.includes('EnhancedToolWrapper') && !reviewedSlugs.includes(slug)) {
    failures.push(`Legacy EnhancedToolWrapper remains on indexable tool: ${slug}`);
  }
}

for (const slug of reviewedSlugs) {
  if (!toolSlugs.includes(slug)) failures.push(`Quarantined tool is not registered: ${slug}`);
  if (!existsSync(join(toolsRoot, slug, 'layout.tsx'))) failures.push(`Quarantined tool has no noindex layout: ${slug}`);
}

for (const slug of ['protect-pdf', 'unlock-pdf']) {
  const source = read(join(toolsRoot, slug, 'page.tsx'));
  if (/type=["']password|PDFDocument|embed|encrypt|decrypt/i.test(source)) {
    failures.push(`PDF security route attempts unsupported local encryption workflow: ${slug}`);
  }
  if (!reviewedSlugs.includes(slug)) {
    failures.push(`PDF security route must remain quarantined until a vetted encryption engine exists: ${slug}`);
  }
}

const seoSource = read(seoPath);
const seoSlugs = [...seoSource.matchAll(/^\s{2}'([^']+)':\s*\{/gm)].map((match) => match[1]);

for (const slug of duplicates(seoSlugs)) {
  failures.push(`Duplicate SEO content slug: ${slug}`);
}

for (const slug of toolSlugs.filter((slug) => !seoSlugs.includes(slug))) {
  const routeSource = read(join(toolsRoot, slug, 'page.tsx'));
  const layoutPath = join(toolsRoot, slug, 'layout.tsx');
  const layoutSource = existsSync(layoutPath) ? read(layoutPath) : '';
  const hasRouteMetadata = /export\s+const\s+metadata\s*[:=]/.test(routeSource) || /export\s+(?:async\s+)?function\s+generateMetadata/.test(routeSource);
  const hasLayoutMetadata = /export\s+const\s+metadata\s*[:=]/.test(layoutSource) || /export\s+(?:async\s+)?function\s+generateMetadata/.test(layoutSource);
  if (!hasRouteMetadata && !hasLayoutMetadata) warnings.push(`Missing dedicated SEO content: ${slug}`);
}

for (const slug of seoSlugs.filter((slug) => !toolSlugs.includes(slug))) {
  failures.push(`SEO content has no registry entry: ${slug}`);
}

const toolPageFiles = existsSync(toolPagesRoot)
  ? readdirSync(toolPagesRoot).filter((file) => file.endsWith('.ts'))
  : [];
const toolPageRecords = [];
const relatedToolReferences = [];
const relatedGuideReferences = [];
const richContentCategories = [];

for (const file of toolPageFiles) {
  const source = read(join(toolPagesRoot, file));
  toolPageRecords.push(...[...source.matchAll(/^\s{2}'([^']+)':\s*\{\s*\n?\s*slug:\s*'([^']+)'/gm)].map((match) => ({ key: match[1], slug: match[2], file })));
  relatedToolReferences.push(...[...source.matchAll(/\{ slug: '([^']+)', name:/g)].map((match) => ({ slug: match[1], file })));
  richContentCategories.push(...[...source.matchAll(/\bcategory:\s*'([^']+)'/g)].map((match) => ({ name: match[1], file })));
  for (const block of source.matchAll(/relatedGuides:\s*\[([^\]]*)\]/g)) {
    relatedGuideReferences.push(...[...block[1].matchAll(/'([^']+)'/g)].map((match) => ({ slug: match[1], file })));
  }
}

for (const slug of duplicates(toolPageRecords.map(({ key }) => key))) {
  failures.push(`Duplicate rich SEO record: ${slug}`);
}

for (const { key, slug, file } of toolPageRecords.filter(({ key, slug }) => key !== slug)) {
  failures.push(`Rich SEO record key and slug differ: ${key} / ${slug} (${file})`);
}

for (const { slug, file } of toolPageRecords.filter(({ slug }) => !toolSlugs.includes(slug))) {
  failures.push(`Rich SEO record has no registry entry: ${slug} (${file})`);
}

for (const { slug, file } of relatedToolReferences.filter(({ slug }) => !toolSlugs.includes(slug))) {
  failures.push(`Related tool has no registry entry: ${slug} (${file})`);
}

for (const { slug, file } of relatedToolReferences.filter(({ slug }) => reviewedSlugs.includes(slug))) {
  failures.push(`Rich SEO content promotes quarantined tool: ${slug} (${file})`);
}

for (const { slug, file } of relatedGuideReferences.filter(({ slug }) => !guideSlugs.includes(slug))) {
  failures.push(`Related guide has no metadata entry: ${slug} (${file})`);
}

for (const { name, file } of richContentCategories) {
  const slug = name.toLowerCase().replaceAll(' ', '-');
  if (!categorySlugs.includes(slug)) failures.push(`Rich SEO content has unknown category: ${name} (${file})`);
}

const toolPageLibrarySource = read(toolPageLibraryPath);
for (const signal of ['canonical: url', 'openGraph:', 'twitter:', "'@type': 'WebApplication'", "'@type': 'BreadcrumbList'"]) {
  if (!toolPageLibrarySource.includes(signal)) failures.push(`Shared rich SEO layer is missing required signal: ${signal}`);
}

if (warnings.length) {
  console.warn(`Architecture warnings (${warnings.length}):`);
  warnings.forEach((warning) => console.warn(`- ${warning}`));
}

if (failures.length) {
  console.error(`Architecture validation failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Architecture validation passed: ${toolSlugs.length} registered tools, ${pageSlugs.length} tool routes, ${seoSlugs.length} tool SEO records, ${guideSlugs.length} complete guides.`);
