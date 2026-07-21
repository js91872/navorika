import { getAllTools } from "@/lib/toolRegistry";
import Link from "next/link";
import { notFound } from "next/navigation";

// Map slugs to actual category names
const slugToCategory: Record<string, string> = {
  finance: "Finance",
  health: "Health",
  pdf: "PDF Tools",
  image: "Image Tools",
  developer: "Developer Tools",
  productivity: "productivity",
};

// Map slugs to display info
const categoryInfo: Record<string, { icon: string; description: string }> = {
  finance: { icon: "💰", description: "Financial calculators for loans, investments, taxes, and more." },
  health: { icon: "💪", description: "Health and wellness calculators for fitness, nutrition, and more." },
  pdf: { icon: "📄", description: "PDF utilities to merge, split, compress, and convert documents." },
  image: { icon: "🖼️", description: "Image tools to compress, resize, convert, and edit images." },
  developer: { icon: "💻", description: "Developer tools for formatting, encoding, generating IDs, and more." },
  productivity: { icon: "🚀", description: "Productivity tools to calculate dates, generate passwords, QR codes, and more." },
};

// Get individual tool icon based on title and keywords
function getToolIcon(tool: any): string {
  // If tool has an icon, use it
  if (tool.icon) return tool.icon;
  
  // Otherwise, assign based on title keywords
  const title = tool.title.toLowerCase();
  
  // Finance tools
  if (title.includes('emi')) return '🏦';
  if (title.includes('gst')) return '🧾';
  if (title.includes('epf')) return '💰';
  if (title.includes('compound interest')) return '📈';
  if (title.includes('income tax')) return '🧾';
  if (title.includes('loan')) return '🏦';
  if (title.includes('inflation')) return '📉';
  if (title.includes('currency')) return '💱';
  if (title.includes('roi')) return '📊';
  if (title.includes('sip')) return '📈';
  if (title.includes('ppf')) return '🏦';
  if (title.includes('rd')) return '🏦';
  if (title.includes('fd')) return '🏦';
  if (title.includes('retirement')) return '👴';
  if (title.includes('cagr')) return '📈';
  if (title.includes('lumpsum')) return '💰';
  if (title.includes('mortgage')) return '🏠';
  if (title.includes('swp')) return '💹';
  
  // Health tools
  if (title.includes('water')) return '💧';
  if (title.includes('bmi')) return '⚖️';
  if (title.includes('bmr')) return '🔥';
  if (title.includes('calorie')) return '🍽️';
  if (title.includes('protein')) return '🥩';
  
  // PDF tools
  if (title.includes('merge')) return '📑';
  if (title.includes('split')) return '✂️';
  if (title.includes('compress')) return '📦';
  if (title.includes('pdf to word')) return '📄➡️📝';
  if (title.includes('word to pdf')) return '📝➡️📄';
  if (title.includes('jpg to pdf')) return '🖼️➡️📄';
  if (title.includes('pdf to jpg')) return '📄➡️🖼️';
  
  // Image tools
  if (title.includes('compressor')) return '📦';
  if (title.includes('resizer')) return '📐';
  if (title.includes('converter')) return '🔄';
  if (title.includes('crop')) return '✂️';
  if (title.includes('background remover')) return '🧹';
  if (title.includes('passport')) return '📸';
  
  // Developer tools
  if (title.includes('json')) return '📋';
  if (title.includes('base64')) return '🔐';
  if (title.includes('uuid')) return '🆔';
  if (title.includes('url')) return '🔗';
  
  // Productivity tools
  if (title.includes('age')) return '🎂';
  if (title.includes('date')) return '📅';
  if (title.includes('percentage')) return '💯';
  if (title.includes('qr')) return '📱';
  if (title.includes('password')) return '🔑';
  
  // Default icon based on category
  const categoryIcons: Record<string, string> = {
    'Finance': '💰',
    'Health': '💪',
    'PDF Tools': '📄',
    'Image Tools': '🖼️',
    'Developer Tools': '💻',
    'productivity': '🚀',
  };
  
  return categoryIcons[tool.category] || '🔧';
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const allTools = getAllTools();
  
  // Get the actual category name from the slug
  const categoryName = slugToCategory[slug];
  
  if (!categoryName) {
    notFound();
  }
  
  // Filter tools by the exact category name
  const tools = allTools.filter(t => t.category === categoryName);
  
  if (tools.length === 0) {
    notFound();
  }
  
  const info = categoryInfo[slug] || { icon: "🔧", description: `${tools.length} tools available` };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Link href="/categories" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition mb-8">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Categories
      </Link>
      
      <div className="flex items-center gap-4 mb-8">
        <span className="text-5xl" role="img" aria-label={categoryName}>{info.icon}</span>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{categoryName}</h1>
          <p className="text-slate-600">{info.description}</p>
          <p className="text-sm text-slate-500 mt-1">{tools.length} tools available</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const icon = getToolIcon(tool);
          return (
            <Link 
              key={tool.slug} 
              href={`/tools/${tool.slug}`} 
              className="block p-6 bg-white rounded-2xl border border-slate-200 hover:shadow-lg hover:border-blue-300 transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl" role="img" aria-label={tool.title}>{icon}</span>
                <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition">
                  {tool.title}
                </h3>
              </div>
              <p className="text-sm text-slate-600">{tool.shortDescription}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
