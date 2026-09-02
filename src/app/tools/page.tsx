import ToolDirectory, { type ToolDirectoryItem } from '@/components/tools/ToolDirectory';
import { categories, tools } from '@/data/registry';
import { toolSearchIndex } from '@/data/toolSearchIndex';
import { getToolIcon } from '@/lib/toolIcons';
import { toolDescriptions } from '@/lib/toolDescriptions';
import { toolsUnderReview } from '@/lib/seo/toolReview';

export default function AllToolsPage() {
  const searchBySlug = new Map(toolSearchIndex.map((tool) => [tool.slug, tool]));
  const directoryTools = tools.flatMap<ToolDirectoryItem>((tool) => {
    if (toolsUnderReview.has(tool.slug)) return [];
    const search = searchBySlug.get(tool.slug);
    if (!search) return [];
    return [{
      ...search,
      categoryName: search.categoryName ?? tool.category,
      displayDescription: toolDescriptions[tool.slug] ?? tool.description,
      icon: getToolIcon(tool.slug),
    }];
  });

  return <ToolDirectory tools={directoryTools} categories={categories.map(({ slug, name }) => ({ slug, name }))} />;
}
