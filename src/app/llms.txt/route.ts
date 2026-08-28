import { categories, tools } from '@/data/registry';
import { getClusterForTool, toolkits } from '@/data/taxonomy';
import { guidesMetadata } from '@/lib/guidesMetadata';
import { toolsUnderReview } from '@/lib/seo/toolReview';

const baseUrl = 'https://navorika.com';

export function GET() {
  const categorySections = categories.map((category) => {
    const categoryTools = tools.filter((tool) => tool.category === category.slug && !toolsUnderReview.has(tool.slug));
    return [`## ${category.name}`, category.description, `Category: ${baseUrl}/categories/${category.slug}`, ...categoryTools.map((tool) => {
      const cluster = getClusterForTool(tool.slug);
      return `- ${tool.title} — ${tool.description} URL: ${baseUrl}/tools/${tool.slug}${cluster ? ` Cluster: ${cluster.name}.` : ''}`;
    })].join('\n');
  });
  const toolkitLines = toolkits.map((toolkit) => `- ${toolkit.name} — ${toolkit.description} URL: ${baseUrl}/toolkits/${toolkit.slug}`);
  const guideLines = guidesMetadata.map((guide) => `- ${guide.title} — ${guide.description} URL: ${baseUrl}/guides/${guide.slug}`);
  const body = [
    '# Navorika',
    '',
    '> Navorika provides free browser-based calculators and utilities for documents, images, finance, health, development, and construction. Most tools process inputs locally; individual pages explain relevant methods, limits, and data handling.',
    '',
    'Canonical site: https://navorika.com',
    'Tool catalog (JSON): https://navorika.com/tools.json',
    'XML sitemap: https://navorika.com/sitemap.xml',
    'All tools: https://navorika.com/tools',
    'Toolkits: https://navorika.com/toolkits',
    'Guides: https://navorika.com/guides',
    '',
    '# Workflow toolkits',
    ...toolkitLines,
    '',
    '# Available tools by category',
    ...categorySections.flatMap((section) => ['', section]),
    '',
    '# Guides',
    ...guideLines,
    '',
    'Catalog relationships are generated from Navorika’s authoritative tool registry and taxonomy.',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600, s-maxage=86400' } });
}
