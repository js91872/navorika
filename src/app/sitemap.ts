import { getAllTools } from "@/lib/toolRegistry";

const baseUrl = "https://navorika.com";

export default async function sitemap() {
  const allTools = getAllTools();
  
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
  
  const toolPages = allTools.map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));
  
  const categoryPages = [
    "finance",
    "health", 
    "pdf",
    "image",
    "developer",
    "productivity",
    "construction",
  ].map((category) => ({
    url: `${baseUrl}/categories/${category}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));
  
  const guideSlugs = [
    "how-to-calculate-emi",
    "understanding-compound-interest",
    "bmi-calculator-guide",
    "pdf-tools-mastery",
    "tax-planning-guide",
    "investment-basics",
  ];
  
  const guidePages = guideSlugs.map((slug) => ({
    url: `${baseUrl}/guides/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));
  
  return [...staticPages, ...toolPages, ...categoryPages, ...guidePages];
}
