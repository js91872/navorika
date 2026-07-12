import { Tool } from "@/types/tool";

// IMPORTANT:
// Explicitly import index.ts to avoid conflict with src/data/tools.ts
import { allTools } from "@/data/tools/index";

export function getAllTools(): Tool[] {
  return allTools;
}

export function getToolBySlug(
  slug: string
): Tool | undefined {
  return allTools.find(
    (tool) => tool.slug === slug
  );
}

export function getFeaturedTools(): Tool[] {
  return allTools.filter(
    (tool) => tool.featured === true
  );
}

export function getPopularTools(): Tool[] {
  return allTools.filter(
    (tool) => tool.popular === true
  );
}

export function getToolsByCategory(
  category: string
): Tool[] {
  return allTools.filter(
    (tool) =>
      tool.category.toLowerCase() ===
      category.toLowerCase()
  );
}

export function getRelatedTools(
  tool: Tool
): Tool[] {
  if (!tool.relatedTools) {
    return [];
  }

  return tool.relatedTools
    .map((slug) => getToolBySlug(slug))
    .filter(
      (item): item is Tool => item !== undefined
    );
}