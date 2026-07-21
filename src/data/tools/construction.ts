import { Tool } from "@/types/tool";

export const constructionTools: Tool[] = [
  {
    slug: "concrete-calculator",
    title: "Concrete Calculator",
    shortDescription: "Calculate how much concrete you need for slabs, columns, and footings.",
    description: "Calculate the exact amount of concrete required for your construction project. Get volume in cubic meters, cubic yards, and number of concrete bags needed.",
    category: "Construction",
    keywords: ["concrete", "calculator", "construction", "slab", "column", "footing", "cement", "volume"],
    icon: "🏗️",
    featured: false,
    popular: true,
    relatedTools: ["paint-calculator"],
  },
  {
    slug: "paint-calculator",
    title: "Paint Calculator",
    shortDescription: "Calculate how much paint you need for walls, ceilings, and more.",
    description: "Calculate the exact amount of paint required for your painting project. Estimate paint quantity for walls, ceilings, doors, and windows with accurate coverage rates.",
    category: "Construction",
    keywords: ["paint", "calculator", "construction", "wall", "ceiling", "painting", "coverage", "renovation"],
    icon: "🎨",
    featured: false,
    popular: true,
    relatedTools: ["concrete-calculator"],
  },
];
