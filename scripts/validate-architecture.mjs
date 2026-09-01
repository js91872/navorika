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
const gscGuideContentPath = join(root, 'src/lib/guideContentGsc.ts');
const guideEnhancementsPath = join(root, 'src/lib/guideContentEnhancements.ts');
const guideToolsPath = join(root, 'src/lib/guideTools.ts');
const guideSourcesPath = join(root, 'src/lib/guideSources.ts');
const guidePagePath = join(root, 'src/app/guides/[slug]/page.tsx');
const sitemapPath = join(root, 'src/app/sitemap.ts');
const llmsPath = join(root, 'src/app/llms.txt/route.ts');
const toolPageLibraryPath = join(root, 'src/lib/seo/toolPage.ts');
const taxonomyPath = join(root, 'src/data/taxonomy.ts');
const toolkitPagePath = join(root, 'src/app/toolkits/[slug]/page.tsx');
const toolCatalogPath = join(root, 'src/app/tools.json/route.ts');
const generatedLlmsPath = join(root, 'src/app/llms.txt/route.ts');
const packagePath = join(root, 'package.json');
const calculationRoot = join(root, 'src/lib/calculations');
const calculationRunnerPath = join(root, 'scripts/run-calculation-tests.mjs');
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
const toolDescriptions = [...toolRegistrySource.matchAll(/\bdescription:\s*'([^']*)'/g)].map((match) => match[1].trim());
const toolCategories = [...toolRegistrySource.matchAll(/\bcategory:\s*'([^']+)'/g)].map((match) => match[1]);
const categoryRegistrySource = registrySource.slice(0, toolsDeclaration);
const categorySlugs = [...categoryRegistrySource.matchAll(/\bslug:\s*'([^']+)'/g)].map((match) => match[1]);
const guideSlugs = [...read(guidesPath).matchAll(/\bslug:\s*'([^']+)'/g)].map((match) => match[1]);

for (const slug of duplicates(guideSlugs)) failures.push(`Duplicate guide metadata slug: ${slug}`);

