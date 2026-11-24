import { categories, tools } from '@/data/registry';
import { getClusterForTool, toolkits } from '@/data/taxonomy';
import { guidesMetadata } from '@/lib/guidesMetadata';
import { toolsUnderReview } from '@/lib/seo/toolReview';

const baseUrl = 'https://navorika.com';
export const dynamic = 'force-static';

export function GET() {
  const categorySections = categories.map((category) => {
    const categoryTools = tools.filter((tool) => tool.category === category.slug && !toolsUnderReview.has(tool.slug));
    return [`## ${category.name}`, category.description, `Category: ${baseUrl}/categories/${category.slug}`, ...categoryTools.map((tool) => {
      const cluster = getClusterForTool(tool.slug);
      return `- ${tool.title} — ${tool.description} URL: ${baseUrl}/tools/${tool.slug}${cluster ? ` Cluster: ${cluster.name}.` : ''}`;
    })].join('\n');
  });
  const toolkitLines = toolkits.map((toolkit) => `- ${toolkit.name} — ${toolkit.description} URL: ${baseUrl}/toolkits/${toolkit.slug}`);
  const standaloneGuideLines = [
    `- How Does a 3D Printer Work? Step-by-Step Beginner’s Guide — Learn how a 3D printer turns a digital model into a physical object. URL: ${baseUrl}/guides/how-does-a-3d-printer-work`,
    `- How to Convert JPG to DXF Free: A Practical AutoCAD and CNC Guide — Learn how to convert JPG to DXF for free, trace raster images into vector CAD outlines, and check scale in AutoCAD. URL: ${baseUrl}/guides/how-to-convert-jpg-to-dxf`,
    `- Can ChatGPT Make Videos? How to Create AI Videos Step by Step — Practical workflow for making AI videos with ChatGPT-assisted scripts and prompts. URL: ${baseUrl}/guides/can-chatgpt-make-videos`,
    `- How to Clean a Phone Speaker Safely: Dust, Water and Muffled Sound — Step-by-step phone speaker cleaning guide for iPhone and Android. URL: ${baseUrl}/guides/how-to-clean-phone-speaker`,
    `- How to Calculate Shopify Profit Margin — Detailed guide to Shopify fees, product pricing, ads, returns and break-even calculations. URL: ${baseUrl}/guides/shopify-profit-margin-calculator`,
  ];
  const guideLines = [
    ...guidesMetadata.map((guide) => `- ${guide.title} — ${guide.description} URL: ${baseUrl}/guides/${guide.slug}`),
    ...standaloneGuideLines,
  ];
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
