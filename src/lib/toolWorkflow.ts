export interface WorkflowTool {
  slug: string;
  title: string;
}

export interface WorkflowItem extends WorkflowTool {
  label: string;
}

export function buildWorkflowItems(
  sourceSlug: string,
  requestedSlugs: readonly string[],
  tools: readonly WorkflowTool[],
  labels: Readonly<Record<string, string>> = {},
  limit = 4,
): WorkflowItem[] {
  const bySlug = new Map(tools.map((tool) => [tool.slug, tool]));
  const seen = new Set([sourceSlug]);
  const items: WorkflowItem[] = [];
  for (const slug of requestedSlugs) {
    if (seen.has(slug)) continue;
    seen.add(slug);
    const tool = bySlug.get(slug);
    if (!tool) continue;
    items.push({ ...tool, label: labels[slug]?.trim() || tool.title });
    if (items.length >= Math.max(0, limit)) break;
  }
  return items;
}