const guideContentSources = [read(guideContentPath), read(additionalGuideContentPath), read(gscGuideContentPath)];
const guideContentSlugs = guideContentSources.flatMap((source) => [...source.matchAll(/^\s{2}'([^']+)':\s*(?:\{|(?:corelArticle|article)\()/gm)].map((match) => match[1]));
const enhancedGuideSlugs = [...read(guideEnhancementsPath).matchAll(/^\s{2}'([^']+)':\s*\{/gm)].map((match) => match[1]);
const sourcedGuideSlugs = [...read(guideSourcesPath).matchAll(/^\s{2}'([^']+)':\s*\[/gm)].map((match) => match[1]);
for (const source of guideContentSources) {
  const sourceSlugs = [...source.matchAll(/^\s{2}'([^']+)':\s*(?:\{|(?:corelArticle|article)\()/gm)].map((match) => match[1]);
  for (const slug of duplicates(sourceSlugs)) failures.push(`Duplicate guide content slug in one registry: ${slug}`);
}
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
for (const signal of ['generateStaticParams', 'generateMetadata', "'@type': 'Article'", "'@type': 'BreadcrumbList'", 'featuredImage.alt', 'citation:', 'Sources and further reading']) {
  if (!guidePageSource.includes(signal)) failures.push(`Guide route is missing required crawl/SEO signal: ${signal}`);
}

if (!read(sitemapPath).includes('guidesMetadata.map')) failures.push('XML sitemap does not enumerate individual guides');
if (!read(llmsPath).includes('guidesMetadata')) failures.push('Generated llms.txt does not expose the guide library');

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
if (toolDescriptions.length !== toolSlugs.length || toolDescriptions.some((description) => !description)) {
  failures.push('Every registry tool must have a non-empty description');
}
for (const category of toolCategories.filter((category) => !categorySlugs.includes(category))) {
  failures.push(`Registry tool references an unknown category: ${category}`);
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

const xmlWordRoutes = [
  ['xml-to-word-converter', 'XmlToWordTool', "@/lib/converters/xml-word/xml-to-docx"],
  ['word-to-xml-converter', 'WordToXmlTool', "@/lib/converters/xml-word/docx-to-xml"],
];
for (const [slug, component, lazyModule] of xmlWordRoutes) {
  const pageSource = read(join(toolsRoot, slug, 'page.tsx'));
  const componentPath = join(root, 'src/components/tools/xml-word', `${component}.tsx`);
  if (!pageSource.includes(`@/components/tools/xml-word/${component}`)) failures.push(`${slug} must use the shared XML/Word UI cluster`);
  if (!existsSync(componentPath) || !read(componentPath).includes(`import('${lazyModule}')`)) failures.push(`${slug} must lazy-load its shared converter implementation`);
}
for (const file of ['config.ts', 'security.ts', 'xml-parser.ts', 'xml-to-docx.ts', 'docx-to-xml.ts']) {
  if (!existsSync(join(root, 'src/lib/converters/xml-word', file))) failures.push(`Missing shared XML/Word converter module: ${file}`);
}
const converterPackageSource = read(packagePath);
for (const dependency of ['"docx"', '"fast-xml-parser"', '"jszip"']) {
  if (!converterPackageSource.includes(dependency)) failures.push(`XML/Word converters require package dependency ${dependency}`);
}

const corelToolSlugs = ['coreldraw-tools','pdf-to-cdr-converter','word-to-cdr-converter','png-to-cdr-converter','jpg-to-cdr-converter','svg-to-cdr-converter','ai-to-cdr-converter','eps-to-cdr-converter','cdr-viewer','cdr-version-converter','cdr-to-pdf-converter','cdr-to-svg-converter','cdr-to-png-converter','cdr-to-jpg-converter','cdr-to-eps-converter'];
for (const slug of corelToolSlugs) {
  const pageSource = read(join(toolsRoot, slug, 'page.tsx'));
  if (!pageSource.includes('@/components/tools/coreldraw/')) failures.push(`${slug} must use the shared CorelDRAW UI platform`);
}
for (const file of ['types.ts','formats.ts','validation.ts','archive-validation.ts','capabilities.ts','job-manager.ts','process.ts','conversion-pipeline.ts','cdr-writer.ts','raster-vectorizer.ts']) {
  if (!existsSync(join(root, 'src/lib/converters/coreldraw', file))) failures.push(`Missing shared CorelDRAW converter module: ${file}`);
}
const corelTypesSource = read(join(root, 'src/lib/converters/coreldraw/types.ts'));
if (!corelTypesSource.includes('cdrWrite: false')) failures.push('Native CDR writing must remain explicitly disabled without a verified provider');
if (corelTypesSource.includes("CorelOutputFormat = 'cdr'")) failures.push('CorelDRAW pipeline must not expose fake native CDR output');
const corelApiSource = read(join(root, 'src/app/api/coreldraw/convert/route.ts'));
for (const signal of ['withCorelJob', 'assertCorelUpload', 'assertSafeZipArchive', "'X-Robots-Tag': 'noindex, nofollow, noarchive'", 'rateLimit']) {
  if (!corelApiSource.includes(signal)) failures.push(`CorelDRAW API is missing security signal: ${signal}`);
}
if (!existsSync(join(root, 'docs/CORELDRAW_CONVERTER_DEPLOYMENT.md'))) failures.push('Missing CorelDRAW VPS deployment documentation');
if (!converterPackageSource.includes('"test:coreldraw"')) failures.push('package.json must expose the CorelDRAW regression suite');

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

if (guidePageSource.includes("'@type': 'FAQPage'") || toolPageLibrarySource.includes("'@type': 'FAQPage'")) {
  failures.push('FAQ structured data must not be emitted by the shared tool or guide architecture');
}

const taxonomySource = read(taxonomyPath);
const clustersSource = taxonomySource.slice(taxonomySource.indexOf('export const clusters'), taxonomySource.indexOf('export const toolkits'));
const clusterRecords = [...clustersSource.matchAll(/\{ id: '([^']+)', name: '[^']+', description: '[^']+', category: '([^']+)', toolSlugs: \[([^\]]*)\] \}/g)].map((match) => ({ id: match[1], category: match[2], tools: [...match[3].matchAll(/'([^']+)'/g)].map((item) => item[1]) }));
const clusterIds = clusterRecords.map(({ id }) => id);
const clusteredTools = clusterRecords.flatMap(({ tools: clusterTools }) => clusterTools);
for (const id of duplicates(clusterIds)) failures.push(`Duplicate cluster id: ${id}`);
for (const slug of duplicates(clusteredTools)) failures.push(`Tool belongs to more than one cluster: ${slug}`);
for (const slug of toolSlugs.filter((slug) => !clusteredTools.includes(slug))) failures.push(`Registered tool has no cluster: ${slug}`);
for (const slug of clusteredTools.filter((slug) => !toolSlugs.includes(slug))) failures.push(`Cluster references an unknown tool: ${slug}`);
for (const { id, category, tools: clusterTools } of clusterRecords) {
  if (!categorySlugs.includes(category)) failures.push(`Cluster ${id} references an unknown category: ${category}`);
  for (const slug of clusterTools) {
    const registryIndex = toolSlugs.indexOf(slug);
    if (registryIndex >= 0 && toolCategories[registryIndex] !== category) failures.push(`Cluster ${id} contains tool from another category: ${slug}`);
  }
}

const toolkitSlugs = [...taxonomySource.matchAll(/^\s{4}slug: '([^']+)', name:/gm)].map((match) => match[1]);
const toolkitToolReferences = [...taxonomySource.matchAll(/toolSlugs: \[([^\]]*)\]/g)].slice(clusterRecords.length).flatMap((match) => [...match[1].matchAll(/'([^']+)'/g)].map((item) => item[1]));
const toolkitGuideReferences = [...taxonomySource.matchAll(/guideSlugs: \[([^\]]*)\]/g)].flatMap((match) => [...match[1].matchAll(/'([^']+)'/g)].map((item) => item[1]));
const toolkitCategoryReferences = [...taxonomySource.matchAll(/categorySlugs: \[([^\]]*)\]/g)].flatMap((match) => [...match[1].matchAll(/'([^']+)'/g)].map((item) => item[1]));
for (const slug of duplicates(toolkitSlugs)) failures.push(`Duplicate toolkit slug: ${slug}`);
for (const slug of toolkitToolReferences.filter((slug) => !toolSlugs.includes(slug))) failures.push(`Toolkit references an unknown tool: ${slug}`);
for (const slug of toolkitGuideReferences.filter((slug) => !guideSlugs.includes(slug))) failures.push(`Toolkit references an unknown guide: ${slug}`);
for (const slug of toolkitCategoryReferences.filter((slug) => !categorySlugs.includes(slug))) failures.push(`Toolkit references an unknown category: ${slug}`);

const complementaryBlocks = taxonomySource.slice(taxonomySource.indexOf('export const complementaryTools'), taxonomySource.indexOf('const clusterByTool'));
const complementarySources = [...complementaryBlocks.matchAll(/^\s{2}'([^']+)':/gm)].map((match) => match[1]);
const complementaryReferences = [...complementaryBlocks.matchAll(/:\s*\[([^\]]*)\]/g)].flatMap((match) => [...match[1].matchAll(/'([^']+)'/g)].map((item) => item[1]));
for (const slug of [...complementarySources, ...complementaryReferences].filter((slug) => !toolSlugs.includes(slug))) failures.push(`Complementary workflow references an unknown tool: ${slug}`);

for (const [path, label] of [[toolkitPagePath, 'toolkit route'], [toolCatalogPath, 'tools.json route'], [generatedLlmsPath, 'generated llms.txt route']]) {
  if (!existsSync(path)) failures.push(`Missing ${label}`);
}
if (existsSync(join(root, 'public/robots.txt'))) failures.push('Static public/robots.txt duplicates the Next.js robots metadata route');
if (existsSync(join(root, 'public/llms.txt'))) failures.push('Static public/llms.txt bypasses the generated registry-backed route');
const sitemapSource = read(sitemapPath);
for (const signal of ['tools', 'categories', 'toolkits', 'guidesMetadata', 'toolsUnderReview']) {
  if (!sitemapSource.includes(signal)) failures.push(`Sitemap is missing authoritative source: ${signal}`);
}
const toolkitPageSource = read(toolkitPagePath);
for (const signal of ['generateStaticParams', 'generateMetadata', "'@type': 'CollectionPage'", "'@type': 'ItemList'", "'@type': 'BreadcrumbList'"]) {
  if (!toolkitPageSource.includes(signal)) failures.push(`Toolkit route is missing required crawl/SEO signal: ${signal}`);
}

const packageJson = JSON.parse(read(packagePath));
if (packageJson.scripts?.['test:calculations'] !== 'node --experimental-strip-types scripts/run-calculation-tests.mjs') {
  failures.push('package.json must expose the standard calculation test runner as test:calculations');
}
if (!existsSync(calculationRunnerPath)) failures.push('Missing scripts/run-calculation-tests.mjs');

const calculationFiles = readdirSync(calculationRoot).filter((file) => file.endsWith('.ts'));
const calculationTestFiles = readdirSync(calculationRoot).filter((file) => file.endsWith('.test.mjs'));
if (calculationTestFiles.length === 0) failures.push('No calculation test modules exist');
const calculationTestNames = [];
for (const file of calculationTestFiles) {
  const source = read(join(calculationRoot, file));
  const moduleImports = [...source.matchAll(/from ['"]\.\/([^'"]+\.ts)['"]/g)].map((match) => match[1]);
  if (moduleImports.length === 0) failures.push(`Calculation test imports no calculation module: ${file}`);
  for (const moduleFile of moduleImports) {
    if (!calculationFiles.includes(moduleFile)) failures.push(`Calculation test imports a missing module: ${file} -> ${moduleFile}`);
  }
  calculationTestNames.push(...[...source.matchAll(/test\(['"]([^'"]+)['"]/g)].map((match) => match[1]));
}
for (const name of duplicates(calculationTestNames)) failures.push(`Duplicate calculation test name: ${name}`);
for (const file of calculationFiles.filter((file) => !file.endsWith('.test.ts'))) {
  const source = read(join(calculationRoot, file));
  if (/from ['"]react['"]|from ['"]react\//.test(source)) failures.push(`Calculation module imports React: ${file}`);
}

const selectedCalculationRoutes = {
  'loan-emi-calculator': 'calculations/emi',
  'electricity-cost-calculator': 'calculations/energyElectrical',
  'solar-panel-calculator': 'calculations/energyElectrical',
  'wire-size-calculator': 'calculations/energyElectrical',
  'voltage-drop-calculator': 'calculations/energyElectrical',
  'house-construction-cost-calculator': 'calculations/projectEstimators',
  'water-tank-calculator': 'calculations/projectEstimators',
  'asphalt-calculator': 'calculations/projectEstimators',
  'roof-area-calculator': 'calculations/projectEstimators',
  'flooring-calculator': 'calculations/projectEstimators',
  'dimensional-weight-calculator': 'calculations/projectEstimators',
  'concrete-calculator': 'calculations/construction',
  'brick-calculator': 'calculations/constructionQuantities',
  'rebar-calculator': 'calculations/constructionQuantities',
  'gravel-calculator': 'calculations/constructionQuantities',
  'excavation-calculator': 'calculations/constructionQuantities',
};
for (const [slug, moduleSignal] of Object.entries(selectedCalculationRoutes)) {
  if (!read(join(toolsRoot, slug, 'page.tsx')).includes(moduleSignal)) failures.push(`Selected calculation route bypasses its calculation module: ${slug}`);
}

const selectedSharedCalculationRoutes = {
  'cement-calculator': { pageSignal: 'CementTakeoffCalculator', implementation: 'SupplierTakeoffTools.tsx', moduleSignal: 'calculations/supplierTakeoffs' },
  'sand-calculator': { pageSignal: 'SandTakeoffCalculator', implementation: 'SupplierTakeoffTools.tsx', moduleSignal: 'calculations/supplierTakeoffs' },
  'paint-calculator': { pageSignal: 'PaintTakeoffCalculator', implementation: 'SupplierTakeoffTools.tsx', moduleSignal: 'calculations/supplierTakeoffs' },
  'tile-calculator': { pageSignal: 'TileTakeoffCalculator', implementation: 'SupplierTakeoffTools.tsx', moduleSignal: 'calculations/supplierTakeoffs' },
  'steel-weight-calculator': { pageSignal: 'SteelTakeoffCalculator', implementation: 'SupplierTakeoffTools.tsx', moduleSignal: 'calculations/supplierTakeoffs' },
  'drywall-calculator': { pageSignal: 'DrywallCalculator', bridge: 'DrywallCalculator.tsx', implementation: 'ConstructionExpansionTools.tsx', moduleSignal: 'calculations/constructionExpansion' },
  'paver-calculator': { pageSignal: 'PaverCalculator', bridge: 'PaverCalculator.tsx', implementation: 'ConstructionExpansionTools.tsx', moduleSignal: 'calculations/constructionExpansion' },
  'polymeric-sand-calculator': { pageSignal: 'PolymericSandCalculator', bridge: 'PolymericSandCalculator.tsx', implementation: 'ConstructionExpansionTools.tsx', moduleSignal: 'calculations/constructionExpansion' },
  'deck-board-calculator': { pageSignal: 'DeckBoardCalculator', bridge: 'DeckBoardCalculator.tsx', implementation: 'ConstructionExpansionTools.tsx', moduleSignal: 'calculations/constructionExpansion' },
  'fence-calculator': { pageSignal: 'FenceCalculator', bridge: 'FenceCalculator.tsx', implementation: 'ConstructionExpansionTools.tsx', moduleSignal: 'calculations/constructionExpansion' },
};
const toolComponentsRoot = join(root, 'src', 'components', 'tools');
for (const [slug, expectation] of Object.entries(selectedSharedCalculationRoutes)) {
  if (!read(join(toolsRoot, slug, 'page.tsx')).includes(expectation.pageSignal)) failures.push(`Selected calculation route bypasses its shared implementation: ${slug}`);
  if (expectation.bridge && !read(join(toolComponentsRoot, expectation.bridge)).includes(expectation.implementation.replace('.tsx', ''))) failures.push(`Selected calculation bridge bypasses its shared implementation: ${slug}`);
  if (!read(join(toolComponentsRoot, expectation.implementation)).includes(expectation.moduleSignal)) failures.push(`Selected shared calculation implementation bypasses its calculation module: ${slug}`);
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

console.log(`Architecture validation passed: ${toolSlugs.length} registered tools, ${pageSlugs.length} tool routes, ${clusterRecords.length} clusters, ${toolkitSlugs.length} toolkits, ${seoSlugs.length} tool SEO records, ${guideSlugs.length} complete guides.`);
