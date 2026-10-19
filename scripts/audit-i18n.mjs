import { readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { createHash } from 'node:crypto';
import { translatedGuides, translatedPublicPages, requiredLocalizedSurfaces, verifiedLocalizedSurfaces } from '../src/lib/i18n/contentCoverage.ts';
import { tools } from '../src/data/registry.ts';
import { guidesMetadata } from '../src/lib/guidesMetadata.ts';
import { locales, translatedTools } from '../src/lib/i18n/config.ts';
import { toolsUnderReview } from '../src/lib/seo/toolReview.ts';

const root = fileURLToPath(new URL('../', import.meta.url));
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]);
const toSourcePath = (path) => relative(root, path).split('\\').join('/');
const syntaxTree = (path) => ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true, path.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
const modules = (path) => syntaxTree(path).statements.filter(ts.isImportDeclaration).filter((statement) => ts.isStringLiteral(statement.moduleSpecifier)).map((statement) => statement.moduleSpecifier.text);
const nameOf = (node) => node && (ts.isStringLiteral(node) || ts.isIdentifier(node)) ? node.text : '';
const trustSlugs = ['about', 'contact', 'privacy', 'terms', 'disclaimer', 'methodology', 'glossary'];
const translated = new Set(translatedTools);
const sourceFiles = walk(join(root, 'src')).filter((path) => /\.(?:ts|tsx)$/.test(path) && !/\.test\./.test(path) && !path.includes('/i18n/'));
const componentFiles = new Map(sourceFiles.filter((path) => path.includes('/components/')).map((path) => [toSourcePath(path).replace(/^src\//, '@/').replace(/\.(?:ts|tsx)$/, ''), path]));
const reachable = (path, seen = new Set()) => {
  if (seen.has(path)) return [];
  seen.add(path);
  const paths = [path];
  for (const importPath of modules(path)) {
    const child = componentFiles.get(importPath);
    if (child && !/\/(?:ui|seo)\//.test(child)) paths.push(...reachable(child, seen));
  }
  return paths;
};

const configSource = syntaxTree(join(root, 'src/lib/calculations/businessConfigs.ts'));
const configNames = [];
const findConfigs = (node) => {
  if (ts.isVariableDeclaration(node) && nameOf(node.name) === 'businessCalculatorConfigs' && node.initializer && ts.isObjectLiteralExpression(node.initializer)) {
    for (const property of node.initializer.properties) if (ts.isPropertyAssignment(property)) configNames.push(nameOf(property.name));
  }
  ts.forEachChild(node, findConfigs);
};
findConfigs(configSource);
const sharedCalculators = new Set(configNames);
const reviewCategories = new Set(['finance-calculators', 'health-calculators', 'construction-calculators']);
const toolRows = tools.map((tool) => {
  const path = join(root, `src/app/(english)/tools/${tool.slug}/page.tsx`);
  const directImports = existsSync(path) ? modules(path) : [];
  const sources = existsSync(path) ? reachable(path).map(toSourcePath).sort() : [];
  const serverProcessing = sources.some((source) => /(?:coreldraw|step-|dwg-|\/media\/)/i.test(source))
    || sources.some((source) => /fetch\s*\(\s*[`'"]\/api\//.test(readFileSync(join(root, source), 'utf8')));
  return {
    slug: tool.slug, title: tool.title, category: tool.category, route: `/tools/${tool.slug}`,
    source: toSourcePath(path), routeExists: existsSync(path),
    family: sharedCalculators.has(tool.slug) ? 'shared-calculator' : directImports.some((importPath) => /FocusedDeveloperTool/.test(importPath)) ? 'focused-developer' : 'individual-or-other-shared',
    status: translated.has(tool.slug) ? 'published' : toolsUnderReview.has(tool.slug) ? 'under-review' : 'pending',
    translatedLocales: translated.has(tool.slug) ? [...locales] : [],
    review: [...(reviewCategories.has(tool.category) ? ['domain-assumptions'] : []), ...(serverProcessing ? ['server-errors-and-processing-disclosure'] : [])],
    definitionSource: sharedCalculators.has(tool.slug) ? 'src/lib/calculations/businessConfigs.ts' : null,
    sources,
  };
}).sort((a, b) => a.slug.localeCompare(b.slug));
const guideRows = guidesMetadata.map((guide) => ({ slug: guide.slug, title: guide.title, category: guide.category, route: `/guides/${guide.slug}`, status: translatedGuides.includes(guide.slug) ? 'published' : 'pending', translatedLocales: translatedGuides.includes(guide.slug) ? [...locales] : [] }));
const trustRows = trustSlugs.map((slug) => ({ slug, route: `/${slug}`, source: `src/app/(english)/${slug}/page.tsx`, routeExists: existsSync(join(root, `src/app/(english)/${slug}/page.tsx`)), status: translatedPublicPages.includes(`/${slug}`) ? 'published' : 'pending', translatedLocales: translatedPublicPages.includes(`/${slug}`) ? [...locales] : [] }));

// Source candidates are an audit queue, not a declaration that every literal is user-facing.
// JSX text, visible attributes and semantic copy fields are distinguished from string literals
// that can also be programming syntax, identifiers or developer messages.
const semanticKeys = new Set(['label', 'title', 'description', 'placeholder', 'help', 'note', 'question', 'answer', 'intro', 'summary', 'content', 'body', 'caption', 'alt', 'error', 'message', 'seoTitle', 'seoDescription']);
const attributeKeys = new Set(['placeholder', 'title', 'alt', 'aria-label', 'aria-description']);
const candidates = [];
const counts = { jsxText: 0, visibleAttribute: 0, semanticCopy: 0, reviewLiteral: 0 };
for (const path of sourceFiles) {
  const tree = syntaxTree(path);
  const visit = (node) => {
    let text = '', kind = '';
    if (ts.isJsxText(node)) { text = node.text.replace(/\s+/g, ' ').trim(); kind = 'jsxText'; }
    else if (ts.isStringLiteralLike(node)) {
      text = node.text.trim();
      if (ts.isJsxAttribute(node.parent) && attributeKeys.has(nameOf(node.parent.name))) kind = 'visibleAttribute';
      else if (ts.isPropertyAssignment(node.parent) && semanticKeys.has(nameOf(node.parent.name))) kind = 'semanticCopy';
      else kind = 'reviewLiteral';
    }
    if (text && /[A-Za-z]{2}/.test(text)) {
      const location = tree.getLineAndCharacterOfPosition(node.getStart(tree));
      candidates.push({ id: createHash('sha256').update(`${toSourcePath(path)}\0${kind}\0${text}`).digest('hex').slice(0, 20), source: toSourcePath(path), line: location.line + 1, kind, text });
      counts[kind]++;
    }
    ts.forEachChild(node, visit);
  };
  visit(tree);
}
const report = {
  schemaVersion: 1,
  languages: [...locales],
  summary: {
    tools: toolRows.length, publishedTools: toolRows.filter((row) => row.status === 'published').length,
    pendingTools: toolRows.filter((row) => row.status === 'pending').length,
    underReviewTools: toolRows.filter((row) => row.status === 'under-review').length,
    sharedCalculators: sharedCalculators.size, guides: guideRows.length, trustPages: trustRows.length,
    publishedToolTranslations: toolRows.filter((row) => row.status === 'published').length * locales.length,
    targetToolTranslations: toolRows.filter((row) => row.status !== 'under-review').length * locales.length,
    pendingGuideTranslations: guideRows.filter((row) => row.status !== 'published').length * locales.length,
    pendingTrustTranslations: trustRows.filter((row) => row.routeExists && row.status !== 'published').length * locales.length,
    candidateCounts: counts,
    candidateCopyWords: candidates.filter((row) => row.kind !== 'reviewLiteral').reduce((total, row) => total + row.text.split(/\s+/).length, 0),
  },
  tools: toolRows, guides: guideRows, trustPages: trustRows,
  infrastructure: requiredLocalizedSurfaces.map((surface) => ({ surface, status: verifiedLocalizedSurfaces.includes(surface) ? 'verified' : 'pending-full-inventory-verification' })),
  pageTemplates: walk(join(root, 'src/app/(english)')).filter((path) => path.endsWith('/page.tsx')).map((path) => {
    const routeTemplate = '/' + relative(join(root, 'src/app/(english)'), path).replace(/\/page\.tsx$/, '').replace(/^page\.tsx$/, '');
    const tool = toolRows.find((row) => row.route === routeTemplate);
    const localizedSource = `src/app/[locale]${routeTemplate === '/' ? '' : routeTemplate}/page.tsx`;
    const staticReady = translatedPublicPages.includes(routeTemplate) && existsSync(join(root, localizedSource));
    const allGuidesReady = routeTemplate === '/guides/[slug]' && guideRows.every((row) => row.status === 'published') && existsSync(join(root, localizedSource));
    return { source: toSourcePath(path), routeTemplate, status: tool ? tool.status : staticReady || allGuidesReady ? 'published' : 'pending', localizedSource: tool ? 'src/app/[locale]/tools/[slug]/page.tsx' : localizedSource };
  }).sort((a, b) => a.source.localeCompare(b.source)),
  extractionNotes: 'Source candidates need editorial classification. Do not translate code, CSS keywords, paths, API identifiers, CSV/JSON keys intended for machines, personal filenames, or user-entered text. Candidate word counts can include repeated copy; they are not a billable translation estimate.',
};
const serialise = (value) => `${JSON.stringify(value, null, 2)}\n`;
const outputPath = join(root, 'docs/i18n-coverage.json');
const candidateArg = process.argv.indexOf('--source-candidates');
const cataloguePath = candidateArg < 0 ? null : process.argv[candidateArg + 1];
if (candidateArg >= 0 && (!cataloguePath || cataloguePath.startsWith('--'))) throw new Error('Pass an output path after --source-candidates.');
if (process.argv.includes('--write')) {
  writeFileSync(outputPath, serialise(report));
  if (cataloguePath) writeFileSync(cataloguePath, serialise(candidates.filter((row) => row.kind !== 'reviewLiteral')));
}
if (process.argv.includes('--check')) {
  for (const [path, value] of [[outputPath, report]]) {
    if (!existsSync(path) || readFileSync(path, 'utf8') !== serialise(value)) throw new Error(`Stale multilingual inventory: ${toSourcePath(path)}. Run npm run i18n:audit:write.`);
  }
}
console.log(JSON.stringify(report.summary, null, 2));
if (process.argv.includes('--require-complete')) {
  const incomplete = [...toolRows.filter((row) => row.status === 'pending'), ...guideRows.filter((row) => row.status !== 'published'), ...trustRows.filter((row) => row.routeExists && row.status !== 'published'), ...report.infrastructure.filter((row) => row.status !== 'verified'), ...report.pageTemplates.filter((row) => row.status === 'pending')];
  if (incomplete.length) { console.error(`Full multilingual completion gate: ${incomplete.length} content entries still need translation/review.`); process.exitCode = 1; }
}
