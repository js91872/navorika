import { categories, tools } from '@/data/registry';
import { getClusterForTool, getToolkitsForTool } from '@/data/taxonomy';
import { toolsUnderReview } from '@/lib/seo/toolReview';
import type { SearchableTool } from '@/lib/toolSearch';

export const toolSearchIndex: SearchableTool[] = tools
  .filter((tool) => !toolsUnderReview.has(tool.slug))
  .map((tool) => ({
    slug: tool.slug,
    title: tool.title,
    description: tool.description,
    category: tool.category,
    categoryName: categories.find((category) => category.slug === tool.category)?.name,
    keywords: tool.keywords,
    aliases: tool.aliases,
    clusterName: getClusterForTool(tool.slug)?.name,
    toolkitNames: getToolkitsForTool(tool.slug).map((toolkit) => toolkit.name),
  }));
