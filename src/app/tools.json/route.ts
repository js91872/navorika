import { categories, tools } from '@/data/registry';
import { getClusterForTool, getToolkitsForTool } from '@/data/taxonomy';
import { toolsUnderReview } from '@/lib/seo/toolReview';

const baseUrl = 'https://navorika.com';
export const dynamic = 'force-static';

export function GET() {
  const catalog = tools.map((tool) => {
    const category = categories.find((item) => item.slug === tool.category);
    const cluster = getClusterForTool(tool.slug);
    return {
      name: tool.title,
      slug: tool.slug,
      url: `${baseUrl}/tools/${tool.slug}`,
      description: tool.description,
      category: category ? { id: category.slug, name: category.name } : null,
      cluster: cluster ? { id: cluster.id, name: cluster.name } : null,
      toolkits: getToolkitsForTool(tool.slug).map((toolkit) => ({ id: toolkit.slug, name: toolkit.name, url: `${baseUrl}/toolkits/${toolkit.slug}` })),
      intents: tool.keywords,
      availability: toolsUnderReview.has(tool.slug) ? 'under-review' : 'available',
    };
  });
  return Response.json({ name: 'Navorika Tool Catalog', canonical: `${baseUrl}/tools.json`, total: catalog.length, available: catalog.filter((tool) => tool.availability === 'available').length, tools: catalog }, { headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400' } });
}
