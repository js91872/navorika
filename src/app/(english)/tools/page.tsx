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

  return (
    <>
      <ToolDirectory tools={directoryTools} categories={categories.map(({ slug, name }) => ({ slug, name }))} />
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8" aria-labelledby="tools-help">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
          <h2 id="tools-help" className="text-2xl font-black">How to choose the right Navorika tool</h2>
          <div className="mt-4 grid gap-5 text-sm leading-7 text-[var(--muted-foreground)] md:grid-cols-2">
            <p>Start with the task you are trying to finish. For example, choose a PDF tool when you need to merge, split, compress, or convert a document; an image tool when you need to resize or change a file format; and a calculator when you need a quantity, cost, payment, health, or planning estimate.</p>
            <p>Many tools work directly in your browser and do not need an account. Some specialized tools use outside data or temporary server processing; those pages explain the difference. For calculators, check the units, assumptions, and limitations shown with the result before using it for an important decision.</p>
          </div>
        </div>
      </section>
    </>
  );
}
